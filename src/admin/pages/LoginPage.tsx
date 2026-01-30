import { useState } from 'react';
import { useAdminStore } from '../stores/adminStore';
import { authApi } from '../api';
import '../styles/admin.css';

export function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAdminStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.login(account, password);
      if (result.user.role !== 'ADMIN' && result.user.role !== 'GM') {
        setError('权限不足，仅管理员可登录');
        return;
      }
      login(result.user, result.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '25%',
        width: 500, height: 500,
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: '20%',
        width: 400, height: 400,
        background: 'radial-gradient(ellipse at center, rgba(77,171,138,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Mountain wave */}
      <svg
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', opacity: 0.12 }}
        viewBox="0 0 1440 320" preserveAspectRatio="none"
      >
        <path fill="var(--gold)" d="M0,160L60,176C120,192,240,224,360,213.3C480,203,600,149,720,138.7C840,128,960,160,1080,186.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L0,320Z" />
      </svg>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          position: 'relative',
          zIndex: 1,
          animation: 'admin-scalein 0.4s ease',
        }}
      >
        <div className="admin-modal" style={{ padding: '2.5rem 2rem' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 1rem',
                borderRadius: 'var(--radius)',
                background: 'var(--gold-wash2)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--gold-light)', marginBottom: 4 }}>
              万界轮回
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', letterSpacing: '0.1em' }}>
              管理后台
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="admin-label">账号</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="admin-input"
                placeholder="用户名或邮箱"
                required
              />
            </div>
            <div>
              <label className="admin-label">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  background: 'var(--crimson-wash)',
                  border: '1px solid rgba(191,69,69,0.25)',
                  color: 'var(--crimson)',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-gold"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', marginTop: 4 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div className="admin-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  登录中...
                </span>
              ) : '登录'}
            </button>
          </form>

          {/* Footer deco */}
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold-border))' }} />
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold-border)' }} />
            <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg, var(--gold-border), transparent)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
