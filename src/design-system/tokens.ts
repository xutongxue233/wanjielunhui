/**
 * Design Tokens - 设计系统唯一真实来源
 * 禁止在页面中硬编码样式，所有样式值必须引用此文件
 */

// ============================================
// Colors - 颜色系统
// ============================================

export const colors = {
  // 主色调 - 仙侠主题
  primary: {
    DEFAULT: "#c9a227",
    light: "#e8d48b",
    dark: "#a88620",
    muted: "rgba(201, 162, 39, 0.6)",
  },

  // 辅助色
  secondary: {
    jade: "#2d8b6f",
    jadeLight: "#5ab896",
    jadeDark: "#1f6b52",
    crimson: "#8b2942",
    crimsonLight: "#c44569",
    azure: "#2563eb",
    azureLight: "#60a5fa",
    purple: "#6d28d9",
    purpleLight: "#a78bfa",
  },

  // 背景色 - 墨色系
  background: {
    base: "#0a0a0f",
    elevated: "#12121a",
    surface: "#1a1a28",
    overlay: "#252535",
    subtle: "#3a3a4a",
  },

  // 文字颜色
  text: {
    primary: "#e8e4d9",
    secondary: "#9ca3af",
    muted: "#6b7280",
    disabled: "#4b5563",
    inverse: "#0a0a0f",
  },

  // 语义色
  success: {
    DEFAULT: "#2d8b6f",
    light: "#5ab896",
    bg: "rgba(45, 139, 111, 0.15)",
  },
  warning: {
    DEFAULT: "#c9a227",
    light: "#e8d48b",
    bg: "rgba(201, 162, 39, 0.15)",
  },
  error: {
    DEFAULT: "#dc2626",
    light: "#f87171",
    bg: "rgba(220, 38, 38, 0.15)",
  },
  disabled: {
    DEFAULT: "#4b5563",
    bg: "rgba(75, 85, 99, 0.3)",
  },

  // 边框颜色
  border: {
    DEFAULT: "rgba(201, 162, 39, 0.2)",
    subtle: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(201, 162, 39, 0.4)",
    focus: "rgba(201, 162, 39, 0.6)",
  },

  // 五行元素色
  element: {
    metal: "#c0c0c0",
    wood: "#4ade80",
    water: "#60a5fa",
    fire: "#f87171",
    earth: "#fbbf24",
  },

  // 境界色
  realm: {
    mortal: "#9ca3af",
    qi: "#86efac",
    foundation: "#60a5fa",
    core: "#c084fc",
    nascent: "#f472b6",
    divine: "#fbbf24",
    void: "#f87171",
    fusion: "#2dd4bf",
    mahayana: "#818cf8",
    tribulation: "#e879f9",
  },
} as const;

// ============================================
// Typography - 排版系统
// ============================================

export const typography = {
  fontFamily: {
    display: "\"Ma Shan Zheng\", \"Noto Serif SC\", serif",
    heading: "\"ZCOOL XiaoWei\", \"Noto Serif SC\", serif",
    body: "\"Noto Serif SC\", \"Source Han Serif SC\", serif",
    mono: "\"Fira Code\", \"JetBrains Mono\", monospace",
  },

  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
  },

  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
    xian: "0.15em",
    ancient: "0.4em",
  },
} as const;

// ============================================
// Spacing - 间距系统
// ============================================

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

// ============================================
// Radius - 圆角系统
// ============================================

export const radius = {
  none: "0",
  sm: "0.25rem",
  DEFAULT: "0.5rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

// ============================================
// Shadow - 阴影系统
// ============================================

export const shadow = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
  glow: {
    gold: "0 0 20px rgba(201, 162, 39, 0.3)",
    goldStrong: "0 0 40px rgba(201, 162, 39, 0.5)",
    jade: "0 0 20px rgba(45, 139, 111, 0.3)",
    crimson: "0 0 20px rgba(139, 41, 66, 0.3)",
    azure: "0 0 20px rgba(37, 99, 235, 0.3)",
    purple: "0 0 20px rgba(109, 40, 217, 0.3)",
  },
  card: "0 4px 20px rgba(0, 0, 0, 0.3)",
  cardHover: "0 8px 30px rgba(0, 0, 0, 0.4)",
  modal: "0 0 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(201, 162, 39, 0.1)",
} as const;

// ============================================
// Z-Index - 层级系统
// ============================================

export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ============================================
// Motion - 动效系统
// ============================================

export const motion = {
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
    slowest: "1000ms",
  },
  easing: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  transition: {
    none: "none",
    all: "all 300ms ease",
    fast: "all 150ms ease",
    slow: "all 500ms ease",
    colors: "color, background-color, border-color 300ms ease",
    opacity: "opacity 300ms ease",
    transform: "transform 300ms ease",
    shadow: "box-shadow 300ms ease",
  },
  framer: {
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } },
    slideUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, transition: { duration: 0.3 } },
    scaleIn: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2 } },
    spring: { type: "spring", damping: 25, stiffness: 300 },
  },
} as const;

// ============================================
// Breakpoints - 断点系统
// ============================================

export const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ============================================
// 导出所有 Tokens
// ============================================

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  zIndex,
  motion,
  breakpoints,
} as const;

export default tokens;
