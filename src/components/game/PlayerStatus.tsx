import React from 'react';
import { Card, ProgressBar, Tooltip } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { getRealmColor, REALM_CONFIGS } from '../../data/realms';
import { getSpiritualRootName } from '../../data/origins';
import { formatNumber } from '../../core/game-loop';

export const PlayerStatus: React.FC = () => {
  const player = usePlayerStore((state) => state.player);

  if (!player) return null;

  const { realm, attributes, spiritualRoot } = player;
  const realmConfig = REALM_CONFIGS[realm.name];
  const realmColor = getRealmColor(realm.name);

  return (
    <Card className="w-full">
      {/* 角色头像和基本信息 */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold relative"
          style={{
            background: `linear-gradient(135deg, ${realmColor}30, ${realmColor}10)`,
            border: `2px solid ${realmColor}`,
            boxShadow: `0 0 20px ${realmColor}30`,
            fontFamily: "'Ma Shan Zheng', serif",
          }}
        >
          {player.name.charAt(0)}
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{
              background: 'var(--ink-dark)',
              border: `1px solid ${realmColor}`,
              color: realmColor,
            }}
          >
            {realm.stage}
          </div>
        </div>

        <div className="flex-1">
          <h2
            className="text-xl font-bold"
            style={{
              color: 'var(--text-primary)',
              fontFamily: "'Ma Shan Zheng', serif",
            }}
          >
            {player.name}
          </h2>
          <Tooltip content={realmConfig.description}>
            <span
              className="text-sm font-medium cursor-help"
              style={{ color: realmColor }}
            >
              {realm.displayName}
            </span>
          </Tooltip>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {getSpiritualRootName(spiritualRoot)}
          </div>
        </div>
      </div>

      {/* 状态条 */}
      <div className="space-y-4">
        <ProgressBar
          current={attributes.hp}
          max={attributes.maxHp}
          type="hp"
          label="气血"
          height={14}
        />

        <ProgressBar
          current={attributes.mp}
          max={attributes.maxMp}
          type="mp"
          label="法力"
          height={14}
        />

        <ProgressBar
          current={attributes.cultivation}
          max={attributes.maxCultivation}
          type="cultivation"
          label="修为"
          height={14}
        />
      </div>

      {/* 分隔线 */}
      <div className="divider-xian my-5" />

      {/* 属性列表 */}
      <div className="grid grid-cols-2 gap-3">
        <AttributeRow label="攻击" value={formatNumber(attributes.attack)} color="var(--crimson-light)" />
        <AttributeRow label="防御" value={formatNumber(attributes.defense)} color="var(--azure-light)" />
        <AttributeRow label="速度" value={formatNumber(attributes.speed)} color="var(--jade-light)" />
        <AttributeRow label="悟性" value={attributes.comprehension.toString()} color="var(--purple-light)" />
        <AttributeRow label="气运" value={attributes.luck.toString()} color="var(--gold-light)" />
        <AttributeRow
          label="寿元"
          value={`${attributes.lifespan}/${attributes.maxLifespan}`}
          color="var(--text-secondary)"
        />
      </div>

      {/* 五行亲和 */}
      <div className="divider-xian my-5" />
      <div className="space-y-2">
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>五行亲和</div>
        <div className="flex justify-between text-sm">
          <ElementBadge element="metal" value={spiritualRoot.elements.metal} />
          <ElementBadge element="wood" value={spiritualRoot.elements.wood} />
          <ElementBadge element="water" value={spiritualRoot.elements.water} />
          <ElementBadge element="fire" value={spiritualRoot.elements.fire} />
          <ElementBadge element="earth" value={spiritualRoot.elements.earth} />
        </div>
      </div>
    </Card>
  );
};

interface AttributeRowProps {
  label: string;
  value: string;
  color: string;
}

const AttributeRow: React.FC<AttributeRowProps> = ({ label, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
    <span className="text-sm font-medium" style={{ color }}>{value}</span>
  </div>
);

interface ElementBadgeProps {
  element: 'metal' | 'wood' | 'water' | 'fire' | 'earth';
  value: number;
}

const ELEMENT_CONFIG = {
  metal: { name: '金', color: 'var(--metal-silver)' },
  wood: { name: '木', color: 'var(--wood-green)' },
  water: { name: '水', color: 'var(--water-blue)' },
  fire: { name: '火', color: 'var(--fire-red)' },
  earth: { name: '土', color: 'var(--earth-yellow)' },
};

const ElementBadge: React.FC<ElementBadgeProps> = ({ element, value }) => {
  const config = ELEMENT_CONFIG[element];
  return (
    <div
      className="flex flex-col items-center gap-1 px-2 py-1 rounded"
      style={{
        background: `${config.color}10`,
        border: `1px solid ${config.color}30`,
      }}
    >
      <span className="text-xs" style={{ color: config.color }}>{config.name}</span>
      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
};
