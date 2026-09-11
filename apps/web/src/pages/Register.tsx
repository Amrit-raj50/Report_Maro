import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequestSchema, type UserRole } from '@sih/shared-types';
import { apiClient, apiErrorMessage } from '../lib/apiClient.js';
import { useAuthStore } from '../store/authStore.js';
import { Button } from '../components/Button.js';

// Official 24 Districts of Jharkhand
const JHARKHAND_DISTRICTS = [
  'Bokaro',
  'Chatra',
  'Deoghar',
  'Dhanbad',
  'Dumka',
  'East Singhbhum',
  'Garhwa',
  'Giridih',
  'Godda',
  'Gumla',
  'Hazaribagh',
  'Jamtara',
  'Khunti',
  'Koderma',
  'Latehar',
  'Lohardaga',
  'Pakur',
  'Palamu',
  'Ramgarh',
  'Ranchi',
  'Sahibganj',
  'Saraikela Kharsawan',
  'Simdega',
  'West Singhbhum',
];

export default function Register() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  // Role
  const [role, setRole] = useState<UserRole>('citizen');

  // Personal Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Geographic Info
  const [district, setDistrict] = useState('Ranchi');
  const [taluka, setTaluka] = useState('');
  const [villageOrCity, setVillageOrCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Organization (for university/industry)
  const [organization, setOrganization] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validate Indian Phone Number: 10 digits starting with 6, 7, 8, or 9
  const validatePhone = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Phone number validation
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!validatePhone(cleanedPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    // 2. Password match check
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    // 3. Pincode validation (if citizen)
    if (role === 'citizen' && pincode && !/^\d{6}$/.test(pincode.trim())) {
      setError('Please enter a valid 6-digit postal pincode.');
      return;
    }

    // 4. Validate with shared Zod schema
    const parsed = registerRequestSchema.safeParse({
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      role,
      organization: organization.trim() || undefined,
      phone: cleanedPhone,
      district: district || undefined,
      taluka: taluka.trim() || undefined,
      village_or_city: villageOrCity.trim() || undefined,
      pincode: pincode.trim() || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid registration details');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', parsed.data);
      setSession(res.data.user, res.data.token);

      // Smart redirect
      if (role === 'citizen') {
        navigate('/submit'); // Direct to report a problem right away
      } else if (role === 'university') {
        navigate('/university');
      } else if (role === 'industry') {
        navigate('/industry');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create account. Email may already be in use.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-8 px-4">
      <div className="bg-white border-2 border-navy rounded-[2px] p-6 sm:p-8 shadow-sm">
        {/* Header Badge */}
        <div className="border-b border-border pb-4 mb-6">
          <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-wider">
            झारखंड सरकार · नागरिक एवं संस्था पंजीकरण (NIC Registration Node)
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1">
            Citizen &amp; Stakeholder Registration / पंजीकरण
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Register to crowdsource societal challenges, submit civic grievances, or track university-industry R&amp;D solutions under NEP 2020.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
            Select Registration Type / खाता प्रकार चुनें
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('citizen')}
              className={`p-2.5 text-xs font-bold rounded-[2px] border transition-colors text-center ${
                role === 'citizen'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-paper text-ink border-border hover:border-navy'
              }`}
            >
              <div className="text-xs">Citizen</div>
              <div className="text-[10px] font-normal opacity-80">नागरिक / जन प्रतिनिधि</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('university')}
              className={`p-2.5 text-xs font-bold rounded-[2px] border transition-colors text-center ${
                role === 'university'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-paper text-ink border-border hover:border-navy'
              }`}
            >
              <div className="text-xs">University</div>
              <div className="text-[10px] font-normal opacity-80">विश्वविद्यालय / शोध संस्थान</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('industry')}
              className={`p-2.5 text-xs font-bold rounded-[2px] border transition-colors text-center ${
                role === 'industry'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-paper text-ink border-border hover:border-navy'
              }`}
            >
              <div className="text-xs">Industry / CSR</div>
              <div className="text-[10px] font-normal opacity-80">उद्योग / सीएसआर पार्टनर</div>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 1: Personal & Contact Information */}
          <div className="border border-border p-4 bg-paper/50 rounded-[2px]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">person</span>
              <span>1. Personal &amp; Contact Details / व्यक्तिगत एवं संपर्क विवरण</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Full Name / पूरा नाम <span className="text-urgent">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Soren"
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Valid Mobile Number / मोबाइल नंबर <span className="text-urgent">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-[2px] border border-r-0 border-border bg-paper text-xs font-mono text-ink-muted">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    className="w-full rounded-r-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-mono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <span className="text-[10px] text-ink-muted mt-0.5 block">
                  10-digit Indian mobile number for SMS &amp; grievance alerts.
                </span>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Email Address / ईमेल पता <span className="text-urgent">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.soren@example.com"
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Organization (Conditional for University / Industry) */}
              {role !== 'citizen' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    {role === 'university'
                      ? 'University / Institution Name / विश्वविद्यालय का नाम *'
                      : 'Company / CSR Entity Name / कंपनी / संगठन का नाम *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      role === 'university'
                        ? 'e.g. Birla Institute of Technology (BIT) Mesra'
                        : 'e.g. Tata Steel Foundation CSR'
                    }
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Geographic & Location Details (For Citizens) */}
          <div className="border border-border p-4 bg-paper/50 rounded-[2px]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">location_on</span>
              <span>2. Geographic &amp; Residential Location / झारखंड क्षेत्रीय विवरण</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* District Dropdown (24 Districts) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  District / जिला <span className="text-urgent">*</span>
                </label>
                <select
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-sans"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Taluka / Block */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Taluka / Block / प्रखंड / अनुमंडल <span className="text-urgent">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamar / Namkum / Jharia"
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                />
              </div>

              {/* City or Village / Ward */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  City or Village / Ward / गाँव / शहर / वार्ड <span className="text-urgent">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salgadih Village / Ward No. 14"
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  value={villageOrCity}
                  onChange={(e) => setVillageOrCity(e.target.value)}
                />
              </div>

              {/* Postal Pincode */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Pincode / पिन कोड <span className="text-urgent">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 835225"
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-mono"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Security Credentials */}
          <div className="border border-border p-4 bg-paper/50 rounded-[2px]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">lock</span>
              <span>3. Security Credentials / सुरक्षा पासवर्ड</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Create Password / पासवर्ड (min 6 chars) <span className="text-urgent">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Confirm Password / पासवर्ड की पुष्टि करें <span className="text-urgent">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-urgent/10 border border-urgent/30 text-urgent text-xs rounded-[2px] font-medium flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs uppercase tracking-wider font-bold shadow-sm"
          >
            {loading ? 'Processing Registration…' : 'Complete Registration / खाता पंजीकृत करें →'}
          </Button>

          {/* Legal / Institutional Verification Notice */}
          <p className="text-[11px] text-ink-muted text-center font-mono leading-relaxed pt-1">
            By registering, your account will be linked to the state-level grievance and innovation database under Department of Higher &amp; Technical Education, Government of Jharkhand.
          </p>
        </form>

        {/* Existing User Link */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>Already registered with Samadhan Setu?</span>
          <Link to="/login" className="font-bold text-navy hover:underline">
            Sign In to Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
