#!/bin/bash
# pre-push hook for iteration system
# 运行 smoke test 确保基本功能正常

set -e

# 检查是否跳过
if [ "$SKIP_ITER_HOOKS" = "1" ]; then
  echo "[iter-hooks] Skipped by SKIP_ITER_HOOKS=1"
  exit 0
fi

echo "[iter-hooks] Running pre-push smoke test..."

# 检查构建是否通过
echo "[iter-hooks] Checking TypeScript build..."
pnpm build || {
  echo "[iter-hooks] Build failed! Push blocked."
  exit 1
}

echo "[iter-hooks] Build check passed"

# 注意: DevTools MCP 测试需要浏览器环境
# 这里只做基本检查，完整测试通过 /iter-devtools-test 命令执行
echo "[iter-hooks] Pre-push checks completed"
echo "[iter-hooks] Tip: Run /iter-devtools-test for full validation"
