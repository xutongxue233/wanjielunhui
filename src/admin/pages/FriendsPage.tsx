import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { friendApi, type FriendRelation } from '../api';

export function FriendsPage() {
  const [relations, setRelations] = useState<FriendRelation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalRelations: number; avgFriends: number } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listData, statsData] = await Promise.all([
        friendApi.getList(page, 20, search || undefined),
        friendApi.getStats(),
      ]);
      setRelations(listData.relations);
      setTotal(listData.total);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load friends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个好友关系吗？')) return;
    try {
      await friendApi.delete(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete relation:', err);
    }
  };

  const columns = [
    { key: 'playerName', title: '玩家' },
    { key: 'playerRealm', title: '玩家境界' },
    { key: 'friendName', title: '好友' },
    { key: 'friendRealm', title: '好友境界' },
    { key: 'intimacy', title: '亲密度' },
    { key: 'createdAt', title: '添加时间', render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, row: FriendRelation) => (
        <button className="admin-btn danger small" onClick={() => handleDelete(row.id)}>
          删除
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">好友关系管理</h2>
        <p className="admin-page-desc">查看和管理玩家好友关系</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>总好友关系</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>{stats.totalRelations}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>平均好友数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--azure)' }}>{stats.avgFriends.toFixed(1)}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          className="admin-input"
          placeholder="搜索玩家名..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      <DataTable
        columns={columns}
        data={relations}
        loading={loading}
        pagination={{
          page,
          pageSize: 20,
          total,
          onChange: setPage,
        }}
      />
    </div>
  );
}
