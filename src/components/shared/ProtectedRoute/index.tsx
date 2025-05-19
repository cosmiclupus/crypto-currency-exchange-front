import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state } = useAuth();
  const location = useLocation();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, manual: true }} replace />;
  }
  
  return <>{children}</>;
}