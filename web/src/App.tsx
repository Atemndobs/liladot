import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { LoadingSpinner } from '@/components/loading-spinner';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/auth-context';

import { MainLayout } from './layouts/main-layout';
import { LoginPage } from './pages/auth/login';
import { SignupPage } from './pages/auth/signup';
import { DashboardPage } from './pages/dashboard';
import { RecordingsPage } from './pages/recordings';
import RecordingDetailPage from './pages/recordings/[id]';
import SettingsPage from './pages/settings';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public route component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="recordings" element={<RecordingsPage />} />
          <Route path="recordings/:id" element={<RecordingDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </Suspense>
  );
}

export default App;
