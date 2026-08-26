import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    try {
      const user = JSON.parse(userString);
      const userRole = user?.role?.toUpperCase();
      if (!allowedRoles.includes(userRole)) {
        // Redirect to dashboard page if unauthorized
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};
