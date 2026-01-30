import { useAdminStore } from '../stores/adminStore';
import type { TabType } from '../AdminApp';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const NAV: { id: TabType; label: string; d: string }[] = [
  { id: 'dashboard', label: '数据概览', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { id: 'users', label: '用户管理', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'saves', label: '存档管理', d: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
  { id: 'ranking', label: '排行榜', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'friends', label: '好友管理', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'sects', label: '门派管理', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'chat', label: '聊天管理', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { id: 'market', label: '交易市场', d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'pvp', label: 'PVP管理', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'announcements', label: '公告管理', d: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
  { id: 'activities', label: '活动管理', d: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  { id: 'mail', label: '邮件群发', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const logout = useAdminStore((s) => s.logout);
  const user = useAdminStore((s) => s.user);

  return (
    <aside
      style={{
        width: 280,
        background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-abyss) 100%)',
        borderRight: '1px solid var(--gold-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* 装饰边线 */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '10%',
          bottom: '10%',
          width: 1,
          background: 'linear-gradient(180deg, transparent, var(--gold-dim), transparent)',
          opacity: 0.5,
        }}
      />

      {/* Brand */}
      <div style={{ padding: '2rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--gold-wash3), var(--gold-wash))',
              border: '1px solid var(--gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold)',
              position: 'relative',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            {/* 光晕效果 */}
            <div
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: 'var(--radius-lg)',
                background: 'radial-gradient(circle, var(--gold-wash2), transparent)',
                zIndex: -1,
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                color: 'var(--gold-light)',
                letterSpacing: '0.08em',
              }}
            >
              万界轮回
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 4, letterSpacing: '0.15em' }}>
              管理后台
            </div>
          </div>
        </div>
      </div>

      <div className="admin-divider" style={{ margin: '0 1.25rem' }} />

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        {NAV.map((item, idx) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-cn)',
                fontSize: '0.9rem',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--gold-light)' : 'var(--text-2)',
                background: active
                  ? 'linear-gradient(90deg, var(--gold-wash2), transparent)'
                  : 'transparent',
                position: 'relative',
                transition: 'all 0.3s var(--ease-silk)',
                textAlign: 'left',
                marginBottom: 4,
                animation: `ink-spread 0.4s var(--ease-flow) ${idx * 60}ms both`,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--gold-wash)';
                  e.currentTarget.style.color = 'var(--text-1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-2)';
                }
              }}
            >
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    bottom: '15%',
                    width: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(180deg, var(--gold), var(--gold-dim))',
                    boxShadow: '0 0 8px var(--gold)',
                  }}
                />
              )}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }}
              >
                <path d={item.d} />
              </svg>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="admin-divider" style={{ margin: '0 1.25rem' }} />

      {/* User */}
      <div style={{ padding: '1rem' }}>
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(145deg, var(--bg-surface), var(--bg-ink))',
            border: '1px solid var(--gold-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 顶部装饰线 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--gold-dim), transparent)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius)',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dim))',
                color: 'var(--bg-abyss)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(212, 168, 83, 0.3)',
              }}
            >
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-1)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.username || '管理员'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--gold-dim)', marginTop: 2 }}>
                {user?.role === 'ADMIN' ? '超级管理员' : '游戏管理员'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              width: '100%',
              marginTop: 12,
              padding: '0.5rem',
              background: 'transparent',
              border: '1px solid var(--crimson-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--crimson)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-cn)',
              cursor: 'pointer',
              transition: 'all 0.25s var(--ease-silk)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--crimson-wash)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(196, 82, 74, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            退出登录
          </button>
        </div>
      </div>
    </aside>
  );
}
