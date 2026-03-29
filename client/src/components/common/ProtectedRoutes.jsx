import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-obsidian"><span className="text-emerald">Loading...</span></div>;
  }

  // Allow bypass for development/testing if token isn't strictly verified yet,
  // but strictly, it should be:
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-obsidian"><span className="text-emerald">Loading...</span></div>;

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
