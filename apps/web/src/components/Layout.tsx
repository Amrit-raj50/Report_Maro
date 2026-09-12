import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useLanguageStore } from '../store/languageStore.js';
import { translations } from '../utils/translations.js';
import { useSocketConnection } from '../hooks/useSocket.js';
import { NotificationBell } from './NotificationBell.js';
import { LogoutPromptModal } from './LogoutPromptModal.js';
import { getDefaultPortalForUser, getUniversitySubRole } from '../utils/portalRouting.js';

export function Layout() {
  useSocketConnection();
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Back button guard for active portal sessions
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    if (!user) {
      setShowLogoutModal(false);
      return;
    }

    // Push guard history entry so browser back button pops this dummy state instead of leaving the portal
    window.history.pushState({ authGuard: true }, '', window.location.href);

    const onPopState = () => {
      if (isLoggingOutRef.current) return;

      // Trap the back navigation: re-push current URL to remain on the active portal page
      window.history.pushState({ authGuard: true }, '', window.location.href);

      // Trigger the logout confirmation prompt
      setShowLogoutModal(true);
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [user, location.pathname]);

  const handleModalStay = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    isLoggingOutRef.current = true;
    setShowLogoutModal(false);
    clearSession();
    try {
      localStorage.removeItem('samadhansetu_university_profile');
    } catch {
      // ignore
    }
    navigate('/login', { replace: true });
  };
  const isUniversity = location.pathname.startsWith('/university');
  const [fontScale, setFontScale] = useState<number>(1);
  const { lang, toggleLang } = useLanguageStore();
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [registerMenuOpen, setRegisterMenuOpen] = useState(false);
  const [univDropdownOpen, setUnivDropdownOpen] = useState(false);

  // Close all open menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLoginMenuOpen(false);
    setRegisterMenuOpen(false);
    setUnivDropdownOpen(false);
  }, [location.pathname]);

  // Global click outside listener to reliably close dropdowns
  useEffect(() => {
    const handleGlobalClick = () => {
      setLoginMenuOpen(false);
      setRegisterMenuOpen(false);
      setUnivDropdownOpen(false);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Handle font size scaling accessibility toggle
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-turmeric selection:text-ink">
      {/* ============================================================ */}
      {/* HEADER: THREE-BAND GOVERNMENT STRUCTURE                      */}
      {/* ============================================================ */}
      <header className="w-full border-b border-border bg-paper z-30">
        {/* BAND 1: UTILITY BAR */}
        <div className="w-full bg-navy text-white py-1 px-3 sm:px-4 text-xs font-sans border-b border-navy-deep">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-3">
            {/* Helpline and email */}
            <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
              <span>
                <strong className="font-semibold text-turmeric">{t.helpline.split(':')[0]}:</strong>{t.helpline.split(':')[1]}
              </span>
              <span className="opacity-40 hidden sm:inline">|</span>
              <span className="hidden md:inline">
                <strong className="font-semibold text-turmeric">{t.support}:</strong>{' '}
                support.samadhansetu@jharkhand.gov.in
              </span>
            </div>

            {/* Accessibility & Language Toggles */}
            <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs">
              {/* Font scaling buttons */}
              <div className="flex items-center gap-1 border-r border-white/20 pr-2">
                <button
                  type="button"
                  onClick={() => setFontScale(0.9)}
                  className={`px-1 py-0.2 hover:text-turmeric transition-colors ${fontScale === 0.9 ? 'text-turmeric font-bold' : ''}`}
                  title="Decrease text size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale(1)}
                  className={`px-1 py-0.2 hover:text-turmeric transition-colors ${fontScale === 1 ? 'text-turmeric font-bold' : ''}`}
                  title="Default text size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale(1.15)}
                  className={`px-1 py-0.2 hover:text-turmeric transition-colors ${fontScale === 1.15 ? 'text-turmeric font-bold' : ''}`}
                  title="Increase text size"
                >
                  A+
                </button>
              </div>

              {/* Language toggle */}
              <button
                type="button"
                onClick={toggleLang}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-white/10 hover:bg-white/20 border border-white/20 hover:border-turmeric text-white transition-all font-medium text-[10px] sm:text-xs cursor-pointer select-none"
                title={lang === 'en' ? 'हिन्दी में बदलें / Switch to Hindi' : 'Switch to English / अंग्रेज़ी में बदलें'}
                aria-label="Toggle Language"
              >
                <span className="text-[12px]">🌐</span>
                <span className={lang === 'en' ? 'text-turmeric font-bold' : 'text-white/70'}>English</span>
                <span className="text-white/40">/</span>
                <span className={lang === 'hi' ? 'text-turmeric font-bold' : 'text-white/70'}>हिन्दी</span>
              </button>

              <span className="opacity-40 hidden sm:inline">|</span>
              <a href="#main-content" className="hover:underline hidden lg:inline">
                {t.skipToContent}
              </a>

              {user ? (
                <>
                  <span className="opacity-40">|</span>
                  <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-turmeric">
                    <span className="max-w-[120px] sm:max-w-none truncate">
                      {user.full_name} ({user.role.toUpperCase()})
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-white hover:text-urgent underline ml-1 font-sans cursor-pointer"
                    >
                      {t.logout}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="opacity-40">|</span>
                  <Link to="/login" className="hover:text-turmeric underline font-medium">
                    {t.signIn}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* BAND 2: IDENTITY BAR */}
        <div className="w-full bg-paper border-b border-border py-2.5 sm:py-3 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* State Emblem & Platform Title */}
            <Link to={user ? getDefaultPortalForUser(user) : "/"} className="flex items-center gap-3 group text-center md:text-left">
              {/* Circular Emblem Crest */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-Saiq8B8HfuJ4idwInA2z4XrnYcglrpW8bRdUTgZg5iXUb0e_TnzlHMlZlopZXeOXOYukXp0nesbHgwQK9l_Pp6se0AyCWFS4ziY870E-CQTJo0b-fdaP6NMuLbhSJhhIfCUG3J0PozKv_wHL5tAjIKPlKHqNcOUsRQUtWG5OtawQ9TbeJ5cDnjxkvJBcVVnYl8-hn2TGt2btwhJDFSmub6fzbIavbHEUR98gdp5KmsOH-CpBr8k"
                alt="Emblem of Jharkhand"
                className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full border border-border object-cover bg-white"
              />

              {/* Stacked Bilingual Authority Title */}
              <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-forest leading-tight">
                  झारखंड सरकार · उच्च एवं तकनीकी शिक्षा विभाग
                </div>
                <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                  GOVERNMENT OF JHARKHAND · DEPT. OF HIGHER &amp; TECHNICAL EDUCATION
                </div>
                <div className="font-display text-lg sm:text-2xl text-navy font-bold tracking-tight mt-0.5 leading-none">
                  समाधान सेतु{' '}
                  <span className="text-ink-muted font-normal text-base sm:text-lg">
                    / SAMADHAN SETU
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-ink-muted hidden sm:block">
                  {t.portalTagline}
                </div>
              </div>
            </Link>

            {/* Right: SIH / Digital India Badges & Portal Login */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right font-mono text-[11px] text-ink-muted border-r border-border pr-4 leading-snug">
                <span className="font-bold text-navy">SMART INDIA HACKATHON 2026</span>
                <span>Problem Statement: PS 26043</span>
                <span className="text-forest font-semibold">
                  National Education Policy (NEP 2020)
                </span>
              </div>

              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <NotificationBell />
                  <Link
                    to={getDefaultPortalForUser(user)}
                    className={`px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-[2px] border transition-colors uppercase tracking-wide flex items-center gap-1.5 ${
                      user.role === 'university'
                        ? 'bg-turmeric text-ink border-turmeric-deep hover:bg-turmeric-deep'
                        : 'bg-navy text-white border-navy hover:bg-navy-deep'
                    }`}
                  >
                    <span>
                      {user.role === 'university'
                        ? getUniversitySubRole(user) === 'mentor'
                          ? '👨‍🏫 Mentor Workspace'
                          : getUniversitySubRole(user) === 'student'
                            ? '👨‍🎓 Student Desk'
                            : '🏛️ University Dashboard'
                        : user.role === 'admin'
                          ? '⚙️ Admin Dashboard'
                          : user.role === 'industry'
                            ? '💼 Industry Portal'
                            : '📋 My Dashboard'}
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 relative">
                  {/* PORTAL LOGIN DROPDOWN */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRegisterMenuOpen(false);
                        setUnivDropdownOpen(false);
                        setLoginMenuOpen((v) => !v);
                      }}
                      className={`px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-[2px] border transition-all uppercase tracking-wide flex items-center gap-1.5 shadow-sm cursor-pointer select-none ${
                        loginMenuOpen
                          ? 'bg-navy text-white border-navy ring-2 ring-navy/20'
                          : 'bg-white text-navy border-navy hover:bg-paper'
                      }`}
                      aria-expanded={loginMenuOpen}
                    >
                      <span>{t.portalLogin}</span>
                      <span className={`text-[9px] transition-transform duration-200 inline-block ${loginMenuOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {loginMenuOpen && (
                      <div
                        className="absolute right-0 top-full mt-1.5 w-64 bg-white border-2 border-navy rounded-[2px] shadow-2xl z-50 py-1 font-sans"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-1 bg-navy text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                          {lang === 'hi' ? 'आधिकारिक भूमिका-आधारित लॉगिन' : 'Official Role-Based Login'}
                        </div>
                        <Link
                          to="/login?role=admin"
                          className="flex items-start gap-2.5 px-3 py-2 hover:bg-paper text-ink transition-colors border-b border-border/50"
                          onClick={() => setLoginMenuOpen(false)}
                        >
                          <span className="text-base mt-0.5">🏛️</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'शासकीय / राज्य व्यवस्थापक' : 'Government / State Admin'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'एआई कतार एवं शिकायत प्राथमिकता' : 'AI queue & grievance triage'}
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/login?role=citizen"
                          className="flex items-start gap-2.5 px-3 py-2 hover:bg-paper text-ink transition-colors border-b border-border/50"
                          onClick={() => setLoginMenuOpen(false)}
                        >
                          <span className="text-base mt-0.5">👥</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'नागरिक शिकायत निवारण पोर्टल' : 'Citizen Grievance Portal'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'शिकायतें एवं स्थानीय मुद्दे ट्रैक करें' : 'Track complaints & local issues'}
                            </div>
                          </div>
                        </Link>
                        <div className="bg-paper-dark/70 px-3 py-1 text-[10px] font-bold text-forest uppercase tracking-wider font-mono border-b border-border/40">
                          🎓 {lang === 'hi' ? 'विश्वविद्यालय पारिस्थितिकी तंत्र' : 'University Ecosystem'}
                        </div>
                        <Link
                          to="/login?role=university&type=student"
                          className="flex items-start gap-2 px-3 py-1.5 hover:bg-paper text-ink transition-colors pl-5 border-b border-border/30"
                          onClick={() => setLoginMenuOpen(false)}
                        >
                          <span className="text-xs mt-0.5">👨‍🎓</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'छात्र नवाचार डेस्क' : 'Student Innovator Desk'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'प्रोजेक्ट प्रगति, जीपीएस साक्ष्य व टेलीमेट्री' : 'Deliverables, GPS photos & telemetry'}
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/login?role=university&type=mentor"
                          className="flex items-start gap-2 px-3 py-1.5 hover:bg-paper text-ink transition-colors pl-5 border-b border-border/30"
                          onClick={() => setLoginMenuOpen(false)}
                        >
                          <span className="text-xs mt-0.5">👨‍🏫</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'संकाय मार्गदर्शक कार्यक्षेत्र' : 'Faculty Mentor Workspace'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'प्रोजेक्ट समीक्षा एवं छात्र संवाद' : 'Project review & student messaging'}
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/login?role=university&type=dean"
                          className="flex items-start gap-2 px-3 py-1.5 hover:bg-paper text-ink transition-colors pl-5 border-b border-border/50"
                          onClick={() => setLoginMenuOpen(false)}
                        >
                          <span className="text-xs mt-0.5">🏛️</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'डीन अनुसंधान / संस्थागत नोडल' : 'Dean R&D / Institutional Admin'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'प्रस्ताव अनुमोदन एवं अनुदान आवंटन' : 'Proposal approvals & fund allocations'}
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/login?role=industry"
                          className="flex items-start gap-2.5 px-3 py-2 hover:bg-paper text-ink transition-colors"
                          onClick={() => setLoginMenuOpen(false)}
                        >
                          <span className="text-base mt-0.5">💼</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'उद्योग व कॉर्पोरेट सीएसआर साझीदार' : 'Industry / CSR Partner'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'कॉर्पोरेट प्रायोजन व सह-वित्तपोषण' : 'Corporate sponsorship & co-funding'}
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* REGISTER DROPDOWN */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLoginMenuOpen(false);
                        setUnivDropdownOpen(false);
                        setRegisterMenuOpen((v) => !v);
                      }}
                      className={`px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-[2px] border transition-all uppercase tracking-wide flex items-center gap-1.5 shadow-sm cursor-pointer select-none ${
                        registerMenuOpen
                          ? 'bg-turmeric-deep text-ink border-turmeric-deep ring-2 ring-turmeric/30'
                          : 'bg-turmeric text-ink border-turmeric-deep hover:bg-turmeric-deep'
                      }`}
                      aria-expanded={registerMenuOpen}
                    >
                      <span>{t.register}</span>
                      <span className={`text-[9px] transition-transform duration-200 inline-block ${registerMenuOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {registerMenuOpen && (
                      <div
                        className="absolute right-0 top-full mt-1.5 w-64 bg-white border-2 border-turmeric-deep rounded-[2px] shadow-2xl z-50 py-1 font-sans"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-1 bg-turmeric text-ink text-[10px] font-bold uppercase tracking-wider font-mono">
                          {lang === 'hi' ? 'नया उपयोगकर्ता पंजीकरण' : 'New User Registration'}
                        </div>
                        <Link
                          to="/register?role=citizen"
                          className="flex items-start gap-2.5 px-3 py-2 hover:bg-paper text-ink transition-colors border-b border-border/50"
                          onClick={() => setRegisterMenuOpen(false)}
                        >
                          <span className="text-base mt-0.5">👥</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'नागरिक खाता' : 'Citizen Account'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'एलजीडी एवं पिनकोड-एकीकृत रिपोर्टिंग' : 'LGD & Pincode-integrated reporting'}
                            </div>
                          </div>
                        </Link>
                        <div className="bg-paper-dark/70 px-3 py-1 text-[10px] font-bold text-forest uppercase tracking-wider font-mono border-b border-border/40">
                          🎓 {lang === 'hi' ? 'विश्वविद्यालय ऑनबोर्डिंग' : 'University Onboarding'}
                        </div>
                        <Link
                          to="/register?role=university&type=student"
                          className="flex items-start gap-2 px-3 py-1.5 hover:bg-paper text-ink transition-colors pl-5 border-b border-border/30"
                          onClick={() => setRegisterMenuOpen(false)}
                        >
                          <span className="text-xs mt-0.5">👨‍🎓</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'छात्र शोधार्थी' : 'Student Researcher'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'रोल नंबर / अपार आईडी से टीम में जुड़ें' : 'Join innovation team with Roll No / APAAR'}
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/register?role=university&type=mentor"
                          className="flex items-start gap-2 px-3 py-1.5 hover:bg-paper text-ink transition-colors pl-5 border-b border-border/30"
                          onClick={() => setRegisterMenuOpen(false)}
                        >
                          <span className="text-xs mt-0.5">👨‍🏫</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'संकाय मार्गदर्शक / पीआई' : 'Faculty Mentor / PI'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'विद्वान / संकाय आईडी से मार्गदर्शन करें' : 'Guide students with Vidwan / Faculty ID'}
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/register?role=university&type=institution"
                          className="flex items-start gap-2 px-3 py-1.5 hover:bg-paper text-ink transition-colors pl-5 border-b border-border/50"
                          onClick={() => setRegisterMenuOpen(false)}
                        >
                          <span className="text-xs mt-0.5">🏛️</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'विश्वविद्यालय / उच्च शिक्षण संस्थान' : 'University / Institution Node'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'AISHE कोड द्वारा संस्थान पंजीकृत करें' : 'Register university with AISHE code'}
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/register?role=industry"
                          className="flex items-start gap-2.5 px-3 py-2 hover:bg-paper text-ink transition-colors"
                          onClick={() => setRegisterMenuOpen(false)}
                        >
                          <span className="text-base mt-0.5">💼</span>
                          <div>
                            <div className="text-xs font-bold text-navy">
                              {lang === 'hi' ? 'उद्योग व कॉर्पोरेट सीएसआर साझीदार' : 'Industry / CSR Partner'}
                            </div>
                            <div className="text-[10px] text-ink-muted">
                              {lang === 'hi' ? 'कॉर्पोरेट प्रायोजन व सह-वित्तपोषण' : 'Corporate sponsorship & co-funding'}
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BAND 3: PRIMARY NAVIGATION (NAVY BAND - Public & Citizen Pages Only) */}
        {!isUniversity && (
          <div className="w-full bg-navy text-white relative z-30">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
              {/* Mobile Nav Header */}
              <div className="flex md:hidden items-center justify-between py-2 border-b border-navy-deep">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-deep text-white border border-white/20 rounded-[2px] text-xs font-bold tracking-wider uppercase"
                  aria-label="Toggle Navigation Menu"
                >
                  <span className="material-symbols-outlined text-base">
                    {mobileMenuOpen ? 'close' : 'menu'}
                  </span>
                  <span>
                    {mobileMenuOpen
                      ? (lang === 'hi' ? 'मेनू बंद करें' : 'Close Menu')
                      : (lang === 'hi' ? 'पोर्टल मेनू' : 'Portal Menu')}
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={user ? "/submit" : "/login?role=citizen&for=submit"}
                    className="px-2.5 py-1 bg-turmeric text-ink font-bold text-[11px] uppercase tracking-wider rounded-[2px] border border-turmeric-deep"
                  >
                    {t.navSubmitIssue}
                  </Link>
                  <Link
                    to="/problems"
                    className="px-2.5 py-1 bg-transparent text-white font-medium text-[11px] uppercase tracking-wider rounded-[2px] border border-white/50"
                  >
                    {t.navTrack}
                  </Link>
                </div>
              </div>

            {/* Desktop Navigation Links - Single Row with Strict Alignment */}
            <div className="hidden md:flex flex-row items-center justify-between min-h-[42px]">
              <nav className="flex items-center space-x-0.5 lg:space-x-1 text-[11px] lg:text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                <Link
                  to={user ? getDefaultPortalForUser(user) : "/"}
                  className={`px-2.5 lg:px-3 py-2.5 transition-colors whitespace-nowrap ${
                    location.pathname === '/'
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  {t.navHome}
                </Link>

                <a
                  href="/#about-scheme"
                  className="px-2.5 lg:px-3 py-2.5 hover:bg-navy-deep text-white transition-colors whitespace-nowrap"
                >
                  {t.navAbout}
                </a>

                {user?.role === 'citizen' && (
                  <Link
                    to="/dashboard"
                    className={`px-2.5 lg:px-3 py-2.5 transition-colors whitespace-nowrap ${
                      location.pathname === '/dashboard'
                        ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                        : 'hover:bg-navy-deep text-white'
                    }`}
                  >
                    {t.navCitizenDashboard}
                  </Link>
                )}

                <Link
                  to="/problems"
                  className={`px-2.5 lg:px-3 py-2.5 transition-colors whitespace-nowrap ${
                    location.pathname === '/problems'
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  {t.navProblems}
                </Link>

                {/* UNIVERSITY PORTAL DROPDOWN IN BAND 3 NAVIGATION */}
                <div className="relative whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoginMenuOpen(false);
                      setRegisterMenuOpen(false);
                      setUnivDropdownOpen((v) => !v);
                    }}
                    className={`px-2.5 lg:px-3 py-2.5 transition-colors flex items-center gap-1 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none ${
                      location.pathname.startsWith('/university') || location.pathname === '/student'
                        ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                        : 'hover:bg-navy-deep text-white'
                    }`}
                    aria-expanded={univDropdownOpen}
                  >
                    <span>{t.navUniversities}</span>
                    <span className={`text-[9px] transition-transform duration-200 inline-block ${univDropdownOpen ? 'rotate-180' : 'opacity-80'}`}>▼</span>
                  </button>

                  {univDropdownOpen && (
                    <div
                      className="absolute left-0 top-full mt-0 w-72 bg-navy-deep border-2 border-turmeric text-white shadow-2xl z-50 py-1.5 normal-case font-normal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-3 py-1 text-[10px] font-mono uppercase font-bold text-turmeric border-b border-white/10 tracking-wider">
                        {lang === 'hi' ? 'उच्च शिक्षा एवं अनुसंधान प्रभाग' : 'Higher Education & Research Desks'}
                      </div>
                      <Link
                        to="/university"
                        onClick={() => setUnivDropdownOpen(false)}
                        className="flex items-start gap-2.5 px-3 py-2 hover:bg-navy text-white transition-colors border-b border-white/10"
                      >
                        <span className="text-base mt-0.5">🏛️</span>
                        <div>
                          <div className="text-xs font-bold text-turmeric">
                            {lang === 'hi' ? 'डीन अनुसंधान डेस्क' : 'Dean R&D Desk'}
                          </div>
                          <div className="text-[10px] text-white/70">
                            {lang === 'hi' ? 'संस्थागत प्रस्ताव, सहमति पत्र व स्वीकृति' : 'Institutional proposals, MoUs & approvals'}
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/university/mentor"
                        onClick={() => setUnivDropdownOpen(false)}
                        className="flex items-start gap-2.5 px-3 py-2 hover:bg-navy text-white transition-colors border-b border-white/10"
                      >
                        <span className="text-base mt-0.5">👨‍🏫</span>
                        <div>
                          <div className="text-xs font-bold text-turmeric">
                            {lang === 'hi' ? 'संकाय मार्गदर्शक कार्यक्षेत्र' : 'Faculty Mentor Workspace'}
                          </div>
                          <div className="text-[10px] text-white/70">
                            {lang === 'hi' ? 'शोध प्रोजेक्ट मार्गदर्शन, टेलीमेट्री व संवाद' : 'Guide student projects, telemetry & live chat'}
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/student"
                        onClick={() => setUnivDropdownOpen(false)}
                        className="flex items-start gap-2.5 px-3 py-2 hover:bg-navy text-white transition-colors border-b border-white/10"
                      >
                        <span className="text-base mt-0.5">👨‍🎓</span>
                        <div>
                          <div className="text-xs font-bold text-turmeric">
                            {lang === 'hi' ? 'छात्र नवाचार डैशबोर्ड' : 'Student Innovator Dashboard'}
                          </div>
                          <div className="text-[10px] text-white/70">
                            {lang === 'hi' ? 'कार्य प्रमाण, जीपीएस तस्वीरें व प्रोजेक्ट प्रगति' : 'Proof of work, GPS photos & live deliverables'}
                          </div>
                        </div>
                      </Link>
                      {!user && (
                        <>
                          <div className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase font-bold text-white/50 tracking-wider">
                            {lang === 'hi' ? 'विश्वविद्यालय प्रमाणीकरण' : 'University Authentication'}
                          </div>
                          <div className="grid grid-cols-2 gap-1 px-2 pb-1">
                            <Link
                              to="/login?role=university"
                              onClick={() => setUnivDropdownOpen(false)}
                              className="px-2 py-1.5 bg-white/10 hover:bg-white/20 text-center rounded-[2px] text-[11px] font-bold text-white uppercase tracking-wider"
                            >
                              🔑 {lang === 'hi' ? 'लॉग इन' : 'Sign In'}
                            </Link>
                            <Link
                              to="/register?role=university"
                              onClick={() => setUnivDropdownOpen(false)}
                              className="px-2 py-1.5 bg-turmeric text-ink hover:bg-turmeric-deep text-center rounded-[2px] text-[11px] font-bold uppercase tracking-wider"
                            >
                              📝 {lang === 'hi' ? 'पंजीकरण' : 'Register'}
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to={user ? (user.role === 'industry' ? '/industry' : getDefaultPortalForUser(user)) : '/login?role=industry'}
                  className={`px-2.5 lg:px-3 py-2.5 transition-colors whitespace-nowrap ${
                    location.pathname.startsWith('/industry') || (location.pathname === '/login' && location.search.includes('role=industry'))
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  {t.industryCsr}
                </Link>

                <Link
                  to="/analytics"
                  className={`px-2.5 lg:px-3 py-2.5 transition-colors whitespace-nowrap ${
                    location.pathname === '/analytics' || location.pathname === '/ai-analytics'
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  {t.navAnalytics}
                </Link>
                <Link
                  to="/government"
                  className={`px-3 py-3 transition-colors ${
                    location.pathname.startsWith('/government')
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  {t.navGovtDashboard}
                </Link>
                <a
                  href="/#notices"
                  className="px-2.5 lg:px-3 py-2.5 hover:bg-navy-deep text-white transition-colors whitespace-nowrap"
                >
                  {t.navNotices}
                </a>
              </nav>

              {/* Single Right CTA Button */}
              <div className="flex items-center shrink-0 ml-3 py-1.5">
                <Link
                  to={user ? "/submit" : "/login?role=citizen&for=submit"}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-turmeric text-ink font-bold text-xs uppercase tracking-wider rounded-[2px] border border-turmeric-deep hover:bg-turmeric-deep transition-all shadow-sm whitespace-nowrap"
                >
                  <span className="text-sm font-black leading-none">+</span>
                  <span>{t.navSubmitIssue}</span>
                </Link>
              </div>
            </div>

            {/* Mobile Expanded Menu Drawer */}
            {mobileMenuOpen && (
              <nav className="md:hidden flex flex-col divide-y divide-navy-deep bg-navy border-t border-navy-deep py-2 text-xs font-semibold uppercase tracking-wider">
                <Link to="/" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● {t.navHome}
                </Link>
                <a href="/#about-scheme" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● {t.navAbout}
                </a>
                <Link to={user ? "/submit" : "/login?role=citizen&for=submit"} className="px-3 py-2.5 hover:bg-navy-deep text-turmeric font-bold">
                  ● {t.navSubmitIssue}
                </Link>
                {user?.role === 'citizen' && (
                  <Link to="/dashboard" className="px-3 py-2.5 hover:bg-navy-deep text-turmeric font-bold">
                    ● {t.navCitizenDashboard}
                  </Link>
                )}
                <Link to="/problems" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● {t.navProblems}
                </Link>

                {/* University Section in Mobile Drawer */}
                <div className="bg-navy-deep/80 px-3 py-2">
                  <div className="text-[10px] font-mono text-turmeric font-bold mb-1">
                    🎓 {lang === 'hi' ? 'विश्वविद्यालय पारिस्थितिकी तंत्र' : 'UNIVERSITY ECOSYSTEM'}
                  </div>
                  <div className="flex flex-col gap-1 pl-2 font-normal normal-case">
                    <Link to="/university" className="py-1 text-xs text-white hover:text-turmeric flex items-center gap-1.5">
                      <span>🏛️</span> <span>{lang === 'hi' ? 'डीन अनुसंधान डेस्क' : 'Dean R&D Desk'}</span>
                    </Link>
                    <Link to="/university/mentor" className="py-1 text-xs text-white hover:text-turmeric flex items-center gap-1.5">
                      <span>👨‍🏫</span> <span>{lang === 'hi' ? 'संकाय मार्गदर्शक कार्यक्षेत्र' : 'Faculty Mentor Workspace'}</span>
                    </Link>
                    <Link to="/student" className="py-1 text-xs text-white hover:text-turmeric flex items-center gap-1.5">
                      <span>👨‍🎓</span> <span>{lang === 'hi' ? 'छात्र नवाचार डैशबोर्ड' : 'Student Innovator Dashboard'}</span>
                    </Link>
                    {!user && (
                      <div className="flex items-center gap-2 pt-1 mt-1 border-t border-white/10">
                        <Link to="/login?role=university" className="text-[11px] font-bold text-turmeric underline">
                          {lang === 'hi' ? 'विश्वविद्यालय लॉगिन' : 'University Sign In'}
                        </Link>
                        <span className="text-white/40">|</span>
                        <Link to="/register?role=university" className="text-[11px] font-bold text-turmeric underline">
                          {lang === 'hi' ? 'पंजीकरण' : 'Register'}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to={user ? (user.role === 'industry' ? '/industry' : getDefaultPortalForUser(user)) : '/login?role=industry'}
                  className="px-3 py-2.5 hover:bg-navy-deep text-white"
                >
                  ● {t.industryCsr}
                </Link>
                <Link to="/analytics" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● {t.navAnalytics}
                </Link>
                <Link to="/government" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● {t.navGovtDashboard}
                </Link>
                <a href="/#notices" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● {t.navNotices}
                </a>

                {/* Quick Role-based Access Links for Mobile */}
                {!user && (
                  <div className="p-3 bg-navy-deep/40 flex flex-col gap-2">
                    <div className="text-[10px] font-mono text-ink-muted uppercase font-bold text-white/70">
                      {lang === 'hi' ? 'त्वरित भूमिका लॉगिन व पंजीकरण' : 'QUICK ROLE LOGIN & REGISTER'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/login"
                        className="py-1.5 text-center bg-white text-navy font-bold text-[11px] rounded-[2px]"
                      >
                        {lang === 'hi' ? 'लॉगिन पोर्टल' : 'Sign In Portal'}
                      </Link>
                      <Link
                        to="/register"
                        className="py-1.5 text-center bg-turmeric text-ink font-bold text-[11px] rounded-[2px]"
                      >
                        {lang === 'hi' ? 'नया पंजीकरण' : 'Register Account'}
                      </Link>
                    </div>
                  </div>
                )}
              </nav>
            )}
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* PERSISTENT FLOATING ACTION ELEMENT (RIGHT EDGE TAB)         */}
      {/* ============================================================ */}
      {!isUniversity && (
        <>
          <Link
            to={user ? "/submit" : "/login?role=citizen&for=submit"}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center bg-turmeric text-ink border-l-2 border-t-2 border-b-2 border-turmeric-deep px-2 py-4 shadow-sm hover:bg-turmeric-deep transition-all group"
            title={lang === 'hi' ? 'नागरिक समस्या दर्ज करें' : 'Quickly Submit a Civic Problem'}
          >
            <span
              className="font-bold text-xs uppercase tracking-widest text-ink"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              ● {t.navSubmitIssue}
            </span>
          </Link>

          {/* Mobile Floating Action Button */}
          <Link
            to={user ? "/submit" : "/login?role=citizen&for=submit"}
            className="md:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-turmeric text-ink font-bold flex items-center justify-center border-2 border-turmeric-deep shadow-lg active:scale-95"
            title={lang === 'hi' ? 'समस्या दर्ज करें' : 'Submit a Problem'}
          >
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
          </Link>
        </>
      )}

      {/* ============================================================ */}
      {/* MAIN CONTENT OUTLET                                          */}
      {/* ============================================================ */}
      <main id="main-content" className="flex-1 w-full">
        <Outlet />
      </main>

      {/* ============================================================ */}
      {/* FOOTER: GOVERNMENT INSTITUTIONAL FOOTER                     */}
      {/* ============================================================ */}
      <footer className="w-full border-t border-border bg-paper mt-auto text-ink">
        {/* Top Footnote Strip */}
        <div className="w-full py-4 border-b border-border bg-[#F5F2E9]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-ink-muted gap-2 text-center md:text-left">
            <div className="font-mono">
              {lang === 'hi' ? 'स्मार्ट इंडिया हैकाथॉन 2026 हेतु विकसित' : 'Developed for'}{' '}
              <strong>Smart India Hackathon 2026</strong> · PS 26043
            </div>
            <div className="font-semibold text-navy">
              {lang === 'hi'
                ? 'उच्च एवं तकनीकी शिक्षा विभाग, झारखंड सरकार'
                : 'Department of Higher & Technical Education, Government of Jharkhand'}
            </div>
            <div className="font-mono text-[11px]">
              {t.footerVersion}
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Navy Banner */}
        <div className="w-full bg-navy text-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
            <p className="text-xs opacity-90 leading-relaxed">
              {t.footerCopyright}
            </p>
            <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs text-white/70">
              <a href="#about-scheme" className="hover:text-turmeric hover:underline">
                {t.footerAbout}
              </a>
              <span>|</span>
              <a href="#accessibility" className="hover:text-turmeric hover:underline">
                {t.footerAccessibility}
              </a>
              <span>|</span>
              <a href="#privacy" className="hover:text-turmeric hover:underline">
                {t.footerPrivacy}
              </a>
              <span>|</span>
              <a href="#terms" className="hover:text-turmeric hover:underline">
                {t.footerTerms}
              </a>
              <span>|</span>
              <a href="#hyperlinking" className="hover:text-turmeric hover:underline">
                {t.footerHyperlink}
              </a>
              <span>|</span>
              <a href="#sitemap" className="hover:text-turmeric hover:underline">
                {t.footerSitemap}
              </a>
              <span>|</span>
              <a href="#help" className="hover:text-turmeric hover:underline">
                {t.footerHelpdesk}
              </a>
            </div>
            <div className="pt-2 text-[10px] sm:text-[11px] font-mono text-white/50">
              {t.footerNicNode}
            </div>
          </div>
        </div>
      </footer>

      {/* Persistent Logout Confirmation Modal on Back Button */}
      {user && (
        <LogoutPromptModal
          isOpen={showLogoutModal}
          user={user}
          onStay={handleModalStay}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
