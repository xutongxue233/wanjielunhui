import React, { useState, useEffect, useCallback } from 'react';
import { PlayerStatus } from './PlayerStatus';
import { CultivationPanel } from './CultivationPanel';
import { StoryPanel } from './StoryPanel';
import { useGameLoop } from '../../core/game-loop';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui';
import { BottomNav, type NavTab } from '../navigation/BottomNav';
import { ChatPanel, ChatToggleButton } from '../chat/ChatPanel';
import { SocialPage } from '../social/SocialPage';
import { MarketPage } from '../market/MarketPage';
import { PvpPage } from '../pvp/PvpPage';
import { RankingPage } from '../ranking/RankingPage';
import { friendApi, mailApi } from '../../services/api';

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
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('game');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const player = usePlayerStore((state) => state.player);
  const setPhase = useGameStore((state) => state.setPhase);
  const { isAuthenticated, logout } = useAuthStore();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const [friendRequests, mailData] = await Promise.all([
        friendApi.requests().catch(() => []),
        mailApi.list(1, 1).catch(() => ({ mails: [], total: 0, unreadCount: 0 })),
      ]);
      const totalUnread = friendRequests.length + (mailData.unreadCount || 0);
      setUnreadCount(totalUnread);
    } catch (err) {
      console.error('获取未读数量失败:', err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchUnreadCount]);

  useGameLoop();

  if (!player) return null;

  const renderGameTabContent = () => {
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

  const renderMainContent = () => {
    switch (activeNavTab) {
      case 'game':
        return (
          <div className="flex-1 flex max-w-7xl mx-auto w-full">
            <aside
              style={{
                width: '280px',
                minWidth: '280px',
                padding: '16px',
                borderRight: '1px solid var(--border-subtle)',
              }}
            >
              <PlayerStatus />
            </aside>

            <main className="flex-1 flex flex-col">
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

              <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {renderGameTabContent()}
              </div>
            </main>
          </div>
        );
      case 'social':
        return (
          <div className="flex-1 max-w-4xl mx-auto w-full">
            <SocialPage />
          </div>
        );
      case 'market':
        return (
          <div className="flex-1 max-w-5xl mx-auto w-full">
            <MarketPage />
          </div>
        );
      case 'pvp':
        return (
          <div className="flex-1 max-w-4xl mx-auto w-full">
            <PvpPage />
          </div>
        );
      case 'ranking':
        return (
          <div className="flex-1 max-w-4xl mx-auto w-full">
            <RankingPage />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingBottom: '64px' }}>
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
          <div className="flex items-center gap-5">
            <div
              className="flex items-center gap-5 px-4 py-1.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 90, 43, 0.15) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <span
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {player.name}
              </span>
              <span
                className="h-4 w-px"
                style={{ background: 'rgba(212, 175, 55, 0.4)' }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--gold-immortal)' }}
              >
                {player.realm.displayName}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPhase('title')}
              className="hover:text-gold-primary"
              style={{
                color: 'var(--text-muted)',
                transition: 'color 0.2s ease',
              }}
            >
              返回
            </Button>
            {isAuthenticated && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  logout();
                  setPhase('title');
                }}
                style={{
                  color: 'var(--crimson-light, #e06860)',
                  transition: 'all 0.2s ease',
                }}
              >
                退出登录
              </Button>
            )}
          </div>
        </div>
      </header>

      {renderMainContent()}

      <BottomNav
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
        unreadCount={unreadCount}
      />

      <ChatToggleButton
        onClick={() => setIsChatOpen(!isChatOpen)}
        unreadCount={isChatOpen ? 0 : unreadCount}
      />

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        unreadCount={unreadCount}
      />
    </div>
  );
};
