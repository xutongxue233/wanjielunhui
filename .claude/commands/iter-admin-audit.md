# 后台审计命令

验收后台管理系统功能完整性。

## 执行步骤

1. **获取后台页面列表**
   扫描 `src/admin/pages/*.tsx`:
   - DashboardPage (仪表盘)
   - UsersPage (用户管理)
   - SavesPage (存档管理)
   - AnnouncementsPage (公告管理)
   - ActivitiesPage (活动管理)
   - MailPage (邮件管理)
   - RankingPage (排行榜管理)
   - FriendsPage (好友管理)
   - SectsPage (宗门管理)
   - ChatPage (聊天管理)
   - MarketPage (交易市场)
   - PvpPage (PVP管理)

2. **对每个页面执行验收**
   使用 DevTools MCP:
   - 导航到页面
   - 检查列表加载
   - 测试 CRUD 操作
   - 验证分页筛选
   - 检查空态显示
   - 验证权限控制

3. **持久化验证**
   - 创建/编辑后刷新
   - 确认数据仍存在
   - 标记为持久化通过

4. **生成验收矩阵**
   输出 `admin-acceptance.md`

## 验收项清单

### 每个页面必须验收

| 功能 | 描述 | 必须通过 |
|------|------|----------|
| 列表展示 | 数据正确加载显示 | 是 |
| 分页 | 翻页正常工作 | 是 |
| 搜索/筛选 | 过滤功能正常 | 是 (如有) |
| 创建 | 新建成功且持久化 | 是 (如有) |
| 编辑 | 修改成功且持久化 | 是 (如有) |
| 删除 | 删除成功且有确认 | 是 (如有) |
| 空态 | 无数据时正确提示 | 是 |
| 加载态 | 加载中有指示 | 建议 |
| 错误处理 | 失败有明确提示 | 是 |

## DevTools MCP 操作序列

```
1. navigate_page(url="http://localhost:5173/admin")
2. wait_for(text="登录") 或 wait_for(text="仪表盘")
3. 如需登录:
   - fill(uid="username-input", value="admin")
   - fill(uid="password-input", value="password")
   - click(uid="login-button")
4. take_snapshot() 获取页面结构
5. click 导航到目标页面
6. list_network_requests() 检查 API 调用
7. list_console_messages() 检查错误
8. take_screenshot() 保存证据
```

## 输出格式

### admin-acceptance.md
```markdown
# 后台功能验收矩阵

## 用户管理

| 功能 | 状态 | 证据 | 备注 |
|------|------|------|------|
| 列表展示 | ✅ | API 200 | 显示 20 条 |
| 分页 | ✅ | page=2 成功 | - |
| 搜索 | ❌ | 无响应 | 需修复 |
| 封禁 | ✅ | 持久化确认 | - |
| 解封 | ✅ | 持久化确认 | - |
```

## 退出条件

- 所有页面验收完成
- admin-acceptance.md 生成
- 问题已追加到 issues.json

## 失败处理

- 页面无法加载: 记录 P0 问题
- API 返回错误: 记录具体状态码
- DevTools 超时: 重试一次后记录
