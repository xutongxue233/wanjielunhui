# API 审计命令

生成/更新 API 契约文件，核对前后端一致性。

## 执行步骤

1. **读取前端 API 定义**
   - `src/services/api.ts` (前台 API)
   - `src/admin/api/index.ts` (后台 API)

2. **读取后端路由定义**
   - `server/src/modules/**/\*.routes.ts`
   - `server/src/modules/**/\*.schema.ts`
   - `server/src/modules/**/\*.controller.ts`

3. **解析并对比**
   - 端点路径一致性
   - 请求参数一致性
   - 响应字段一致性
   - 错误码定义
   - 鉴权要求

4. **生成报告**
   - `api-contract.json`: 完整契约
   - `api-coverage.md`: 覆盖率摘要
   - 追加问题到 `issues.json`

## 检查清单

### 端点检查
- [ ] 所有前端调用的端点后端都已实现
- [ ] 所有后端端点前端都有对应调用
- [ ] HTTP 方法一致 (GET/POST/PUT/DELETE)

### 字段检查
- [ ] 请求参数名称和类型一致
- [ ] 响应字段名称和类型一致
- [ ] 必填/可选标记一致

### 分页检查
- [ ] 分页参数: page, pageSize
- [ ] 分页响应: total, page, pageSize
- [ ] 边界处理正确

### 鉴权检查
- [ ] 需要 token 的端点正确标记
- [ ] admin 端点检查角色权限

## 输出文件

### api-contract.json
```json
{
  "version": "1.0.0",
  "generatedAt": "...",
  "endpoints": [...],
  "summary": {
    "total": 50,
    "match": 45,
    "mismatch": 3,
    "missing_backend": 1,
    "missing_frontend": 1
  }
}
```

### api-coverage.md
```markdown
# API 覆盖率报告

## 统计
- 总端点数: 50
- 匹配: 45 (90%)
- 不匹配: 3 (6%)
- 后端缺失: 1 (2%)
- 前端缺失: 1 (2%)

## 问题列表
| 端点 | 问题 | 严重级别 |
|------|------|----------|
| GET /admin/users | 响应缺少 email 字段 | P1 |
```

## 退出条件

- api-contract.json 生成成功
- 所有问题已记录到 issues.json

## 失败处理

- 文件读取失败: 报告缺失的文件
- 解析失败: 报告解析错误位置
