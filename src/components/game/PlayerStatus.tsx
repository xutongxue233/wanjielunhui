import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, ProgressBar, Tooltip } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { getRealmColor, REALM_CONFIGS } from '../../data/realms';
import { getSpiritualRootName } from '../../data/origins';
import { formatNumber } from '../../core/game-loop';
import './PlayerStatus.css';

export const PlayerStatus: React.FC = () => {
  const player = usePlayerStore((state) => state.player);
  const checkLifespanWarning = usePlayerStore((state) => state.checkLifespanWarning);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!player) return null;

  const { realm, attributes, spiritualRoot } = player;
  const realmConfig = REALM_CONFIGS[realm.name];
  const realmColor = getRealmColor(realm.name);

  // 检查寿元警告状态
  const { isWarning: lifespanWarning, percentage: lifespanPercentage } = checkLifespanWarning();

  return (
    <Card className="w-full">
      {/* 角色头像和基本信息 */}
      <div className="player-status-header">
        {/* 头像 */}
        <div
          className="player-avatar"
          style={{
            background: `linear-gradient(135deg, ${realmColor}30, ${realmColor}10)`,
            border: `2px solid ${realmColor}`,
            boxShadow: `0 0 20px ${realmColor}30`,
          }}
        >
          {player.name.charAt(0)}
        </div>

        {/* 名字和境界信息 */}
        <div className="player-info">
          <div className="player-name">
            {player.name}
          </div>
          <div className="player-realm">
            <Tooltip content={realmConfig.description}>
              <span className="player-realm-text" style={{ color: realmColor }}>
                {realm.displayName}
              </span>
            </Tooltip>
          </div>
          <div className="player-spiritual-root">
            {getSpiritualRootName(spiritualRoot)}
          </div>
        </div>

        {/* 移动端展开/折叠按钮 */}
        <button
          className="player-mobile-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? '折叠详情' : '展开详情'}
        >
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'inline-block' }}
          >
            ▼
          </motion.span>
        </button>
      </div>

      {/* 状态条 - 始终显示 */}
      <div className="player-bars">
        <div className="player-bar-row">
          <ProgressBar
            current={attributes.hp}
            max={attributes.maxHp}
            type="hp"
            label="气血"
            height={14}
          />
        </div>
        <div className="player-bar-row">
          <ProgressBar
            current={attributes.mp}
            max={attributes.maxMp}
            type="mp"
            label="法力"
            height={14}
          />
        </div>
        <div className="player-bar-row">
          <ProgressBar
            current={attributes.cultivation}
            max={attributes.maxCultivation}
            type="cultivation"
            label="修为"
            height={14}
          />
        </div>
      </div>

      {/* 可折叠的详细属性区域 - 桌面端始终显示，移动端可折叠 */}
      <div className="player-details-desktop">
        {/* 分隔线 */}
        <div className="player-divider" />

        {/* 属性列表 */}
        <div className="player-attributes">
          <div className="player-attr-row">
            <div className="player-attr-item">
              <span className="player-attr-label">攻击</span>
              <span className="player-attr-value attack">{formatNumber(attributes.attack)}</span>
            </div>
            <div className="player-attr-item">
              <span className="player-attr-label">防御</span>
              <span className="player-attr-value defense">{formatNumber(attributes.defense)}</span>
            </div>
          </div>
          <div className="player-attr-row">
            <div className="player-attr-item">
              <span className="player-attr-label">速度</span>
              <span className="player-attr-value speed">{formatNumber(attributes.speed)}</span>
            </div>
            <div className="player-attr-item">
              <span className="player-attr-label">悟性</span>
              <span className="player-attr-value comprehension">{attributes.comprehension}</span>
            </div>
          </div>
          <div className="player-attr-row">
            <div className="player-attr-item">
              <span className="player-attr-label">气运</span>
              <span className="player-attr-value luck">{attributes.luck}</span>
            </div>
            <div className="player-attr-item">
              <Tooltip content={lifespanWarning ? `寿元告急！仅剩${lifespanPercentage.toFixed(1)}%` : `寿元充足 ${lifespanPercentage.toFixed(1)}%`}>
                <div className="player-attr-lifespan-wrap">
                  <span className="player-attr-label">寿元</span>
                  <span className={`player-attr-value lifespan ${lifespanWarning ? 'lifespan-warning' : ''}`}>
                    {attributes.lifespan}/{attributes.maxLifespan}
                    {lifespanWarning && <span className="lifespan-warning-icon">!</span>}
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="player-divider" />

        {/* 五行亲和 */}
        <div className="player-elements">
          <div className="player-elements-title">
            五行亲和
          </div>
          <div className="player-elements-list">
            <ElementBadge name="金" value={spiritualRoot.elements.includes('metal') ? 100 : 0} color="var(--element-metal)" />
            <ElementBadge name="木" value={spiritualRoot.elements.includes('wood') ? 100 : 0} color="var(--element-wood)" />
            <ElementBadge name="水" value={spiritualRoot.elements.includes('water') ? 100 : 0} color="var(--element-water)" />
            <ElementBadge name="火" value={spiritualRoot.elements.includes('fire') ? 100 : 0} color="var(--element-fire)" />
            <ElementBadge name="土" value={spiritualRoot.elements.includes('earth') ? 100 : 0} color="var(--element-earth)" />
          </div>
        </div>
      </div>

      {/* 移动端可折叠区域 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="player-details-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="player-divider" />

            <div className="player-attributes">
              <div className="player-attr-row">
                <div className="player-attr-item">
                  <span className="player-attr-label">攻击</span>
                  <span className="player-attr-value attack">{formatNumber(attributes.attack)}</span>
                </div>
                <div className="player-attr-item">
                  <span className="player-attr-label">防御</span>
                  <span className="player-attr-value defense">{formatNumber(attributes.defense)}</span>
                </div>
              </div>
              <div className="player-attr-row">
                <div className="player-attr-item">
                  <span className="player-attr-label">速度</span>
                  <span className="player-attr-value speed">{formatNumber(attributes.speed)}</span>
                </div>
                <div className="player-attr-item">
                  <span className="player-attr-label">悟性</span>
                  <span className="player-attr-value comprehension">{attributes.comprehension}</span>
                </div>
              </div>
              <div className="player-attr-row">
                <div className="player-attr-item">
                  <span className="player-attr-label">气运</span>
                  <span className="player-attr-value luck">{attributes.luck}</span>
                </div>
                <div className="player-attr-item">
                  <Tooltip content={lifespanWarning ? `寿元告急！仅剩${lifespanPercentage.toFixed(1)}%` : `寿元充足 ${lifespanPercentage.toFixed(1)}%`}>
                    <span className="player-attr-label">寿元</span>
                    <span className={`player-attr-value lifespan ${lifespanWarning ? 'lifespan-warning' : ''}`}>
                      {attributes.lifespan}/{attributes.maxLifespan}
                      {lifespanWarning && <span className="lifespan-warning-icon">!</span>}
                    </span>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="player-divider" />

            <div className="player-elements">
              <div className="player-elements-title">五行亲和</div>
              <div className="player-elements-list">
                <ElementBadge name="金" value={spiritualRoot.elements.includes('metal') ? 100 : 0} color="var(--element-metal)" />
                <ElementBadge name="木" value={spiritualRoot.elements.includes('wood') ? 100 : 0} color="var(--element-wood)" />
                <ElementBadge name="水" value={spiritualRoot.elements.includes('water') ? 100 : 0} color="var(--element-water)" />
                <ElementBadge name="火" value={spiritualRoot.elements.includes('fire') ? 100 : 0} color="var(--element-fire)" />
                <ElementBadge name="土" value={spiritualRoot.elements.includes('earth') ? 100 : 0} color="var(--element-earth)" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

interface ElementBadgeProps {
  name: string;
  value: number;
  color: string;
}

const ElementBadge: React.FC<ElementBadgeProps> = ({ name, value, color }) => {
  return (
    <div
      className="element-badge"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}40`,
      }}
    >
      <span className="element-badge-name" style={{ color }}>{name}</span>
      <span className="element-badge-value">{value}</span>
    </div>
  );
};
