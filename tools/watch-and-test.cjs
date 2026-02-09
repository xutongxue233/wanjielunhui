#!/usr/bin/env node
/**
 * 文件监听自动测试
 *
 * 监听代码变更，自动触发 DevTools 测试
 *
 * 用法:
 *   node tools/watch-and-test.cjs
 *
 * 依赖:
 *   pnpm add -D chokidar
 */

const { spawn } = require('child_process');
const path = require('path');

// 尝试加载 chokidar
let chokidar;
try {
  chokidar = require('chokidar');
} catch (e) {
  console.log('[WATCH] chokidar 未安装');
  console.log('[WATCH] 请先运行: pnpm add -D chokidar');
  process.exit(1);
}

const WATCH_PATHS = [
  'src/**/*.tsx',
  'src/**/*.ts',
  'server/src/**/*.ts'
];

const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/dist/**'
];

// 防抖：文件变更后等待 2 秒再触发
let debounceTimer = null;
const DEBOUNCE_MS = 2000;

// 测试状态
let isRunning = false;

function runTest() {
  if (isRunning) {
    console.log('[WATCH] 测试正在运行，跳过...');
    return;
  }

  isRunning = true;
  console.log('[WATCH] 检测到变更，启动测试...');
  console.log('[WATCH] 时间:', new Date().toISOString());

  // 先运行构建检查
  const build = spawn('pnpm', ['build'], {
    stdio: 'pipe',
    shell: true
  });

  let buildOutput = '';
  build.stdout.on('data', (data) => { buildOutput += data.toString(); });
  build.stderr.on('data', (data) => { buildOutput += data.toString(); });

  build.on('close', (code) => {
    if (code !== 0) {
      console.log('[WATCH] 构建失败:');
      console.log(buildOutput.slice(-500)); // 最后 500 字符
      console.log('[WATCH] 请修复后重试');
      isRunning = false;
      return;
    }

    console.log('[WATCH] 构建通过，可以运行 DevTools 测试');
    console.log('[WATCH] 提示: 手动执行 /iter-devtools-test 进行完整测试');
    isRunning = false;
  });
}

function onFileChange(filePath) {
  console.log(`[WATCH] 文件变更: ${filePath}`);

  // 防抖
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    runTest();
  }, DEBOUNCE_MS);
}

function main() {
  console.log('[WATCH] 启动文件监听...');
  console.log('[WATCH] 监听路径:', WATCH_PATHS.join(', '));
  console.log('[WATCH] 按 Ctrl+C 退出');
  console.log('');

  const watcher = chokidar.watch(WATCH_PATHS, {
    ignored: IGNORE_PATTERNS,
    persistent: true,
    ignoreInitial: true
  });

  watcher
    .on('change', onFileChange)
    .on('add', onFileChange)
    .on('unlink', onFileChange)
    .on('error', (error) => {
      console.error('[WATCH] 监听错误:', error);
    });
}

main();
