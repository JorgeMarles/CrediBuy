// ProtectedRoute.tsx
import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../services/AuthContext';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, refreshAccessToken, logout } = useContext<AuthContextType>(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
        console.log(isAuthenticated);
        
      if (isAuthenticated) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
          navigate('/login');
        }
      }
    };

    checkToken();
  }, [isAuthenticated, refreshAccessToken, logout]);

  return isAuthenticated ? <>{element}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;