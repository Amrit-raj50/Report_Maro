import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import {
  JHARKHAND_UNIVERSITIES,
  JHARKHAND_DEPARTMENTS,
  getUniversityById,
} from '../data/jharkhandUniversities.js';

interface PostalPostOffice {
  Name: string;
  District: string;
  Block: string;
  State: string;
  Pincode: string;
}

export type UniversityRegisterSubRole = 'student' | 'mentor' | 'institution';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);

  const searchParams = new URLSearchParams(location.search);
  const queryRole = searchParams.get('role');
  const queryType = searchParams.get('type');

  // Role
  const [role, setRole] = useState<UserRole>(() => {
    if (queryRole === 'university') return 'university';
    if (queryRole === 'industry') return 'industry';
    return 'citizen';
  });

  // University Sub-Role
  const [univSubRole, setUnivSubRole] = useState<UniversityRegisterSubRole>(() => {
    if (queryType === 'mentor') return 'mentor';
    if (queryType === 'institution' || queryType === 'dean') return 'institution';
    return 'student';
  });

  // University Academic Fields
  const [selectedUnivId, setSelectedUnivId] = useState<string>('nitjsr');
  const [customUnivName, setCustomUnivName] = useState('');
  const [department, setDepartment] = useState<string>(JHARKHAND_DEPARTMENTS[0] || 'Computer Science & Engineering');
  const [customDepartment, setCustomDepartment] = useState('');

  // Student-specific fields
  const [rollNumber, setRollNumber] = useState('');
  const [academicYear, setAcademicYear] = useState('3rd Year (6th Semester)');
  const [apaarId, setApaarId] = useState('');
  const [researchInterest, setResearchInterest] = useState('');

  // Mentor-specific fields
  const [facultyDesignation, setFacultyDesignation] = useState('Associate Professor');
  const [facultyId, setFacultyId] = useState('');
  const [vidwanId, setVidwanId] = useState('');
  const [researchLab, setResearchLab] = useState('');

  // Institutional Admin-specific fields
  const [adminDesignation, setAdminDesignation] = useState('Dean (R&D)');
  const [aisheCodeInput, setAisheCodeInput] = useState('U-0205');
  const [nodalOrderRef, setNodalOrderRef] = useState('');

  // Industry-specific fields
  const [corporateCin, setCorporateCin] = useState('');
  const [corporateDesignation, setCorporateDesignation] = useState('CSR Head / Nodal Manager');

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

  // Organization (for general fallback or industry)
  const [organization, setOrganization] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    if (queryRole === 'university') setRole('university');
    else if (queryRole === 'industry') setRole('industry');
    else if (queryRole === 'citizen') setRole('citizen');

    if (queryType === 'mentor') setUnivSubRole('mentor');
    else if (queryType === 'institution' || queryType === 'dean') setUnivSubRole('institution');
    else if (queryType === 'student') setUnivSubRole('student');
  }, [queryRole, queryType]);

  // When university is selected, auto-update campus location & AISHE code
  useEffect(() => {
    if (role === 'university' && selectedUnivId !== '__other__') {
      const u = getUniversityById(selectedUnivId);
      if (u) {
        setDistrict(u.district);
        setPincode(u.pincode);
        setVillageOrCity(u.city);
        setAisheCodeInput(u.aisheCode);
      }
    }
  }, [role, selectedUnivId]);

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

    // 3. Citizen-specific geographic validations
    let effectiveTaluka = taluka === '__other__' ? customTaluka.trim() : taluka.trim();
    let effectiveVillage = villageOrCity === '__custom__' ? customVillage.trim() : villageOrCity.trim();

    if (role === 'citizen') {
      if (pincode && !/^\d{6}$/.test(pincode.trim())) {
        setError('Please enter a valid 6-digit postal pincode.');
        return;
      }
      if (!effectiveTaluka) {
        setError('Please select or specify your Taluka / Block.');
        return;
      }
      if (!effectiveVillage) {
        setError('Please select or specify your City / Village / Ward.');
        return;
      }
    }

    // 4. Resolve university institutional organization string
    let finalOrg = organization.trim();
    const effectiveUnivName =
      selectedUnivId === '__other__'
        ? customUnivName.trim() || 'Affiliated Institution'
        : getUniversityById(selectedUnivId)?.name || 'NIT Jamshedpur';
    const effectiveDept =
      department === '__other__' ? customDepartment.trim() || 'General' : department;

    if (role === 'university') {
      if (univSubRole === 'student') {
        finalOrg = `${effectiveUnivName} | Dept: ${effectiveDept} | Role: Student (${rollNumber.trim() || 'Enrolled'})`;
      } else if (univSubRole === 'mentor') {
        finalOrg = `${effectiveUnivName} | Dept: ${effectiveDept} | Role: Faculty Mentor (${facultyDesignation}${facultyId ? `, ID: ${facultyId.trim()}` : ''})`;
      } else {
        finalOrg = `${effectiveUnivName} | Role: Institutional Admin (${adminDesignation}, AISHE: ${aisheCodeInput.trim() || 'U-0205'})`;
      }
    } else if (role === 'industry') {
      finalOrg = organization.trim() || 'Industry / CSR Co-sponsor';
    }

    // 5. Validate with shared Zod schema
    const parsed = registerRequestSchema.safeParse({
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      role,
      organization: finalOrg || undefined,
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

      // Save client profile details in localStorage for enriched dashboard experience
      if (role === 'university') {
        try {
          localStorage.setItem(
            'samadhansetu_university_profile',
            JSON.stringify({
              univId: selectedUnivId,
              univName: effectiveUnivName,
              subRole: univSubRole,
              department: effectiveDept,
              rollNumber,
              facultyId,
              designation: univSubRole === 'mentor' ? facultyDesignation : adminDesignation,
            }),
          );
        } catch {
          // ignore localStorage failure
        }
      }

      // Smart role-based redirect
      if (role === 'citizen') {
        navigate('/dashboard');
      } else if (role === 'university') {
        if (univSubRole === 'student') {
          navigate('/student');
        } else if (univSubRole === 'mentor') {
          navigate('/university/mentor');
        } else {
          navigate('/university');
        }
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
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-wider">
              झारखंड सरकार · नागरिक एवं संस्था पंजीकरण (NIC &amp; LGD Integrated)
            </span>
            <span className="text-[10px] font-mono bg-paper px-2 py-0.5 border border-border text-ink-muted">
              NEP 2020 / AISHE
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mt-1">
            Stakeholder Registration / पंजीकरण
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Official portal to crowdsource societal challenges, civic grievances, and university-industry innovation pipelines.
          </p>
        </div>

        {/* ROLE SELECTOR TABS */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 font-mono">
            Select Account Type / खाता प्रकार चुनें
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('citizen')}
              className={`p-3 text-xs font-bold rounded-[2px] border transition-colors text-center ${
                role === 'citizen'
                  ? 'bg-navy text-white border-navy shadow-sm'
                  : 'bg-paper text-ink border-border hover:border-navy'
              }`}
            >
              <div className="text-sm mb-0.5">👥 Citizen</div>
              <div className="text-[10px] font-normal opacity-85">
                नागरिक / जन प्रतिनिधि
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('university')}
              className={`p-3 text-xs font-bold rounded-[2px] border transition-colors text-center ${
                role === 'university'
                  ? 'bg-forest text-white border-forest shadow-sm'
                  : 'bg-paper text-ink border-border hover:border-forest'
              }`}
            >
              <div className="text-sm mb-0.5">🎓 University</div>
              <div className="text-[10px] font-normal opacity-85">
                छात्र · संरक्षक · संस्थान
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('industry')}
              className={`p-3 text-xs font-bold rounded-[2px] border transition-colors text-center ${
                role === 'industry'
                  ? 'bg-navy text-white border-navy shadow-sm'
                  : 'bg-paper text-ink border-border hover:border-navy'
              }`}
            >
              <div className="text-sm mb-0.5">💼 Industry / CSR</div>
              <div className="text-[10px] font-normal opacity-85">
                उद्योग / सीएसआर पार्टनर
              </div>
            </button>
          </div>
        </div>

        {/* UNIVERSITY SPECIFIC SUB-ROLE TABS */}
        {role === 'university' && (
          <div className="mb-6 p-4 bg-forest/10 border-2 border-forest/40 rounded-[2px]">
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2 font-mono">
              University Ecosystem Role / विश्वविद्यालय संवर्ग चुनें
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUnivSubRole('student')}
                className={`p-2.5 text-left rounded-[2px] border transition-colors ${
                  univSubRole === 'student'
                    ? 'bg-white border-forest shadow-sm text-forest'
                    : 'bg-paper/80 border-border hover:border-forest text-ink'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>👨‍🎓 Student Innovator</span>
                </div>
                <div className="text-[10px] text-ink-muted mt-0.5">
                  Undergrad / Postgrad Team Researcher
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUnivSubRole('mentor')}
                className={`p-2.5 text-left rounded-[2px] border transition-colors ${
                  univSubRole === 'mentor'
                    ? 'bg-white border-forest shadow-sm text-forest'
                    : 'bg-paper/80 border-border hover:border-forest text-ink'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>👨‍🏫 Faculty Mentor</span>
                </div>
                <div className="text-[10px] text-ink-muted mt-0.5">
                  Professor / Guide / Principal Investigator
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUnivSubRole('institution')}
                className={`p-2.5 text-left rounded-[2px] border transition-colors ${
                  univSubRole === 'institution'
                    ? 'bg-white border-forest shadow-sm text-forest'
                    : 'bg-paper/80 border-border hover:border-forest text-ink'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>🏛️ Institution Node</span>
                </div>
                <div className="text-[10px] text-ink-muted mt-0.5">
                  Dean R&amp;D / Registrar / Nodal Officer
                </div>
              </button>
            </div>
          </div>
        )}

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 1: Personal & Contact Information */}
          <div className="border border-border p-4 bg-paper/50 rounded-[2px]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 mb-3 flex items-center gap-1.5 font-mono">
              <span className="material-symbols-outlined text-base">person</span>
              <span>
                1. Personal &amp; Identity Details / व्यक्तिगत विवरण
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
                  placeholder={
                    role === 'university' && univSubRole === 'mentor'
                      ? 'e.g. Dr. Rajesh Sharma'
                      : role === 'university' && univSubRole === 'student'
                        ? 'e.g. Himmat Singh'
                        : 'e.g. Ramesh Kumar Soren'
                  }
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                  Mobile Number / मोबाइल नंबर <span className="text-urgent">*</span>
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
                  10-digit Indian mobile number for SMS OTP alerts.
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
                  placeholder={
                    role === 'university'
                      ? 'e.g. scholar@nitjsr.ac.in'
                      : 'e.g. user@example.com'
                  }
                  className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {role === 'university' && (
                  <span className="text-[10px] text-forest mt-0.5 block font-mono">
                    Use institutional domain for fast auto-verification.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2A: UNIVERSITY ACADEMIC PROFILE (When University Role is Selected) */}
          {role === 'university' && (
            <div className="border border-forest/40 p-4 bg-paper/60 rounded-[2px] space-y-4">
              <div className="border-b border-border pb-1.5 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-base">school</span>
                  <span>
                    2. University &amp; Academic Affiliation / शैक्षणिक विवरण
                  </span>
                </h2>
                <span className="text-[10px] font-mono bg-forest/10 px-2 py-0.5 text-forest font-bold rounded-[2px]">
                  {univSubRole.toUpperCase()} DESK
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* University Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Select University / Institution / विश्वविद्यालय चुनें <span className="text-urgent">*</span>
                  </label>
                  <select
                    value={selectedUnivId}
                    onChange={(e) => setSelectedUnivId(e.target.value)}
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                  >
                    {JHARKHAND_UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (AISHE: {u.aisheCode} · {u.city})
                      </option>
                    ))}
                    <option value="__other__">Other Affiliated College / Polytechnic Institute…</option>
                  </select>

                  {selectedUnivId === '__other__' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        required
                        placeholder="Enter full name of your college or university"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                        value={customUnivName}
                        onChange={(e) => setCustomUnivName(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Academic Department */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Department / संकाय <span className="text-urgent">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                  >
                    {JHARKHAND_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                    <option value="__other__">Other Department / Specialization…</option>
                  </select>

                  {department === '__other__' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        required
                        placeholder="Enter your department name"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* STUDENT SPECIFIC FIELDS */}
                {univSubRole === 'student' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Student Roll No. / Enrollment ID <span className="text-urgent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2022UGCS045"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest font-mono uppercase"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Current Academic Year / Semester <span className="text-urgent">*</span>
                      </label>
                      <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                      >
                        <option value="1st Year (1st/2nd Sem)">1st Year (1st/2nd Sem)</option>
                        <option value="2nd Year (3rd/4th Sem)">2nd Year (3rd/4th Sem)</option>
                        <option value="3rd Year (6th Semester)">3rd Year (5th/6th Sem)</option>
                        <option value="4th Year (7th/8th Sem)">4th Year (7th/8th Sem)</option>
                        <option value="Postgraduate / M.Tech">Postgraduate / M.Tech</option>
                        <option value="Ph.D. Scholar">Ph.D. Scholar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        APAAR ID / ABC ID (Optional - NEP 2020)
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="12-digit Academic Bank of Credits ID"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest font-mono"
                        value={apaarId}
                        onChange={(e) => setApaarId(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Innovation Team / Topic Focus
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Namkum Water Telemetry Team"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                        value={researchInterest}
                        onChange={(e) => setResearchInterest(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* MENTOR SPECIFIC FIELDS */}
                {univSubRole === 'mentor' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Faculty Designation <span className="text-urgent">*</span>
                      </label>
                      <select
                        value={facultyDesignation}
                        onChange={(e) => setFacultyDesignation(e.target.value)}
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                      >
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Professor">Professor</option>
                        <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                        <option value="Dean / Director">Dean / Director</option>
                        <option value="Visiting Research Guide">Visiting Research Guide</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Faculty Employee ID / कोड <span className="text-urgent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. FAC-CSE-108"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest font-mono uppercase"
                        value={facultyId}
                        onChange={(e) => setFacultyId(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Vidwan / ORCID ID (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VIDWAN-948102"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest font-mono"
                        value={vidwanId}
                        onChange={(e) => setVidwanId(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Research Lab / CoE Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. IoT &amp; Environmental Sensing Lab"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                        value={researchLab}
                        onChange={(e) => setResearchLab(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* INSTITUTIONAL ADMIN SPECIFIC FIELDS */}
                {univSubRole === 'institution' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Administrative Designation <span className="text-urgent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dean (Research &amp; Consultancy)"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest"
                        value={adminDesignation}
                        onChange={(e) => setAdminDesignation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Institutional AISHE Code <span className="text-urgent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. U-0205"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest font-mono"
                        value={aisheCodeInput}
                        onChange={(e) => setAisheCodeInput(e.target.value)}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Nodal Order / Registrar Authorisation Ref
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. NITJSR/RD/2026/ORD-412"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-forest font-mono"
                        value={nodalOrderRef}
                        onChange={(e) => setNodalOrderRef(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* SECTION 2B: INDUSTRY / CSR PROFILE */}
          {role === 'industry' && (
            <div className="border border-border p-4 bg-paper/50 rounded-[2px] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 mb-3 flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-base">business</span>
                <span>2. Corporate &amp; CSR Partnership Profile / कॉर्पोरेट विवरण</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Company / CSR Entity Name <span className="text-urgent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Steel Foundation CSR / Central Coalfields Limited"
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Corporate CIN or CSR Reg No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. L27100MH1907PLC000260"
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-mono"
                    value={corporateCin}
                    onChange={(e) => setCorporateCin(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Designation / Role in Entity <span className="text-urgent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead - Tribal Development &amp; Rural R&amp;D"
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                    value={corporateDesignation}
                    onChange={(e) => setCorporateDesignation(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2C: CITIZEN GEOGRAPHIC & LGD DETAILS (For Citizens) */}
          {role === 'citizen' && (
            <div className="border border-border p-4 bg-paper/50 rounded-[2px]">
              <div className="border-b border-border pb-1.5 mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span>
                    2. Geographic &amp; Residential Location / झारखंड LGD प्रशासनिक विवरण
                  </span>
                </h2>

                <div className="text-[10px] font-mono bg-paper-dark px-2 py-0.5 border border-border rounded-[2px] text-ink-muted">
                  State: Jharkhand (Code 20)
                  {selectedDistrictObj && ` · Dist LGD: ${selectedDistrictObj.code}`}
                  {selectedBlockObj && ` · Blk LGD: ${selectedBlockObj.code}`}
                  {selectedVillageObj && ` · GP/Ward: ${selectedVillageObj.code}`}
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
                    District / जिला (LGD 24 Districts) <span className="text-urgent">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d.code} value={d.name}>
                        {d.name} ({d.nameLocal}) · Code: {d.code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Block / Taluka Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    Taluka / Block / प्रखंड (LGD) <span className="text-urgent">*</span>
                  </label>
                  <select
                    value={taluka}
                    onChange={(e) => setTaluka(e.target.value)}
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                  >
                    {availableBlocks.map((b) => (
                      <option key={b.code} value={b.name}>
                        {b.name} · LGD: {b.code}
                      </option>
                    ))}
                    <option value="__other__">Other / Block not listed…</option>
                  </select>
                </div>

                {taluka === '__other__' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                      Specify Taluka / Block Name <span className="text-urgent">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sonahatu"
                      className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                      value={customTaluka}
                      onChange={(e) => setCustomTaluka(e.target.value)}
                    />
                  </div>
                )}

                {/* Village / Gram Panchayat / Ward Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
                    City / Gram Panchayat / Ward / गाँव / पंचायत <span className="text-urgent">*</span>
                  </label>

                  {localities.length > 0 ? (
                    <div className="space-y-2">
                      <select
                        value={villageOrCity}
                        onChange={(e) => setVillageOrCity(e.target.value)}
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-mono"
                      >
                        <optgroup label="── Localities from India Post PIN Lookup ──">
                          {localities.map((loc) => (
                            <option key={`po-${loc}`} value={loc}>
                              📮 {loc}
                            </option>
                          ))}
                        </optgroup>
                        {availableVillages.length > 0 && (
                          <optgroup label="── Official LGD Gram Panchayats ──">
                            {availableVillages.map((v) => (
                              <option key={`lgd-${v.code}`} value={v.name}>
                                🏛️ {v.name} ({v.type})
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <option value="__custom__">Type a custom Village / Tola / Locality…</option>
                      </select>
                    </div>
                  ) : availableVillages.length > 0 ? (
                    <select
                      value={villageOrCity}
                      onChange={(e) => setVillageOrCity(e.target.value)}
                      className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                    >
                      {availableVillages.map((v) => (
                        <option key={v.code} value={v.name}>
                          {v.name} ({v.type}) · LGD: {v.code}
                        </option>
                      ))}
                      <option value="__custom__">Other Village / Mohalla / Custom Tola…</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Morabadi / Kanke Village / Ward 4"
                      className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                      value={villageOrCity}
                      onChange={(e) => setVillageOrCity(e.target.value)}
                    />
                  )}

                  {villageOrCity === '__custom__' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        required
                        placeholder="Type your Village / Tola / Mohalla name"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                        value={customVillage}
                        onChange={(e) => setCustomVillage(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Security Credentials */}
          <div className="border border-border p-4 bg-paper/50 rounded-[2px]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 mb-3 flex items-center gap-1.5 font-mono">
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
                  Confirm Password / पासवर्ड पुष्टि <span className="text-urgent">*</span>
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
              : role === 'university'
                ? `Complete Registration as ${univSubRole === 'student' ? 'Student Innovator' : univSubRole === 'mentor' ? 'Faculty Mentor' : 'Institution Node'} →`
                : role === 'industry'
                  ? 'Register Corporate CSR Entity →'
                  : 'Complete Registration / खाता पंजीकृत करें →'}
          </Button>

          {/* Institutional Compliance Notice */}
          <p className="text-[11px] text-ink-muted text-center font-mono leading-relaxed pt-1">
            By registering, your account will be indexed in the Jharkhand State Innovation &amp; Grievance Registry under Department of Higher &amp; Technical Education.
          </p>
        </form>

        {/* Existing User Link */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>Already registered with Samadhan Setu?</span>
          <Link
            to={`/login?role=${role}${role === 'university' ? `&type=${univSubRole}` : ''}`}
            className="font-bold text-navy hover:underline"
          >
            Sign In to Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
