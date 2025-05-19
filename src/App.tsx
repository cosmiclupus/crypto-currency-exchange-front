import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/Auth';
import AuthPage from './pages/Auth';
import OrdersPage from './pages/Orders';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AppLayout from './AppLayout';

function App() {
  return (
      <AuthProvider>
        <Routes>
          {/* Login page without AppLayout */}
          <Route path="/login" element={<AuthPage />} />
          
          {/* Protected routes with AppLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <OrdersPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <AppLayout>
                <OrdersPage  />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback route to login */}
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </AuthProvider>
  );
}

export default App;