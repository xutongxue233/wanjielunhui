import React from 'react';
import { Button } from '../ui';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';

export const TitleScreen: React.FC = () => {
  const setPhase = useGameStore((state) => state.setPhase);
  const player = usePlayerStore((state) => state.player);
  const resetPlayer = usePlayerStore((state) => state.resetPlayer);

  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleNewGame = () => {
    if (player) {
      setShowConfirm(true);
    } else {
      setPhase('character_creation');
    }
  };

  const handleContinue = () => {
    if (player) {
      setPhase('playing');
    }
  };

  const handleConfirmNewGame = () => {
    resetPlayer();
    setPhase('character_creation');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 w-96 h-96 rounded-full animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(45, 139, 111, 0.1) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* 八卦装饰 */}
      <div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full animate-rotate-slow opacity-5"
        style={{
          transform: 'translate(-50%, -50%)',
          background: `conic-gradient(
            from 0deg,
            var(--ink-black) 0deg 45deg,
            var(--gold-immortal) 45deg 90deg,
            var(--ink-black) 90deg 135deg,
            var(--gold-immortal) 135deg 180deg,
            var(--ink-black) 180deg 225deg,
            var(--gold-immortal) 225deg 270deg,
            var(--ink-black) 270deg 315deg,
            var(--gold-immortal) 315deg 360deg
          )`,
        }}
      />

      {/* 主内容 */}
      <div className="relative z-10 text-center animate-fade-in-up">
        {/* 标题 */}
        <h1
          className="text-6xl md:text-7xl font-bold mb-4 text-gradient-gold"
          style={{ fontFamily: "'Ma Shan Zheng', 'Noto Serif SC', serif" }}
        >
          万界轮回
        </h1>

        <p
          className="text-xl mb-16 animate-fade-in stagger-2"
          style={{ color: 'var(--text-secondary)', fontFamily: "'ZCOOL XiaoWei', serif" }}
        >
          凡人修仙 逆天改命
        </p>

        {/* 按钮组 */}
        <div className="flex flex-col gap-4 items-center animate-fade-in stagger-3">
          {player && (
            <Button
              variant="primary"
              size="lg"
              className="w-48"
              onClick={handleContinue}
            >
              继续修炼
            </Button>
          )}

          <Button
            variant={player ? 'secondary' : 'primary'}
            size="lg"
            className="w-48"
            onClick={handleNewGame}
          >
            {player ? '重新开始' : '开始修炼'}
          </Button>
        </div>

        {/* 版本号 */}
        <div
          className="mt-20 text-sm animate-fade-in stagger-4"
          style={{ color: 'var(--text-muted)' }}
        >
          <p>版本 0.1.0</p>
        </div>
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(10, 10, 15, 0.85)' }}
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative card-xian max-w-md w-full mx-4 animate-fade-in-scale">
            <h3 className="card-title">确认重新开始?</h3>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
              当前存档将被覆盖，此操作不可撤销。
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
              >
                取消
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleConfirmNewGame}
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
