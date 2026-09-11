import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginRequestSchema } from '@sih/shared-types';
import { apiClient, apiErrorMessage } from '../lib/apiClient.js';
import { useAuthStore } from '../store/authStore.js';
import { Button } from '../components/Button.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearSession, setSession } = useAuthStore();

  // Check if user was redirected from a protected page like /university
  const stateObj = location.state as { from?: string; requiredRole?: string; message?: string } | undefined;
  const fromPath = stateObj?.from;
  const isUniversityRedirect =
    Boolean(fromPath?.startsWith('/university')) ||
    stateObj?.requiredRole === 'university' ||
    location.search.includes('role=university');

  const [email, setEmail] = useState(isUniversityRedirect ? 'dean@nitjsr.ac.in' : '');
  const [password, setPassword] = useState(isUniversityRedirect ? 'mock-login-not-a-secret' : '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const performLogin = async (loginEmail: string, loginPass: string, forcedRole?: string) => {
    setError(null);
    const parsed = loginRequestSchema.safeParse({ email: loginEmail, password: loginPass });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    setLoading(true);
    try {
      let res;
      try {
        res = await apiClient.post('/auth/login', parsed.data);
      } catch (err: any) {
        // Self-healing fallback for Hackathon demo accounts if not yet in fresh DB
        if (loginEmail === 'dean@nitjsr.ac.in' || loginEmail === 'dean.test@university.edu') {
          await apiClient.post('/auth/register', {
            full_name: 'Dr. S. Mahato (Dean R&D)',
            email: loginEmail,
            password: loginPass,
            role: 'university',
            organization: 'NIT Jamshedpur',
          }).catch(() => null);
          res = await apiClient.post('/auth/login', parsed.data);
        } else if (loginEmail === 'himmat@nitjsr.ac.in') {
          await apiClient.post('/auth/register', {
            full_name: 'Himmat (Student Investigator)',
            email: loginEmail,
            password: loginPass,
            role: 'citizen',
            organization: 'NIT Jamshedpur',
          }).catch(() => null);
          res = await apiClient.post('/auth/login', parsed.data);
        } else if (loginEmail === 'admin@sihportal.dev') {
          await apiClient.post('/auth/register', {
            full_name: 'Portal Administrator',
            email: loginEmail,
            password: loginPass,
            role: 'admin',
          }).catch(() => null);
          res = await apiClient.post('/auth/login', parsed.data);
        } else {
          throw err;
        }
      }

      if (res?.data?.user && res?.data?.token) {
        setSession(res.data.user, res.data.token);

        const role = res.data.user.role;
        // Priority destination: if student demo or target, go to /student
        if (forcedRole === 'student' || loginEmail === 'himmat@nitjsr.ac.in') {
          navigate('/student');
        } else if (fromPath && (role === 'university' || !fromPath.startsWith('/university'))) {
          navigate(fromPath);
        } else if (role === 'university' || forcedRole === 'university') {
          navigate('/university');
        } else if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'industry') {
          navigate('/industry');
        } else {
          navigate('/problems');
        }
      }
    } catch (err) {
      setError(apiErrorMessage(err, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  // Quick fill helper for hackathon demo & evaluation
  const handleQuickDemo = (demoEmail: string, role?: string) => {
    setEmail(demoEmail);
    setPassword('mock-login-not-a-secret');
    performLogin(demoEmail, 'mock-login-not-a-secret', role);
  };

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="bg-white border-2 border-navy rounded-[2px] p-6 sm:p-8 shadow-sm">
        {/* Header Badge */}
        <div className="border-b border-border pb-4 mb-6">
          <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-wider">
            झारखंड सरकार · NIC Authentication Node
          </span>
          <h1 className="font-display text-2xl font-bold text-navy mt-1">Official Portal Login</h1>
          <p className="text-xs text-ink-muted mt-1">
            Sign in to access departmental triage, university proposals, or citizen grievance logs.
          </p>
        </div>

        {/* Redirect Notice */}
        {isUniversityRedirect && (
          <div className="mb-4 p-3 bg-forest/10 border border-forest/30 rounded-[2px] flex flex-col gap-1 text-xs text-forest">
            <div className="flex items-start gap-1.5 font-bold">
              <span>🏛️ University Access Required:</span>
            </div>
            <span>
              {stateObj?.message || 'Please sign in with your University credential or use the 1-click University demo button below.'}
            </span>
            {user && (
              <div className="mt-2 pt-2 border-t border-forest/20 flex items-center justify-between text-[11px] text-ink">
                <span>
                  Currently logged in as: <strong>{user.full_name}</strong> ({user.role})
                </span>
                <button
                  type="button"
                  onClick={clearSession}
                  className="text-urgent font-bold underline hover:text-urgent/80"
                >
                  Logout current account
                </button>
              </div>
            )}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
              Official / Registered Email
            </label>
            <input
              type="email"
              placeholder="e.g. admin@sihportal.dev"
              className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:border-navy"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:border-navy"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-2.5 bg-urgent/10 border border-urgent/30 text-urgent text-xs rounded-[2px] font-medium">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs uppercase tracking-wider"
          >
            {loading ? 'Authenticating Credentials…' : 'Sign In to Portal →'}
          </Button>
        </form>

        {/* Hackathon Fast-Demo Buttons */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-center mb-3">
            <span className="font-mono text-[11px] text-ink-muted uppercase font-semibold bg-paper px-2 py-0.5 border border-border">
              ★ SIH 2026 Evaluation: 1-Click Role Login
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@sihportal.dev', 'admin')}
              className="p-2 bg-paper border border-navy/40 hover:border-navy hover:bg-white text-navy rounded-[2px] text-left transition-colors"
            >
              <div className="text-[11px] font-bold text-navy flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-urgent"></span> Govt. Admin
              </div>
              <div className="font-mono text-[10px] text-ink-muted truncate">
                admin@sihportal.dev
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('dean@nitjsr.ac.in', 'university')}
              className="p-2 bg-forest/10 border-2 border-forest hover:bg-forest/20 text-forest rounded-[2px] text-left transition-colors relative"
            >
              <div className="text-[11px] font-bold text-forest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-forest"></span> 🏛️ University
              </div>
              <div className="font-mono text-[10px] text-forest/90 truncate">dean@nitjsr.ac.in</div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-forest block mt-0.5">
                → R&amp;D Desk
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('himmat@nitjsr.ac.in', 'student')}
              className="p-2 bg-turmeric/10 border-2 border-turmeric hover:bg-turmeric/20 text-ink rounded-[2px] text-left transition-colors relative"
            >
              <div className="text-[11px] font-bold text-navy flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric-deep"></span> 👨‍🎓 Student
              </div>
              <div className="font-mono text-[10px] text-ink-muted truncate">himmat@nitjsr.ac.in</div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-turmeric-deep block mt-0.5">
                → Student Desk
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('asha.devi@example.com', 'citizen')}
              className="p-2 bg-paper border border-border hover:border-navy hover:bg-white text-ink rounded-[2px] text-left transition-colors"
            >
              <div className="text-[11px] font-bold text-ink flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-muted"></span> Citizen
              </div>
              <div className="font-mono text-[10px] text-ink-muted truncate">
                asha.devi@example.com
              </div>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>New to the platform?</span>
          <Link to="/register" className="font-bold text-navy hover:underline">
            Register an Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
