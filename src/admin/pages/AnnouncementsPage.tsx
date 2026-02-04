import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { announcementApi, type Announcement, type CreateAnnouncementInput } from '../api';

export function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await announcementApi.getAll();
      setItems(res.announcements);
    } catch { /* empty */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此公告?')) return;
    try { await announcementApi.delete(id); load(); } catch { alert('删除失败'); }
  };

  const columns = [
    { key: 'title', title: '标题' },
    { key: 'type', title: '类型' },
    { key: 'priority', title: '优先级' },
    {
      key: 'isActive',
      title: '状态',
      render: (_: unknown, row: Announcement) => (
        <span className={`admin-badge ${row.isActive ? 'jade' : 'muted'}`}>
          {row.isActive ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: '创建时间',
      render: (_: unknown, row: Announcement) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, row: Announcement) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="admin-btn-inline azure" onClick={(e) => { e.stopPropagation(); setEditing(row); setShowModal(true); }}>编辑</button>
          <button className="admin-btn-inline crimson" onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}>删除</button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="admin-page-title">公告管理</h2>
          <p className="admin-page-desc">管理游戏内公告</p>
        </div>
        <button className="admin-btn admin-btn-gold" onClick={() => { setEditing(null); setShowModal(true); }}>
          发布公告
        </button>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <DataTable columns={columns} data={items} loading={loading} />
      </div>

      {showModal && (
        <AnnouncementModal
          item={editing}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}

function AnnouncementModal({ item, onClose, onSave }: { item: Announcement | null; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState<CreateAnnouncementInput>({
    title: item?.title ?? '',
    content: item?.content ?? '',
    type: item?.type ?? 'normal',
    priority: item?.priority ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (item) await announcementApi.update(item.id, form);
      else await announcementApi.create(form);
      onSave();
    } catch { alert('保存失败'); } finally { setSaving(false); }
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>
          {item ? '编辑公告' : '发布公告'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="admin-label">标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
              required
            />
          </div>
          <div>
            <label className="admin-label">内容</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="admin-textarea"
              style={{ height: 120 }}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="admin-label">类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="admin-select"
              >
                <option value="normal">普通</option>
                <option value="important">重要</option>
                <option value="maintenance">维护</option>
                <option value="event">活动</option>
              </select>
            </div>
            <div>
              <label className="admin-label">优先级</label>
              <input
                type="number"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) })}
                className="admin-input"
                min="0"
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <button type="button" onClick={onClose} className="admin-btn admin-btn-ghost">取消</button>
            <button type="submit" disabled={saving} className="admin-btn admin-btn-gold">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
