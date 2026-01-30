import { useState, useEffect, useCallback } from 'react';
import { pvpApi, type PvpStats, type PvpMatch, type PvpBattleState } from '../../services/api';
import './PvpPage.css';

type PvpState = 'idle' | 'matching' | 'battle';

export function PvpPage() {
  const [pvpState, setPvpState] = useState<PvpState>('idle');
  const [matchTime, setMatchTime] = useState(0);
  const [stats, setStats] = useState<PvpStats | null>(null);
  const [history, setHistory] = useState<PvpMatch[]>([]);
  const [battle, setBattle] = useState<PvpBattleState | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, historyData, battleData] = await Promise.all([
        pvpApi.stats().catch(() => null),
        pvpApi.history().catch(() => ({ matches: [], total: 0 })),
        pvpApi.getBattle().catch(() => null),
      ]);
      setStats(statsData);
      setHistory(historyData.matches);

      if (battleData && battleData.status === 'ongoing') {
        setBattle(battleData);
        setPvpState('battle');
      }
    } catch (err) {
      console.error('加载PVP数据失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let timer: number;
    let pollTimer: number;

    if (pvpState === 'matching') {
      timer = window.setInterval(() => {
        setMatchTime((t) => t + 1);
      }, 1000);

      // 轮询检查是否匹配成功
      pollTimer = window.setInterval(async () => {
        try {
          const battleData = await pvpApi.getBattle();
          if (battleData && battleData.status === 'ongoing') {
            setBattle(battleData);
            setPvpState('battle');
          }
        } catch (err) {
          console.error('检查匹配状态失败:', err);
        }
      }, 2000);

      return () => {
        clearInterval(timer);
        clearInterval(pollTimer);
      };
    }
    return () => {
      if (timer) clearInterval(timer);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [pvpState]);

  const handleMatch = async () => {
    if (pvpState === 'idle') {
      try {
        await pvpApi.joinQueue();
        setPvpState('matching');
        setMatchTime(0);
      } catch (err) {
        console.error('加入匹配队列失败:', err);
      }
    } else if (pvpState === 'matching') {
      try {
        await pvpApi.leaveQueue();
        setPvpState('idle');
      } catch (err) {
        console.error('离开匹配队列失败:', err);
      }
    }
  };

  const handleAction = async (action: 'attack' | 'skill' | 'defend') => {
    if (!battle || battle.status !== 'ongoing' || !battle.isMyTurn || actionLoading) return;

    setActionLoading(true);
    try {
      const result = await pvpApi.action(action);
      setBattle(result);

      if (result.status !== 'ongoing') {
        setTimeout(() => {
          setPvpState('idle');
          setBattle(null);
          loadData();
        }, 2000);
      }
    } catch (err) {
      console.error('执行动作失败:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSurrender = async () => {
    if (!confirm('确定要投降吗？')) return;
    try {
      await pvpApi.surrender();
      setPvpState('idle');
      setBattle(null);
      loadData();
    } catch (err) {
      console.error('投降失败:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderIdleState = () => (
    <>
      <div className="pvp-matchmaking">
        <button className="pvp-match-btn" onClick={handleMatch}>
          开始匹配
        </button>
      </div>

      <div className="pvp-history">
        <div className="pvp-history-title">最近对战</div>
        {history.length === 0 ? (
          <div className="pvp-history-item" style={{ justifyContent: 'center', color: 'var(--text-muted)' }}>
            暂无对战记录
          </div>
        ) : (
          history.map((record) => (
            <div key={record.id} className="pvp-history-item">
              <span className={`pvp-history-result ${record.result}`}>
                {record.result === 'win' ? '胜利' : record.result === 'lose' ? '失败' : '平局'}
              </span>
              <span className="pvp-history-opponent">vs {record.opponentName}</span>
              <span className={`pvp-history-rating ${record.ratingChange > 0 ? 'positive' : 'negative'}`}>
                {record.ratingChange > 0 ? '+' : ''}{record.ratingChange}
              </span>
              <span className="pvp-history-time">
                {new Date(record.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );

  const renderMatchingState = () => (
    <div className="pvp-matchmaking">
      <button className="pvp-match-btn matching" onClick={handleMatch}>
        取消匹配
      </button>
      <div className="pvp-matching-text">
        正在寻找对手... <span className="pvp-matching-time">{formatTime(matchTime)}</span>
      </div>
    </div>
  );

  const renderBattleState = () => {
    if (!battle) return null;

    const myHpPercent = (battle.myHp / battle.myMaxHp) * 100;
    const enemyHpPercent = (battle.enemyHp / battle.enemyMaxHp) * 100;

    return (
      <div className="pvp-battle">
        <div className="pvp-battle-header">
          <div className="pvp-player">
            <div className="pvp-player-avatar">我</div>
            <div className="pvp-player-info">
              <div className="pvp-player-name">你</div>
              <div className="pvp-player-realm">{stats?.seasonName || ''}</div>
            </div>
          </div>
          <div className="pvp-vs">VS</div>
          <div className="pvp-player right">
            <div className="pvp-player-avatar">{battle.opponent.name.charAt(0)}</div>
            <div className="pvp-player-info">
              <div className="pvp-player-name">{battle.opponent.name}</div>
              <div className="pvp-player-realm">{battle.opponent.realm}</div>
            </div>
          </div>
        </div>

        <div className="pvp-health-bars">
          <div className="pvp-health-bar">
            <div className="pvp-health-fill" style={{ width: `${myHpPercent}%` }} />
            <span className="pvp-health-text">{battle.myHp}/{battle.myMaxHp}</span>
          </div>
          <div className="pvp-health-bar right">
            <div className="pvp-health-fill" style={{ width: `${enemyHpPercent}%` }} />
            <span className="pvp-health-text">{battle.enemyHp}/{battle.enemyMaxHp}</span>
          </div>
        </div>

        <div className="pvp-battle-log">
          {battle.logs.map((log, index) => (
            <div key={index} className={`pvp-log-entry ${log.type}`}>
              {log.message}
            </div>
          ))}
          {battle.status === 'won' && (
            <div className="pvp-log-entry critical">你获得了胜利！</div>
          )}
          {battle.status === 'lost' && (
            <div className="pvp-log-entry">你被击败了...</div>
          )}
        </div>

        {battle.status === 'ongoing' && (
          <div className="pvp-actions">
            <button
              className="pvp-action-btn attack"
              onClick={() => handleAction('attack')}
              disabled={!battle.isMyTurn || actionLoading}
            >
              普通攻击
            </button>
            <button
              className="pvp-action-btn skill"
              onClick={() => handleAction('skill')}
              disabled={!battle.isMyTurn || actionLoading}
            >
              技能
            </button>
            <button
              className="pvp-action-btn defend"
              onClick={() => handleAction('defend')}
              disabled={!battle.isMyTurn || actionLoading}
            >
              防御
            </button>
            <button
              className="pvp-action-btn defend"
              onClick={handleSurrender}
              style={{ flex: 0.5 }}
            >
              投降
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pvp-page">
        <div className="pvp-header">
          <div className="pvp-title">论剑台</div>
          <div className="pvp-season">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pvp-page">
      <div className="pvp-header">
        <div className="pvp-title">论剑台</div>
        <div className="pvp-season">{stats?.seasonName || '当前赛季'}</div>
        <div className="pvp-stats">
          <div className="pvp-stat">
            <span className="pvp-stat-value">{stats?.rating || 0}</span>
            <span className="pvp-stat-label">积分</span>
          </div>
          <div className="pvp-stat">
            <span className="pvp-stat-value">{stats?.wins || 0}</span>
            <span className="pvp-stat-label">胜场</span>
          </div>
          <div className="pvp-stat">
            <span className="pvp-stat-value">{stats?.losses || 0}</span>
            <span className="pvp-stat-label">败场</span>
          </div>
          <div className="pvp-stat">
            <span className="pvp-stat-value">{stats?.winRate || 0}%</span>
            <span className="pvp-stat-label">胜率</span>
          </div>
        </div>
      </div>

      <div className="pvp-content">
        {pvpState === 'idle' && renderIdleState()}
        {pvpState === 'matching' && renderMatchingState()}
        {pvpState === 'battle' && renderBattleState()}
      </div>
    </div>
  );
}
