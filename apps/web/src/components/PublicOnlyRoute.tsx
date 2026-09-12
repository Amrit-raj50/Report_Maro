import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { getDefaultPortalForUser } from '../utils/portalRouting.js';

/**
 * PublicOnlyRoute blocks authenticated users from accessing public-only routes (such as /login and /register).
 * If a user is already logged in, they are immediately redirected to their corresponding portal dashboard.
 */
export function PublicOnlyRoute() {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Navigate to={getDefaultPortalForUser(user)} replace />;
  }

  return <Outlet />;
}
