import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { sectApi, type SectInfo, type SectMemberInfo } from '../api';

export function SectsPage() {
  const [sects, setSects] = useState<SectInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSect, setSelectedSect] = useState<SectInfo | null>(null);
  const [members, setMembers] = useState<SectMemberInfo[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [stats, setStats] = useState<{ totalSects: number; totalMembers: number; avgMembers: number } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listData, statsData] = await Promise.all([
        sectApi.getList(page, 20, search || undefined),
        sectApi.getStats(),
      ]);
      setSects(listData.sects);
      setTotal(listData.total);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load sects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search]);

  const handleViewMembers = async (sect: SectInfo) => {
    setSelectedSect(sect);
    setMembersLoading(true);
    try {
      const data = await sectApi.getMembers(sect.id);
      setMembers(data.members);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleDisband = async (id: string) => {
    if (!confirm('确定要解散这个门派吗？此操作不可恢复！')) return;
    try {
      await sectApi.disband(id);
      await loadData();
      setSelectedSect(null);
    } catch (err) {
      console.error('Failed to disband sect:', err);
    }
  };

  const handleKickMember = async (memberId: string) => {
    if (!confirm('确定要将该成员踢出门派吗？')) return;
    if (!selectedSect) return;
    try {
      await sectApi.kickMember(selectedSect.id, memberId);
      handleViewMembers(selectedSect);
    } catch (err) {
      console.error('Failed to kick member:', err);
    }
  };

  const roleLabels: Record<string, string> = {
    LEADER: '掌门',
    ELDER: '长老',
    DEACON: '执事',
    MEMBER: '弟子',
  };

  const columns = [
    { key: 'name', title: '门派名称' },
    { key: 'level', title: '等级' },
    { key: 'memberCount', title: '成员数', render: (_: unknown, row: SectInfo) => `${row.memberCount}/${row.maxMembers}` },
    { key: 'totalPower', title: '总战力', render: (v: unknown) => { const n = Number(v); return n.toLocaleString(); } },
    { key: 'joinType', title: '加入方式', render: (v: unknown) => { const s = String(v); return s === 'OPEN' ? '开放' : s === 'APPROVAL' ? '审批' : '邀请'; } },
    { key: 'createdAt', title: '创建时间', render: (v: unknown) => { const s = String(v); return new Date(s).toLocaleDateString(); } },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, row: SectInfo) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn secondary small" onClick={() => handleViewMembers(row)}>
            成员
          </button>
          <button className="admin-btn danger small" onClick={() => handleDisband(row.id)}>
            解散
          </button>
        </div>
      ),
    },
  ];

  const memberColumns = [
    { key: 'playerName', title: '玩家' },
    { key: 'role', title: '职位', render: (v: unknown) => { const s = String(v); return roleLabels[s] || s; } },
    { key: 'playerRealm', title: '境界' },
    { key: 'combatPower', title: '战力', render: (v: unknown) => { const n = Number(v); return n.toLocaleString(); } },
    { key: 'contribution', title: '贡献' },
    { key: 'joinedAt', title: '加入时间', render: (v: unknown) => { const s = String(v); return new Date(s).toLocaleDateString(); } },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, row: SectMemberInfo) => row.role !== 'LEADER' && (
        <button className="admin-btn danger small" onClick={() => handleKickMember(row.playerId)}>
          踢出
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">门派管理</h2>
        <p className="admin-page-desc">查看和管理游戏门派</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>门派总数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>{stats.totalSects}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>门派成员总数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--azure)' }}>{stats.totalMembers}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>平均成员数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--jade)' }}>{stats.avgMembers.toFixed(1)}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          className="admin-input"
          placeholder="搜索门派名..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      <DataTable
        columns={columns}
        data={sects}
        loading={loading}
        pagination={{
          page,
          pageSize: 20,
          total,
          onChange: setPage,
        }}
      />

      {selectedSect && (
        <div className="admin-modal-overlay" onClick={() => setSelectedSect(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 800 }}>
            <div className="admin-modal-header">
              <h3>{selectedSect.name} - 成员列表</h3>
              <button className="admin-modal-close" onClick={() => setSelectedSect(null)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <DataTable
                columns={memberColumns}
                data={members}
                loading={membersLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
