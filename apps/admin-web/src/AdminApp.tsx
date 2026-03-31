import React, { useState } from 'react';
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
import { APP_SHELL_COPY } from '@wanjie/ui';

export type TabType = 'dashboard' | 'users' | 'saves' | 'announcements' | 'activities' | 'mail' | 'ranking' | 'friends' | 'sects' | 'chat' | 'market' | 'pvp';

export function AdminApp() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const pages: Record<TabType, React.ReactNode> = {
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
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="mb-6 rounded-[24px] border border-gold/15 bg-ink-dark/70 px-6 py-5 shadow-[0_24px_48px_rgba(0,0,0,0.24)]">
            <p className="mb-1 text-xs tracking-[0.32em] text-gold/60">{APP_SHELL_COPY.adminKicker}</p>
            <h1 className="font-heading text-3xl text-gold-light">{APP_SHELL_COPY.brandTitle}</h1>
            <p className="mt-2 text-sm text-text-secondary">三段式架构下的运营、风控与内容发布中枢。</p>
          </div>
          {pages[activeTab]}
        </div>
      </main>
    </div>
  );
}

export default AdminApp;
