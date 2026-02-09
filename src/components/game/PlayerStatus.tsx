import React from 'react';
import { Card, ProgressBar, Tooltip } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { getRealmColor, REALM_CONFIGS } from '../../data/realms';
import { getSpiritualRootName } from '../../data/origins';
import { formatNumber } from '../../core/game-loop';
import './PlayerStatus.css';

export const PlayerStatus: React.FC = () => {
  const player = usePlayerStore((state) => state.player);

  if (!player) return null;

  const { realm, attributes, spiritualRoot } = player;
  const realmConfig = REALM_CONFIGS[realm.name];
  const realmColor = getRealmColor(realm.name);

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
      </div>

      {/* 状态条 */}
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
            <span className="player-attr-label">寿元</span>
            <span className="player-attr-value lifespan">{attributes.lifespan}/{attributes.maxLifespan}</span>
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
