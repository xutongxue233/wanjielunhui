import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { activityApi, type Activity, type CreateActivityInput } from '../api';

export function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateActivityInput>({
    name: '',
    description: '',
    type: 'login',
    config: {},
    startAt: '',
    endAt: '',
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await activityApi.getAll();
      setItems(res.activities || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await activityApi.create({
        ...form,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
      });
      setShowModal(false);
      setForm({ name: '', description: '', type: 'login', config: {}, startAt: '', endAt: '' });
      load();
    } catch (err) {
      alert('创建失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此活动吗？')) return;
    try {
      await activityApi.delete(id);
      load();
    } catch (err) {
      alert('删除失败');
    }
  };

  const columns = [
    { key: 'name', title: '活动名称' },
    { key: 'type', title: '类型' },
    { key: 'startAt', title: '开始时间', render: (item: Activity) => new Date(item.startAt).toLocaleDateString() },
    { key: 'endAt', title: '结束时间', render: (item: Activity) => new Date(item.endAt).toLocaleDateString() },
    {
      key: 'isActive',
      title: '状态',
      render: (item: Activity) => (
        <span className={`admin-badge ${item.isActive ? 'jade' : 'muted'}`}>
          {item.isActive ? '进行中' : '已结束'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      render: (item: Activity) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="admin-btn-inline crimson" onClick={() => handleDelete(item.id)}>删除</button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="admin-page-title">活动管理</h2>
          <p className="admin-page-desc">管理游戏活动</p>
        </div>
        <button className="admin-btn admin-btn-gold" onClick={() => setShowModal(true)}>
          创建活动
        </button>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <DataTable columns={columns} data={items} loading={loading} />
      </div>

      {showModal && (
        <div className="admin-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 24 }}>
              创建活动
            </h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="admin-label">活动名称</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="admin-label">活动描述</label>
                <textarea
                  className="admin-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ height: 80 }}
                  required
                />
              </div>
              <div>
                <label className="admin-label">活动类型</label>
                <select
                  className="admin-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="login">登录奖励</option>
                  <option value="buff">增益活动</option>
                  <option value="exchange">兑换活动</option>
                  <option value="rank">排行活动</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="admin-label">开始时间</label>
                  <input
                    type="datetime-local"
                    className="admin-input"
                    value={form.startAt}
                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="admin-label">结束时间</label>
                  <input
                    type="datetime-local"
                    className="admin-input"
                    value={form.endAt}
                    onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-ghost">取消</button>
                <button type="submit" className="admin-btn admin-btn-gold" disabled={saving}>
                  {saving ? '创建中...' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
