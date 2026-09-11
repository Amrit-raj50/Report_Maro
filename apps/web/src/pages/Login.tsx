import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginRequestSchema } from '@sih/shared-types';
import { apiClient, apiErrorMessage } from '../lib/apiClient.js';
import { useAuthStore } from '../store/authStore.js';
import { Button } from '../components/Button.js';
import { JHARKHAND_UNIVERSITIES, getUniversityById } from '../data/jharkhandUniversities.js';

export type LoginRoleTab = 'citizen' | 'university' | 'industry' | 'admin';
export type UniversitySubRole = 'student' | 'mentor' | 'dean';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearSession, setSession } = useAuthStore();

  const searchParams = new URLSearchParams(location.search);
  const queryRole = searchParams.get('role');
  const queryType = searchParams.get('type');

  // Check if user was redirected from a protected route
  const stateObj = location.state as { from?: string; requiredRole?: string; message?: string } | undefined;
  const fromPath = stateObj?.from;
  const isUniversityRedirect =
    Boolean(fromPath?.startsWith('/university')) ||
    Boolean(fromPath?.startsWith('/student')) ||
    stateObj?.requiredRole === 'university' ||
    queryRole === 'university';

  // Role Tab selection
  const [activeRole, setActiveRole] = useState<LoginRoleTab>(() => {
    if (queryRole === 'admin') return 'admin';
    if (queryRole === 'university' || isUniversityRedirect) return 'university';
    if (queryRole === 'industry') return 'industry';
    return 'citizen';
  });

  // University Sub-Role selection
  const [univSubRole, setUnivSubRole] = useState<UniversitySubRole>(() => {
    if (queryType === 'mentor' || fromPath?.includes('/mentor')) return 'mentor';
    if (queryType === 'dean' || (fromPath === '/university' && !queryType)) return 'dean';
    if (queryType === 'student' || fromPath === '/student') return 'student';
    return 'student';
  });

  // Selected University
  const [selectedUnivId, setSelectedUnivId] = useState<string>('nitjsr');
  const selectedUniv = getUniversityById(selectedUnivId) || JHARKHAND_UNIVERSITIES[0];

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('mock-login-not-a-secret');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    if (queryRole === 'admin') setActiveRole('admin');
    else if (queryRole === 'university') setActiveRole('university');
    else if (queryRole === 'industry') setActiveRole('industry');
    else if (queryRole === 'citizen') setActiveRole('citizen');

    if (queryType === 'mentor') setUnivSubRole('mentor');
    else if (queryType === 'dean') setUnivSubRole('dean');
    else if (queryType === 'student') setUnivSubRole('student');
  }, [queryRole, queryType]);

  // Set default placeholder/value when university role or subrole switches
  useEffect(() => {
    if (activeRole === 'university') {
      if (univSubRole === 'student') {
        setEmail(selectedUnivId === 'nitjsr' ? 'himmat@nitjsr.ac.in' : `student@${selectedUniv?.domain || 'ac.in'}`);
      } else if (univSubRole === 'mentor') {
        setEmail(selectedUnivId === 'nitjsr' ? 'rsharma.env@nitjsr.ac.in' : `mentor@${selectedUniv?.domain || 'ac.in'}`);
      } else {
        setEmail(selectedUnivId === 'nitjsr' ? 'dean@nitjsr.ac.in' : `dean@${selectedUniv?.domain || 'ac.in'}`);
      }
    } else if (activeRole === 'citizen') {
      setEmail('asha.devi@example.com');
    } else if (activeRole === 'industry') {
      setEmail('tata.csr@tatasteel.com');
    } else if (activeRole === 'admin') {
      setEmail('admin@sihportal.dev');
    }
  }, [activeRole, univSubRole, selectedUnivId, selectedUniv?.domain]);

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
        // Self-healing fallback for Hackathon demo evaluation accounts if not yet in MongoDB
        if (loginEmail === 'dean@nitjsr.ac.in' || loginEmail.startsWith('dean@')) {
          await apiClient.post('/auth/register', {
            full_name: 'Dr. S. Mahato (Dean R&D)',
            email: loginEmail,
            password: loginPass,
            role: 'university',
            organization: selectedUniv?.name || 'NIT Jamshedpur',
          }).catch(() => null);
          res = await apiClient.post('/auth/login', parsed.data);
        } else if (loginEmail === 'rsharma.env@nitjsr.ac.in' || loginEmail.includes('rsharma') || loginEmail.startsWith('mentor@')) {
          await apiClient.post('/auth/register', {
            full_name: 'Dr. Rajesh Sharma (Faculty Mentor)',
            email: loginEmail,
            password: loginPass,
            role: 'university',
            organization: `${selectedUniv?.name || 'NIT Jamshedpur'} | Dept: Environmental Engg | Role: Faculty Mentor`,
          }).catch(() => null);
          res = await apiClient.post('/auth/login', parsed.data);
        } else if (loginEmail === 'himmat@nitjsr.ac.in' || loginEmail.includes('himmat') || loginEmail.startsWith('student@')) {
          await apiClient.post('/auth/register', {
            full_name: 'Himmat (Student Investigator)',
            email: loginEmail,
            password: loginPass,
            role: 'university',
            organization: `${selectedUniv?.name || 'NIT Jamshedpur'} | Dept: Computer Science | Role: Student (Roll: 2022UGCS045)`,
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
        } else if (loginEmail === 'tata.csr@tatasteel.com') {
          await apiClient.post('/auth/register', {
            full_name: 'Vikram Singhania (CSR Lead)',
            email: loginEmail,
            password: loginPass,
            role: 'industry',
            organization: 'Tata Steel Foundation',
          }).catch(() => null);
          res = await apiClient.post('/auth/login', parsed.data);
        } else if (loginEmail === 'asha.devi@example.com') {
          await apiClient.post('/auth/register', {
            full_name: 'Asha Devi',
            email: loginEmail,
            password: loginPass,
            role: 'citizen',
            district: 'Ranchi',
            taluka: 'Kanke',
            village_or_city: 'Morabadi',
            pincode: '834008',
          }).catch(() => null);
          res = await apiClient.post('/auth/login', parsed.data);
        } else {
          throw err;
        }
      }

      if (res?.data?.user && res?.data?.token) {
        setSession(res.data.user, res.data.token);

        const role = res.data.user.role;

        // Routing logic based on role & subrole
        if (forcedRole === 'student' || (activeRole === 'university' && univSubRole === 'student') || loginEmail.includes('himmat')) {
          navigate('/student');
        } else if (forcedRole === 'mentor' || (activeRole === 'university' && univSubRole === 'mentor') || loginEmail.includes('rsharma')) {
          navigate('/university/mentor');
        } else if (forcedRole === 'dean' || (activeRole === 'university' && univSubRole === 'dean') || loginEmail.includes('dean')) {
          navigate('/university');
        } else if (fromPath && (role === 'university' || !fromPath.startsWith('/university'))) {
          navigate(fromPath);
        } else if (role === 'university') {
          navigate('/university');
        } else if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'industry') {
          navigate('/industry');
        } else {
          navigate('/dashboard');
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

  const handleQuickDemo = (demoEmail: string, role?: string) => {
    setEmail(demoEmail);
    setPassword('mock-login-not-a-secret');
    performLogin(demoEmail, 'mock-login-not-a-secret', role);
  };

  return (
    <div className="mx-auto max-w-xl py-8 px-3 sm:px-4">
      <div className="bg-white border-2 border-navy rounded-[2px] p-5 sm:p-8 shadow-sm">
        {/* Header Badge */}
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-wider">
              झारखंड सरकार · NIC Authentication Gateway
            </span>
            <span className="text-[10px] font-mono bg-paper px-2 py-0.5 border border-border text-ink-muted">
              NEP 2020 / SIH PS 26043
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1">Official Portal Login</h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Sign in to access departmental triage, university innovation labs, or citizen grievance logs.
          </p>
        </div>

        {/* Redirect Notice */}
        {isUniversityRedirect && (
          <div className="mb-5 p-3 bg-forest/10 border border-forest/30 rounded-[2px] flex flex-col gap-1 text-xs text-forest">
            <div className="flex items-start gap-1.5 font-bold">
              <span>🏛️ University Access Required:</span>
            </div>
            <span>
              {stateObj?.message || 'Please sign in with your University credential or use the 1-click University demo accounts below.'}
            </span>
            {user && (
              <div className="mt-2 pt-2 border-t border-forest/20 flex items-center justify-between text-[11px] text-ink">
                <span>
                  Currently signed in as: <strong>{user.full_name}</strong> ({user.role})
                </span>
                <button
                  type="button"
                  onClick={clearSession}
                  className="text-urgent font-bold underline hover:text-urgent/80"
                >
                  Switch Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* TOP LEVEL ROLE SWITCHER TABS */}
        <div className="mb-5">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted mb-2">
            Select Portal Access Role / भूमिका चुनें
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-paper border border-border rounded-[2px]">
            <button
              type="button"
              onClick={() => setActiveRole('citizen')}
              className={`py-2 px-2 text-xs font-bold rounded-[2px] transition-all flex flex-col items-center justify-center gap-0.5 ${
                activeRole === 'citizen'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-ink-muted hover:text-navy hover:bg-white/60'
              }`}
            >
              <span className="text-sm">👥</span>
              <span className="text-[11px]">Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('university')}
              className={`py-2 px-2 text-xs font-bold rounded-[2px] transition-all flex flex-col items-center justify-center gap-0.5 ${
                activeRole === 'university'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-ink-muted hover:text-navy hover:bg-white/60'
              }`}
            >
              <span className="text-sm">🎓</span>
              <span className="text-[11px]">University</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('industry')}
              className={`py-2 px-2 text-xs font-bold rounded-[2px] transition-all flex flex-col items-center justify-center gap-0.5 ${
                activeRole === 'industry'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-ink-muted hover:text-navy hover:bg-white/60'
              }`}
            >
              <span className="text-sm">💼</span>
              <span className="text-[11px]">Industry</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('admin')}
              className={`py-2 px-2 text-xs font-bold rounded-[2px] transition-all flex flex-col items-center justify-center gap-0.5 ${
                activeRole === 'admin'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-ink-muted hover:text-navy hover:bg-white/60'
              }`}
            >
              <span className="text-sm">🏛️</span>
              <span className="text-[11px]">Government</span>
            </button>
          </div>
        </div>

        {/* UNIVERSITY-SPECIFIC NESTED SELECTORS */}
        {activeRole === 'university' && (
          <div className="mb-5 p-3.5 bg-paper-dark/60 border-2 border-forest/30 rounded-[2px] space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1">
                  <span>🎓</span>
                  <span>Select University Role / पदनाम</span>
                </span>
                <span className="text-[10px] text-ink-muted font-mono">
                  Direct Desk Routing
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setUnivSubRole('student')}
                  className={`py-2 px-2 rounded-[2px] text-center text-xs font-bold border transition-colors ${
                    univSubRole === 'student'
                      ? 'bg-forest text-white border-forest shadow-sm'
                      : 'bg-white text-ink border-border hover:border-forest'
                  }`}
                >
                  <div className="text-xs">👨‍🎓 Student</div>
                  <div className="text-[9px] font-normal opacity-80 truncate">Innovator / Team</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUnivSubRole('mentor')}
                  className={`py-2 px-2 rounded-[2px] text-center text-xs font-bold border transition-colors ${
                    univSubRole === 'mentor'
                      ? 'bg-forest text-white border-forest shadow-sm'
                      : 'bg-white text-ink border-border hover:border-forest'
                  }`}
                >
                  <div className="text-xs">👨‍🏫 Mentor</div>
                  <div className="text-[9px] font-normal opacity-80 truncate">Faculty / PI</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUnivSubRole('dean')}
                  className={`py-2 px-2 rounded-[2px] text-center text-xs font-bold border transition-colors ${
                    univSubRole === 'dean'
                      ? 'bg-forest text-white border-forest shadow-sm'
                      : 'bg-white text-ink border-border hover:border-forest'
                  }`}
                >
                  <div className="text-xs">🏛️ Dean / Admin</div>
                  <div className="text-[9px] font-normal opacity-80 truncate">R&amp;D Institutional</div>
                </button>
              </div>
            </div>

            {/* University Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Select Your Institution / विश्वविद्यालय चुनें
              </label>
              <select
                value={selectedUnivId}
                onChange={(e) => setSelectedUnivId(e.target.value)}
                className="w-full rounded-[2px] border border-border px-3 py-2 text-xs bg-white text-ink focus:outline-none focus:border-forest font-sans"
              >
                {JHARKHAND_UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortName} ({u.aisheCode} · {u.city})
                  </option>
                ))}
              </select>
              {selectedUniv && (
                <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-ink-muted">
                  <span>AISHE: {selectedUniv.aisheCode} · District: {selectedUniv.district}</span>
                  <span className="text-forest font-semibold">Domain: @{selectedUniv.domain}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOGIN CREDENTIALS FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
              {activeRole === 'university'
                ? `Institutional Email (${selectedUniv?.domain || 'ac.in'})`
                : activeRole === 'admin'
                  ? 'Official NIC Administrator Email'
                  : activeRole === 'industry'
                    ? 'Corporate / CSR Registered Email'
                    : 'Citizen Mobile or Email / ईमेल या मोबाइल'}
              <span className="text-urgent"> *</span>
            </label>
            <input
              type="email"
              placeholder={
                activeRole === 'university'
                  ? `e.g. yourname@${selectedUniv?.domain || 'nitjsr.ac.in'}`
                  : 'e.g. user@example.com'
              }
              className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:border-navy font-sans"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Password / पासवर्ड <span className="text-urgent">*</span>
              </label>
              <span className="text-[10px] text-ink-muted font-mono">Demo: mock-login-not-a-secret</span>
            </div>
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
            className="w-full py-2.5 text-xs uppercase tracking-wider font-bold"
          >
            {loading
              ? 'Authenticating Credentials…'
              : activeRole === 'university'
                ? `Sign In as ${univSubRole === 'student' ? 'Student Innovator' : univSubRole === 'mentor' ? 'Faculty Mentor' : 'Dean R&D'} →`
                : `Sign In to ${activeRole.toUpperCase()} Portal →`}
          </Button>
        </form>

        {/* FAST 1-CLICK DEMO ACCOUNTS FOR EVALUATION */}
        <div className="mt-8 pt-5 border-t border-border">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-mono text-[11px] text-ink font-bold uppercase tracking-wider flex items-center gap-1">
              <span>⚡</span>
              <span>1-Click Fast Demo Credentials (SIH 2026)</span>
            </span>
            <span className="text-[10px] text-forest font-mono">No password required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeRole === 'university' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('himmat@nitjsr.ac.in', 'student')}
                  className="p-2.5 bg-turmeric/10 border border-turmeric-deep hover:bg-turmeric/20 text-ink rounded-[2px] text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-navy flex items-center justify-between">
                    <span>👨‍🎓 Student Innovator</span>
                    <span className="text-[9px] bg-turmeric px-1 py-0.2 rounded-[2px]">3rd Yr CSE</span>
                  </div>
                  <div className="font-mono text-[10px] text-ink-muted truncate mt-0.5">himmat@nitjsr.ac.in</div>
                  <span className="text-[9px] font-bold uppercase text-turmeric-deep block mt-1">
                    → Student Desk (/student)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('rsharma.env@nitjsr.ac.in', 'mentor')}
                  className="p-2.5 bg-forest/10 border border-forest hover:bg-forest/20 text-forest rounded-[2px] text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-forest flex items-center justify-between">
                    <span>👨‍🏫 Faculty Mentor</span>
                    <span className="text-[9px] bg-forest text-white px-1 py-0.2 rounded-[2px]">PI Guide</span>
                  </div>
                  <div className="font-mono text-[10px] text-forest/90 truncate mt-0.5">rsharma.env@nitjsr.ac.in</div>
                  <span className="text-[9px] font-bold uppercase text-forest block mt-1">
                    → Mentor Workspace (/university/mentor)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('dean@nitjsr.ac.in', 'dean')}
                  className="p-2.5 bg-navy/5 border border-navy hover:bg-navy/15 text-navy rounded-[2px] text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-navy flex items-center justify-between">
                    <span>🏛️ Dean R&amp;D Desk</span>
                    <span className="text-[9px] bg-navy text-white px-1 py-0.2 rounded-[2px]">NIT JSR</span>
                  </div>
                  <div className="font-mono text-[10px] text-navy/90 truncate mt-0.5">dean@nitjsr.ac.in</div>
                  <span className="text-[9px] font-bold uppercase text-navy block mt-1">
                    → University Admin (/university)
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('asha.devi@example.com', 'citizen')}
                  className="p-2.5 bg-paper border border-border hover:border-navy hover:bg-white text-ink rounded-[2px] text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-ink">👥 Citizen Grievant</div>
                  <div className="font-mono text-[10px] text-ink-muted truncate">asha.devi@example.com</div>
                  <span className="text-[9px] font-bold text-navy block mt-1">→ Citizen Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('tata.csr@tatasteel.com', 'industry')}
                  className="p-2.5 bg-paper border border-border hover:border-navy hover:bg-white text-ink rounded-[2px] text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-ink">💼 Tata Steel CSR</div>
                  <div className="font-mono text-[10px] text-ink-muted truncate">tata.csr@tatasteel.com</div>
                  <span className="text-[9px] font-bold text-navy block mt-1">→ Industry Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin@sihportal.dev', 'admin')}
                  className="p-2.5 bg-paper border border-navy/40 hover:border-navy hover:bg-white text-navy rounded-[2px] text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-navy">🏛️ Govt. Administrator</div>
                  <div className="font-mono text-[10px] text-ink-muted truncate">admin@sihportal.dev</div>
                  <span className="text-[9px] font-bold text-urgent block mt-1">→ AI Queue &amp; Triage</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>
            {activeRole === 'university'
              ? `New ${univSubRole === 'student' ? 'Student' : univSubRole === 'mentor' ? 'Mentor' : 'Institution'}?`
              : 'New to Samadhan Setu?'}
          </span>
          <Link
            to={`/register?role=${activeRole}${activeRole === 'university' ? `&type=${univSubRole}` : ''}`}
            className="font-bold text-navy hover:underline flex items-center gap-1"
          >
            <span>Register an Account →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
