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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      {/* 修炼进度 */}
      <Card title="修炼进度">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
          {/* 修炼圆环 */}
          <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '24px' }}>
            {/* 外层发光效果 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${realmColor}20 0%, transparent 70%)`,
              }}
            />
            {/* SVG圆环 */}
            <svg
              style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', position: 'relative', zIndex: 10 }}
              viewBox="0 0 100 100"
            >
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
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={realmColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} 283`}
                style={{ opacity: 0.3, transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>

            {/* 中心内容 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              <motion.div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: realmColor,
                  fontFamily: "'Ma Shan Zheng', serif",
                }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {realm.displayName}
              </motion.div>
            </div>
          </div>

          {/* 修为数值 */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)' }}>
              {formatNumber(attributes.cultivation)}
              <span style={{ color: 'var(--text-muted)' }}> / </span>
              {formatNumber(attributes.maxCultivation)}
            </div>
            <div
              style={{
                fontSize: '14px',
                marginTop: '4px',
                color: canBreakthrough ? 'var(--jade-light)' : 'var(--text-muted)',
              }}
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
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  background: breakthroughResult.success ? 'rgba(45, 139, 111, 0.15)' : 'rgba(139, 41, 66, 0.15)',
                  border: breakthroughResult.success ? '1px solid var(--jade-essence)' : '1px solid var(--crimson-blood)',
                  color: breakthroughResult.success ? 'var(--jade-light)' : 'var(--crimson-light)',
                }}
              >
                {breakthroughResult.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 突破按钮 */}
          <Button
            variant={canBreakthrough ? 'primary' : 'secondary'}
            style={{ width: '100%', maxWidth: '240px' }}
            disabled={!canBreakthrough || !nextRealm}
            onClick={handleBreakthrough}
          >
            {canBreakthrough ? '尝试突破' : '修为不足'}
          </Button>
        </div>
      </Card>

      {/* 修炼信息 */}
      <Card title="修炼信息">
        <div>
          {/* 修炼速度 */}
          <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--ink-medium)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>修炼速度</span>
              <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--gold-immortal)' }}>
                {cultivationSpeed.toFixed(2)}
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/秒</span>
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              受灵根资质、功法、丹药等影响
            </div>
          </div>

          {/* 下一境界 */}
          {nextRealm && (
            <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--ink-medium)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>下一境界</span>
                <span
                  style={{
                    fontWeight: '500',
                    color: getRealmColor(nextRealm.name),
                    fontFamily: "'Ma Shan Zheng', serif",
                  }}
                >
                  {nextRealm.displayName}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {REALM_CONFIGS[nextRealm.name].description}
              </div>
            </div>
          )}

          {/* 突破概率 */}
          <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--ink-medium)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>突破成功率</span>
              <span style={{ color: 'var(--jade-light)' }}>
                {Math.min(95, Math.floor(50 + attributes.comprehension * 0.5 + attributes.luck * 0.3))}%
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              悟性和气运越高，突破成功率越高
            </div>
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, var(--border-subtle) 20%, var(--gold-immortal) 50%, var(--border-subtle) 80%, transparent 100%)', margin: '16px 0' }} />

          {/* 当前境界描述 */}
          <div>
            <div
              style={{
                fontSize: '14px',
                marginBottom: '8px',
                color: realmColor,
                fontFamily: "'Ma Shan Zheng', serif",
              }}
            >
              {realm.displayName}
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {REALM_CONFIGS[realm.name].description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
