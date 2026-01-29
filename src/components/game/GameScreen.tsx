import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerStatus } from './PlayerStatus';
import { CultivationPanel } from './CultivationPanel';
import { StoryPanel } from './StoryPanel';
import { useGameLoop } from '../../core/game-loop';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../ui';

type TabType = 'cultivation' | 'story' | 'combat' | 'alchemy' | 'disciples' | 'exploration';

const TABS: { id: TabType; name: string; icon: string; available: boolean }[] = [
  { id: 'cultivation', name: '修炼', icon: '/', available: true },
  { id: 'story', name: '剧情', icon: '/', available: true },
  { id: 'combat', name: '战斗', icon: '/', available: false },
  { id: 'alchemy', name: '炼丹', icon: '/', available: false },
  { id: 'disciples', name: '弟子', icon: '/', available: false },
  { id: 'exploration', name: '探索', icon: '/', available: false },
];

export const GameScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cultivation');
  const player = usePlayerStore((state) => state.player);
  const setPhase = useGameStore((state) => state.setPhase);

  useGameLoop();

  if (!player) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cultivation':
        return <CultivationPanel />;
      case 'story':
        return <StoryPanel />;
      case 'combat':
        return (
          <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="text-center">
              <div className="text-4xl mb-4" style={{ color: 'var(--gold-immortal)', opacity: 0.3 }}>
                /
              </div>
              <p>战斗系统开发中...</p>
            </div>
          </div>
        );
      case 'alchemy':
        return (
          <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="text-center">
              <div className="text-4xl mb-4" style={{ color: 'var(--gold-immortal)', opacity: 0.3 }}>
                /
              </div>
              <p>炼丹系统开发中...</p>
            </div>
          </div>
        );
      case 'disciples':
        return (
          <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="text-center">
              <div className="text-4xl mb-4" style={{ color: 'var(--gold-immortal)', opacity: 0.3 }}>
                /
              </div>
              <p>弟子系统开发中...</p>
            </div>
          </div>
        );
      case 'exploration':
        return (
          <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="text-center">
              <div className="text-4xl mb-4" style={{ color: 'var(--gold-immortal)', opacity: 0.3 }}>
                /
              </div>
              <p>探索系统开发中...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header
        className="glass-effect px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            className="text-xl font-bold text-gradient-gold"
            style={{ fontFamily: "'Ma Shan Zheng', serif" }}
          >
            万界轮回
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--text-primary)' }}>{player.name}</span>
              <span className="text-sm" style={{ color: 'var(--gold-immortal)' }}>
                {player.realm.displayName}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPhase('title')}
            >
              返回
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* 左侧角色状态栏 */}
        <aside
          className="w-72 p-4"
          style={{ borderRight: '1px solid var(--border-subtle)' }}
        >
          <PlayerStatus />
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 flex flex-col">
          {/* 标签页导航 */}
          <nav
            className="flex px-4"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-xian ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => tab.available && setActiveTab(tab.id)}
                disabled={!tab.available}
                style={{
                  opacity: tab.available ? 1 : 0.4,
                  cursor: tab.available ? 'pointer' : 'not-allowed',
                }}
              >
                {tab.name}
                {!tab.available && (
                  <span
                    className="ml-1 text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    (soon)
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* 内容区域 */}
          <div className="flex-1 p-4 overflow-y-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* 底部状态栏 */}
      <footer
        className="glass-effect px-4 py-2"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div
          className="max-w-7xl mx-auto flex justify-between text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>万界轮回 v0.1.0</span>
          <span
            className="flex items-center gap-1"
            style={{ color: 'var(--jade-essence)' }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--jade-essence)' }}
            />
            自动保存已启用
          </span>
        </div>
      </footer>
    </div>
  );
};
