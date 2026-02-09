import React from 'react';
import { Modal, Button } from '../ui';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import './DeathDialog.css';

interface DeathDialogProps {
  isOpen: boolean;
}

export const DeathDialog: React.FC<DeathDialogProps> = ({ isOpen }) => {
  const player = usePlayerStore((state) => state.player);
  const reincarnate = usePlayerStore((state) => state.reincarnate);
  const resetPlayer = usePlayerStore((state) => state.resetPlayer);
  const setPhase = useGameStore((state) => state.setPhase);

  if (!player) return null;

  const handleReincarnate = () => {
    reincarnate();
  };

  const handleGiveUp = () => {
    resetPlayer();
    setPhase('title');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // 不允许关闭
      title="道消身陨"
      size="md"
    >
      <div className="death-dialog">
        <div className="death-dialog-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M12 8V12" strokeLinecap="round" />
            <path d="M12 16H12.01" strokeLinecap="round" />
          </svg>
        </div>

        <div className="death-dialog-content">
          <p className="death-dialog-message">
            道友 <span className="death-dialog-name">{player.name}</span> 寿元耗尽，神魂消散...
          </p>
          <p className="death-dialog-hint">
            天道轮回，万物皆有转生之机。是否选择转世重修？
          </p>
          <div className="death-dialog-info">
            <div className="death-dialog-info-item">
              <span className="death-dialog-info-label">转世保留:</span>
              <span className="death-dialog-info-value">10%悟性 + 10%气运</span>
            </div>
          </div>
        </div>

        <div className="death-dialog-actions">
          <Button
            variant="primary"
            onClick={handleReincarnate}
            className="death-dialog-btn-reincarnate"
          >
            转世重修
          </Button>
          <Button
            variant="ghost"
            onClick={handleGiveUp}
            className="death-dialog-btn-giveup"
          >
            放弃此生
          </Button>
        </div>
      </div>
    </Modal>
  );
};
