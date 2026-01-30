interface Column<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns, data, loading, emptyText = '暂无数据', onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="admin-spinner" style={{ margin: '0 auto 1rem' }} />
          <div style={{ color: 'var(--text-3)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            载入中...
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="admin-empty">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: '0 auto 1rem', opacity: 0.3 }}
        >
          <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <div style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>{emptyText}</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                animation: `ink-spread 0.4s var(--ease-flow) ${idx * 50}ms both`,
              }}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(item)
                    : (item as Record<string, unknown>)[col.key]?.toString() ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
