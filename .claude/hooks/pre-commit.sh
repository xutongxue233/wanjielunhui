#!/bin/bash
# pre-commit hook for iteration system
# 生成变更摘要并运行静态检查

set -e

# 检查是否跳过
if [ "$SKIP_ITER_HOOKS" = "1" ]; then
  echo "[iter-hooks] Skipped by SKIP_ITER_HOOKS=1"
  exit 0
fi

echo "[iter-hooks] Running pre-commit checks..."

# 生成变更摘要
CHANGED_FILES=$(git diff --cached --name-only)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SUMMARY_FILE="reports/iteration/changed-files-${TIMESTAMP}.md"

mkdir -p reports/iteration

cat > "$SUMMARY_FILE" << EOF
# 变更文件摘要

时间: $(date '+%Y-%m-%d %H:%M:%S')

## 变更文件列表

\`\`\`
${CHANGED_FILES}
\`\`\`

## 统计

- 总文件数: $(echo "$CHANGED_FILES" | wc -l)
- 前端文件: $(echo "$CHANGED_FILES" | grep -c "^src/" || true)
- 后端文件: $(echo "$CHANGED_FILES" | grep -c "^server/" || true)
EOF

echo "[iter-hooks] Generated: $SUMMARY_FILE"

# 运行 lint 检查 (如果有变更的 ts/tsx 文件)
if echo "$CHANGED_FILES" | grep -qE '\.(ts|tsx)$'; then
  echo "[iter-hooks] Running lint check..."
  pnpm lint --quiet || {
    echo "[iter-hooks] Lint check failed!"
    exit 1
  }
  echo "[iter-hooks] Lint check passed"
fi

echo "[iter-hooks] Pre-commit checks completed"
