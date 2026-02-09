import { useState, useEffect } from 'react';
import { saveSyncService } from '../../services/saveSync';
import { type SaveSlot } from '../../services/api';
import { Button, Card, Spinner, Modal, Confirm, message } from '../ui';
import './SaveManager.css';

interface SaveManagerProps {
  onLoad: (slot: number) => void;
  onNewGame: () => void;
  onClose?: () => void;
}

export function SaveManager({ onLoad, onNewGame, onClose }: SaveManagerProps) {
  const [cloudSaves, setCloudSaves] = useState<SaveSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [hasLocalSave, setHasLocalSave] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [deleteSlot, setDeleteSlot] = useState<number | null>(null);

  useEffect(() => {
    loadSaves();
  }, []);

  const loadSaves = async () => {
    setLoading(true);
    try {
      const saves = await saveSyncService.getCloudSaves();
      setCloudSaves(saves);
      setHasLocalSave(saveSyncService.hasLocalSave());
    } catch (error) {
      console.error('Failed to load saves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (slot: number) => {
    setActionLoading(slot);
    try {
      const success = await saveSyncService.loadCloudSave(slot);
      if (success) {
        onLoad(slot);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (slot: number) => {
    setActionLoading(slot);
    try {
      await saveSyncService.deleteCloudSave(slot);
      await loadSaves();
      setDeleteSlot(null);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUploadLocal = async () => {
    const emptySlot = [1, 2, 3].find(
      (s) => !cloudSaves.some((save) => save.slot === s)
    );

    if (!emptySlot) {
      message.warning('没有空闲的存档槽位，请先删除一个存档');
      return;
    }

    setActionLoading(0);
    try {
      const success = await saveSyncService.uploadLocalToCloud(emptySlot);
      if (success) {
        saveSyncService.clearLocalSave();
        await loadSaves();
        setHasLocalSave(false);
        setShowUploadConfirm(false);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}小时${minutes}分钟`;
    return `${minutes}分钟`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card padding="lg" className="save-manager">
        <div className="save-manager-loading">
          <Spinner size="lg" />
          <p>加载存档中...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="save-manager">
      <Confirm
        isOpen={deleteSlot !== null}
        onClose={() => setDeleteSlot(null)}
        onConfirm={() => deleteSlot !== null && handleDelete(deleteSlot)}
        title="删除存档"
        message="确定要删除这个存档吗？此操作不可恢复。"
        confirmText="删除"
        cancelText="取消"
        danger
      />
      <div className="save-manager-header">
        <h2>存档管理</h2>
        {onClose && (
          <button className="save-close-btn" onClick={onClose}>
            &times;
          </button>
        )}
      </div>

      {hasLocalSave && (
        <div className="save-local-notice">
          <div className="save-local-icon">!</div>
          <div className="save-local-text">
            <p>检测到本地存档</p>
            <span>是否上传到云端？上传后可跨设备游玩</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowUploadConfirm(true)}
            disabled={actionLoading !== null}
          >
            上传
          </Button>
        </div>
      )}

      <Modal
        isOpen={showUploadConfirm}
        onClose={() => setShowUploadConfirm(false)}
        title="上传本地存档"
        size="sm"
      >
        <p className="save-confirm-text">
          确定要将本地存档上传到云端吗？上传后本地存档将被清除。
        </p>
        <div className="save-confirm-actions">
          <Button variant="ghost" onClick={() => setShowUploadConfirm(false)}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleUploadLocal}
            loading={actionLoading === 0}
          >
            确认上传
          </Button>
        </div>
      </Modal>

      <div className="save-slots">
        {[1, 2, 3].map((slot) => {
          const save = cloudSaves.find((s) => s.slot === slot);
          const isLoading = actionLoading === slot;

          return (
            <div key={slot} className={`save-slot ${save ? 'has-save' : 'empty'}`}>
              <div className="save-slot-header">
                <span className="save-slot-number">存档 {slot}</span>
                {save && (
                  <span className="save-slot-time">{formatDate(save.updatedAt)}</span>
                )}
              </div>

              {save ? (
                <>
                  <div className="save-slot-info">
                    <h3 className="save-slot-name">{save.name}</h3>
                    <p className="save-slot-checkpoint">{save.checkpoint || '炼气初期'}</p>
                    <p className="save-slot-playtime">游戏时长: {formatPlayTime(save.playTime)}</p>
                  </div>
                  <div className="save-slot-actions">
                    <Button
                      variant="primary"
                      onClick={() => handleLoad(slot)}
                      loading={isLoading}
                      className="save-btn-load"
                    >
                      继续修仙
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteSlot(slot)}
                      disabled={isLoading}
                    >
                      删除
                    </Button>
                  </div>
                </>
              ) : (
                <div className="save-slot-empty">
                  <p>空存档</p>
                  <Button variant="secondary" onClick={onNewGame}>
                    开始新游戏
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="save-manager-footer">
        <Button variant="ghost" size="lg" onClick={onNewGame}>
          开始新游戏
        </Button>
      </div>
    </Card>
  );
}
