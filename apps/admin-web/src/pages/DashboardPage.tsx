import { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { dashboardApi, type DashboardStats, type SystemStatus } from '../api';

const Icon = ({ d }: { d: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [system, setSystem] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, systemData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getSystemStatus(),
        ]);
        setStats(statsData);
        setSystem(systemData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '未知';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    return `${Math.floor(diff / 86400)}天前`;
  };

  const realmColors: Record<string, string> = {
    '炼气': 'var(--text-3)',
    '筑基': 'var(--azure)',
    '金丹': 'var(--jade)',
    '元婴': 'var(--gold)',
    '化神': 'var(--violet)',
    '大乘': 'var(--crimson)',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h2 className="admin-page-title">数据概览</h2>
        <p className="admin-page-desc">实时查看游戏运营数据</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard
          title="在线玩家"
          value={stats?.onlineCount ?? 0}
          icon={<Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
          color="gold"
        />
        <StatCard
          title="总注册用户"
          value={stats?.totalUsers ?? 0}
          icon={<Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
          color="azure"
        />
        <StatCard
          title="今日新增"
          value={stats?.todayRegistrations ?? 0}
          icon={<Icon d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />}
          color="jade"
        />
        <StatCard
          title="今日活跃"
          value={stats?.todayActiveUsers ?? 0}
          icon={<Icon d="M13 10V3L4 14h7v7l9-11h-7z" />}
          color="violet"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 16 }}>最近登录</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {stats?.recentLogins && stats.recentLogins.length > 0 ? (
              stats.recentLogins.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 0',
                    borderBottom: i < stats.recentLogins.length - 1 ? '1px solid var(--gold-border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34,
                      borderRadius: 'var(--radius)',
                      background: `linear-gradient(135deg, ${realmColors[p.realm] || 'var(--gold)'}, ${realmColors[p.realm] || 'var(--gold)'}aa)`,
                      color: 'var(--bg-void)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}>
                      {p.playerName[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>{p.playerName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{p.realm}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{formatTime(p.lastLoginAt)}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>暂无登录记录</div>
            )}
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 16 }}>系统状态</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-2)' }}>内存使用</span>
                <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>
                  {system?.memoryUsage.heapUsed ?? 0}MB / {system?.memoryUsage.heapTotal ?? 0}MB
                </span>
              </div>
              <div className="admin-progress">
                <div
                  className="admin-progress-fill"
                  style={{ width: `${system?.memoryUsage.percentage ?? 0}%`, background: 'var(--gold)' }}
                />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-2)' }}>数据库连接</span>
                <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>正常</span>
              </div>
              <div className="admin-progress">
                <div className="admin-progress-fill" style={{ width: '100%', background: 'var(--jade)' }} />
              </div>
            </div>
          </div>
          <div className="admin-divider" style={{ margin: '20px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>运行时间</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-1)', fontWeight: 600, marginTop: 4 }}>
                {system?.uptimeFormatted ?? '未知'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>服务器版本</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-1)', fontWeight: 600, marginTop: 4 }}>
                v{system?.version ?? '1.0.0'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
