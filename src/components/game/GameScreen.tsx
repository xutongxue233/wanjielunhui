import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerStatus } from './PlayerStatus';
import { CultivationPanel } from './CultivationPanel';
import { StoryPanel } from './StoryPanel';
import { CombatPanel } from './CombatPanel';
import { AlchemyPanel } from './AlchemyPanel';
import { DisciplePanel } from './DisciplePanel';
import { ExplorationPanel } from './ExplorationPanel';
import { DeathDialog } from './DeathDialog';
import { SaveManager } from '../save/SaveManager';
import { useGameLoop } from '../../core/game-loop';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';
import { useContentStore } from '../../stores/contentStore';
import { Button, Modal } from '../ui';
import { BottomNav, type NavTab } from '../navigation/BottomNav';
import { ChatPanel, ChatToggleButton } from '../chat/ChatPanel';
import { SocialPage } from '../social/SocialPage';
import { MarketPage } from '../market/MarketPage';
import { PvpPage } from '../pvp/PvpPage';
import { RankingPage } from '../ranking/RankingPage';
import { friendApi, mailApi } from '../../services/api';
import './GameScreen.css';

type TabType = 'cultivation' | 'story' | 'combat' | 'alchemy' | 'disciples' | 'exploration';

const TABS: { id: TabType; name: string; icon: string; available: boolean }[] = [
  { id: 'cultivation', name: '修炼', icon: '/', available: true },
  { id: 'story', name: '剧情', icon: '/', available: true },
  { id: 'combat', name: '战斗', icon: '/', available: true },
  { id: 'alchemy', name: '炼丹', icon: '/', available: true },
  { id: 'disciples', name: '弟子', icon: '/', available: true },
  { id: 'exploration', name: '探索', icon: '/', available: true },
];

export const GameScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cultivation');
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('game');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSaveManager, setShowSaveManager] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const contentLoadStarted = useRef(false);

  const player = usePlayerStore((state) => state.player);
  const isPlayerDead = usePlayerStore((state) => state.isPlayerDead);
  const setPhase = useGameStore((state) => state.setPhase);
  const { isAuthenticated, logout } = useAuthStore();
  const { loadAll, isAllLoaded, getLoadProgress } = useContentStore();

  // 加载游戏内容数据
  useEffect(() => {
    if (contentLoadStarted.current) return;
    contentLoadStarted.current = true;

    if (isAllLoaded()) {
      setContentReady(true);
      return;
    }

    loadAll().then(() => {
      setContentReady(true);
    });
  }, [loadAll, isAllLoaded]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const [friendRequestsData, mailData] = await Promise.all([
        friendApi.requests().catch(() => []),
        mailApi.list(1, 1).catch(() => ({ mails: [], total: 0, unreadCount: 0 })),
      ]);
      const requestCount = friendRequestsData?.length || 0;
      const totalUnread = requestCount + (mailData.unreadCount || 0);
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

  // 显示内容加载进度
  if (!contentReady) {
    const { loaded, total } = getLoadProgress();
    const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
    return (
      <div className="game-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#d4af37' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>载入天地法则...</h2>
          <div style={{
            width: '300px',
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            margin: '0 auto',
          }}>
            <div style={{
              width: `${percent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #d4af37, #f5d77a)',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
            {loaded}/{total}
          </p>
        </div>
      </div>
    );
  }

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: 'easeInOut' as const },
  };

  const renderGameTabContent = () => {
    switch (activeTab) {
      case 'cultivation':
        return <CultivationPanel />;
      case 'story':
        return <StoryPanel />;
      case 'combat':
        return <CombatPanel />;
      case 'alchemy':
        return <AlchemyPanel />;
      case 'disciples':
        return <DisciplePanel />;
      case 'exploration':
        return <ExplorationPanel />;
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    switch (activeNavTab) {
      case 'game':
        return (
          <div className="game-main-wrapper">
            <aside className="game-sidebar">
              <PlayerStatus />
            </aside>

            <main className="game-main">
              <nav className="game-tabs-nav">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-xian ${activeTab === tab.id ? 'active' : ''} ${!tab.available ? 'disabled' : ''}`}
                    onClick={() => tab.available && setActiveTab(tab.id)}
                    disabled={!tab.available}
                  >
                    {tab.name}
                    {!tab.available && (
                      <span className="game-tab-soon">(soon)</span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="game-content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    {...pageTransition}
                  >
                    {renderGameTabContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        );
      case 'social':
        return (
          <div className="game-page-container social">
            <SocialPage />
          </div>
        );
      case 'market':
        return (
          <div className="game-page-container market">
            <MarketPage />
          </div>
        );
      case 'pvp':
        return (
          <div className="game-page-container pvp">
            <PvpPage />
          </div>
        );
      case 'ranking':
        return (
          <div className="game-page-container ranking">
            <RankingPage />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-screen">
      <header className="game-header glass-effect px-4 py-3">
        <div className="game-header-inner">
          <h1 className="game-title text-xl font-bold text-gradient-gold">
            万界轮回
          </h1>
          <div className="game-user-info">
            <div className="game-user-badge">
              <span className="game-user-name">{player.name}</span>
              <span className="game-user-divider" />
              <span className="game-user-realm">{player.realm.displayName}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSaveManager(true)}
              className="game-btn-save"
            >
              存档
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPhase('title')}
              className="game-btn-back"
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
                className="game-btn-logout"
              >
                退出登录
              </Button>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeNavTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {renderMainContent()}
        </motion.div>
      </AnimatePresence>

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

      {/* 存档管理弹窗 */}
      <Modal
        isOpen={showSaveManager}
        onClose={() => setShowSaveManager(false)}
        title="存档管理"
        size="lg"
      >
        <SaveManager
          onLoad={() => setShowSaveManager(false)}
          onNewGame={() => {
            setShowSaveManager(false);
            setPhase('character_creation');
          }}
          onClose={() => setShowSaveManager(false)}
        />
      </Modal>

      {/* 死亡对话框 */}
      <DeathDialog isOpen={isPlayerDead} />
    </div>
  );
};
