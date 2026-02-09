import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameLoop, formatNumber } from '../../core/game-loop';
import { getRealmColor, getNextRealm, REALM_CONFIGS } from '../../data/realms';
import './CultivationPanel.css';

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
    <div className="cultivation-grid">
      {/* 修炼进度 */}
      <Card title="修炼进度">
        <div className="flex flex-col items-center py-6">
          {/* 修炼圆环 */}
          <div className="cultivation-ring-container">
            {/* 外层发光效果 */}
            <div
              className="cultivation-ring-glow"
              style={{ '--ring-color': realmColor } as React.CSSProperties}
            />
            {/* SVG圆环 */}
            <svg className="cultivation-ring-svg" viewBox="0 0 100 100">
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
                className="cultivation-ring-progress"
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
                className="cultivation-ring-glow-circle"
              />
            </svg>

            {/* 中心内容 */}
            <div className="cultivation-ring-center">
              <motion.div
                className="cultivation-realm-name"
                style={{ color: realmColor }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {realm.displayName}
              </motion.div>
            </div>
          </div>

          {/* 修为数值 */}
          <div className="cultivation-values">
            <div className="cultivation-current">
              {formatNumber(attributes.cultivation)}
              <span className="cultivation-separator"> / </span>
              {formatNumber(attributes.maxCultivation)}
            </div>
            <div className={`cultivation-hint ${canBreakthrough ? 'cultivation-hint-ready' : 'cultivation-hint-waiting'}`}>
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
                className={`cultivation-result ${breakthroughResult.success ? 'cultivation-result-success' : 'cultivation-result-fail'}`}
              >
                {breakthroughResult.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 突破按钮 */}
          <Button
            variant={canBreakthrough ? 'primary' : 'secondary'}
            className="w-full max-w-60"
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
          <div className="cultivation-info-block">
            <div className="cultivation-info-row">
              <span className="cultivation-info-label">修炼速度</span>
              <span className="cultivation-speed-value">
                {cultivationSpeed.toFixed(2)}
                <span className="cultivation-speed-unit">/秒</span>
              </span>
            </div>
            <div className="cultivation-info-hint">
              受灵根资质、功法、丹药等影响
            </div>
          </div>

          {/* 下一境界 */}
          {nextRealm && (
            <div className="cultivation-info-block">
              <div className="cultivation-info-row">
                <span className="cultivation-info-label">下一境界</span>
                <span
                  className="cultivation-realm-title"
                  style={{ color: getRealmColor(nextRealm.name) }}
                >
                  {nextRealm.displayName}
                </span>
              </div>
              <div className="cultivation-info-hint">
                {REALM_CONFIGS[nextRealm.name].description}
              </div>
            </div>
          )}

          {/* 突破概率 */}
          <div className="cultivation-info-block">
            <div className="cultivation-info-row">
              <span className="cultivation-info-label">突破成功率</span>
              <span className="cultivation-info-value cultivation-info-jade">
                {Math.min(95, Math.floor((REALM_CONFIGS[player.realm.name].breakthroughBaseRate + attributes.comprehension * 0.005 + attributes.luck * 0.003) * 100))}%
              </span>
            </div>
            <div className="cultivation-info-hint">
              悟性和气运越高，突破成功率越高
            </div>
          </div>

          {/* 分隔线 */}
          <div className="cultivation-divider" />

          {/* 当前境界描述 */}
          <div>
            <div
              className="cultivation-realm-title"
              style={{ color: realmColor }}
            >
              {realm.displayName}
            </div>
            <p className="cultivation-realm-desc">
              {REALM_CONFIGS[realm.name].description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
