import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const args = process.argv.slice(2);
const reportDirArgIndex = args.findIndex((arg) => arg === '--report-dir');
const reportDir = reportDirArgIndex >= 0 ? args[reportDirArgIndex + 1] : null;

if (!reportDir) {
  console.error('Usage: node tools/iteration/run-playwright-mcp-full.mjs --report-dir <dir>');
  process.exit(1);
}

const absReportDir = path.resolve(reportDir);
const screenshotsDir = path.join(absReportDir, 'screenshots');
fs.mkdirSync(screenshotsDir, { recursive: true });

const client = new Client({ name: 'wanjie-playwright-mcp-loop', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: 'npx',
  args: [
    '@playwright/mcp@latest',
    '--output-dir',
    path.resolve('.tmp/playwright-mcp-run'),
    '--isolated',
    '--headless',
  ],
});

const summary = {
  startedAt: new Date().toISOString(),
  reportDir: absReportDir,
  cases: [],
  issues: [],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForService(url, attempts = 20, delayMs = 500) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch {
      // ignore and retry
    }
    await sleep(delayMs);
  }
  return false;
}

function addIssue(priority, scope, message, evidence = {}) {
  summary.issues.push({
    id: `issue_${summary.issues.length + 1}`,
    priority,
    scope,
    message,
    evidence,
  });
}

function getTextContent(result) {
  if (!result || !Array.isArray(result.content)) return '';
  return result.content
    .map((item) => (typeof item?.text === 'string' ? item.text : ''))
    .filter(Boolean)
    .join('\n');
}

async function callTool(name, toolArgs) {
  const result = await client.callTool({
    name,
    arguments: toolArgs,
  });
  return {
    raw: result,
    text: getTextContent(result),
  };
}

function parseNetworkFailures(networkText) {
  const lines = networkText.split('\n');
  const failures = [];

  for (const line of lines) {
    const normalized = line.trim();
    if (!normalized) continue;
    if (normalized.includes('Outdated Optimize Dep')) continue;

    const statusMatch = line.match(/\bstatus=(\d{3})\b/i) || line.match(/\b(\d{3})\b/);
    if (!statusMatch) continue;
    const status = Number(statusMatch[1]);
    if (status >= 400) {
      failures.push({ line: normalized, status });
    }
  }

  return failures;
}

function hasConsoleError(consoleText) {
  return /console\.error|error:/i.test(consoleText) && !/No console messages/i.test(consoleText);
}

