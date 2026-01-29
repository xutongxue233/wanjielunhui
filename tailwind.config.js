/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 修仙主题色
        'xian': {
          gold: '#D4AF37',
          jade: '#00A86B',
          purple: '#8B5CF6',
          crimson: '#DC143C',
          azure: '#007FFF',
          ink: '#1a1a2e',
          paper: '#f5f5dc',
        },
        // 五行颜色
        'wuxing': {
          metal: '#C0C0C0',
          wood: '#228B22',
          water: '#1E90FF',
          fire: '#FF4500',
          earth: '#DAA520',
        },
        // 境界颜色
        'realm': {
          lianqi: '#9CA3AF',
          zhuji: '#60A5FA',
          jindan: '#FBBF24',
          yuanying: '#A78BFA',
          huashen: '#F472B6',
          heti: '#34D399',
          dacheng: '#F97316',
          dujie: '#EF4444',
          xianren: '#FFD700',
        }
      },
      fontFamily: {
        'xian': ['LXGW WenKai', 'Noto Serif SC', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        }
      }
    },
  },
  plugins: [],
}
