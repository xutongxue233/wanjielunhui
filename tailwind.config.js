/** @type {import('tailwindcss').Config} */

// 从Design System导入颜色Token
// 注意：Tailwind配置在Node环境运行，需要直接定义值
// 这些值与 src/design-system/tokens.ts 保持同步

const colors = {
  // 水墨色阶
  ink: {
    black: '#0a0a0f',
    deep: '#12121a',
    dark: '#1a1a28',
    medium: '#252535',
    light: '#3a3a4a',
  },
  // 金色系
  gold: {
    DEFAULT: '#c9a227',
    light: '#e8d48b',
    dark: '#a88620',
  },
  // 翠玉色
  jade: {
    DEFAULT: '#2d8b6f',
    light: '#5ab896',
  },
  // 绯红色
  crimson: {
    DEFAULT: '#8b2942',
    light: '#c44569',
  },
  // 青蓝色
  azure: {
    DEFAULT: '#2563eb',
    light: '#60a5fa',
  },
  // 紫霞色
  purple: {
    DEFAULT: '#6d28d9',
    light: '#a78bfa',
  },
  // 五行色彩
  element: {
    metal: '#a8a8b8',
    wood: '#22863a',
    water: '#1e6bb8',
    fire: '#c24e4e',
    earth: '#b8860b',
  },
  // 境界色彩
  realm: {
    lianqi: '#9CA3AF',
    zhuji: '#60A5FA',
    jindan: '#FBBF24',
    yuanying: '#A78BFA',
    huashen: '#F472B6',
    heti: '#34D399',
    dacheng: '#F97316',
    dujie: '#EF4444',
    xianren: '#FFD700',
  },
  // 文本色彩
  text: {
    primary: '#e8e4d9',
    secondary: '#9ca3af',
    muted: '#6b7280',
  },
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        // 保留旧的xian和wuxing命名以兼容现有代码
        xian: {
          gold: colors.gold.DEFAULT,
          jade: colors.jade.DEFAULT,
          purple: colors.purple.DEFAULT,
          crimson: colors.crimson.DEFAULT,
          azure: colors.azure.DEFAULT,
          ink: colors.ink.dark,
          paper: '#f5f5dc',
        },
        wuxing: {
          metal: colors.element.metal,
          wood: colors.element.wood,
          water: colors.element.water,
          fire: colors.element.fire,
          earth: colors.element.earth,
        },
      },
      fontFamily: {
        display: ["'Ma Shan Zheng'", "'Noto Serif SC'", 'serif'],
        heading: ["'ZCOOL XiaoWei'", "'Noto Serif SC'", 'serif'],
        body: ["'Noto Serif SC'", 'serif'],
        xian: ["'LXGW WenKai'", "'Noto Serif SC'", 'serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        gold: '0 0 20px rgba(201, 162, 39, 0.15)',
        'gold-strong': '0 4px 20px rgba(201, 162, 39, 0.4)',
        jade: '0 0 20px rgba(45, 139, 111, 0.15)',
        'jade-strong': '0 4px 20px rgba(45, 139, 111, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-scale': 'fadeInScale 0.3s ease-out',
        'breathe': 'breathe 4s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
