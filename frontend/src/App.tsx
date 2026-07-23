import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/i18n/AppContext';
import { Landing } from '@/pages/Landing';
import { Login, Signup } from '@/pages/Login';
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

function ProtectedRoutes() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <AppLayout />
      <FloatingAssistant />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
    </AppProvider>
  );
}
