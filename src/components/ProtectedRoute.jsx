import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  if (!user && (!token || token === "undefined")) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
