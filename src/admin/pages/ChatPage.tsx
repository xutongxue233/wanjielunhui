import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { chatApi, type ChatMessage } from '../api';

type Channel = 'WORLD' | 'SECT' | 'PRIVATE';

const CHANNELS: { value: Channel; label: string }[] = [
  { value: 'WORLD', label: '世界频道' },
  { value: 'SECT', label: '门派频道' },
  { value: 'PRIVATE', label: '私聊' },
];

export function ChatPage() {
  const [channel, setChannel] = useState<Channel>('WORLD');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalMessages: number; todayMessages: number } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listData, statsData] = await Promise.all([
        chatApi.getList(channel, page),
        chatApi.getStats(),
      ]);
      setMessages(listData.messages);
      setTotal(listData.total);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load chat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [channel, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条消息吗？')) return;
    try {
      await chatApi.delete(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleClearChannel = async () => {
    if (!confirm(`确定要清空${CHANNELS.find(c => c.value === channel)?.label}的所有消息吗？`)) return;
    try {
      await chatApi.clearChannel(channel);
      await loadData();
    } catch (err) {
      console.error('Failed to clear channel:', err);
    }
  };

  const columns = [
    { key: 'senderName', title: '发送者' },
    { key: 'senderRealm', title: '境界' },
    { key: 'content', title: '内容', render: (v: string) => v.length > 50 ? v.slice(0, 50) + '...' : v },
    { key: 'createdAt', title: '时间', render: (v: string) => new Date(v).toLocaleString() },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, row: ChatMessage) => (
        <button className="admin-btn danger small" onClick={() => handleDelete(row.id)}>
          删除
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">聊天管理</h2>
        <p className="admin-page-desc">查看和管理游戏聊天记录</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>总消息数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>{stats.totalMessages}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>今日消息</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--azure)' }}>{stats.todayMessages}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {CHANNELS.map(c => (
            <button
              key={c.value}
              className={`admin-btn ${channel === c.value ? 'primary' : 'secondary'}`}
              onClick={() => { setChannel(c.value); setPage(1); }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button className="admin-btn danger" onClick={handleClearChannel}>
          清空频道
        </button>
      </div>

      <DataTable
        columns={columns}
        data={messages}
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