function extractFieldValue(text, field) {
  const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`);
  return text.match(regex)?.[1];
}

function extractBooleanValue(text, field) {
  const regex = new RegExp(`"${field}"\\s*:\\s*(true|false)`);
  const value = text.match(regex)?.[1];
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

async function runGameCases() {
  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'laptop', width: 1366, height: 768 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  const tabs = [
    'cultivation',
    'combat',
    'story',
    'alchemy',
    'disciple',
    'exploration',
    'ranking',
    'social',
    'market',
    'pvp',
    'save',
  ];

  const tabLabelMap = {
    cultivation: '修炼',
    combat: '战斗',
    story: '剧情',
    alchemy: '炼丹',
    exploration: '探索',
  };

  for (const viewport of viewports) {
    await callTool('browser_resize', { width: viewport.width, height: viewport.height });

    for (const tab of tabs) {
      const caseName = `game-${viewport.name}-${tab}`;
      const startedAt = Date.now();

      try {
        let stateResult = null;
        for (let attempt = 0; attempt < 4; attempt += 1) {
          await callTool('browser_navigate', {
            url: `http://localhost:5173/?autotest=1&fresh=1&nav=game&tab=${tab}`,
          });
          await callTool('browser_wait_for', { time: 1 });

          stateResult = await callTool('browser_evaluate', {
            function: `() => {
              if (typeof window.render_game_to_text !== 'function') return null;
              try {
                return JSON.parse(window.render_game_to_text());
              } catch {
                return { raw: window.render_game_to_text() };
              }
            }`,
          });

          if (!/### Result\s+null/i.test(stateResult.text || '')) {
            break;
          }
          await callTool('browser_wait_for', { time: 1 });
        }

        if (!stateResult || /### Result\s+null/i.test(stateResult.text || '')) {
          addIssue('P1', caseName, '页面未就绪，render_game_to_text 不可用', {});
        }

        const expectedLabel = tabLabelMap[tab];
        let actualTab = extractFieldValue(stateResult.text, 'gameTab');
        if (expectedLabel && actualTab !== expectedLabel) {
          await callTool('browser_run_code', {
            code: `async (page) => {
              const label = ${JSON.stringify(expectedLabel)};
              const target = page.getByText(label, { exact: false }).first();
              if (await target.count()) {
                await target.click();
                await page.waitForTimeout(600);
              }
            }`,
          });

          stateResult = await callTool('browser_evaluate', {
            function: `() => {
              if (typeof window.render_game_to_text !== 'function') return null;
              try {
                return JSON.parse(window.render_game_to_text());
              } catch {
                return { raw: window.render_game_to_text() };
              }
            }`,
          });
          actualTab = extractFieldValue(stateResult.text, 'gameTab');
        }

        if (expectedLabel && actualTab !== expectedLabel) {
          addIssue('P2', caseName, '目标标签页未命中，自动化入口与实际 UI 不一致', {
            expectedTab: expectedLabel,
            actualTab: actualTab ?? 'unknown',
          });
        }

        const shotPath = path.join(screenshotsDir, `${caseName}.png`);
        await callTool('browser_take_screenshot', {
          type: 'png',
          fullPage: true,
          filename: shotPath,
        });

        const consoleResult = await callTool('browser_console_messages', {
          level: 'error',
          all: false,
        });
        const networkResult = await callTool('browser_network_requests', {
          requestBody: false,
          requestHeaders: false,
          static: false,
        });

        if (hasConsoleError(consoleResult.text)) {
          addIssue('P1', caseName, '页面存在 console error', {
            console: consoleResult.text.slice(0, 1200),
            screenshot: shotPath,
          });
        }

        const failures = parseNetworkFailures(networkResult.text).filter(
          (item) => item.status >= 500 && /\/api\//i.test(item.line),
        );
        if (failures.length > 0) {
          addIssue('P1', caseName, '存在 5xx 网络请求失败', {
            failures: failures.slice(0, 10),
            screenshot: shotPath,
          });
        }

        summary.cases.push({
          name: caseName,
          status: 'passed',
          durationMs: Date.now() - startedAt,
          screenshot: shotPath,
          state: stateResult.text?.slice(0, 2000) || '',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        addIssue('P0', caseName, '用例执行失败', { error: message });
        summary.cases.push({
          name: caseName,
          status: 'failed',
          durationMs: Date.now() - startedAt,
          error: message,
        });
      }
    }
  }
}

