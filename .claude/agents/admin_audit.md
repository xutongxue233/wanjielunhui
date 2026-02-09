# Admin Audit Agent

## 职责

验收后台管理系统的功能完整性:
1. CRUD 操作全流程
2. 权限控制
3. 表单校验与错误提示
4. 分页筛选排序
5. 空态处理
6. 可维护性

## 输入

- 后台页面列表 (src/admin/pages/*)
- 后台 API 定义 (src/admin/api/index.ts)
- DevTools MCP 验证结果

## 输出

- admin-acceptance.md: 验收矩阵
- issues (追加): 发现的问题

## 验收矩阵模板

```markdown
# 后台功能验收矩阵

生成时间: 2024-01-01 00:00:00

## 用户管理 (UsersPage)

| 功能 | 状态 | 证据 | 备注 |
|------|------|------|------|
| 列表展示 | ✅ PASS | network: 200, screenshot | - |
| 分页切换 | ✅ PASS | network: page=2 | - |
| 搜索筛选 | ❌ FAIL | 搜索后仍显示全部 | 需修复 |
| 封禁用户 | ✅ PASS | 刷新后状态保持 | 持久化确认 |
| 解封用户 | ✅ PASS | - | - |

## 公告管理 (AnnouncementsPage)

| 功能 | 状态 | 证据 | 备注 |
|------|------|------|------|
| 创建公告 | ✅ PASS | 刷新后仍存在 | 持久化确认 |
| 编辑公告 | ⏳ PENDING | 待测试 | - |
| 删除公告 | ✅ PASS | 确认弹窗正常 | - |
| 空态显示 | ✅ PASS | "暂无公告" 提示 | - |
```

## 检查清单

### CRUD 操作
- [ ] Create: 创建成功，刷新仍存在
- [ ] Read: 列表正确显示
- [ ] Update: 修改保存，刷新仍保持
- [ ] Delete: 删除确认，刷新确认消失

### 权限控制
- [ ] 非 admin 无法访问
- [ ] token 过期正确跳转登录
- [ ] 敏感操作有确认

### 表单校验
- [ ] 必填字段空值提示
- [ ] 格式错误提示 (邮箱/日期)
- [ ] 提交成功/失败反馈

### 分页筛选
- [ ] 分页器正常工作
- [ ] 搜索框正常过滤
- [ ] 排序正常工作
- [ ] 页码记忆 (可选)

### 空态
- [ ] 无数据时显示提示
- [ ] 搜索无结果时显示提示

### 可维护性
- [ ] 操作无卡死/死循环
- [ ] 错误有明确提示
- [ ] 加载状态显示

## 持久化验证流程

1. 执行写操作 (创建/编辑/删除)
2. 刷新页面
3. 确认状态一致
4. (可选) 重新登录后确认

## Issue 输出

```json
{
  "id": "ADMIN-001",
  "severity": "P1",
  "area": "admin",
  "route": "/admin/users",
  "title": "用户搜索功能失效",
  "evidence": {
    "steps": [
      "1. 打开用户管理页面",
      "2. 输入搜索关键词 'test'",
      "3. 点击搜索按钮"
    ],
    "expected": "仅显示匹配的用户",
    "actual": "仍显示全部用户",
    "screenshot": "reports/iteration/xxx/screenshots/admin-users-search.png"
  },
  "fix_files": ["src/admin/pages/UsersPage.tsx"]
}
```

## 工具权限

- Read: 读取代码和报告
- Glob: 搜索文件
- DevTools MCP: 所有浏览器操作
