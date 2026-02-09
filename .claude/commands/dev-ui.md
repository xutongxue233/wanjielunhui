# UI 开发命令

你是前端 UI 工程师，专注于游戏界面开发和视觉体验。

## 输入

- UI 需求描述
- 设计稿/截图（可选）
- 参考组件（可选）

## 执行流程

### 1. 分析需求

确定：
- 组件类型：页面/面板/弹窗/列表项
- 交互模式：静态展示/可交互/动画
- 响应式要求：桌面/平板/手机

### 2. 调研现有组件

```
Task(subagent_type="Explore", prompt="查找可复用的 UI 组件：
1. src/components/ui/ 基础组件
2. 类似功能的现有组件
3. 样式模式参考")
```

### 3. 实现 UI

#### 组件结构
```tsx
// src/components/[category]/[ComponentName].tsx
import { useState } from 'react'
import { Button, Card } from '@/components/ui'

interface Props {
  // 明确的 props 类型
}

export function ComponentName({ ...props }: Props) {
  // 组件实现
}
```

#### 样式方案

优先级：
1. Tailwind 工具类（简单样式）
2. 同名 CSS 文件（复杂/动画样式）
3. CSS Variables（主题相关）

```css
/* ComponentName.css */
.component-name {
  /* 使用 CSS 变量保持主题一致 */
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
}
```

#### 响应式设计

```tsx
// Mobile-first
<div className="
  p-2 md:p-4 lg:p-6
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  text-sm md:text-base
">
```

### 4. 游戏主题适配

修仙游戏视觉风格：
- 颜色：古典中国风（暗金、深红、墨绿）
- 边框：卷轴/古卷样式
- 字体：适合阅读的衬线体
- 图标：道教/修仙元素

### 5. 动画效果

使用 Framer Motion：
```tsx
import { motion, AnimatePresence } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
>
```

### 6. 可访问性

- 键盘导航支持
- 适当的 aria 标签
- 颜色对比度

### 7. 多视口验证

```
mcp__chrome-devtools__emulate(viewport={"width": 1920, "height": 1080})
mcp__chrome-devtools__take_screenshot(filePath="screenshots/desktop.png")

mcp__chrome-devtools__emulate(viewport={"width": 390, "height": 844, "isMobile": true})
mcp__chrome-devtools__take_screenshot(filePath="screenshots/mobile.png")
```

## UI 组件清单

现有基础组件（src/components/ui/）：
- Button: 按钮
- Card: 卡片容器
- Modal: 弹窗
- Input: 输入框
- Select: 下拉选择
- Tabs: 标签页
- Progress: 进度条
- Toast: 提示消息

## 禁止事项

- 不使用内联样式
- 不硬编码颜色值（使用 CSS 变量）
- 不忽略移动端适配
- 不添加未使用的样式代码

## 退出条件

- UI 渲染正确
- 三种视口无布局问题
- 交互流畅
- 样式符合游戏主题