async function runAdminCases() {
  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'laptop', width: 1366, height: 768 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    const caseName = `admin-${viewport.name}`;
    const startedAt = Date.now();

    try {
      await callTool('browser_resize', { width: viewport.width, height: viewport.height });
      await callTool('browser_navigate', { url: 'http://localhost:5174/admin' });
      await callTool('browser_wait_for', { time: 1 });

      await callTool('browser_run_code', {
        code: `async (page) => {
          const user = page.locator('input[placeholder*="用户名"], input[placeholder*="账号"]').first();
          const pwd = page.locator('input[placeholder*="密码"]').first();
          if (await user.count()) await user.fill('admin');
          if (await pwd.count()) await pwd.fill('admin123');
          const btn = page.getByRole('button', { name: /登录/ }).first();
          if (await btn.count()) await btn.click();
        }`,
      });

      await callTool('browser_wait_for', { time: 2 });

      const dashboardCheck = await callTool('browser_run_code', {
        code: `async (page) => {
          const text = await page.locator('body').innerText();
          const loginInput = page.locator('input[name="login-account"], #login-account');
          const passwordInput = page.locator('input[name="login-password"], #login-password');
          return {
            hasDashboard:
              text.includes('数据概览')
              || text.includes('系统状态')
              || text.includes('用户管理')
              || text.includes('公告管理'),
            hasLoginForm: (await loginInput.count()) > 0 && (await passwordInput.count()) > 0,
          };
        }`,
      });
      let hasDashboard = extractBooleanValue(dashboardCheck.text, 'hasDashboard');
      let hasLoginForm = extractBooleanValue(dashboardCheck.text, 'hasLoginForm');
      if (!hasDashboard && hasLoginForm) {
        await callTool('browser_wait_for', { time: 2 });
        const dashboardRetry = await callTool('browser_run_code', {
          code: `async (page) => {
            const text = await page.locator('body').innerText();
            const loginInput = page.locator('input[name="login-account"], #login-account');
            const passwordInput = page.locator('input[name="login-password"], #login-password');
            return {
              hasDashboard:
                text.includes('数据概览')
                || text.includes('系统状态')
                || text.includes('用户管理')
                || text.includes('公告管理'),
              hasLoginForm: (await loginInput.count()) > 0 && (await passwordInput.count()) > 0,
            };
          }`,
        });
        hasDashboard = extractBooleanValue(dashboardRetry.text, 'hasDashboard');
        hasLoginForm = extractBooleanValue(dashboardRetry.text, 'hasLoginForm');
      }
      if (!hasDashboard && hasLoginForm) {
        addIssue('P1', caseName, '后台登录后未进入仪表盘', {
          evidence: dashboardCheck.text.slice(0, 800),
        });
      }

      await callTool('browser_run_code', {
        code: `async (page) => {
          const labels = ['用户管理', '公告管理', '存档管理', '排行榜管理'];
          for (const label of labels) {
            const item = page.getByText(label, { exact: false }).first();
            if (await item.count()) {
              await item.click();
              await page.waitForTimeout(600);
            }
          }
        }`,
      });

      if (viewport.name === 'desktop' && hasDashboard) {
        const announcementCheck = await callTool('browser_run_code', {
          code: `async (page) => {
            const stamp = Date.now();
            const title = '自动化公告_' + stamp;
            const content = '自动化回归公告内容_' + stamp;
            let createButtonFound = false;
            let titleInputFound = false;
            let contentInputFound = false;
            let saveButtonFound = false;

            const nav = page.getByText('公告管理', { exact: false }).first();
            if (await nav.count()) {
              await nav.click();
              await page.waitForTimeout(800);
            }

            const createBtn = page.getByRole('button', { name: /新建公告|新增公告|创建公告|发布公告/ }).first();
            if (await createBtn.count()) {
              createButtonFound = true;
              await createBtn.click();
              await page.waitForTimeout(600);
            }

            const titleInput = page.locator('#announcement-title, input[name=\"announcement-title\"], input[placeholder*=\"标题\"]').first();
            const contentInput = page.locator('#announcement-content, textarea[name=\"announcement-content\"], textarea[placeholder*=\"内容\"], textarea').first();

            if (await titleInput.count()) {
              titleInputFound = true;
              await titleInput.fill(title);
            }
            if (await contentInput.count()) {
              contentInputFound = true;
              await contentInput.fill(content);
            }

            const saveBtn = page.getByRole('button', { name: /保存|提交|确定/ }).first();
            if (await saveBtn.count()) {
              saveButtonFound = true;
              await saveBtn.click();
              await page.waitForTimeout(1200);
            }

            await page.reload();
            await page.waitForTimeout(1200);

            let persisted = false;
            for (let i = 0; i < 12; i++) {
              const body = await page.locator('body').innerText();
              if (body.includes(title)) {
                persisted = true;
                break;
              }
              await page.waitForTimeout(500);
            }

            return {
              title,
              persisted,
              createButtonFound,
              titleInputFound,
              contentInputFound,
              saveButtonFound,
            };
          }`,
        });

        const persisted = extractBooleanValue(announcementCheck.text, 'persisted');
        const createButtonFound = extractBooleanValue(announcementCheck.text, 'createButtonFound');
        const titleInputFound = extractBooleanValue(announcementCheck.text, 'titleInputFound');
        const contentInputFound = extractBooleanValue(announcementCheck.text, 'contentInputFound');
        const saveButtonFound = extractBooleanValue(announcementCheck.text, 'saveButtonFound');
        const crudHookReady = createButtonFound && titleInputFound && contentInputFound && saveButtonFound;

        if (!crudHookReady) {
          addIssue('P2', caseName, '公告 CRUD 自动化选择器未完全命中', {
            evidence: announcementCheck.text.slice(0, 1000),
          });
        } else if (!persisted) {
          addIssue('P1', caseName, '公告 CRUD 持久化校验未通过', {
            evidence: announcementCheck.text.slice(0, 1000),
          });
        }
      }

      const shotPath = path.join(screenshotsDir, `${caseName}.png`);
      await callTool('browser_take_screenshot', {
        type: 'png',
        fullPage: true,
        filename: shotPath,
      });

      const consoleResult = await callTool('browser_console_messages', {
        level: 'error',
        all: false,
      });
      const networkResult = await callTool('browser_network_requests', {
        requestBody: false,
        requestHeaders: false,
        static: false,
      });

      if (hasConsoleError(consoleResult.text)) {
        addIssue('P1', caseName, '后台页面存在 console error', {
          console: consoleResult.text.slice(0, 1200),
          screenshot: shotPath,
        });
      }

      const failures = parseNetworkFailures(networkResult.text).filter(
        (item) => item.status >= 500 && /\/api\//i.test(item.line),
      );
      if (failures.length > 0) {
        addIssue('P1', caseName, '后台存在 5xx 网络请求失败', {
          failures: failures.slice(0, 10),
          screenshot: shotPath,
        });
      }

      summary.cases.push({
        name: caseName,
        status: 'passed',
        durationMs: Date.now() - startedAt,
        screenshot: shotPath,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addIssue('P0', caseName, '后台用例执行失败', { error: message });
      summary.cases.push({
        name: caseName,
        status: 'failed',
        durationMs: Date.now() - startedAt,
        error: message,
      });
    }
  }
}

async function main() {
  try {
    const apiReady = await waitForService('http://localhost:3000/health');
    const gameReady = await waitForService('http://localhost:5173/');
    const adminReady = await waitForService('http://localhost:5174/admin');

    if (!apiReady) {
      addIssue('P0', 'preflight', 'API 服务未就绪: http://localhost:3000/health', {});
    }
    if (!gameReady) {
      addIssue('P0', 'preflight', '前台服务未就绪: http://localhost:5173/', {});
    }
    if (!adminReady) {
      addIssue('P0', 'preflight', '后台服务未就绪: http://localhost:5174/admin', {});
    }

    await client.connect(transport);

    await runGameCases();
    await runAdminCases();
  } finally {
    summary.finishedAt = new Date().toISOString();
    summary.stats = {
      totalCases: summary.cases.length,
      failedCases: summary.cases.filter((item) => item.status === 'failed').length,
      p0: summary.issues.filter((item) => item.priority === 'P0').length,
      p1: summary.issues.filter((item) => item.priority === 'P1').length,
      p2: summary.issues.filter((item) => item.priority === 'P2').length,
    };

    fs.writeFileSync(
      path.join(absReportDir, 'issues.json'),
      JSON.stringify(summary.issues, null, 2),
      'utf-8',
    );
    fs.writeFileSync(
      path.join(absReportDir, 'iteration-summary.json'),
      JSON.stringify(summary, null, 2),
      'utf-8',
    );

    await client.close();
  }
}

await main();
