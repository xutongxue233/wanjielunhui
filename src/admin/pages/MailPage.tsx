import { useState } from 'react';
import { message } from '../../components/ui';

export function MailPage() {
  const [form, setForm] = useState({
    targetType: 'all',
    targetIds: '',
    title: '',
    content: '',
    attachments: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      message.success('邮件发送成功');
      setSending(false);
      setForm({ targetType: 'all', targetIds: '', title: '', content: '', attachments: '' });
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">邮件群发</h2>
        <p className="admin-page-desc">向玩家发送系统邮件</p>
      </div>

      <div className="admin-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Target */}
          <div>
            <label className="admin-label">发送目标</label>
            <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-1)', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  className="admin-radio"
                  value="all"
                  checked={form.targetType === 'all'}
                  onChange={(e) => setForm({ ...form, targetType: e.target.value })}
                />
                全服玩家
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-1)', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  className="admin-radio"
                  value="specific"
                  checked={form.targetType === 'specific'}
                  onChange={(e) => setForm({ ...form, targetType: e.target.value })}
                />
                指定玩家
              </label>
            </div>
          </div>

          {form.targetType === 'specific' && (
            <div>
              <label className="admin-label">玩家ID列表</label>
              <textarea
                value={form.targetIds}
                onChange={(e) => setForm({ ...form, targetIds: e.target.value })}
                className="admin-textarea"
                style={{ height: 80 }}
                placeholder="每行一个玩家ID"
              />
            </div>
          )}

          <div>
            <label className="admin-label">邮件标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
              placeholder="请输入邮件标题"
              required
            />
          </div>

          <div>
            <label className="admin-label">邮件内容</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="admin-textarea"
              style={{ height: 140 }}
              placeholder="请输入邮件内容"
              required
            />
          </div>

          <div>
            <label className="admin-label">附件 (JSON格式)</label>
            <textarea
              value={form.attachments}
              onChange={(e) => setForm({ ...form, attachments: e.target.value })}
              className="admin-textarea"
              style={{ height: 100, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              placeholder='[{"type": "spiritStones", "amount": 1000}]'
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={sending} className="admin-btn admin-btn-gold" style={{ minWidth: 120 }}>
              {sending ? '发送中...' : '发送邮件'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
