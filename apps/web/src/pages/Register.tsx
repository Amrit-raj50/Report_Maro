import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequestSchema, type UserRole } from '@sih/shared-types';
import { apiClient, apiErrorMessage } from '../lib/apiClient.js';
import { useAuthStore } from '../store/authStore.js';
import { Button } from '../components/Button.js';
import {
  JHARKHAND_DISTRICTS,
  getBlocksForDistrict,
  getDistrictByName,
  getVillagesForBlock,
} from '../data/jharkhandLgd.js';

interface PostalPostOffice {
  Name: string;
  District: string;
  Block: string;
  State: string;
  Pincode: string;
}

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
  const [pincode, setPincode] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [taluka, setTaluka] = useState('Kanke');
  const [customTaluka, setCustomTaluka] = useState('');
  const [villageOrCity, setVillageOrCity] = useState('');
  const [customVillage, setCustomVillage] = useState('');

  // India Post Auto-detect State
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeFeedback, setPincodeFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [localities, setLocalities] = useState<string[]>([]);

  // Organization (for university/industry)
  const [organization, setOrganization] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get official LGD blocks for currently selected district
  const availableBlocks = useMemo(() => {
    return getBlocksForDistrict(district);
  }, [district]);

  // Selected LGD District & Block objects
  const selectedDistrictObj = useMemo(() => {
    return getDistrictByName(district) || JHARKHAND_DISTRICTS[0];
  }, [district]);

  const selectedBlockObj = useMemo(() => {
    return availableBlocks.find(
      (b) => b.name.toLowerCase() === taluka.trim().toLowerCase(),
    );
  }, [availableBlocks, taluka]);

  // Available Gram Panchayats / Wards for selected Block
  const availableVillages = useMemo(() => {
    if (taluka === '__other__' || !taluka) return [];
    return getVillagesForBlock(taluka);
  }, [taluka]);

  // Selected Village / Ward object
  const selectedVillageObj = useMemo(() => {
    return availableVillages.find(
      (v) => v.name.toLowerCase() === villageOrCity.trim().toLowerCase(),
    );
  }, [availableVillages, villageOrCity]);

  // Keep taluka valid when district changes
  useEffect(() => {
    if (taluka === '__other__') return;
    const exists = availableBlocks.some(
      (b) => b.name.toLowerCase() === taluka.trim().toLowerCase(),
    );
    if (!exists && availableBlocks.length > 0 && availableBlocks[0]) {
      setTaluka(availableBlocks[0].name);
    }
  }, [district, availableBlocks, taluka]);

  // Keep village valid when block changes
  useEffect(() => {
    if (villageOrCity === '__custom__') return;
    if (availableVillages.length > 0) {
      const existsInVillages = availableVillages.some(
        (v) => v.name.toLowerCase() === villageOrCity.trim().toLowerCase(),
      );
      const existsInLocalities = localities.some(
        (l) => l.toLowerCase() === villageOrCity.trim().toLowerCase(),
      );
      if (!existsInVillages && !existsInLocalities && availableVillages[0]) {
        setVillageOrCity(availableVillages[0].name);
      }
    }
  }, [availableVillages, localities, villageOrCity]);

  // Validate Indian Phone Number: 10 digits starting with 6, 7, 8, or 9
  const validatePhone = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  // Indian Postal Pincode Auto-Detection
  const handlePincodeLookup = async (pinToLookup: string) => {
    const cleanedPin = pinToLookup.trim().replace(/\D/g, '');
    if (cleanedPin.length !== 6) return;

    setPincodeLoading(true);
    setPincodeFeedback(null);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${cleanedPin}`,
      );
      const data = await response.json();

      if (
        Array.isArray(data) &&
        data[0]?.Status === 'Success' &&
        Array.isArray(data[0]?.PostOffice) &&
        data[0].PostOffice.length > 0
      ) {
        const poList: PostalPostOffice[] = data[0].PostOffice;
        const postOffice = poList[0];
        if (!postOffice) return;

        // Extract localities for dropdown
        const uniqueLocalities = Array.from(
          new Set(poList.map((po) => po.Name)),
        );
        setLocalities(uniqueLocalities);

        // Try to match District in Jharkhand LGD
        const poDistrict = postOffice.District || '';
        const poBlock = postOffice.Block || '';

        const matchedDist = JHARKHAND_DISTRICTS.find(
          (d) =>
            d.name.toLowerCase() === poDistrict.toLowerCase() ||
            poDistrict.toLowerCase().includes(d.name.toLowerCase()) ||
            d.name.toLowerCase().includes(poDistrict.toLowerCase()),
        );

        if (matchedDist) {
          setDistrict(matchedDist.name);

          // Try to match block
          const distBlocks = getBlocksForDistrict(matchedDist.code);
          const matchedBlk = distBlocks.find(
            (b) =>
              b.name.toLowerCase() === poBlock.toLowerCase() ||
              poBlock.toLowerCase().includes(b.name.toLowerCase()) ||
              b.name.toLowerCase().includes(poBlock.toLowerCase()),
          );

          if (matchedBlk) {
            setTaluka(matchedBlk.name);
          }

          // Auto-select first locality/village from India Post
          const firstLoc = uniqueLocalities[0];
          if (firstLoc) {
            setVillageOrCity(firstLoc);
          }

          setPincodeFeedback({
            type: 'success',
            text: `✓ India Post Verified: ${poDistrict} (${uniqueLocalities.length} localities found)`,
          });
        } else {
          setPincodeFeedback({
            type: 'success',
            text: `✓ India Post: Found ${poDistrict} (${uniqueLocalities.length} localities)`,
          });
        }
      } else {
        setPincodeFeedback({
          type: 'error',
          text: 'Pincode not found in India Post directory. You can select details from the dropdowns.',
        });
      }
    } catch {
      setPincodeFeedback({
        type: 'error',
        text: 'Postal service lookup offline. You can select District, Block & Village manually.',
      });
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      handlePincodeLookup(val);
    } else {
      setPincodeFeedback(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Phone number validation
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!validatePhone(cleanedPhone)) {
      setError(
        'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).',
      );
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

    // Resolve final taluka name
    const effectiveTaluka =
      taluka === '__other__' ? customTaluka.trim() : taluka.trim();

    if (role === 'citizen' && !effectiveTaluka) {
      setError('Please select or specify your Taluka / Block.');
      return;
    }

    // Resolve final village/ward name
    const effectiveVillage =
      villageOrCity === '__custom__' ? customVillage.trim() : villageOrCity.trim();

    if (role === 'citizen' && !effectiveVillage) {
      setError('Please select or specify your City / Village / Ward.');
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
      taluka: effectiveTaluka || undefined,
      village_or_city: effectiveVillage || undefined,
      pincode: pincode.trim() || undefined,
      lgd_district_code: selectedDistrictObj?.code,
      lgd_block_code: selectedBlockObj?.code,
    });

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? 'Invalid registration details',
      );
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', parsed.data);
      setSession(res.data.user, res.data.token);

      // Smart redirect
      if (role === 'citizen') {
        navigate('/dashboard');
      } else if (role === 'university') {
        navigate('/university');
      } else if (role === 'industry') {
        navigate('/industry');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        apiErrorMessage(
          err,
          'Could not create account. Email may already be in use.',
        ),
      );
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
            झारखंड सरकार · नागरिक एवं संस्था पंजीकरण (NIC &amp; LGD Integrated)
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1">
            Citizen &amp; Stakeholder Registration / पंजीकरण
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Official registration portal for crowdsourcing local societal
            challenges, civic grievances, and university-industry solutions.
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
              <div className="text-[10px] font-normal opacity-80">
                नागरिक / जन प्रतिनिधि
              </div>
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
              <div className="text-[10px] font-normal opacity-80">
                विश्वविद्यालय / शोध संस्थान
              </div>
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
              <div className="text-[10px] font-normal opacity-80">
                उद्योग / सीएसआर पार्टनर
              </div>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 1: Personal & Contact Information */}
          <div className="border border-border p-4 bg-paper/50 rounded-[2px]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">person</span>
              <span>
                1. Personal &amp; Contact Details / व्यक्तिगत एवं संपर्क विवरण
              </span>
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
                  Valid Mobile Number / मोबाइल नंबर{' '}
                  <span className="text-urgent">*</span>
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
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ''))
                    }
                  />
                </div>
                <span className="text-[10px] text-ink-muted mt-0.5 block">
                  10-digit Indian mobile number for SMS alerts.
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
            <div className="border-b border-border pb-1.5 mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  location_on
                </span>
                <span>
                  2. Geographic &amp; Residential Location / झारखंड LGD
                  प्रशासनिक विवरण
                </span>
              </h2>

              {/* LGD Official Metadata Tag */}
              <div className="text-[10px] font-mono bg-paper-dark px-2 py-0.5 border border-border rounded-[2px] text-ink-muted">
                State: Jharkhand (Code 20)
                {selectedDistrictObj &&
                  ` · District LGD: ${selectedDistrictObj.code}`}
                {selectedBlockObj && ` · Block LGD: ${selectedBlockObj.code}`}
                {selectedVillageObj && ` · GP/Ward LGD: ${selectedVillageObj.code}`}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Postal Pincode with Auto-Detect */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Postal Pincode / पिन कोड <span className="text-urgent">*</span>
                  </label>
                  <span className="text-[10px] text-forest font-mono">
                    ⚡ Auto-fills District, Block &amp; Village Dropdowns via India Post
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode (e.g. 834001, 827001)"
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-mono"
                    value={pincode}
                    onChange={handlePincodeChange}
                  />
                  <button
                    type="button"
                    disabled={pincodeLoading || pincode.length !== 6}
                    onClick={() => handlePincodeLookup(pincode)}
                    className="px-3 py-2 text-xs font-bold bg-paper border border-border hover:border-navy text-navy rounded-[2px] whitespace-nowrap disabled:opacity-50"
                  >
                    {pincodeLoading ? 'Checking...' : 'Lookup PIN'}
                  </button>
                </div>

                {/* Pincode Feedback Message */}
                {pincodeFeedback && (
                  <div
                    className={`mt-1.5 text-[11px] font-mono flex items-center gap-1 ${
                      pincodeFeedback.type === 'success'
                        ? 'text-forest font-bold'
                        : 'text-urgent'
                    }`}
                  >
                    <span>{pincodeFeedback.text}</span>
                  </div>
                )}
              </div>

              {/* District Dropdown (24 Official LGD Districts) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  District / जिला (LGD 24 Districts){' '}
                  <span className="text-urgent">*</span>
                </label>
                <select
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-sans"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name} ({d.nameLocal}) [LGD: {d.code}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Cascading Taluka / Block Dropdown (264 Official LGD Blocks) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Taluka / Block / प्रखंड ({availableBlocks.length} in{' '}
                  {district}) <span className="text-urgent">*</span>
                </label>
                <select
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-sans"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  required
                >
                  {availableBlocks.map((b) => (
                    <option key={b.code} value={b.name}>
                      {b.name} [LGD: {b.code}]
                    </option>
                  ))}
                  <option value="__other__">Other / Other Urban Body...</option>
                </select>
              </div>

              {/* Custom Block Input if Other selected */}
              {taluka === '__other__' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Enter Block or Municipality Name / प्रखंड या नगर निकाय का
                    नाम <span className="text-urgent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adityapur Municipal Corp / Kanke Urban"
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                    value={customTaluka}
                    onChange={(e) => setCustomTaluka(e.target.value)}
                  />
                </div>
              )}

              {/* DROPDOWN FOR CITY OR VILLAGE / WARD */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    City or Village / Ward / गाँव / शहर / वार्ड{' '}
                    <span className="text-urgent">*</span>
                  </label>
                  <span className="text-[10px] text-ink-muted font-mono">
                    {availableVillages.length > 0
                      ? `${availableVillages.length} Panchayats/Wards in ${taluka}`
                      : 'Select from official LGD list'}
                  </span>
                </div>

                <select
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-sans"
                  value={villageOrCity}
                  onChange={(e) => setVillageOrCity(e.target.value)}
                  required
                >
                  <option value="">-- Select Village / Gram Panchayat / Ward --</option>

                  {/* India Post Localities Group if available */}
                  {localities.length > 0 && (
                    <optgroup label={`India Post Localities (PIN ${pincode})`}>
                      {localities.map((loc) => (
                        <option key={`po-${loc}`} value={loc}>
                          📍 {loc} (Postal Area)
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Official LGD Gram Panchayats / Wards */}
                  {availableVillages.length > 0 && (
                    <optgroup label={`Official LGD Gram Panchayats / Wards (${taluka})`}>
                      {availableVillages.map((v) => (
                        <option key={v.code} value={v.name}>
                          {v.name} ({v.type}) [LGD: {v.code}]
                        </option>
                      ))}
                    </optgroup>
                  )}

                  <option value="__custom__">✍️ Other / Enter Custom Village or Tola...</option>
                </select>

                {/* Custom Village/Ward input if user selects custom */}
                {villageOrCity === '__custom__' && (
                  <div className="mt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                      Type Your Village / Tola / Locality / मोहल्ला / टोला का नाम <span className="text-urgent">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Salgadih Tola / Morabadi Housing Colony / Ward 12"
                      className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                      value={customVillage}
                      onChange={(e) => setCustomVillage(e.target.value)}
                    />
                  </div>
                )}

                <span className="text-[10px] text-ink-muted mt-1 block">
                  Select your Gram Panchayat or Ward from the official LGD directory, or choose &apos;Other&apos; to type a custom village.
                </span>
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
                  Create Password / पासवर्ड (min 6 chars){' '}
                  <span className="text-urgent">*</span>
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
                  Confirm Password / पासवर्ड की पुष्टि करें{' '}
                  <span className="text-urgent">*</span>
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
            {loading
              ? 'Processing Registration…'
              : 'Complete Registration / खाता पंजीकृत करें →'}
          </Button>

          {/* Legal / Institutional Verification Notice */}
          <p className="text-[11px] text-ink-muted text-center font-mono leading-relaxed pt-1">
            By registering, your account will be linked to the state-level
            grievance and innovation database under Department of Higher &amp;
            Technical Education, Government of Jharkhand.
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
