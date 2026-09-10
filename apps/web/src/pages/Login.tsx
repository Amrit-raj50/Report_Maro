import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginRequestSchema } from '@sih/shared-types';
import { apiClient, apiErrorMessage } from '../lib/apiClient.js';
import { useAuthStore } from '../store/authStore.js';
import { Button } from '../components/Button.js';

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    const parsed = loginRequestSchema.safeParse({ email: loginEmail, password: loginPass });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', parsed.data);
      setSession(res.data.user, res.data.token);

      // Smart role-based redirect
      const role = res.data.user.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'university') {
        navigate('/university');
      } else if (role === 'industry') {
        navigate('/industry');
      } else {
        navigate('/problems');
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
  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('mock-login-not-a-secret');
    performLogin(demoEmail, 'mock-login-not-a-secret');
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@sihportal.dev')}
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
              onClick={() => handleQuickDemo('dean@nitjsr.ac.in')}
              className="p-2 bg-paper border border-forest/40 hover:border-forest hover:bg-white text-forest rounded-[2px] text-left transition-colors"
            >
              <div className="text-[11px] font-bold text-forest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-forest"></span> University
              </div>
              <div className="font-mono text-[10px] text-ink-muted truncate">dean@nitjsr.ac.in</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('asha.devi@example.com')}
              className="p-2 bg-paper border border-border hover:border-navy hover:bg-white text-ink rounded-[2px] text-left transition-colors"
            >
              <div className="text-[11px] font-bold text-ink flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric-deep"></span> Citizen
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
