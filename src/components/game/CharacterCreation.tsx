import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { ORIGINS } from '../../data/origins';
import type { OriginType } from '../../types';

export const CharacterCreation: React.FC = () => {
  const [step, setStep] = useState<'name' | 'origin' | 'confirm'>('name');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedOrigin, setSelectedOrigin] = useState<OriginType | null>(null);

  const createCharacter = usePlayerStore((state) => state.createCharacter);
  const setPhase = useGameStore((state) => state.setPhase);

  const handleNext = () => {
    if (step === 'name' && name.trim()) {
      setStep('origin');
    } else if (step === 'origin' && selectedOrigin) {
      setStep('confirm');
    }
  };

  const handleBack = () => {
    if (step === 'origin') {
      setStep('name');
    } else if (step === 'confirm') {
      setStep('origin');
    }
  };

  const handleCreate = () => {
    if (name.trim() && selectedOrigin) {
      createCharacter(name.trim(), gender, selectedOrigin);
      setPhase('playing');
    }
  };

  const stepIndicator = (
    <div className="flex justify-center gap-3 mb-8">
      {['name', 'origin', 'confirm'].map((s, i) => (
        <div
          key={s}
          className="flex items-center gap-2"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step === s
                ? 'border-glow-gold'
                : i < ['name', 'origin', 'confirm'].indexOf(step)
                ? 'bg-jade-essence/30 border border-jade-essence/50'
                : ''
            }`}
            style={{
              background: step === s ? 'var(--gold-immortal)' : 'var(--ink-medium)',
              color: step === s ? 'var(--ink-black)' : 'var(--text-muted)',
              border: step !== s ? '1px solid var(--border-subtle)' : undefined,
            }}
          >
            {i + 1}
          </div>
          {i < 2 && (
            <div
              className="w-12 h-px"
              style={{
                background: i < ['name', 'origin', 'confirm'].indexOf(step)
                  ? 'var(--jade-essence)'
                  : 'var(--border-subtle)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(45, 139, 111, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animationDelay: '2s',
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className="text-4xl font-bold text-center text-gradient-gold mb-2"
          style={{ fontFamily: "'Ma Shan Zheng', 'Noto Serif SC', serif" }}
        >
          开创修仙之路
        </h1>
        <p
          className="text-center mb-8"
          style={{ color: 'var(--text-secondary)', fontFamily: "'ZCOOL XiaoWei', serif" }}
        >
          踏入仙途，逆天改命
        </p>

        {stepIndicator}

        <AnimatePresence mode="wait">
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card title="角色信息" className="mb-6">
                <div className="space-y-6">
                  <div>
                    <label
                      className="block mb-2 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      道号
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="请输入你的道号..."
                      maxLength={12}
                      className="input-xian"
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      性别
                    </label>
                    <div className="flex gap-4">
                      <button
                        className={`flex-1 py-3 rounded transition-all ${
                          gender === 'male' ? 'border-glow-gold' : ''
                        }`}
                        style={{
                          background: gender === 'male'
                            ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%)'
                            : 'var(--ink-medium)',
                          border: gender === 'male'
                            ? '1px solid var(--gold-immortal)'
                            : '1px solid var(--border-subtle)',
                          color: gender === 'male' ? 'var(--gold-light)' : 'var(--text-muted)',
                        }}
                        onClick={() => setGender('male')}
                      >
                        男
                      </button>
                      <button
                        className={`flex-1 py-3 rounded transition-all ${
                          gender === 'female' ? 'border-glow-gold' : ''
                        }`}
                        style={{
                          background: gender === 'female'
                            ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%)'
                            : 'var(--ink-medium)',
                          border: gender === 'female'
                            ? '1px solid var(--gold-immortal)'
                            : '1px solid var(--border-subtle)',
                          color: gender === 'female' ? 'var(--gold-light)' : 'var(--text-muted)',
                        }}
                        onClick={() => setGender('female')}
                      >
                        女
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="primary" onClick={handleNext} disabled={!name.trim()}>
                  下一步
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'origin' && (
            <motion.div
              key="origin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card title="选择出身" className="mb-6">
                <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  你的出身将影响初始属性和剧情走向
                </p>
                <div className="space-y-3">
                  {(Object.keys(ORIGINS) as OriginType[]).map((originType) => {
                    const origin = ORIGINS[originType];
                    const isSelected = selectedOrigin === originType;
                    return (
                      <motion.div
                        key={originType}
                        className="p-4 rounded-lg cursor-pointer transition-all"
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.05) 100%)'
                            : 'var(--ink-medium)',
                          border: isSelected
                            ? '1px solid var(--gold-immortal)'
                            : '1px solid var(--border-subtle)',
                          boxShadow: isSelected ? 'var(--shadow-gold)' : 'none',
                        }}
                        onClick={() => setSelectedOrigin(originType)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <h4
                          className="text-lg font-semibold mb-2"
                          style={{
                            color: isSelected ? 'var(--gold-immortal)' : 'var(--text-primary)',
                            fontFamily: "'Ma Shan Zheng', serif",
                          }}
                        >
                          {origin.name}
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {origin.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  上一步
                </Button>
                <Button variant="primary" onClick={handleNext} disabled={!selectedOrigin}>
                  下一步
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && selectedOrigin && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card title="确认信息" className="mb-6">
                <div className="space-y-4">
                  <div
                    className="flex justify-between py-3"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>道号</span>
                    <span style={{ color: 'var(--text-primary)' }}>{name}</span>
                  </div>
                  <div
                    className="flex justify-between py-3"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>性别</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {gender === 'male' ? '男' : '女'}
                    </span>
                  </div>
                  <div
                    className="flex justify-between py-3"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>出身</span>
                    <span style={{ color: 'var(--gold-immortal)' }}>
                      {ORIGINS[selectedOrigin].name}
                    </span>
                  </div>
                  <div className="py-3">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {ORIGINS[selectedOrigin].description}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  上一步
                </Button>
                <Button variant="primary" onClick={handleCreate}>
                  踏入仙途
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
