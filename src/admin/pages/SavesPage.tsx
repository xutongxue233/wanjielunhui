import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { saveApi, type GameSave, type GameSaveDetail, type SaveStats } from '../api';

function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
}

export function SavesPage() {
  const [saves, setSaves] = useState<GameSave[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<SaveStats | null>(null);
  const [selectedSave, setSelectedSave] = useState<GameSaveDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const pageSize = 20;

  const load = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        saveApi.getList(page, pageSize, search || undefined),
        saveApi.getStats(),
      ]);
      setSaves(listRes.saves);
      setTotal(listRes.total);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load saves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该存档吗？此操作不可恢复！')) return;
    try {
      await saveApi.delete(id);
      load();
    } catch (err) {
      alert('删除失败');
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const detail = await saveApi.getById(id);
      setSelectedSave(detail);
      setShowDetail(true);
    } catch (err) {
      alert('获取详情失败');
    }
  };

  const columns = [
    {
      key: 'player',
      title: '玩家',
      render: (_: unknown, item: GameSave) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: 'var(--gold-light)', fontWeight: 500 }}>{item.player.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
            @{item.player.username}
          </span>
        </div>
      ),
    },
    {
      key: 'name',
      title: '存档名',
      render: (_: unknown, item: GameSave) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="admin-badge gold">槽位 {item.slot}</span>
          <span>{item.name}</span>
        </div>
      ),
    },
    {
      key: 'realm',
      title: '境界',
      render: (_: unknown, item: GameSave) => (
        <span style={{ color: 'var(--jade-light)' }}>
          {item.checkpoint || `${item.player.realm} · ${item.player.realmStage}`}
        </span>
      ),
    },
    {
      key: 'playTime',
      title: '游戏时长',
      render: (_: unknown, item: GameSave) => formatPlayTime(item.playTime),
    },
    {
      key: 'updatedAt',
      title: '最后更新',
      render: (_: unknown, item: GameSave) => new Date(item.updatedAt).toLocaleString(),
    },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, item: GameSave) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="admin-btn-inline azure" onClick={() => handleViewDetail(item.id)}>
            详情
          </button>
          <button className="admin-btn-inline crimson" onClick={() => handleDelete(item.id)}>
            删除
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">存档管理</h2>
        <p className="admin-page-desc">查看和管理玩家游戏存档</p>
      </div>

      {/* 统计卡片 */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div className="stat-card gold">
            <div className="stat-card-value">{stats.totalSaves}</div>
            <div className="stat-card-title">总存档数</div>
          </div>
          <div className="stat-card jade">
            <div className="stat-card-value">{stats.recentSaves}</div>
            <div className="stat-card-title">24小时内更新</div>
          </div>
          <div className="stat-card azure">
            <div className="stat-card-value">{formatPlayTime(stats.avgPlayTime)}</div>
            <div className="stat-card-title">平均游戏时长</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          placeholder="搜索玩家名或存档名..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="admin-input"
          style={{ maxWidth: 320 }}
        />
        <button className="admin-btn admin-btn-gold" onClick={handleSearch}>
          搜索
        </button>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <DataTable columns={columns} data={saves} loading={loading} />
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <button
            className="admin-btn admin-btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </button>
          <span style={{ color: 'var(--text-2)', padding: '0.5rem 1rem' }}>
            {page} / {totalPages}
          </span>
          <button
            className="admin-btn admin-btn-ghost"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </button>
        </div>
      )}

      {/* 详情弹窗 */}
      {showDetail && selectedSave && (
        <div className="admin-overlay" onClick={() => setShowDetail(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: 700, maxHeight: '80vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: 'var(--gold-light)', marginBottom: 16, fontFamily: 'var(--font-display)' }}>
              存档详情
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <div className="admin-label">玩家</div>
                <div style={{ color: 'var(--text-1)' }}>{selectedSave.player.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>@{selectedSave.player.username}</div>
              </div>
              <div>
                <div className="admin-label">境界</div>
                <div style={{ color: 'var(--jade-light)' }}>
                  {selectedSave.player.realm} · {selectedSave.player.realmStage}
                </div>
              </div>
              <div>
                <div className="admin-label">存档槽位</div>
                <div>槽位 {selectedSave.slot} - {selectedSave.name}</div>
              </div>
              <div>
                <div className="admin-label">游戏时长</div>
                <div>{formatPlayTime(selectedSave.playTime)}</div>
              </div>
              <div>
                <div className="admin-label">版本</div>
                <div>v{selectedSave.version}</div>
              </div>
              <div>
                <div className="admin-label">校验和</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                  {selectedSave.checksum.slice(0, 16)}...
                </div>
              </div>
              <div>
                <div className="admin-label">创建时间</div>
                <div>{new Date(selectedSave.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="admin-label">更新时间</div>
                <div>{new Date(selectedSave.updatedAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="admin-divider" style={{ margin: '16px 0' }} />

            <div style={{ marginBottom: 16 }}>
              <div className="admin-label">玩家数据预览</div>
              <pre
                style={{
                  background: 'var(--bg-ink)',
                  padding: 12,
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-2)',
                  maxHeight: 200,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(selectedSave.playerData), null, 2);
                  } catch {
                    return selectedSave.playerData;
                  }
                })()}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowDetail(false)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
