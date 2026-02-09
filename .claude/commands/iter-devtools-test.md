# DevTools 测试命令

使用 Chrome DevTools MCP 执行自动化验证。

## 执行步骤

1. **加载用例配置**
   从 `tools/iteration/cases/` 读取:
   - `frontend/*.json` (前台用例)
   - `admin/*.json` (后台用例)

2. **设置视口**
   依次测试三种视口:
   - Desktop: 1920x1080
   - Laptop: 1366x768
   - Mobile: 390x844

3. **执行用例**
   对每个用例:
   - 导航到起始 URL
   - 执行步骤序列
   - 采集 console 日志
   - 采集 network 请求
   - 截图保存

4. **对比 baseline**
   如果存在 baseline:
   - 对比截图差异
   - 超过阈值则标记失败

5. **生成报告**
   输出 `devtools-report.json`

## 用例配置格式

```json
{
  "name": "admin-users-list",
  "description": "后台用户列表页面",
  "start_url": "http://localhost:5173/admin",
  "auth": {
    "required": true,
    "username": "admin",
    "password": "admin123"
  },
  "steps": [
    { "action": "wait", "text": "用户管理" },
    { "action": "click", "target": "用户管理" },
    { "action": "wait", "text": "用户列表" },
    { "action": "screenshot", "name": "users-list" }
  ],
  "assertions": [
    { "type": "element_exists", "selector": "table" },
    { "type": "no_console_errors" },
    { "type": "api_success", "pattern": "/admin/users" }
  ],
  "viewports": ["desktop", "laptop", "mobile"]
}
```

## DevTools MCP 调用

### 视口设置
```
emulate(viewport={"width": 1920, "height": 1080})
emulate(viewport={"width": 1366, "height": 768})
emulate(viewport={"width": 390, "height": 844, "isMobile": true, "hasTouch": true})
```

### 证据采集
```
list_console_messages()  # 获取所有控制台消息
list_network_requests()  # 获取所有网络请求
take_screenshot(filePath="./screenshots/xxx.png")
```

### 错误过滤白名单
以下警告可忽略:
- "Download the React DevTools"
- "Warning: ReactDOM.render is deprecated"
- favicon.ico 404

## 报告格式

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "cases": [
    {
      "name": "admin-users-list",
      "status": "pass",
      "duration_ms": 3500,
      "viewports": {
        "desktop": { "status": "pass", "screenshot": "..." },
        "laptop": { "status": "pass", "screenshot": "..." },
        "mobile": { "status": "fail", "error": "按钮被遮挡" }
      },
      "console": { "errors": [], "warnings": [...] },
      "network": { "total": 5, "failed": 0 }
    }
  ],
  "summary": {
    "total": 10,
    "passed": 9,
    "failed": 1
  }
}
```

## 退出条件

- 所有用例执行完成
- devtools-report.json 生成
- 截图保存到 screenshots/

## 失败处理

- 页面超时: 记录超时错误，继续下一个
- 元素未找到: 记录元素信息，标记失败
- 网络错误: 记录请求详情
