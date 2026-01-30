import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { pvpApi, type PvpMatch, type PvpSeason } from '../api';

type TabType = 'matches' | 'seasons';

export function PvpPage() {
  const [tab, setTab] = useState<TabType>('matches');
  const [matches, setMatches] = useState<PvpMatch[]>([]);
  const [seasons, setSeasons] = useState<PvpSeason[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalMatches: number;
    todayMatches: number;
    activeQueue: number;
    currentSeason: string;
  } | null>(null);
  const [showSeasonForm, setShowSeasonForm] = useState(false);
  const [seasonForm, setSeasonForm] = useState({ name: '', startAt: '', endAt: '', rewards: '{}' });

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await pvpApi.getStats();
      setStats(statsData);

      if (tab === 'matches') {
        const data = await pvpApi.getMatches(page);
        setMatches(data.matches);
        setTotal(data.total);
      } else {
        const data = await pvpApi.getSeasons();
        setSeasons(data.seasons);
        setTotal(data.seasons.length);
      }
    } catch (err) {
      console.error('Failed to load pvp:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tab, page]);

  const handleCreateSeason = async () => {
    try {
      await pvpApi.createSeason({
        name: seasonForm.name,
        startAt: seasonForm.startAt,
        endAt: seasonForm.endAt,
        rewards: JSON.parse(seasonForm.rewards),
      });
      setShowSeasonForm(false);
      setSeasonForm({ name: '', startAt: '', endAt: '', rewards: '{}' });
      await loadData();
    } catch (err) {
      console.error('Failed to create season:', err);
    }
  };

  const handleActivateSeason = async (id: number) => {
    if (!confirm('确定要激活这个赛季吗？当前赛季将被关闭。')) return;
    try {
      await pvpApi.activateSeason(id);
      await loadData();
    } catch (err) {
      console.error('Failed to activate season:', err);
    }
  };

  const handleEndSeason = async (id: number) => {
    if (!confirm('确定要结束这个赛季吗？将发放赛季奖励并重置积分。')) return;
    try {
      await pvpApi.endSeason(id);
      await loadData();
    } catch (err) {
      console.error('Failed to end season:', err);
    }
  };

  const resultLabels: Record<string, string> = { WIN: '胜利', LOSE: '失败', DRAW: '平局' };

  const matchColumns = [
    { key: 'playerName', title: '玩家' },
    { key: 'opponentName', title: '对手' },
    { key: 'result', title: '结果', render: (v: string) => resultLabels[v] || v },
    { key: 'playerRatingChange', title: '积分变化', render: (v: number) => v > 0 ? `+${v}` : v },
    { key: 'duration', title: '时长(秒)' },
    { key: 'createdAt', title: '时间', render: (v: string) => new Date(v).toLocaleString() },
  ];

  const seasonColumns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '赛季名称' },
    { key: 'startAt', title: '开始时间', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'endAt', title: '结束时间', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'isActive', title: '状态', render: (v: boolean) => v ? '进行中' : '未激活' },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, row: PvpSeason) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {!row.isActive && (
            <button className="admin-btn primary small" onClick={() => handleActivateSeason(row.id)}>
              激活
            </button>
          )}
          {row.isActive && (
            <button className="admin-btn danger small" onClick={() => handleEndSeason(row.id)}>
              结束
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">PVP管理</h2>
        <p className="admin-page-desc">查看和管理PVP对战与赛季</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>总对战数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>{stats.totalMatches}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>今日对战</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--azure)' }}>{stats.todayMatches}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>匹配队列</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--jade)' }}>{stats.activeQueue}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>当前赛季</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--violet)' }}>{stats.currentSeason || '无'}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`admin-btn ${tab === 'matches' ? 'primary' : 'secondary'}`}
            onClick={() => { setTab('matches'); setPage(1); }}
          >
            对战记录
          </button>
          <button
            className={`admin-btn ${tab === 'seasons' ? 'primary' : 'secondary'}`}
            onClick={() => { setTab('seasons'); setPage(1); }}
          >
            赛季管理
          </button>
        </div>
        <div style={{ flex: 1 }} />
        {tab === 'seasons' && (
          <button className="admin-btn primary" onClick={() => setShowSeasonForm(true)}>
            创建赛季
          </button>
        )}
      </div>

      <DataTable
        columns={tab === 'matches' ? matchColumns : seasonColumns}
        data={tab === 'matches' ? matches : seasons}
        loading={loading}
        pagination={tab === 'matches' ? {
          page,
          pageSize: 20,
          total,
          onChange: setPage,
        } : undefined}
      />

      {showSeasonForm && (
        <div className="admin-modal-overlay" onClick={() => setShowSeasonForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>创建赛季</h3>
              <button className="admin-modal-close" onClick={() => setShowSeasonForm(false)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="admin-label">赛季名称</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={seasonForm.name}
                    onChange={e => setSeasonForm({ ...seasonForm, name: e.target.value })}
                    placeholder="第一赛季"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">开始时间</label>
                    <input
                      type="datetime-local"
                      className="admin-input"
                      value={seasonForm.startAt}
                      onChange={e => setSeasonForm({ ...seasonForm, startAt: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">结束时间</label>
                    <input
                      type="datetime-local"
                      className="admin-input"
                      value={seasonForm.endAt}
                      onChange={e => setSeasonForm({ ...seasonForm, endAt: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">奖励配置 (JSON)</label>
                  <textarea
                    className="admin-input"
                    value={seasonForm.rewards}
                    onChange={e => setSeasonForm({ ...seasonForm, rewards: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn secondary" onClick={() => setShowSeasonForm(false)}>取消</button>
              <button className="admin-btn primary" onClick={handleCreateSeason}>创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
