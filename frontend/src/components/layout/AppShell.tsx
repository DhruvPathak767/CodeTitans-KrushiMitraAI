import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar ONLY (hidden on mobile/small screens < 1024px) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />

        <main
          className="flex-1 overflow-y-auto px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8"
          id="main-content"
        >
          <div className="mx-auto max-w-6xl space-y-6">
            <Outlet />
          </div>
        </main>

        {/* BottomNav ONLY for mobile/small screens (< 1024px, hidden lg:hidden on desktop) */}
        <BottomNav />
      </div>
    </div>
  );
}
