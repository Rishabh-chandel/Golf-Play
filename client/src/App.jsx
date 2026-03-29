import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoutes';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Public Pages
const Home = lazy(() => import('./pages/public/Home.jsx'));
const HowItWorks = lazy(() => import('./pages/public/HowItWorks.jsx'));
const Pricing = lazy(() => import('./pages/public/Pricing.jsx'));
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const Charities = lazy(() => import('./pages/public/Charities.jsx'));
const DrawResults = lazy(() => import('./pages/public/DrawResults.jsx'));
const Leaderboard = lazy(() => import('./pages/public/Leaderboard.jsx'));

// Dashboard Pages
const Overview = lazy(() => import('./pages/dashboard/Overview.jsx'));
const MyScores = lazy(() => import('./pages/dashboard/MyScores.jsx'));
const MyCharity = lazy(() => import('./pages/dashboard/MyCharity.jsx'));
const MyDraws = lazy(() => import('./pages/dashboard/MyDraws.jsx'));
const MyWinnings = lazy(() => import('./pages/dashboard/MyWinnings.jsx'));
const Subscription = lazy(() => import('./pages/dashboard/Subscription.jsx'));
const Settings = lazy(() => import('./pages/dashboard/Settings.jsx'));

const AdminOverview = lazy(() => import('./pages/admin/AdminOverview.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminDraws = lazy(() => import('./pages/admin/AdminDraws.jsx'));
const AdminCharities = lazy(() => import('./pages/admin/AdminCharities.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'));

const AppShell = () => {
  const theme = useSelector((state) => state.ui.theme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="site-shell min-h-screen bg-obsidian text-text-primary">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="text-emerald">Loading...</span></div>}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/charities" element={<Charities />} />
              <Route path="/draw-results" element={<DrawResults />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Overview />} />
                  <Route path="scores" element={<MyScores />} />
                  <Route path="charity" element={<MyCharity />} />
                  <Route path="draws" element={<MyDraws />} />
                  <Route path="winnings" element={<MyWinnings />} />
                  <Route path="subscription" element={<Subscription />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="draws" element={<AdminDraws />} />
                  <Route path="charities" element={<AdminCharities />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { background: 'var(--color-surface-2)', color: 'var(--color-text-primary)' } 
        }} 
      />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
