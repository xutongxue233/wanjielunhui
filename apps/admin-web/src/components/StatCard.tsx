interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'gold' | 'jade' | 'azure' | 'violet';
  trend?: { value: number; isUp: boolean };
}

export function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="stat-card-title">{title}</div>
      {trend && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--gold-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: trend.isUp ? 'var(--jade)' : 'var(--crimson)',
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ transform: trend.isUp ? '' : 'rotate(180deg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>较昨日</span>
        </div>
      )}
    </div>
  );
}
