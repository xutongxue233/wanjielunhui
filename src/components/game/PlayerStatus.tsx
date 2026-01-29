import React from 'react';
import { Card, ProgressBar, Tooltip } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { getRealmColor, REALM_CONFIGS, STAGE_DISPLAY_NAMES } from '../../data/realms';
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
        {/* 头像 */}
        <div
          style={{
            width: '64px',
            height: '64px',
            minWidth: '64px',
            minHeight: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${realmColor}30, ${realmColor}10)`,
            border: `2px solid ${realmColor}`,
            boxShadow: `0 0 20px ${realmColor}30`,
            fontFamily: "'Ma Shan Zheng', serif",
            color: 'var(--text-primary)',
            flexShrink: 0,
          }}
        >
          {player.name.charAt(0)}
        </div>

        {/* 名字和境界信息 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              lineHeight: '1.3',
              marginBottom: '6px',
              color: 'var(--text-primary)',
              fontFamily: "'Ma Shan Zheng', serif",
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {player.name}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <Tooltip content={realmConfig.description}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'help',
                  color: realmColor,
                }}
              >
                {realm.displayName}
              </span>
            </Tooltip>
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            {getSpiritualRootName(spiritualRoot)}
          </div>
        </div>
      </div>

      {/* 状态条 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <ProgressBar
            current={attributes.hp}
            max={attributes.maxHp}
            type="hp"
            label="气血"
            height={14}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <ProgressBar
            current={attributes.mp}
            max={attributes.maxMp}
            type="mp"
            label="法力"
            height={14}
          />
        </div>
        <div>
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
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, var(--border-subtle) 20%, var(--gold-immortal) 50%, var(--border-subtle) 80%, transparent 100%)', margin: '16px 0' }} />

      {/* 属性列表 */}
      <div>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingRight: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>攻击</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--crimson-light)' }}>{formatNumber(attributes.attack)}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingLeft: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>防御</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--azure-light)' }}>{formatNumber(attributes.defense)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingRight: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>速度</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--jade-light)' }}>{formatNumber(attributes.speed)}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingLeft: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>悟性</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--purple-light)' }}>{attributes.comprehension}</span>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingRight: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>气运</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--gold-light)' }}>{attributes.luck}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingLeft: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>寿元</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>{attributes.lifespan}/{attributes.maxLifespan}</span>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, var(--border-subtle) 20%, var(--gold-immortal) 50%, var(--border-subtle) 80%, transparent 100%)', margin: '16px 0' }} />

      {/* 五行亲和 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          五行亲和
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
          <ElementBadge name="金" value={spiritualRoot.elements.metal} color="var(--metal-silver)" />
          <ElementBadge name="木" value={spiritualRoot.elements.wood} color="var(--wood-green)" />
          <ElementBadge name="水" value={spiritualRoot.elements.water} color="var(--water-blue)" />
          <ElementBadge name="火" value={spiritualRoot.elements.fire} color="var(--fire-red)" />
          <ElementBadge name="土" value={spiritualRoot.elements.earth} color="var(--earth-yellow)" />
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6px 10px',
        borderRadius: '4px',
        background: `${color}15`,
        border: `1px solid ${color}40`,
        minWidth: '36px',
      }}
    >
      <span style={{ fontSize: '12px', color, fontWeight: '500' }}>{name}</span>
      <span style={{ fontSize: '11px', color: 'var(--text-primary)', marginTop: '2px' }}>
        {value}
      </span>
    </div>
  );
};
