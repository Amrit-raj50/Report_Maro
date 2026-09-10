import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '@sih/shared-types';
import { useAuthStore } from '../store/authStore.js';

export function ProtectedRoute({ allow }: { allow?: UserRole[] }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
