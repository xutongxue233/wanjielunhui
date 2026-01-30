import { useState, useEffect } from 'react';
import { friendApi, sectApi, type Friend, type FriendRequest, type Sect, type SectMember } from '../../services/api';
import './SocialPage.css';

type SocialTab = 'friends' | 'sect' | 'requests';

export function SocialPage() {
  const [activeTab, setActiveTab] = useState<SocialTab>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [sect, setSect] = useState<Sect | null>(null);
  const [sectMembers, setSectMembers] = useState<SectMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [friendsData, requestsData, sectData] = await Promise.all([
        friendApi.list().catch(() => []),
        friendApi.requests().catch(() => []),
        sectApi.getMySect().catch(() => null),
      ]);
      setFriends(friendsData);
      setRequests(requestsData);
      setSect(sectData);

      if (sectData) {
        const members = await sectApi.getMembers().catch(() => []);
        setSectMembers(members);
      }
    } catch (err) {
      console.error('加载社交数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await friendApi.accept(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      const updatedFriends = await friendApi.list();
      setFriends(updatedFriends);
    } catch (err) {
      console.error('接受好友请求失败:', err);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await friendApi.reject(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error('拒绝好友请求失败:', err);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm('确定要删除该好友吗？')) return;
    try {
      await friendApi.remove(friendId);
      setFriends((prev) => prev.filter((f) => f.friendId !== friendId));
    } catch (err) {
      console.error('删除好友失败:', err);
    }
  };

  const renderFriendsList = () => (
    <div className="friend-list">
      {loading ? (
        <div className="social-empty">
          <span className="social-empty-text">加载中...</span>
        </div>
      ) : friends.length === 0 ? (
        <div className="social-empty">
          <svg className="social-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="social-empty-text">暂无好友</span>
          <button className="social-empty-action">寻找道友</button>
        </div>
      ) : (
        friends.map((friend) => (
          <div key={friend.id} className="friend-card">
            <div className={`friend-avatar ${friend.isOnline ? 'online' : ''}`}>
              {friend.friendName.charAt(0)}
            </div>
            <div className="friend-info">
              <div className="friend-name">{friend.friendName}</div>
              <div className="friend-details">
                <span className="friend-realm">{friend.friendRealm}</span>
                <span className="friend-status">
                  <span className={`friend-status-dot ${friend.isOnline ? 'online' : ''}`} />
                  {friend.isOnline ? '在线' : '离线'}
                </span>
              </div>
            </div>
            <div className="friend-actions">
              <button className="friend-action-btn primary">私聊</button>
              <button className="friend-action-btn secondary" onClick={() => handleRemoveFriend(friend.friendId)}>
                删除
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSectPanel = () => {
    if (loading) {
      return (
        <div className="social-empty">
          <span className="social-empty-text">加载中...</span>
        </div>
      );
    }

    if (!sect) {
      return (
        <div className="social-empty">
          <svg className="social-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="social-empty-text">您尚未加入宗门</span>
          <button className="social-empty-action">寻找宗门</button>
        </div>
      );
    }

    return (
      <div className="sect-panel">
        <div className="sect-header">
          <div className="sect-name">{sect.name}</div>
          <div className="sect-level">{sect.level}级宗门</div>
          <div className="sect-stats">
            <div className="sect-stat">
              <span className="sect-stat-value">{sect.memberCount}/{sect.maxMembers}</span>
              <span className="sect-stat-label">成员</span>
            </div>
            <div className="sect-stat">
              <span className="sect-stat-value">{(sect.totalContribution / 1000).toFixed(1)}k</span>
              <span className="sect-stat-label">总贡献</span>
            </div>
          </div>
        </div>

        <div className="sect-members-title">宗门成员</div>
        <div className="sect-member-list">
          {sectMembers.map((member) => (
            <div key={member.id} className="sect-member">
              <span className={`sect-member-rank ${member.playerId === sect.leaderId ? 'leader' : ''}`}>
                {member.rank}
              </span>
              <span className="sect-member-name">{member.playerName}</span>
              <span className="sect-member-contribution">贡献: {member.contribution}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRequests = () => (
    <div className="request-list">
      {loading ? (
        <div className="social-empty">
          <span className="social-empty-text">加载中...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="social-empty">
          <svg className="social-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span className="social-empty-text">暂无好友请求</span>
        </div>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="friend-avatar">{request.fromPlayerName.charAt(0)}</div>
            <div className="request-info">
              <div className="request-name">{request.fromPlayerName}</div>
              <div className="request-message">{request.message || '请求添加您为好友'}</div>
            </div>
            <div className="request-actions">
              <button className="request-btn accept" onClick={() => handleAcceptRequest(request.id)}>
                接受
              </button>
              <button className="request-btn reject" onClick={() => handleRejectRequest(request.id)}>
                拒绝
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="social-page">
      <div className="social-tabs">
        <button
          className={`social-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          好友列表
        </button>
        <button
          className={`social-tab ${activeTab === 'sect' ? 'active' : ''}`}
          onClick={() => setActiveTab('sect')}
        >
          宗门
        </button>
        <button
          className={`social-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          好友请求
          {requests.length > 0 && (
            <span style={{
              marginLeft: '6px',
              padding: '2px 6px',
              background: 'var(--crimson)',
              borderRadius: '8px',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {requests.length}
            </span>
          )}
        </button>
      </div>

      <div className="social-content">
        {activeTab === 'friends' && renderFriendsList()}
        {activeTab === 'sect' && renderSectPanel()}
        {activeTab === 'requests' && renderRequests()}
      </div>
    </div>
  );
}
