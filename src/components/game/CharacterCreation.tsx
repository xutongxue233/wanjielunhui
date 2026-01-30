import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { ORIGINS } from '../../data/origins';
import type { OriginType } from '../../types';

// 步骤配置
const STEPS = [
  { key: 'name', label: '命名', icon: '壹' },
  { key: 'origin', label: '出身', icon: '贰' },
  { key: 'confirm', label: '入道', icon: '叁' },
] as const;

// 出身图标和颜色
const ORIGIN_CONFIG: Record<OriginType, { icon: string; color: string; bgColor: string }> = {
  village_orphan: {
    icon: '山',
    color: '#5ab896',
    bgColor: 'rgba(90, 184, 150, 0.15)'
  },
  fallen_clan: {
    icon: '族',
    color: '#a78bfa',
    bgColor: 'rgba(167, 139, 250, 0.15)'
  },
  reincarnation: {
    icon: '轮',
    color: '#f472b6',
    bgColor: 'rgba(244, 114, 182, 0.15)'
  },
};

export const CharacterCreation: React.FC = () => {
  const [step, setStep] = useState<'name' | 'origin' | 'confirm'>('name');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedOrigin, setSelectedOrigin] = useState<OriginType | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const createCharacter = usePlayerStore((state) => state.createCharacter);
  const setPhase = useGameStore((state) => state.setPhase);
  const resetStoryProgress = useGameStore((state) => state.resetStoryProgress);

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const handleNext = () => {
    if (step === 'name' && name.trim()) {
      setStep('origin');
    } else if (step === 'origin' && selectedOrigin) {
      setStep('confirm');
    }
  };

  const handleBack = () => {
    if (step === 'origin') setStep('name');
    else if (step === 'confirm') setStep('origin');
  };

  const handleCreate = () => {
    if (name.trim() && selectedOrigin) {
      // 重置剧情进度，确保新游戏从头开始
      resetStoryProgress();
      createCharacter(name.trim(), gender, selectedOrigin);
      setPhase('playing');
    }
  };

  // 粒子系统
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'var(--ink-black)' }}
    >
      {/* 背景层 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 主光晕 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '140%',
            height: '140%',
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(45, 139, 111, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(201, 162, 39, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(109, 40, 217, 0.06) 0%, transparent 60%)
            `,
          }}
        />

        {/* 装饰圆环 */}
        <motion.div
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: '700px',
            height: '700px',
            marginLeft: '-350px',
            marginTop: '-350px',
            border: '1px solid rgba(201, 162, 39, 0.08)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: '500px',
            height: '500px',
            marginLeft: '-250px',
            marginTop: '-250px',
            border: '1px dashed rgba(45, 139, 111, 0.1)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
        />

        {/* 粒子 */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.id % 3 === 0
                ? 'var(--gold-immortal)'
                : p.id % 3 === 1
                ? 'var(--jade-essence)'
                : 'var(--purple-light)',
              boxShadow: `0 0 ${p.size * 2}px currentColor`,
            }}
            animate={{
              y: [0, -150],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* 主内容 */}
      <motion.div
        className="w-full relative z-10"
        style={{ maxWidth: '540px', margin: '0 auto' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-wider"
            style={{
              fontFamily: "'Ma Shan Zheng', serif",
              background: 'linear-gradient(135deg, #e8d48b 0%, #c9a227 50%, #e8d48b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(201, 162, 39, 0.3)',
            }}
          >
            开创修仙之路
          </h1>
          <p
            className="text-base tracking-[0.5em]"
            style={{
              color: 'var(--text-muted)',
              fontFamily: "'ZCOOL XiaoWei', serif",
            }}
          >
            踏入仙途 逆天改命
          </p>
        </motion.div>

        {/* 步骤指示器 */}
        <motion.div
          className="flex justify-center items-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {STEPS.map((s, i) => {
            const isActive = step === s.key;
            const isPast = i < currentStepIndex;

            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center">
                  {/* 圆圈 */}
                  <motion.div
                    className="relative flex items-center justify-center"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: isActive
                        ? 'linear-gradient(135deg, #c9a227 0%, #a88620 100%)'
                        : isPast
                        ? 'linear-gradient(135deg, rgba(45, 139, 111, 0.4) 0%, rgba(45, 139, 111, 0.2) 100%)'
                        : 'rgba(37, 37, 53, 0.8)',
                      border: isActive
                        ? '2px solid #e8d48b'
                        : isPast
                        ? '2px solid var(--jade-essence)'
                        : '2px solid rgba(201, 162, 39, 0.2)',
                      boxShadow: isActive
                        ? '0 0 30px rgba(201, 162, 39, 0.5), 0 0 60px rgba(201, 162, 39, 0.2)'
                        : isPast
                        ? '0 0 20px rgba(45, 139, 111, 0.3)'
                        : 'none',
                    }}
                    animate={isActive ? {
                      boxShadow: [
                        '0 0 30px rgba(201, 162, 39, 0.5), 0 0 60px rgba(201, 162, 39, 0.2)',
                        '0 0 40px rgba(201, 162, 39, 0.7), 0 0 80px rgba(201, 162, 39, 0.3)',
                        '0 0 30px rgba(201, 162, 39, 0.5), 0 0 60px rgba(201, 162, 39, 0.2)',
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span
                      style={{
                        fontFamily: "'Ma Shan Zheng', serif",
                        fontSize: '1.5rem',
                        color: isActive ? '#0a0a0f' : isPast ? '#5ab896' : 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {s.icon}
                    </span>
                  </motion.div>

                  {/* 标签 */}
                  <span
                    className="mt-3 text-sm tracking-widest"
                    style={{
                      fontFamily: "'ZCOOL XiaoWei', serif",
                      color: isActive ? '#c9a227' : isPast ? '#2d8b6f' : 'var(--text-muted)',
                    }}
                  >
                    {s.label}
                  </span>
                </div>

                {/* 连接线 */}
                {i < STEPS.length - 1 && (
                  <div
                    className="relative mx-4"
                    style={{ width: 60, height: 2, marginBottom: 28 }}
                  >
                    <div
                      className="absolute inset-0 rounded"
                      style={{ background: 'rgba(201, 162, 39, 0.15)' }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded"
                      style={{
                        background: 'linear-gradient(90deg, #2d8b6f, #c9a227)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: i < currentStepIndex ? '100%' : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* 内容区域 */}
        <AnimatePresence mode="wait">
          {step === 'name' && (
            <motion.div
              key="name-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 卡片 */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(26, 26, 40, 0.95) 0%, rgba(18, 18, 26, 0.98) 100%)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(201, 162, 39, 0.1)',
                  marginBottom: 24,
                }}
              >
                {/* 卡片头部装饰 */}
                <div
                  style={{
                    height: 3,
                    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
                  }}
                />

                <div style={{ padding: '28px 32px 32px' }}>
                  {/* 卡片标题 */}
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.05) 100%)',
                        border: '1px solid rgba(201, 162, 39, 0.3)',
                      }}
                    >
                      <span style={{
                        fontFamily: "'Ma Shan Zheng', serif",
                        fontSize: '1.5rem',
                        color: '#c9a227',
                      }}>
                        册
                      </span>
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: "'Ma Shan Zheng', serif",
                        fontSize: '1.5rem',
                        color: '#c9a227',
                        letterSpacing: '0.1em',
                      }}>
                        角色信息
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        请输入你的修仙身份
                      </p>
                    </div>
                  </div>

                  {/* 道号输入 */}
                  <div className="mb-10">
                    <label
                      className="block mb-3"
                      style={{
                        color: 'var(--text-secondary)',
                        fontFamily: "'ZCOOL XiaoWei', serif",
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      道号
                    </label>
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="请赐道号..."
                        maxLength={12}
                        className="w-full outline-none transition-all duration-300"
                        style={{
                          padding: '16px 20px',
                          fontSize: '1.1rem',
                          fontFamily: "'Noto Serif SC', serif",
                          color: 'var(--text-primary)',
                          background: 'rgba(10, 10, 15, 0.8)',
                          border: isInputFocused
                            ? '2px solid #c9a227'
                            : '2px solid rgba(201, 162, 39, 0.2)',
                          borderRadius: 12,
                          boxShadow: isInputFocused
                            ? '0 0 30px rgba(201, 162, 39, 0.2), inset 0 0 20px rgba(201, 162, 39, 0.05)'
                            : 'none',
                          letterSpacing: '0.15em',
                        }}
                      />
                      <div
                        className="flex justify-end mt-2"
                        style={{
                          fontSize: '0.8rem',
                          color: name.length > 0 ? 'rgba(201, 162, 39, 0.7)' : 'var(--text-muted)',
                          fontFamily: "'ZCOOL XiaoWei', serif",
                        }}
                      >
                        {name.length}/12
                      </div>
                    </div>
                  </div>

                  {/* 性别选择 */}
                  <div className="mb-4">
                    <label
                      className="block mb-3"
                      style={{
                        color: 'var(--text-secondary)',
                        fontFamily: "'ZCOOL XiaoWei', serif",
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      性别
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'male' as const, label: '男', icon: '乾', desc: '天行健' },
                        { value: 'female' as const, label: '女', icon: '坤', desc: '地势坤' },
                      ].map((option) => {
                        const isSelected = gender === option.value;
                        return (
                          <motion.button
                            key={option.value}
                            className="relative overflow-hidden text-left"
                            style={{
                              padding: '20px',
                              borderRadius: 16,
                              background: isSelected
                                ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.05) 100%)'
                                : 'rgba(10, 10, 15, 0.6)',
                              border: isSelected
                                ? '2px solid #c9a227'
                                : '2px solid rgba(201, 162, 39, 0.15)',
                              boxShadow: isSelected
                                ? '0 10px 40px rgba(201, 162, 39, 0.2), inset 0 0 30px rgba(201, 162, 39, 0.05)'
                                : 'none',
                            }}
                            onClick={() => setGender(option.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="flex items-center justify-center"
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: '50%',
                                  background: isSelected
                                    ? 'linear-gradient(135deg, #c9a227 0%, #a88620 100%)'
                                    : 'rgba(201, 162, 39, 0.1)',
                                  border: isSelected
                                    ? '2px solid #e8d48b'
                                    : '2px solid rgba(201, 162, 39, 0.2)',
                                }}
                              >
                                <span style={{
                                  fontFamily: "'Ma Shan Zheng', serif",
                                  fontSize: '1.5rem',
                                  color: isSelected ? '#0a0a0f' : 'var(--text-muted)',
                                }}>
                                  {option.icon}
                                </span>
                              </div>
                              <div>
                                <div style={{
                                  fontFamily: "'Ma Shan Zheng', serif",
                                  fontSize: '1.3rem',
                                  color: isSelected ? '#c9a227' : 'var(--text-primary)',
                                  marginBottom: 2,
                                }}>
                                  {option.label}
                                </div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--text-muted)',
                                  fontFamily: "'ZCOOL XiaoWei', serif",
                                }}>
                                  {option.desc}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 按钮区域 */}
              <div className="flex justify-end">
                <motion.button
                  className="relative flex items-center gap-3 overflow-hidden"
                  style={{
                    padding: '14px 32px',
                    borderRadius: 14,
                    background: name.trim()
                      ? 'linear-gradient(135deg, #c9a227 0%, #a88620 100%)'
                      : 'rgba(201, 162, 39, 0.15)',
                    color: name.trim() ? '#0a0a0f' : 'var(--text-muted)',
                    fontSize: '1.05rem',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 500,
                    border: name.trim() ? '2px solid #e8d48b' : '2px solid rgba(201, 162, 39, 0.2)',
                    cursor: name.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: name.trim()
                      ? '0 10px 35px rgba(201, 162, 39, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : 'none',
                    letterSpacing: '0.1em',
                  }}
                  onClick={handleNext}
                  disabled={!name.trim()}
                  whileHover={name.trim() ? {
                    scale: 1.03,
                    boxShadow: '0 15px 45px rgba(201, 162, 39, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  } : {}}
                  whileTap={name.trim() ? { scale: 0.97 } : {}}
                >
                  {name.trim() && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                      }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                    />
                  )}
                  <span className="relative">下一步</span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="relative">
                    <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'origin' && (
            <motion.div
              key="origin-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(26, 26, 40, 0.95) 0%, rgba(18, 18, 26, 0.98) 100%)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(201, 162, 39, 0.1)',
                  marginBottom: 24,
                }}
              >
                <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }} />

                <div style={{ padding: '28px 32px 32px' }}>
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.05) 100%)',
                        border: '1px solid rgba(201, 162, 39, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: '1.5rem', color: '#c9a227' }}>
                        源
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: '1.5rem', color: '#c9a227' }}>
                        选择出身
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        出身将影响你的初始属性与命运走向
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {(Object.keys(ORIGINS) as OriginType[]).map((originType, index) => {
                      const origin = ORIGINS[originType];
                      const config = ORIGIN_CONFIG[originType];
                      const isSelected = selectedOrigin === originType;

                      return (
                        <motion.div
                          key={originType}
                          className="relative cursor-pointer overflow-hidden"
                          style={{
                            padding: '20px',
                            borderRadius: 16,
                            background: isSelected ? config.bgColor : 'rgba(10, 10, 15, 0.6)',
                            border: isSelected
                              ? `2px solid ${config.color}`
                              : '2px solid rgba(201, 162, 39, 0.1)',
                            boxShadow: isSelected
                              ? `0 10px 40px ${config.color}30`
                              : 'none',
                          }}
                          onClick={() => setSelectedOrigin(originType)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01, x: 5 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-start gap-5">
                            {/* 图标 */}
                            <motion.div
                              style={{
                                width: 64,
                                height: 64,
                                borderRadius: 16,
                                background: isSelected
                                  ? `linear-gradient(135deg, ${config.color} 0%, ${config.color}aa 100%)`
                                  : config.bgColor,
                                border: `2px solid ${config.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: isSelected ? `0 0 25px ${config.color}50` : 'none',
                              }}
                            >
                              <span style={{
                                fontFamily: "'Ma Shan Zheng', serif",
                                fontSize: '2rem',
                                color: isSelected ? '#0a0a0f' : config.color,
                              }}>
                                {config.icon}
                              </span>
                            </motion.div>

                            {/* 内容 */}
                            <div className="flex-1 min-w-0">
                              <h4 style={{
                                fontFamily: "'Ma Shan Zheng', serif",
                                fontSize: '1.4rem',
                                color: isSelected ? config.color : 'var(--text-primary)',
                                marginBottom: 8,
                              }}>
                                {origin.name}
                              </h4>
                              <p style={{
                                fontSize: '0.875rem',
                                lineHeight: 1.7,
                                color: 'var(--text-secondary)',
                              }}>
                                {origin.description}
                              </p>
                            </div>

                            {/* 选中标记 */}
                            <div
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: isSelected ? config.color : 'transparent',
                                border: `2px solid ${isSelected ? config.color : 'rgba(201, 162, 39, 0.2)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: 4,
                              }}
                            >
                              {isSelected && (
                                <motion.svg
                                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  <path d="M3 7L6 10L11 4" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </motion.svg>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <motion.button
                  className="flex items-center gap-2"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: 'rgba(26, 26, 40, 0.8)',
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    fontFamily: "'Noto Serif SC', serif",
                    border: '1px solid rgba(201, 162, 39, 0.25)',
                    letterSpacing: '0.05em',
                  }}
                  onClick={handleBack}
                  whileHover={{ scale: 1.02, background: 'rgba(201, 162, 39, 0.12)', borderColor: 'rgba(201, 162, 39, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  上一步
                </motion.button>
                <motion.button
                  className="relative flex items-center gap-3 overflow-hidden"
                  style={{
                    padding: '14px 32px',
                    borderRadius: 14,
                    background: selectedOrigin
                      ? 'linear-gradient(135deg, #c9a227 0%, #a88620 100%)'
                      : 'rgba(201, 162, 39, 0.15)',
                    color: selectedOrigin ? '#0a0a0f' : 'var(--text-muted)',
                    fontSize: '1.05rem',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 500,
                    border: selectedOrigin ? '2px solid #e8d48b' : '2px solid rgba(201, 162, 39, 0.2)',
                    cursor: selectedOrigin ? 'pointer' : 'not-allowed',
                    boxShadow: selectedOrigin
                      ? '0 10px 35px rgba(201, 162, 39, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : 'none',
                    letterSpacing: '0.1em',
                  }}
                  onClick={handleNext}
                  disabled={!selectedOrigin}
                  whileHover={selectedOrigin ? {
                    scale: 1.03,
                    boxShadow: '0 15px 45px rgba(201, 162, 39, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  } : {}}
                  whileTap={selectedOrigin ? { scale: 0.97 } : {}}
                >
                  {selectedOrigin && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                      }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                    />
                  )}
                  <span className="relative">下一步</span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="relative">
                    <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && selectedOrigin && (
            <motion.div
              key="confirm-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(26, 26, 40, 0.95) 0%, rgba(18, 18, 26, 0.98) 100%)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(201, 162, 39, 0.1)',
                  marginBottom: 24,
                }}
              >
                <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }} />

                <div style={{ padding: '28px 32px 32px' }}>
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.05) 100%)',
                        border: '1px solid rgba(201, 162, 39, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      animate={{
                        boxShadow: [
                          '0 0 15px rgba(201, 162, 39, 0.3)',
                          '0 0 30px rgba(201, 162, 39, 0.5)',
                          '0 0 15px rgba(201, 162, 39, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: '1.5rem', color: '#c9a227' }}>
                        印
                      </span>
                    </motion.div>
                    <div>
                      <h3 style={{ fontFamily: "'Ma Shan Zheng', serif", fontSize: '1.5rem', color: '#c9a227' }}>
                        确认信息
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        确认后将踏入修仙之路
                      </p>
                    </div>
                  </div>

                  {/* 角色信息卡片 */}
                  <div
                    style={{
                      padding: '24px',
                      borderRadius: 16,
                      background: 'rgba(10, 10, 15, 0.6)',
                      border: '1px solid rgba(201, 162, 39, 0.15)',
                    }}
                  >
                    {[
                      { label: '道号', value: name },
                      { label: '性别', value: gender === 'male' ? '男' : '女' },
                      { label: '出身', value: ORIGINS[selectedOrigin].name, color: ORIGIN_CONFIG[selectedOrigin].color },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="flex justify-between items-center"
                        style={{
                          padding: '16px 0',
                          borderBottom: i < 2 ? '1px solid rgba(201, 162, 39, 0.1)' : 'none',
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <span style={{
                          color: 'var(--text-muted)',
                          fontFamily: "'ZCOOL XiaoWei', serif",
                        }}>
                          {item.label}
                        </span>
                        <span style={{
                          fontFamily: "'Ma Shan Zheng', serif",
                          fontSize: '1.25rem',
                          color: item.color || '#c9a227',
                        }}>
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* 出身描述 */}
                  <motion.div
                    className="mt-8"
                    style={{
                      padding: '20px',
                      borderRadius: 12,
                      background: ORIGIN_CONFIG[selectedOrigin].bgColor,
                      border: `1px solid ${ORIGIN_CONFIG[selectedOrigin].color}40`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.8,
                      color: 'var(--text-secondary)',
                    }}>
                      {ORIGINS[selectedOrigin].description}
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="flex justify-between">
                <motion.button
                  className="flex items-center gap-2"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: 'rgba(26, 26, 40, 0.8)',
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    fontFamily: "'Noto Serif SC', serif",
                    border: '1px solid rgba(201, 162, 39, 0.25)',
                    letterSpacing: '0.05em',
                  }}
                  onClick={handleBack}
                  whileHover={{ scale: 1.02, background: 'rgba(201, 162, 39, 0.12)', borderColor: 'rgba(201, 162, 39, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  上一步
                </motion.button>

                <motion.button
                  className="relative flex items-center gap-3 overflow-hidden"
                  style={{
                    padding: '14px 36px',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #c9a227 0%, #a88620 100%)',
                    color: '#0a0a0f',
                    fontSize: '1.1rem',
                    fontFamily: "'Noto Serif SC', serif",
                    fontWeight: 600,
                    border: '2px solid #e8d48b',
                    boxShadow: '0 10px 40px rgba(201, 162, 39, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    letterSpacing: '0.15em',
                  }}
                  onClick={handleCreate}
                  whileHover={{ scale: 1.03, boxShadow: '0 15px 50px rgba(201, 162, 39, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <span className="relative">踏入仙途</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="relative">
                    <path d="M10 3V17M10 3L16 9M10 3L4 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
