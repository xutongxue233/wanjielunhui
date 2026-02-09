#!/usr/bin/env node
/**
 * 迭代停止条件检查脚本
 * 用于 Claude Code Stop Hook，阻止在停止条件未满足时结束对话
 *
 * 使用: node check-stop-condition.js
 * 环境变量: SKIP_ITER_HOOKS=1 跳过检查
 *
 * 退出码:
 *   0 - 允许停止（条件满足或跳过检查）
 *   1 - 阻止停止（条件未满足）
 */

const fs = require('fs');
const path = require('path');

// 跳过检查
if (process.env.SKIP_ITER_HOOKS === '1') {
  console.log('[ITER-HOOK] SKIP_ITER_HOOKS=1, 跳过停止条件检查');
  process.exit(0);
}

const REPORTS_DIR = path.join(__dirname, '../../reports/iteration');
const LATEST_FILE = path.join(REPORTS_DIR, 'latest.json');

/**
 * 读取最新迭代状态
 */
function readLatestState() {
  try {
    if (!fs.existsSync(LATEST_FILE)) {
      return null;
    }
    const content = fs.readFileSync(LATEST_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('[ITER-HOOK] 读取 latest.json 失败:', e.message);
    return null;
  }
}

/**
 * 读取 issues.json
 */
function readIssues(iterationId) {
  try {
    const issuesPath = path.join(REPORTS_DIR, iterationId, 'issues.json');
    if (!fs.existsSync(issuesPath)) {
      return [];
    }
    const content = fs.readFileSync(issuesPath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('[ITER-HOOK] 读取 issues.json 失败:', e.message);
    return [];
  }
}

/**
 * 检查停止条件
 */
function checkStopConditions(state, issues) {
  const conditions = {
    p0_p1_cleared: true,
    no_console_errors: true,
    no_network_failures: true,
    admin_crud_passed: true,
    persistence_verified: true,
    multi_viewport: true
  };

  // 检查 P0/P1 问题
  const openP0P1 = issues.filter(i =>
    (i.severity === 'P0' || i.severity === 'P1') &&
    i.status !== 'verified'
  );
  conditions.p0_p1_cleared = openP0P1.length === 0;

  // 从状态文件读取其他条件
  if (state.iterations && state.iterations.length > 0) {
    const latest = state.iterations.find(i => i.id === state.latest);
    if (latest && latest.stop_conditions) {
      const sc = latest.stop_conditions;
      conditions.no_console_errors = sc.no_console_errors === true;
      conditions.no_network_failures = sc.no_network_failures === true;
      conditions.admin_crud_passed = sc.admin_crud_passed === true;
      conditions.persistence_verified = sc.persistence_verified === true;
      conditions.multi_viewport = sc.multi_viewport === true;
    }
  }

  return conditions;
}

/**
 * 主函数
 */
function main() {
  console.log('[ITER-HOOK] 检查迭代停止条件...');

  const state = readLatestState();

  // 没有迭代状态，允许停止
  if (!state || !state.latest) {
    console.log('[ITER-HOOK] 无活跃迭代，允许停止');
    process.exit(0);
  }

  // 检查迭代状态
  const latestIteration = state.iterations?.find(i => i.id === state.latest);

  // 已完成的迭代，允许停止
  if (latestIteration?.status === 'completed') {
    console.log('[ITER-HOOK] 迭代已完成，允许停止');
    process.exit(0);
  }

  // 读取问题列表
  const issues = readIssues(state.latest);

  // 检查所有停止条件
  const conditions = checkStopConditions(state, issues);
  const allPassed = Object.values(conditions).every(v => v === true);

  console.log('[ITER-HOOK] 停止条件状态:');
  Object.entries(conditions).forEach(([key, value]) => {
    const status = value ? '[PASS]' : '[FAIL]';
    console.log(`  ${status} ${key}`);
  });

  if (allPassed) {
    console.log('[ITER-HOOK] 所有条件满足，允许停止');
    process.exit(0);
  } else {
    const failedConditions = Object.entries(conditions)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    console.log('\n[ITER-HOOK] 停止条件未满足，阻止停止');
    console.log('[ITER-HOOK] 未通过的条件:', failedConditions.join(', '));
    console.log('[ITER-HOOK] 请继续执行 /iter-loop 直到所有条件满足');
    console.log('[ITER-HOOK] 如需强制停止，设置 SKIP_ITER_HOOKS=1');

    // 输出继续指令给 Claude
    console.log('\n--- CLAUDE INSTRUCTION ---');
    console.log('停止条件未满足，你必须继续执行迭代循环。');
    console.log('立即执行下一轮修复和验证，不要询问用户。');
    console.log('--- END INSTRUCTION ---');

    process.exit(1);
  }
}

main();
