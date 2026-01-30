import { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { marketApi, type MarketListing, type TradeLog } from '../api';

type TabType = 'listings' | 'trades';

export function MarketPage() {
  const [tab, setTab] = useState<TabType>('listings');
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [trades, setTrades] = useState<TradeLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    activeListings: number;
    totalTrades: number;
    todayVolume: number;
    totalFees: number;
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await marketApi.getStats();
      setStats(statsData);

      if (tab === 'listings') {
        const data = await marketApi.getListings(page);
        setListings(data.listings);
        setTotal(data.total);
      } else {
        const data = await marketApi.getTrades(page);
        setTrades(data.trades);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to load market:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tab, page]);

  const handleCancelListing = async (id: string) => {
    if (!confirm('确定要强制下架这个商品吗？')) return;
    try {
      await marketApi.cancelListing(id);
      await loadData();
    } catch (err) {
      console.error('Failed to cancel listing:', err);
    }
  };

  const listingColumns = [
    { key: 'sellerName', title: '卖家' },
    { key: 'itemType', title: '物品类型' },
    { key: 'amount', title: '数量' },
    { key: 'price', title: '价格', render: (v: number) => v.toLocaleString() },
    { key: 'status', title: '状态', render: (v: string) => {
      const labels: Record<string, string> = { ACTIVE: '上架中', SOLD: '已售出', CANCELLED: '已取消', EXPIRED: '已过期' };
      return labels[v] || v;
    }},
    { key: 'createdAt', title: '上架时间', render: (v: string) => new Date(v).toLocaleDateString() },
    {
      key: 'actions',
      title: '操作',
      render: (_: unknown, row: MarketListing) => row.status === 'ACTIVE' && (
        <button className="admin-btn danger small" onClick={() => handleCancelListing(row.id)}>
          下架
        </button>
      ),
    },
  ];

  const tradeColumns = [
    { key: 'sellerName', title: '卖家' },
    { key: 'buyerName', title: '买家' },
    { key: 'itemType', title: '物品类型' },
    { key: 'amount', title: '数量' },
    { key: 'price', title: '成交价', render: (v: number) => v.toLocaleString() },
    { key: 'fee', title: '手续费', render: (v: number) => v.toLocaleString() },
    { key: 'createdAt', title: '成交时间', render: (v: string) => new Date(v).toLocaleString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="admin-page-title">交易市场管理</h2>
        <p className="admin-page-desc">查看和管理游戏交易市场</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>在售商品</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>{stats.activeListings}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>总交易数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--azure)' }}>{stats.totalTrades}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>今日成交额</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--jade)' }}>{stats.todayVolume.toLocaleString()}</div>
          </div>
          <div className="admin-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>累计手续费</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--violet)' }}>{stats.totalFees.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className={`admin-btn ${tab === 'listings' ? 'primary' : 'secondary'}`}
          onClick={() => { setTab('listings'); setPage(1); }}
        >
          商品列表
        </button>
        <button
          className={`admin-btn ${tab === 'trades' ? 'primary' : 'secondary'}`}
          onClick={() => { setTab('trades'); setPage(1); }}
        >
          交易记录
        </button>
      </div>

      <DataTable
        columns={tab === 'listings' ? listingColumns : tradeColumns}
        data={tab === 'listings' ? listings : trades}
        loading={loading}
        pagination={{
          page,
          pageSize: 20,
          total,
          onChange: setPage,
        }}
      />
    </div>
  );
}
