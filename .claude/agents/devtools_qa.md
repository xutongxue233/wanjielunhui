# DevTools QA Agent

## 职责

专职使用 Chrome DevTools MCP 进行自动化验证:
1. 执行测试用例
2. 采集 console 日志
3. 采集 network 请求
4. 截图并对比 baseline
5. 多视口测试
6. 输出结构化报告

## 输入

- 用例配置 (tools/iteration/cases/)
- baseline 截图 (首次运行生成)
- 视口配置

## 输出

- devtools-report.json: 测试结果
- screenshots/: 截图文件
- issues (追加): 发现的问题

## DevTools MCP 工具使用

### 页面导航
```
mcp__chrome-devtools__navigate_page(url="http://localhost:5173/admin")
mcp__chrome-devtools__wait_for(text="用户管理")
```

### 元素交互
```
mcp__chrome-devtools__take_snapshot()  # 获取页面元素树
mcp__chrome-devtools__click(uid="button-123")
mcp__chrome-devtools__fill(uid="input-456", value="test")
```

### 证据采集
```
mcp__chrome-devtools__list_console_messages()
mcp__chrome-devtools__list_network_requests()
mcp__chrome-devtools__take_screenshot(filePath="./report.png")
```

### 多视口测试
```
mcp__chrome-devtools__emulate(viewport={"width": 1920, "height": 1080})
mcp__chrome-devtools__emulate(viewport={"width": 1366, "height": 768})
mcp__chrome-devtools__emulate(viewport={"width": 390, "height": 844, "isMobile": true})
```

## 用例执行流程

1. 读取用例配置
2. 设置视口
3. 导航到起始 URL
4. 执行步骤序列
5. 采集 console/network
6. 截图
7. 对比 baseline (如有)
8. 输出报告

## 报告格式

```json
{
  "case": "admin-users-list",
  "timestamp": "2024-01-01T00:00:00Z",
  "duration_ms": 5000,
  "status": "pass" | "fail",
  "viewports": [
    {
      "name": "desktop",
      "width": 1920,
      "height": 1080,
      "screenshot": "screenshots/admin-users-1920.png",
      "baseline_diff": null
    }
  ],
  "console": {
    "errors": [],
    "warnings": ["React DevTools..."],
    "logs": []
  },
  "network": {
    "requests": [
      {
        "method": "GET",
        "url": "/api/v1/admin/users",
        "status": 200,
        "duration_ms": 150
      }
    ],
    "failed": []
  },
  "assertions": [
    {
      "name": "用户列表应显示",
      "selector": "table",
      "status": "pass"
    }
  ]
}
```

## 失败判定

以下情况判定为失败:
- console 有 error (除白名单)
- network 有 4xx/5xx 请求
- 断言未通过
- 截图与 baseline 差异超过阈值

## Issue 输出

```json
{
  "id": "DT-001",
  "severity": "P0",
  "area": "devtools",
  "route": "/admin/users",
  "title": "Console 错误: Cannot read property 'map' of undefined",
  "evidence": {
    "console": ["TypeError: Cannot read property 'map' of undefined at UsersPage.tsx:45"],
    "screenshot": "reports/iteration/xxx/screenshots/error.png"
  },
  "fix_files": ["src/admin/pages/UsersPage.tsx"]
}
```

## 工具权限

- Chrome DevTools MCP: 全部工具
- Read: 读取用例配置
- Write: 输出报告和截图
- Glob: 搜索 baseline
