import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { userApi, type User } from '../api';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const load = async () => {
    setLoading(true);
    try {
      const res = await userApi.getList(page, pageSize, search || undefined);
      setUsers(res.users);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load users:', err);
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

  const handleBan = async (id: string) => {
    if (!confirm('确定要封禁该用户吗？')) return;
    try {
      await userApi.ban(id);
      load();
    } catch (err) {
      alert('操作失败');
    }
  };

  const handleUnban = async (id: string) => {
    if (!confirm('确定要解封该用户吗？')) return;
    try {
      await userApi.unban(id);
      load();
    } catch (err) {
      alert('操作失败');
    }
  };

  const columns = [
    { key: 'username', title: '用户名' },
    {
      key: 'player',
      title: '游戏角色',
      render: (_: unknown, item: User) => item.player ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: 'var(--gold-light)', fontWeight: 500 }}>{item.player.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
            {item.player.realm} · {item.player.realmStage}
          </span>
        </div>
      ) : (
        <span style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>未创建角色</span>
      ),
    },
    {
      key: 'role',
      title: '权限',
      render: (_: unknown, item: User) => (
        <span className={`admin-badge ${item.role === 'ADMIN' ? 'violet' : item.role === 'GM' ? 'azure' : 'muted'}`}>
          {item.role === 'ADMIN' ? '管理员' : item.role === 'GM' ? '游戏管理' : '玩家'}
        </span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      render: (_: unknown, item: User) => (
        <span className={`admin-badge ${item.status === 'ACTIVE' ? 'jade' : 'crimson'}`}>
          {item.status === 'ACTIVE' ? '正常' : '封禁'}
        </span>
      ),
    },
    {
      key: 'lastLoginAt',
      title: '最后登录',
      render: (_: unknown, item: User) => item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString() : '从未登录',
    },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, item: User) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {item.status === 'ACTIVE' ? (
            <button className="admin-btn-inline crimson" onClick={() => handleBan(item.id)}>封禁</button>
          ) : (
            <button className="admin-btn-inline jade" onClick={() => handleUnban(item.id)}>解封</button>
          )}
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">用户管理</h2>
        <p className="admin-page-desc">查看和管理游戏用户 (共 {total} 人)</p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          placeholder="搜索用户名或邮箱..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="admin-input"
          style={{ maxWidth: 320 }}
        />
        <button className="admin-btn admin-btn-gold" onClick={handleSearch}>搜索</button>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <DataTable columns={columns} data={users} loading={loading} />
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
    </div>
  );
}
