import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import type { UserRole } from '@sih/shared-types';
import { useAuthStore } from '../store/authStore.js';
import { getDefaultPortalForUser } from '../utils/portalRouting.js';

export function ProtectedRoute({ allow }: { allow?: UserRole[] }) {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const location = useLocation();

  if (!user) {
    if (location.pathname.startsWith('/industry')) {
      return <Navigate to="/login?role=industry" state={{ from: location.pathname }} replace />;
    }
    if (location.pathname.startsWith('/university') || location.pathname === '/student') {
      return <Navigate to="/login?role=university" state={{ from: location.pathname }} replace />;
    }
    if (location.pathname === '/submit') {
      return <Navigate to="/login?role=citizen&for=submit" state={{ from: location.pathname }} replace />;
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allow && !allow.includes(user.role)) {
    const isIndustry = location.pathname.startsWith('/industry');
    const isUniv = location.pathname.startsWith('/university') || location.pathname === '/student';
    const targetRole = isIndustry ? 'industry' : isUniv ? 'university' : allow[0];
    const userPortal = getDefaultPortalForUser(user);

    return (
      <div className="mx-auto max-w-xl py-12 px-4">
        <div className="bg-white border-2 border-urgent rounded-[2px] p-6 sm:p-8 shadow-sm text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-urgent/10 flex items-center justify-center text-urgent text-2xl font-bold">
            🛡️
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-navy mb-2">
            Access Restricted / अनाधिकृत पहुंच
          </h2>
          <p className="text-sm text-ink-muted mb-4">
            This portal requires an authorized <strong className="text-navy">{allow.join(' / ').toUpperCase()}</strong> account.
          </p>

          <div className="p-3 bg-paper border border-border rounded-[2px] mb-6 text-xs text-left">
            <div className="text-ink font-semibold">Currently signed in as:</div>
            <div className="font-bold text-navy text-sm mt-0.5">{user.full_name}</div>
            <div className="font-mono text-ink-muted text-[11px]">
              {user.email} · Role: <span className="uppercase font-bold text-forest">{user.role}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={userPortal}
              className="px-4 py-2 bg-navy text-white text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-navy-deep transition-colors text-center"
            >
              ← Return to My Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                clearSession();
                try {
                  localStorage.removeItem('samadhansetu_university_profile');
                } catch {
                  // ignore
                }
                window.location.href = `/login?role=${targetRole}`;
              }}
              className="px-4 py-2 bg-paper border border-urgent text-urgent text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-urgent/10 transition-colors text-center cursor-pointer"
            >
              Logout &amp; Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

