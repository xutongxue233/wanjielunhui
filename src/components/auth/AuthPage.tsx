import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../services/api';
import './AuthPage.css';

type Mode = 'login' | 'register';

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('两次输入的密码不一致');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('密码至少需要6个字符');
          setLoading(false);
          return;
        }

        await authApi.register(username, email, password);
        // 注册成功后自动登录
        const loginRes = await authApi.login(username, password);
        setAuth(loginRes.user, loginRes.accessToken, loginRes.refreshToken);
      } else {
        const res = await authApi.login(username, password);
        setAuth(res.user, res.accessToken, res.refreshToken);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">万界轮回</h1>
          <p className="auth-subtitle">踏入修仙之路</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              登录
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">
                {mode === 'login' ? '账号' : '用户名'}
              </label>
              <input
                type="text"
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'login' ? '用户名或邮箱' : '请输入用户名'}
                required
                autoComplete="username"
              />
            </div>

            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-label">邮箱</label>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  required
                  autoComplete="email"
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">密码</label>
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-label">确认密码</label>
                <input
                  type="password"
                  className="auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-loading" />
              ) : mode === 'login' ? (
                '进入仙途'
              ) : (
                '开启修仙之旅'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span className="auth-footer-text">
              {mode === 'login' ? '还没有账号？' : '已有账号？'}
            </span>
            <button className="auth-switch" onClick={switchMode}>
              {mode === 'login' ? '立即注册' : '去登录'}
            </button>
          </div>
        </div>

        <div className="auth-tips">
          <p>登录后可享受云存档，跨设备继续修仙</p>
        </div>
      </div>
    </div>
  );
}
