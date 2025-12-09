import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // If not authenticated, don't render children
  if (!authService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
