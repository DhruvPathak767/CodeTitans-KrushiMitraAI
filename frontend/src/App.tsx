import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from '@/i18n/AppContext';
import { FarmProvider, useFarm } from '@/context/FarmContext';
import { WeatherProvider } from '@/context/WeatherContext';
import { AdvisoryProvider } from '@/context/AdvisoryContext';
import { Landing } from '@/pages/Landing';
import { Login, Signup } from '@/pages/Login';
import { OnboardingFarm } from '@/pages/OnboardingFarm';
import { AppLayout } from '@/components/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
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
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Loader2 } from 'lucide-react';

function MandatoryFarmGuard({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  const { hasFarm, checkingOnboarding } = useFarm();
  const location = useLocation();

  if (checkingOnboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-xs font-semibold text-slate-400">Verifying farm registration status...</p>
        </div>
      </div>
    );
  }

  // If farmer has NO farms registered yet, force redirect to onboarding page
  if (hasFarm === false && location.pathname !== '/onboarding/farm') {
    return <Navigate to="/onboarding/farm" replace />;
  }

  // If farmer ALREADY has farms registered and tries to visit onboarding, redirect to dashboard
  if (hasFarm === true && location.pathname === '/onboarding/farm') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}

function ProtectedRoutes() {
  const { user, loadingUser } = useApp();

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-xs font-semibold text-slate-400">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <MandatoryFarmGuard>
      <AppLayout />
      <FloatingAssistant />
    </MandatoryFarmGuard>
  );
}

function OnboardingRouteGuard() {
  const { user, loadingUser } = useApp();

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
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
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding/farm" element={<OnboardingRouteGuard />} />
                <Route path="/app" element={<ProtectedRoutes />}>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="weather" element={<Weather />} />
                  <Route path="disease" element={<DiseaseDetection />} />
                  <Route path="advisory" element={<Advisory />} />
                  <Route path="irrigation" element={<Irrigation />} />
                  <Route path="market" element={<Market />} />
                  <Route path="sellstore" element={<SellStore />} />
                  <Route path="schemes" element={<Schemes />} />
                  <Route path="chatbot" element={<Chatbot />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="farm" element={<FarmRegistration />} />
                  <Route path="planner" element={<Planner />} />
                  <Route path="reports" element={<Reports />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AdvisoryProvider>
        </WeatherProvider>
      </FarmProvider>
    </AppProvider>
  );
}
