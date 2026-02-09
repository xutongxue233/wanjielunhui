import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { ORIGINS } from '../../data/origins';
import { getItemById } from '../../data/items';
import type { OriginType } from '../../types';
import './CharacterCreation.css';

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
    color: 'var(--jade-light)',
    bgColor: 'rgba(90, 184, 150, 0.15)'
  },
  fallen_clan: {
    icon: '族',
    color: 'var(--purple-light)',
    bgColor: 'rgba(167, 139, 250, 0.15)'
  },
  reincarnation: {
    icon: '轮',
    color: 'var(--realm-huashen)',
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
  const addItem = usePlayerStore((state) => state.addItem);
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

      // 发放初始物品
      const originConfig = ORIGINS[selectedOrigin];
      if (originConfig.startingBonus.items) {
        for (const startItem of originConfig.startingBonus.items) {
          const itemDef = getItemById(startItem.itemId);
          if (itemDef) {
            addItem({
              item: {
                id: itemDef.id,
                name: itemDef.name,
                description: itemDef.description,
                type: itemDef.type,
                quality: itemDef.quality,
                stackable: itemDef.stackable,
                maxStack: itemDef.maxStack,
                effects: itemDef.effects,
              },
              quantity: startItem.quantity,
            });
          }
        }
      }

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
    <div className="char-creation">
      {/* 背景层 */}
      <div className="char-creation-bg">
        {/* 主光晕 */}
        <div className="char-creation-glow" />

        {/* 装饰圆环 */}
        <motion.div
          className="char-creation-ring outer"
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="char-creation-ring inner"
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
        className="char-creation-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 标题 */}
        <motion.div
          className="char-creation-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>开创修仙之路</h1>
          <p>踏入仙途 逆天改命</p>
        </motion.div>

        {/* 步骤指示器 */}
        <motion.div
          className="char-creation-steps"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {STEPS.map((s, i) => {
            const isActive = step === s.key;
            const isPast = i < currentStepIndex;
            const stateClass = isActive ? 'active' : isPast ? 'past' : 'future';

            return (
              <React.Fragment key={s.key}>
                <div className="char-step">
                  {/* 圆圈 */}
                  <motion.div
                    className={`char-step-circle ${stateClass}`}
                    animate={isActive ? {
                      boxShadow: [
                        '0 0 30px rgba(201, 162, 39, 0.5), 0 0 60px rgba(201, 162, 39, 0.2)',
                        '0 0 40px rgba(201, 162, 39, 0.7), 0 0 80px rgba(201, 162, 39, 0.3)',
                        '0 0 30px rgba(201, 162, 39, 0.5), 0 0 60px rgba(201, 162, 39, 0.2)',
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className={`char-step-icon ${stateClass}`}>
                      {s.icon}
                    </span>
                  </motion.div>

                  {/* 标签 */}
                  <span className={`char-step-label ${stateClass}`}>
                    {s.label}
                  </span>
                </div>

                {/* 连接线 */}
                {i < STEPS.length - 1 && (
                  <div className="char-step-line">
                    <div className="char-step-line-bg" />
                    <motion.div
                      className="char-step-line-fill"
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
              <div className="char-card">
                {/* 卡片头部装饰 */}
                <div className="char-card-header-line" />

                <div className="char-card-body">
                  {/* 卡片标题 */}
                  <div className="char-card-title">
                    <div className="char-card-icon">
                      <span>册</span>
                    </div>
                    <div>
                      <h3>角色信息</h3>
                      <p>请输入你的修仙身份</p>
                    </div>
                  </div>

                  {/* 道号输入 */}
                  <div className="mb-10">
                    <label className="char-label">道号</label>
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="请赐道号..."
                        maxLength={12}
                        className={`char-input ${isInputFocused ? 'focused' : ''}`}
                      />
                      <div className={`char-input-counter ${name.length > 0 ? 'has-value' : ''}`}>
                        {name.length}/12
                      </div>
                    </div>
                  </div>

                  {/* 性别选择 */}
                  <div className="mb-4">
                    <label className="char-label">性别</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'male' as const, label: '男', icon: '乾', desc: '天行健' },
                        { value: 'female' as const, label: '女', icon: '坤', desc: '地势坤' },
                      ].map((option) => {
                        const isSelected = gender === option.value;
                        return (
                          <motion.button
                            key={option.value}
                            className={`char-select-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setGender(option.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`char-select-icon ${isSelected ? 'selected' : ''}`}>
                                <span>{option.icon}</span>
                              </div>
                              <div>
                                <div className={`char-select-label ${isSelected ? 'selected' : ''}`}>
                                  {option.label}
                                </div>
                                <div className="char-select-desc">
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
                  className={`char-submit-btn ${name.trim() ? 'enabled' : 'disabled'}`}
                  onClick={handleNext}
                  disabled={!name.trim()}
                  whileHover={name.trim() ? { transform: 'translateY(-2px)' } : {}}
                  whileTap={name.trim() ? { scale: 0.97 } : {}}
                >
                  下一步
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
              <div className="char-card">
                <div className="char-card-header-line" />

                <div className="char-card-body">
                  <div className="char-card-title">
                    <div className="char-card-icon">
                      <span>源</span>
                    </div>
                    <div>
                      <h3>选择出身</h3>
                      <p>出身将影响你的初始属性与命运走向</p>
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
                          className={`char-origin-card ${isSelected ? 'selected' : ''}`}
                          style={{
                            background: isSelected ? config.bgColor : undefined,
                            borderColor: isSelected ? config.color : undefined,
                            boxShadow: isSelected ? `0 10px 40px ${config.color}30` : undefined,
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
                              className="char-origin-icon"
                              style={{
                                background: isSelected
                                  ? `linear-gradient(135deg, ${config.color} 0%, ${config.color}aa 100%)`
                                  : config.bgColor,
                                borderColor: config.color,
                                boxShadow: isSelected ? `0 0 25px ${config.color}50` : undefined,
                              }}
                            >
                              <span style={{ color: isSelected ? 'var(--ink-black)' : config.color }}>
                                {config.icon}
                              </span>
                            </motion.div>

                            {/* 内容 */}
                            <div className="flex-1 min-w-0">
                              <h4
                                className="char-origin-name"
                                style={{ color: isSelected ? config.color : undefined }}
                              >
                                {origin.name}
                              </h4>
                              <p className="char-origin-desc">
                                {origin.description}
                              </p>
                            </div>

                            {/* 选中标记 */}
                            <div
                              className="flex items-center justify-center flex-shrink-0 mt-1"
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: isSelected ? config.color : 'transparent',
                                border: `2px solid ${isSelected ? config.color : 'rgba(201, 162, 39, 0.2)'}`,
                              }}
                            >
                              {isSelected && (
                                <motion.svg
                                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  <path d="M3 7L6 10L11 4" stroke="var(--ink-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <button className="char-back-btn" onClick={handleBack}>
                  上一步
                </button>
                <motion.button
                  className={`char-submit-btn ${selectedOrigin ? 'enabled' : 'disabled'}`}
                  onClick={handleNext}
                  disabled={!selectedOrigin}
                  whileHover={selectedOrigin ? { transform: 'translateY(-2px)' } : {}}
                  whileTap={selectedOrigin ? { scale: 0.97 } : {}}
                >
                  下一步
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
              <div className="char-card">
                <div className="char-card-header-line" />

                <div className="char-card-body">
                  <div className="char-card-title">
                    <motion.div
                      className="char-card-icon"
                      animate={{
                        boxShadow: [
                          '0 0 15px rgba(201, 162, 39, 0.3)',
                          '0 0 30px rgba(201, 162, 39, 0.5)',
                          '0 0 15px rgba(201, 162, 39, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span>印</span>
                    </motion.div>
                    <div>
                      <h3>确认信息</h3>
                      <p>确认后将踏入修仙之路</p>
                    </div>
                  </div>

                  {/* 角色信息卡片 */}
                  <div className="char-confirm-section">
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
                        <span className="char-confirm-label">{item.label}</span>
                        <span
                          className="char-confirm-value"
                          style={{ color: item.color || undefined }}
                        >
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* 出身描述 */}
                  <motion.div
                    className="char-confirm-section mt-8"
                    style={{
                      background: ORIGIN_CONFIG[selectedOrigin].bgColor,
                      border: `1px solid ${ORIGIN_CONFIG[selectedOrigin].color}40`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="char-origin-desc" style={{ lineHeight: 1.8 }}>
                      {ORIGINS[selectedOrigin].description}
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="flex justify-between">
                <button className="char-back-btn" onClick={handleBack}>
                  上一步
                </button>

                <motion.button
                  className="char-submit-btn enabled"
                  onClick={handleCreate}
                  whileHover={{ transform: 'translateY(-2px)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  踏入仙途
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
