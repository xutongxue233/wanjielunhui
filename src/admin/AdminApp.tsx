import { useState, useEffect } from 'react';
import { useAdminStore } from './stores/adminStore';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { SavesPage } from './pages/SavesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { MailPage } from './pages/MailPage';
import { RankingPage } from './pages/RankingPage';
import { FriendsPage } from './pages/FriendsPage';
import { SectsPage } from './pages/SectsPage';
import { ChatPage } from './pages/ChatPage';
import { MarketPage } from './pages/MarketPage';
import { PvpPage } from './pages/PvpPage';
import './styles/admin.css';

export type TabType = 'dashboard' | 'users' | 'saves' | 'announcements' | 'activities' | 'mail' | 'ranking' | 'friends' | 'sects' | 'chat' | 'market' | 'pvp';

export function AdminApp() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const pages: Record<TabType, JSX.Element> = {
    dashboard: <DashboardPage />,
    users: <UsersPage />,
    saves: <SavesPage />,
    announcements: <AnnouncementsPage />,
    activities: <ActivitiesPage />,
    mail: <MailPage />,
    ranking: <RankingPage />,
    friends: <FriendsPage />,
    sects: <SectsPage />,
    chat: <ChatPage />,
    market: <MarketPage />,
    pvp: <PvpPage />,
  };

  return (
    <div className="admin-root flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main
        className="flex-1 overflow-y-auto"
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          {pages[activeTab]}
        </div>
      </main>
    </div>
  );
}

export default AdminApp;
