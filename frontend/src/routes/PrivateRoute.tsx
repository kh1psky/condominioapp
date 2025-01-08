// src/routes/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { signed, loading } = useAuth();  // Mudamos de isAuthenticated para signed
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;