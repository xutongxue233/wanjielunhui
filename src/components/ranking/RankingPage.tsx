import { useState, useEffect } from 'react';
import { rankingApiExtended, type RankingEntry } from '../../services/api';
import './RankingPage.css';

type RankingTab = 'combat' | 'realm' | 'wealth' | 'pvp';

const RANKING_TABS: { id: RankingTab; label: string; scoreLabel: string }[] = [
  { id: 'combat', label: '战力榜', scoreLabel: '战力' },
  { id: 'realm', label: '境界榜', scoreLabel: '修为' },
  { id: 'wealth', label: '财富榜', scoreLabel: '灵石' },
  { id: 'pvp', label: '论剑榜', scoreLabel: '积分' },
];

interface MyRankInfo {
  rank: number;
  score: number;
}

export function RankingPage() {
  const [activeTab, setActiveTab] = useState<RankingTab>('combat');
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRankInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankings();
  }, [activeTab]);

  const loadRankings = async () => {
    setLoading(true);
    try {
      let rankingsData: { rankings: RankingEntry[]; total: number };

      switch (activeTab) {
        case 'combat':
          rankingsData = await rankingApiExtended.getCombatPower();
          break;
        case 'realm':
          rankingsData = await rankingApiExtended.getRealm();
          break;
        case 'wealth':
          rankingsData = await rankingApiExtended.getWealth();
          break;
        case 'pvp':
          rankingsData = await rankingApiExtended.getPvp();
          break;
        default:
          rankingsData = { rankings: [], total: 0 };
      }

      setRankings(rankingsData.rankings);

      // 获取我的排名
      try {
        const myRankData = await rankingApiExtended.getMyRank(activeTab);
        setMyRank(myRankData);
      } catch {
        setMyRank(null);
      }
    } catch (err) {
      console.error('加载排行榜失败:', err);
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const currentTabInfo = RANKING_TABS.find((t) => t.id === activeTab)!;

  const formatScore = (score: number) => {
    if (score >= 100000000) {
      return (score / 100000000).toFixed(1) + '亿';
    }
    if (score >= 10000) {
      return (score / 10000).toFixed(1) + '万';
    }
    return score.toLocaleString();
  };

  const getPositionClass = (index: number) => {
    if (index === 0) return 'top-1';
    if (index === 1) return 'top-2';
    if (index === 2) return 'top-3';
    return '';
  };

  return (
    <div className="ranking-page">
      <div className="ranking-tabs">
        {RANKING_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`ranking-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ranking-content">
        {myRank && (
          <div className="my-ranking">
            <div>
              <div className="my-ranking-label">我的排名</div>
              <div className="my-ranking-position">#{myRank.rank}</div>
            </div>
            <div className="my-ranking-info" />
            <div className="my-ranking-score">
              <div className="my-ranking-score-value">{formatScore(myRank.score)}</div>
              <div className="my-ranking-score-label">{currentTabInfo.scoreLabel}</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="ranking-empty">
            <span>加载中...</span>
          </div>
        ) : rankings.length === 0 ? (
          <div className="ranking-empty">
            <svg className="ranking-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>暂无排行数据</span>
          </div>
        ) : (
          <div className="ranking-list">
            {rankings.map((player, index) => (
              <div key={player.playerId} className={`ranking-item ${getPositionClass(index)}`}>
                <div className="ranking-position">{player.rank}</div>
                <div className="ranking-avatar">{player.playerName.charAt(0)}</div>
                <div className="ranking-info">
                  <div className="ranking-name">{player.playerName}</div>
                  <div className="ranking-details">
                    <span className="ranking-realm">{player.realm}</span>
                  </div>
                </div>
                <div className="ranking-score">
                  <span className="ranking-score-value">{formatScore(player.score)}</span>
                  <span className="ranking-score-label">{currentTabInfo.scoreLabel}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
