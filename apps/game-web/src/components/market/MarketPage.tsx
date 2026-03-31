import { useState, useEffect } from 'react';
import { marketApi, type MarketListing, type ShopItem, type MyTrade } from '../../services/api';
import { message, Tabs } from '../ui';
import './MarketPage.css';

type MarketTab = 'player' | 'shop' | 'myTrades';

const ITEM_TYPES = ['全部', '丹药', '法宝', '材料', '功法', '其他'];
const SHOP_CATEGORIES = ['推荐', '丹药', '法宝', '材料', '限时'];

// 图标映射: 将后端图标标识符映射到展示内容
const ICON_MAP: Record<string, string> = {
  pill_blue: '💊',
  pill_green: '💚',
  pill_red: '❤️',
  pill_gold: '🌟',
  herb_1: '🌿',
  herb_2: '🍀',
  scroll_1: '📜',
  scroll_2: '📋',
  weapon_1: '⚔️',
  weapon_2: '🗡️',
  armor_1: '🛡️',
  material_1: '💎',
  default: '📦',
};

const getItemIcon = (iconId: string): string => {
  return ICON_MAP[iconId] || ICON_MAP.default;
};

export function MarketPage() {
  const [activeTab, setActiveTab] = useState<MarketTab>('player');
  const [selectedType, setSelectedType] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('推荐');
  const [searchQuery, setSearchQuery] = useState('');

  const [listings, setListings] = useState<MarketListing[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [myTrades, setMyTrades] = useState<MyTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerListings();
  }, [selectedType, searchQuery]);

  useEffect(() => {
    if (activeTab === 'shop') {
      loadShopItems();
    } else if (activeTab === 'myTrades') {
      loadMyTrades();
    }
  }, [activeTab, selectedCategory]);

  const loadPlayerListings = async () => {
    setLoading(true);
    try {
      const data = await marketApi.listings(1, 50, selectedType, searchQuery);
      setListings(data.listings);
    } catch (err) {
      console.error('加载市场列表失败:', err);
      message.error('加载市场列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadShopItems = async () => {
    setLoading(true);
    try {
      const data = await marketApi.shop(selectedCategory);
      setShopItems(data);
    } catch (err) {
      console.error('加载商店失败:', err);
      message.error('加载商店失败');
    } finally {
      setLoading(false);
    }
  };

  const loadMyTrades = async () => {
    setLoading(true);
    try {
      const [listings, trades] = await Promise.all([
        marketApi.myListings().catch(() => []),
        marketApi.myTrades().catch(() => []),
      ]);
      setMyTrades([...listings, ...trades]);
    } catch (err) {
      console.error('加载我的交易失败:', err);
      message.error('加载我的交易失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listingId: string) => {
    try {
      await marketApi.buy(listingId);
      loadPlayerListings();
    } catch (err) {
      console.error('购买失败:', err);
      message.error('购买失败');
    }
  };

  const handleShopBuy = async (itemId: string) => {
    try {
      await marketApi.shopBuy(itemId);
      message.success('购买成功');
    } catch (err) {
      console.error('购买失败:', err);
      message.error('购买失败');
    }
  };

  const handleCancel = async (listingId: string) => {
    try {
      await marketApi.cancel(listingId);
      loadMyTrades();
    } catch (err) {
      console.error('下架失败:', err);
      message.error('下架失败');
    }
  };

  const renderPlayerMarket = () => (
    <>
      <div className="market-filters">
        {ITEM_TYPES.map((type) => (
          <button
            key={type}
            className={`market-filter-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
        <input
          type="text"
          className="market-search"
          placeholder="搜索物品..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="market-empty">
          <span>加载中...</span>
        </div>
      ) : listings.length === 0 ? (
        <div className="market-empty">
          <svg className="market-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>暂无商品</span>
        </div>
      ) : (
        <div className="market-grid">
          {listings.map((item) => (
            <div key={item.id} className="market-item">
              <div className="market-item-header">
                <div className={`market-item-icon ${item.itemRarity}`}>{getItemIcon(item.itemIcon)}</div>
                <div className="market-item-info">
                  <div className="market-item-name">{item.itemName}</div>
                  <div className="market-item-type">{item.itemType}</div>
                </div>
              </div>
              <div className="market-item-desc">{item.description}</div>
              <div className="market-item-footer">
                <div>
                  <div className="market-item-price">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    {item.price.toLocaleString()}
                  </div>
                  <div className="market-item-seller">{item.sellerName}</div>
                </div>
                <button className="market-buy-btn" onClick={() => handleBuy(item.id)}>购买</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderSystemShop = () => (
    <>
      <div className="shop-categories">
        {SHOP_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`shop-category ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="market-empty">
          <span>加载中...</span>
        </div>
      ) : shopItems.length === 0 ? (
        <div className="market-empty">
          <svg className="market-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>暂无商品</span>
        </div>
      ) : (
        <div className="market-grid">
          {shopItems.map((item) => (
            <div key={item.id} className="market-item">
              <div className="market-item-header">
                <div className={`market-item-icon ${item.itemRarity}`}>{getItemIcon(item.itemIcon)}</div>
                <div className="market-item-info">
                  <div className="market-item-name">{item.itemName}</div>
                  <div className="market-item-type">{item.itemType}</div>
                </div>
              </div>
              <div className="market-item-desc">{item.description}</div>
              <div className="market-item-footer">
                <div className="market-item-price">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  {item.price.toLocaleString()}
                </div>
                <button className="market-buy-btn" onClick={() => handleShopBuy(item.itemId)}>购买</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderMyTrades = () => (
    <div className="my-trades">
      {loading ? (
        <div className="market-empty">
          <span>加载中...</span>
        </div>
      ) : myTrades.length === 0 ? (
        <div className="market-empty">
          <svg className="market-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>暂无交易记录</span>
        </div>
      ) : (
        myTrades.map((trade) => (
          <div key={trade.id} className="trade-item">
            <div className="trade-item-info">
              <div className="trade-item-name">{trade.itemName}</div>
              <div className="trade-item-details">
                <span>价格: {trade.price}</span>
                <span>上架时间: {new Date(trade.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <span className={`trade-status ${trade.status === 'active' ? 'selling' : 'sold'}`}>
              {trade.status === 'active' ? '出售中' : '已售出'}
            </span>
            {trade.status === 'active' && (
              <button className="trade-cancel-btn" onClick={() => handleCancel(trade.id)}>下架</button>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="market-page">
      <Tabs
        items={[
          { key: 'player', label: '玩家交易' },
          { key: 'shop', label: '系统商店' },
          { key: 'myTrades', label: '我的交易' },
        ]}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as MarketTab)}
        className="market-tabs"
      />

      <div className="market-content">
        {activeTab === 'player' && renderPlayerMarket()}
        {activeTab === 'shop' && renderSystemShop()}
        {activeTab === 'myTrades' && renderMyTrades()}
      </div>
    </div>
  );
}
