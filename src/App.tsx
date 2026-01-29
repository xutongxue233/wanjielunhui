import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './stores/gameStore';
import { usePlayerStore } from './stores/playerStore';
import { TitleScreen, CharacterCreation, GameScreen } from './components/game';
import { useGameLoop } from './core/game-loop';

function App() {
  const phase = useGameStore((state) => state.phase);
  const player = usePlayerStore((state) => state.player);
  const { processOfflineRewards } = useGameLoop();

  useEffect(() => {
    if (player && phase === 'playing') {
      const rewards = processOfflineRewards();
      if (rewards && rewards.cultivation > 0) {
        console.log(`离线收益: 修为 +${rewards.cultivation.toFixed(0)}`);
      }
    }
  }, [phase]);

  const renderPhase = () => {
    switch (phase) {
      case 'title':
        return <TitleScreen key="title" />;
      case 'character_creation':
        return <CharacterCreation key="creation" />;
      case 'playing':
        return <GameScreen key="game" />;
      default:
        return <TitleScreen key="title" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>
    </div>
  );
}

export default App;
