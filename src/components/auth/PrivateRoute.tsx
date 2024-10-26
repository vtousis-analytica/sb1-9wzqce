import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}