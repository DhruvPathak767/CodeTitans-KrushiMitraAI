import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from '@/i18n/AppContext';
import { FarmProvider, useFarm } from '@/context/FarmContext';
import { WeatherProvider } from '@/context/WeatherContext';
import { AdvisoryProvider } from '@/context/AdvisoryContext';
import { Landing } from '@/pages/Landing';
import { Login, Signup } from '@/pages/Login';
import { OnboardingFarm } from '@/pages/OnboardingFarm';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/features/home/HomePage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { Weather } from '@/pages/Weather';
import { DiseaseDetection } from '@/pages/DiseaseDetection';
import { Advisory } from '@/pages/Advisory';
import { Irrigation } from '@/pages/Irrigation';
import { Market } from '@/pages/Market';
import { SellStore } from '@/pages/SellStore';
import { Schemes } from '@/pages/Schemes';
import { Chatbot } from '@/pages/Chatbot';
import { Notifications } from '@/pages/Notifications';
import { FarmRegistration } from '@/pages/FarmRegistration';
import { Planner } from '@/pages/Planner';
import { Reports } from '@/pages/Reports';
import { Loader2 } from 'lucide-react';

function MandatoryFarmGuard({ children }: { children: React.ReactNode }) {
  const { t } = useApp();
  const { hasFarm, checkingOnboarding } = useFarm();
  const location = useLocation();

  if (checkingOnboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-base font-semibold text-slate-500">{t('state.checkingFarm')}</p>
        </div>
      </div>
    );
  }

  if (hasFarm === false && location.pathname !== '/onboarding/farm') {
    return <Navigate to="/onboarding/farm" replace />;
  }

  if (hasFarm === true && location.pathname === '/onboarding/farm') {
    return <Navigate to="/app/home" replace />;
  }

  return <>{children}</>;
}

function ProtectedRoutes() {
  const { t, user, loadingUser } = useApp();

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-base font-semibold text-slate-500">{t('state.authenticating')}</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <MandatoryFarmGuard>
      <AppShell />
    </MandatoryFarmGuard>
  );
}

function OnboardingRouteGuard() {
  const { t, user, loadingUser } = useApp();

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <MandatoryFarmGuard>
      <OnboardingFarm />
    </MandatoryFarmGuard>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FarmProvider>
        <WeatherProvider>
          <AdvisoryProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding/farm" element={<OnboardingRouteGuard />} />

                {/* Protected app routes — AppShell provides TopBar + BottomNav */}
                <Route path="/app" element={<ProtectedRoutes />}>
                  {/* Default: redirect /app → /app/home */}
                  <Route index element={<Navigate to="/app/home" replace />} />

                  {/* Bottom nav primary tabs */}
                  <Route path="home" element={<HomePage />} />
                  <Route path="farm" element={<FarmRegistration />} />
                  <Route path="market" element={<Market />} />
                  <Route path="profile" element={<ProfilePage />} />

                  {/* Feature pages (accessible from Home action cards) */}
                  <Route path="disease" element={<DiseaseDetection />} />
                  <Route path="advisory" element={<Advisory />} />
                  <Route path="weather" element={<Weather />} />
                  <Route path="irrigation" element={<Irrigation />} />
                  <Route path="sellstore" element={<SellStore />} />
                  <Route path="schemes" element={<Schemes />} />

                  {/* Secondary pages (accessible from Profile or deep links) */}
                  <Route path="chatbot" element={<Chatbot />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="planner" element={<Planner />} />
                  <Route path="reports" element={<Reports />} />

                  {/* Backward compat: /app/dashboard → /app/home */}
                  <Route path="dashboard" element={<Navigate to="/app/home" replace />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AdvisoryProvider>
        </WeatherProvider>
      </FarmProvider>
    </AppProvider>
  );
}
