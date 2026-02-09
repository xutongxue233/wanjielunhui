import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './stores/gameStore';
import { usePlayerStore } from './stores/playerStore';
import { useAuthStore } from './stores/authStore';
import { TitleScreen, CharacterCreation, GameScreen } from './components/game';
import { SaveManager } from './components/save/SaveManager';
import { useGameLoop } from './core/game-loop';
import { saveSyncService } from './services/saveSync';
import { MessageContainer } from './components/ui';

function App() {
  const phase = useGameStore((state) => state.phase);
  const setPhase = useGameStore((state) => state.setPhase);
  const player = usePlayerStore((state) => state.player);
  const { isAuthenticated, isLoading: authLoading, setLoading } = useAuthStore();
  const { processOfflineRewards } = useGameLoop();

  const [showSaveManager, setShowSaveManager] = useState(false);
  const [currentSaveSlot, setCurrentSaveSlot] = useState<number | null>(null);

  // 初始化认证状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  // 处理离线奖励
  useEffect(() => {
    if (player && phase === 'playing') {
      const rewards = processOfflineRewards();
      if (rewards && rewards.cultivation > 0) {
        console.log(`离线收益: 修为 +${rewards.cultivation.toFixed(0)}`);
      }
    }
  }, [phase, player, processOfflineRewards]);

  // 登录后启动自动保存
  useEffect(() => {
    if (isAuthenticated && phase === 'playing' && currentSaveSlot) {
      saveSyncService.startAutoSave(60, currentSaveSlot);
      return () => saveSyncService.stopAutoSave();
    }
  }, [isAuthenticated, phase, currentSaveSlot]);

  // 加载存档后的处理
  const handleLoadSave = (slot: number) => {
    setCurrentSaveSlot(slot);
    setShowSaveManager(false);
    setPhase('playing');
  };

  // 开始新游戏
  const handleNewGame = () => {
    setShowSaveManager(false);
    setPhase('character_creation');
  };

  // 从标题页进入
  const handleEnterGame = () => {
    if (isAuthenticated) {
      setShowSaveManager(true);
    } else {
      // 未登录时使用本地存档
      if (player) {
        setPhase('playing');
      } else {
        setPhase('character_creation');
      }
    }
  };

  // 加载中
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 存档管理界面
  if (showSaveManager && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <SaveManager
          onLoad={handleLoadSave}
          onNewGame={handleNewGame}
          onClose={() => setShowSaveManager(false)}
        />
      </div>
    );
  }

  const renderPhase = () => {
    switch (phase) {
      case 'title':
        return <TitleScreen key="title" onEnter={handleEnterGame} />;
      case 'character_creation':
        return <CharacterCreation key="creation" />;
      case 'playing':
        return <GameScreen key="game" />;
      default:
        return <TitleScreen key="title" onEnter={handleEnterGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>
      <MessageContainer />
    </div>
  );
}

export default App;
