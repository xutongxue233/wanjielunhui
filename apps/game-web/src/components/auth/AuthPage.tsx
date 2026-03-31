import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../services/api';
import { Button, Input, Card } from '../ui';
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

        <Card padding="lg" className="auth-card">
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
            <Input
              label={mode === 'login' ? '账号' : '用户名'}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === 'login' ? '用户名或邮箱' : '请输入用户名'}
              required
              autoComplete="username"
            />

            {mode === 'register' && (
              <Input
                label="邮箱"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                required
                autoComplete="email"
              />
            )}

            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />

            {mode === 'register' && (
              <Input
                label="确认密码"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入密码"
                required
                autoComplete="new-password"
              />
            )}

            {error && <div className="auth-error">{error}</div>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="auth-submit"
            >
              {mode === 'login' ? '进入仙途' : '开启修仙之旅'}
            </Button>
          </form>

          <div className="auth-footer">
            <span className="auth-footer-text">
              {mode === 'login' ? '还没有账号？' : '已有账号？'}
            </span>
            <button className="auth-switch" onClick={switchMode}>
              {mode === 'login' ? '立即注册' : '去登录'}
            </button>
          </div>
        </Card>

        <div className="auth-tips">
          <p>登录后可享受云存档，跨设备继续修仙</p>
        </div>
      </div>
    </div>
  );
}
