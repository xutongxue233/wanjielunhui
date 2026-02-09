#!/bin/bash
# 安装迭代系统 hooks

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"
CLAUDE_HOOKS_DIR="$PROJECT_ROOT/.claude/hooks"

echo "Installing iteration system hooks..."

# 确保 hooks 目录存在
mkdir -p "$HOOKS_DIR"

# 安装 pre-commit hook
if [ -f "$CLAUDE_HOOKS_DIR/pre-commit.sh" ]; then
  cp "$CLAUDE_HOOKS_DIR/pre-commit.sh" "$HOOKS_DIR/pre-commit"
  chmod +x "$HOOKS_DIR/pre-commit"
  echo "✓ Installed pre-commit hook"
fi

# 安装 pre-push hook
if [ -f "$CLAUDE_HOOKS_DIR/pre-push.sh" ]; then
  cp "$CLAUDE_HOOKS_DIR/pre-push.sh" "$HOOKS_DIR/pre-push"
  chmod +x "$HOOKS_DIR/pre-push"
  echo "✓ Installed pre-push hook"
fi

echo ""
echo "Hooks installed successfully!"
echo ""
echo "Usage:"
echo "  - Hooks run automatically on commit/push"
echo "  - Skip with: SKIP_ITER_HOOKS=1 git commit/push"
echo ""
echo "To uninstall:"
echo "  rm .git/hooks/pre-commit .git/hooks/pre-push"
