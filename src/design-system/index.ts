/**
 * Design System - 统一导出
 */

export * from "./tokens";
export { default as tokens } from "./tokens";

// CSS 变量生成器 - 用于生成 :root 中的 CSS 变量
export function generateCSSVariables() {
  return `
/* ===== 自动生成的 CSS 变量 - 请勿手动修改 ===== */
/* 来源: src/design-system/tokens.ts */

:root {
  /* Colors - Primary */
  --color-primary: #c9a227;
  --color-primary-light: #e8d48b;
  --color-primary-dark: #a88620;
  --color-primary-muted: rgba(201, 162, 39, 0.6);

  /* Colors - Secondary */
  --color-jade: #2d8b6f;
  --color-jade-light: #5ab896;
  --color-crimson: #8b2942;
  --color-crimson-light: #c44569;
  --color-azure: #2563eb;
  --color-azure-light: #60a5fa;
  --color-purple: #6d28d9;
  --color-purple-light: #a78bfa;

  /* Colors - Background */
  --bg-base: #0a0a0f;
  --bg-elevated: #12121a;
  --bg-surface: #1a1a28;
  --bg-overlay: #252535;
  --bg-subtle: #3a3a4a;

  /* Colors - Text */
  --text-primary: #e8e4d9;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --text-disabled: #4b5563;

  /* Colors - Semantic */
  --color-success: #2d8b6f;
  --color-warning: #c9a227;
  --color-error: #dc2626;

  /* Colors - Border */
  --border-default: rgba(201, 162, 39, 0.2);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(201, 162, 39, 0.4);
  --border-focus: rgba(201, 162, 39, 0.6);

  /* Typography */
  --font-display: "Ma Shan Zheng", "Noto Serif SC", serif;
  --font-heading: "ZCOOL XiaoWei", "Noto Serif SC", serif;
  --font-body: "Noto Serif SC", "Source Han Serif SC", serif;
  --font-mono: "Fira Code", "JetBrains Mono", monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-glow-gold: 0 0 20px rgba(201, 162, 39, 0.3);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-modal: 0 0 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(201, 162, 39, 0.1);

  /* Z-Index */
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-overlay: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-toast: 1700;
  --z-tooltip: 1800;

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --ease-default: ease;
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  /* Transition presets */
  --transition-fast: all 150ms ease;
  --transition-normal: all 300ms ease;
  --transition-slow: all 500ms ease;
}
`;
}
