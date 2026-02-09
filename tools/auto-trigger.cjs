#!/usr/bin/env node
/**
 * 自动触发脚本
 *
 * 用法:
 *   node tools/auto-trigger.cjs iter-loop    # 触发迭代循环
 *   node tools/auto-trigger.cjs build "功能描述"  # 触发一键构建
 *
 * 可配合:
 *   - cron 定时任务
 *   - CI/CD (GitHub Actions)
 *   - 文件监听工具 (nodemon, chokidar)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMMANDS = {
  'iter-loop': '执行完整迭代循环，直到停止条件满足',
  'iter-fix': '修复当前发现的问题',
  'build': '一键构建功能（需要参数：功能描述）',
  'quick-fix': '快速修复问题（需要参数：问题描述）',
  'status': '查看项目状态'
};

function showHelp() {
  console.log('自动触发脚本 - 万界轮回开发团队');
  console.log('');
  console.log('用法: node tools/auto-trigger.cjs <command> [args]');
  console.log('');
  console.log('可用命令:');
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(15)} ${desc}`);
  });
  console.log('');
  console.log('示例:');
  console.log('  node tools/auto-trigger.cjs iter-loop');
  console.log('  node tools/auto-trigger.cjs build "添加好友系统"');
  console.log('  node tools/auto-trigger.cjs quick-fix "登录报错"');
}

function triggerClaude(command, args = '') {
  const prompt = args ? `/${command} ${args}` : `/${command}`;

  console.log(`[AUTO-TRIGGER] 触发命令: ${prompt}`);
  console.log(`[AUTO-TRIGGER] 时间: ${new Date().toISOString()}`);
  console.log('');

  // 记录触发日志
  const logDir = path.join(__dirname, '../reports/auto-trigger');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, `${Date.now()}.log`);
  fs.writeFileSync(logFile, JSON.stringify({
    command,
    args,
    prompt,
    timestamp: new Date().toISOString()
  }, null, 2));

  // 启动 Claude Code
  // 注意: 这需要 claude 命令在 PATH 中
  const claude = spawn('claude', ['-p', prompt], {
    stdio: 'inherit',
    shell: true
  });

  claude.on('error', (err) => {
    console.error('[AUTO-TRIGGER] 启动 Claude Code 失败:', err.message);
    console.log('');
    console.log('请确保:');
    console.log('1. Claude Code CLI 已安装');
    console.log('2. claude 命令在系统 PATH 中');
    process.exit(1);
  });

  claude.on('close', (code) => {
    console.log(`[AUTO-TRIGGER] Claude Code 退出，代码: ${code}`);

    // 更新日志
    const log = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    log.exitCode = code;
    log.endTime = new Date().toISOString();
    fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
  });
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  const command = args[0];
  const commandArgs = args.slice(1).join(' ');

  if (!COMMANDS[command]) {
    console.error(`[AUTO-TRIGGER] 未知命令: ${command}`);
    console.log('');
    showHelp();
    process.exit(1);
  }

  triggerClaude(command, commandArgs);
}

main();
