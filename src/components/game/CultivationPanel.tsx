import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameLoop, formatNumber } from '../../core/game-loop';
import { getRealmColor, getNextRealm, REALM_CONFIGS } from '../../data/realms';

export const CultivationPanel: React.FC = () => {
  const player = usePlayerStore((state) => state.player);
  const attemptBreakthrough = usePlayerStore((state) => state.attemptBreakthrough);
  const { calculateCultivationSpeed } = useGameLoop();

  const [breakthroughResult, setBreakthroughResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!player) return null;

  const { realm, attributes } = player;
  const cultivationSpeed = calculateCultivationSpeed();
  const nextRealm = getNextRealm(realm);
  const canBreakthrough = attributes.cultivation >= attributes.maxCultivation;
  const progress = (attributes.cultivation / attributes.maxCultivation) * 100;
  const realmColor = getRealmColor(realm.name);

  const handleBreakthrough = () => {
    const result = attemptBreakthrough();
    setBreakthroughResult(result);
    setTimeout(() => setBreakthroughResult(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 修炼进度 */}
      <Card title="修炼进度">
        <div className="flex flex-col items-center py-6">
          {/* 修炼圆环 */}
          <div className="relative w-40 h-40 mb-6">
            {/* 背景圆环 */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--ink-medium)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={realmColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} 283`}
                style={{
                  filter: `drop-shadow(0 0 10px ${realmColor})`,
                  transition: 'stroke-dasharray 0.5s ease',
                }}
              />
            </svg>

            {/* 中心内容 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-2xl font-bold"
                style={{
                  color: realmColor,
                  fontFamily: "'Ma Shan Zheng', serif",
                }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {realm.displayName}
              </motion.div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                第{realm.stage}层
              </div>
            </div>

            {/* 旋转装饰 */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: realmColor,
                    opacity: 0.5,
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${deg}deg) translateY(-58px) translateX(-50%)`,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* 修为数值 */}
          <div className="text-center mb-4">
            <div className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(attributes.cultivation)}
              <span style={{ color: 'var(--text-muted)' }}> / </span>
              {formatNumber(attributes.maxCultivation)}
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: canBreakthrough ? 'var(--jade-light)' : 'var(--text-muted)' }}
            >
              {canBreakthrough ? '修为圆满，可尝试突破' : `还需 ${formatNumber(attributes.maxCultivation - attributes.cultivation)}`}
            </div>
          </div>

          {/* 突破结果提示 */}
          <AnimatePresence>
            {breakthroughResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full p-3 rounded-lg text-center mb-4"
                style={{
                  background: breakthroughResult.success
                    ? 'rgba(45, 139, 111, 0.15)'
                    : 'rgba(139, 41, 66, 0.15)',
                  border: breakthroughResult.success
                    ? '1px solid var(--jade-essence)'
                    : '1px solid var(--crimson-blood)',
                  color: breakthroughResult.success
                    ? 'var(--jade-light)'
                    : 'var(--crimson-light)',
                }}
              >
                {breakthroughResult.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 突破按钮 */}
          <Button
            variant={canBreakthrough ? 'primary' : 'secondary'}
            className="w-full max-w-xs"
            disabled={!canBreakthrough || !nextRealm}
            onClick={handleBreakthrough}
          >
            {canBreakthrough ? '尝试突破' : '修为不足'}
          </Button>
        </div>
      </Card>

      {/* 修炼信息 */}
      <Card title="修炼信息">
        <div className="space-y-4">
          {/* 修炼速度 */}
          <div
            className="p-4 rounded-lg"
            style={{ background: 'var(--ink-medium)' }}
          >
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'var(--text-secondary)' }}>修炼速度</span>
              <span className="text-lg font-medium" style={{ color: 'var(--gold-immortal)' }}>
                {cultivationSpeed.toFixed(2)}
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/秒</span>
              </span>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              受灵根资质、功法、丹药等影响
            </div>
          </div>

          {/* 下一境界 */}
          {nextRealm && (
            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--ink-medium)' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>下一境界</span>
                <span
                  className="font-medium"
                  style={{
                    color: getRealmColor(nextRealm.name),
                    fontFamily: "'Ma Shan Zheng', serif",
                  }}
                >
                  {nextRealm.displayName}
                </span>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {REALM_CONFIGS[nextRealm.name].description}
              </div>
            </div>
          )}

          {/* 突破概率 */}
          <div
            className="p-4 rounded-lg"
            style={{ background: 'var(--ink-medium)' }}
          >
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'var(--text-secondary)' }}>突破成功率</span>
              <span style={{ color: 'var(--jade-light)' }}>
                {Math.min(95, Math.floor(50 + attributes.comprehension * 0.5 + attributes.luck * 0.3))}%
              </span>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              悟性和气运越高，突破成功率越高
            </div>
          </div>

          {/* 当前境界描述 */}
          <div className="divider-xian my-4" />
          <div>
            <div
              className="text-sm mb-2"
              style={{
                color: realmColor,
                fontFamily: "'Ma Shan Zheng', serif",
              }}
            >
              {realm.displayName}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {REALM_CONFIGS[realm.name].description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
