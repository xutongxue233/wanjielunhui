import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { rankingApi, type RankingEntry } from '../api';

type RankingType = 'COMBAT_POWER' | 'REALM' | 'REINCARNATION' | 'PVP_RATING' | 'WEALTH';

const RANKING_TYPES: { value: RankingType; label: string }[] = [
  { value: 'COMBAT_POWER', label: '战力榜' },
  { value: 'REALM', label: '境界榜' },
  { value: 'REINCARNATION', label: '轮回榜' },
  { value: 'PVP_RATING', label: 'PVP榜' },
  { value: 'WEALTH', label: '财富榜' },
];

export function RankingPage() {
  const [type, setType] = useState<RankingType>('COMBAT_POWER');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await rankingApi.getList(type, page);
      setEntries(data.entries);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to load ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [type, page]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await rankingApi.syncAll();
      await loadData();
    } catch (err) {
      console.error('Failed to sync ranking:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleRebuild = async () => {
    if (!confirm(`确定要重建${RANKING_TYPES.find(t => t.value === type)?.label}吗？`)) return;
    setSyncing(true);
    try {
      await rankingApi.rebuild(type);
      await loadData();
    } catch (err) {
      console.error('Failed to rebuild ranking:', err);
    } finally {
      setSyncing(false);
    }
  };

  const columns = [
    { key: 'rank', title: '排名', width: 80 },
    { key: 'playerName', title: '玩家' },
    { key: 'playerRealm', title: '境界' },
    { key: 'score', title: '分数', render: (v: number) => v.toLocaleString() },
    { key: 'sectName', title: '门派', render: (v: string) => v || '-' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">排行榜管理</h2>
        <p className="admin-page-desc">查看和管理游戏排行榜数据</p>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {RANKING_TYPES.map(t => (
            <button
              key={t.value}
              className={`admin-btn ${type === t.value ? 'primary' : 'secondary'}`}
              onClick={() => { setType(t.value); setPage(1); }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button
          className="admin-btn secondary"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? '同步中...' : '全量同步'}
        </button>
        <button
          className="admin-btn secondary"
          onClick={handleRebuild}
          disabled={syncing}
        >
          重建排行榜
        </button>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        loading={loading}
        pagination={{
          page,
          pageSize: 50,
          total,
          onChange: setPage,
        }}
      />
    </div>
  );
}
