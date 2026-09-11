import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useSocketConnection } from '../hooks/useSocket.js';
import { NotificationBell } from './NotificationBell.js';

export function Layout() {
  useSocketConnection();
  const { user, clearSession } = useAuthStore();
  const location = useLocation();
  const isUniversity = location.pathname.startsWith('/university');
  const [fontScale, setFontScale] = useState<number>(1);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
                <strong className="font-semibold text-turmeric">Helpline:</strong> 1800-345-6570
              </span>
              <span className="opacity-40 hidden sm:inline">|</span>
              <span className="hidden md:inline">
                <strong className="font-semibold text-turmeric">Support:</strong>{' '}
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
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="hover:text-turmeric transition-colors font-medium text-[10px] sm:text-xs"
              >
                {lang === 'en' ? 'English / हिन्दी' : 'हिन्दी / English'}
              </button>

              <span className="opacity-40 hidden sm:inline">|</span>
              <a href="#main-content" className="hover:underline hidden lg:inline">
                Skip to Content
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
                      onClick={clearSession}
                      className="text-white hover:text-urgent underline ml-1 font-sans"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="opacity-40">|</span>
                  <Link to="/login" className="hover:text-turmeric underline font-medium">
                    Sign In
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
            <Link to="/" className="flex items-center gap-3 group text-center md:text-left">
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
                  A Digital Platform to Crowdsource Societal Challenges &amp; Drive
                  University-Industry R&amp;D (PS 26043)
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
                    to={
                      user.role === 'admin'
                        ? '/admin'
                        : user.role === 'university'
                          ? '/university'
                          : user.role === 'industry'
                            ? '/industry'
                            : '/problems'
                    }
                    className={`px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-[2px] border transition-colors uppercase tracking-wide flex items-center gap-1.5 ${
                      user.role === 'university'
                        ? 'bg-turmeric text-ink border-turmeric-deep hover:bg-turmeric-deep'
                        : 'bg-navy text-white border-navy hover:bg-navy-deep'
                    }`}
                  >
                    <span>
                      {user.role === 'university'
                        ? '🏛️ University Dashboard'
                        : user.role === 'admin'
                          ? '⚙️ Admin Dashboard'
                          : user.role === 'industry'
                            ? '💼 Industry Portal'
                            : '📋 My Grievances'}
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 bg-white text-navy text-[11px] sm:text-xs font-bold rounded-[2px] border border-navy hover:bg-paper transition-colors uppercase tracking-wide"
                  >
                    PORTAL LOGIN
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 bg-turmeric text-ink text-[11px] sm:text-xs font-bold rounded-[2px] border border-turmeric-deep hover:bg-turmeric-deep transition-colors uppercase tracking-wide"
                  >
                    REGISTER
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BAND 3: PRIMARY NAVIGATION (NAVY BAND - Public & Citizen Pages Only) */}
        {!isUniversity && (
          <div className="w-full bg-navy text-white">
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
                  <span>{mobileMenuOpen ? 'Close Menu' : 'Portal Menu'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <Link
                    to="/submit"
                    className="px-2.5 py-1 bg-turmeric text-ink font-bold text-[11px] uppercase tracking-wider rounded-[2px] border border-turmeric-deep"
                  >
                    SUBMIT ISSUE
                  </Link>
                  <Link
                    to="/problems"
                    className="px-2.5 py-1 bg-transparent text-white font-medium text-[11px] uppercase tracking-wider rounded-[2px] border border-white/50"
                  >
                    TRACK
                  </Link>
                </div>
              </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex flex-row items-center justify-between">
              <nav className="flex flex-wrap items-center text-xs font-bold uppercase tracking-wider">
                <Link
                  to="/"
                  className={`px-3 py-3 transition-colors ${
                    location.pathname === '/'
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="/#about-scheme"
                  className="px-3 py-3 hover:bg-navy-deep text-white transition-colors"
                >
                  About the Scheme
                </a>
                <Link
                  to="/submit"
                  className={`px-3 py-3 transition-colors ${
                    location.pathname === '/submit'
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  Submit a Problem
                </Link>
                {user?.role === 'citizen' && (
                  <Link
                    to="/dashboard"
                    className={`px-3 py-3 transition-colors ${
                      location.pathname === '/dashboard'
                        ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                        : 'hover:bg-navy-deep text-white'
                    }`}
                  >
                    Citizen Dashboard
                  </Link>
                )}
                <Link
                  to="/problems"
                  className={`px-3 py-3 transition-colors ${
                    location.pathname === '/problems'
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  Track Problems
                </Link>
                <Link
                  to="/university"
                  className={`px-3 py-3 transition-colors ${
                    location.pathname.startsWith('/university')
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  University Portal
                </Link>
                <Link
                  to="/industry"
                  className={`px-3 py-3 transition-colors ${
                    location.pathname.startsWith('/industry')
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  Industry &amp; Funding
                </Link>
                <Link
                  to="/admin"
                  className={`px-3 py-3 transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-navy-deep text-turmeric border-b-2 border-turmeric'
                      : 'hover:bg-navy-deep text-white'
                  }`}
                >
                  Analytics &amp; AI Queue
                </Link>
                <a
                  href="/#notices"
                  className="px-3 py-3 hover:bg-navy-deep text-white transition-colors"
                >
                  Circulars &amp; Notices
                </a>
              </nav>

              <div className="flex items-center gap-2 py-2">
                <Link
                  to="/submit"
                  className="inline-flex items-center justify-center px-3.5 py-1.5 bg-turmeric text-ink font-bold text-xs uppercase tracking-wider rounded-[2px] border border-turmeric-deep hover:bg-turmeric-deep transition-colors"
                >
                  SUBMIT A PROBLEM
                </Link>
                <Link
                  to="/problems"
                  className="inline-flex items-center justify-center px-3 py-1.5 bg-transparent text-white font-semibold text-xs uppercase tracking-wider rounded-[2px] border border-white/60 hover:bg-white/10 transition-colors"
                >
                  TRACK STATUS
                </Link>
              </div>
            </div>

            {/* Mobile Expanded Menu Drawer */}
            {mobileMenuOpen && (
              <nav className="md:hidden flex flex-col divide-y divide-navy-deep bg-navy border-t border-navy-deep py-2 text-xs font-semibold uppercase tracking-wider">
                <Link to="/" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● Home
                </Link>
                <a href="/#about-scheme" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● About the Scheme
                </a>
                <Link to="/submit" className="px-3 py-2.5 hover:bg-navy-deep text-turmeric">
                  ● Submit a Problem
                </Link>
                {user?.role === 'citizen' && (
                  <Link to="/dashboard" className="px-3 py-2.5 hover:bg-navy-deep text-turmeric font-bold">
                    ● Citizen Dashboard
                  </Link>
                )}
                <Link to="/problems" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● Track Problems
                </Link>
                <Link to="/university" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● University Portal
                </Link>
                <Link to="/industry" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● Industry &amp; Funding
                </Link>
                <Link to="/admin" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● Analytics &amp; AI Queue
                </Link>
                <a href="/#notices" className="px-3 py-2.5 hover:bg-navy-deep text-white">
                  ● Circulars &amp; Notices
                </a>
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
            to="/submit"
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center bg-turmeric text-ink border-l-2 border-t-2 border-b-2 border-turmeric-deep px-2 py-4 shadow-sm hover:bg-turmeric-deep transition-all group"
            title="Quickly Submit a Civic Problem"
          >
            <span
              className="font-bold text-xs uppercase tracking-widest text-ink"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              ● SUBMIT A PROBLEM
            </span>
          </Link>

          {/* Mobile Floating Action Button */}
          <Link
            to="/submit"
            className="md:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-turmeric text-ink font-bold flex items-center justify-center border-2 border-turmeric-deep shadow-lg active:scale-95"
            title="Submit a Problem"
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
              Developed for <strong>Smart India Hackathon 2026</strong> · PS 26043
            </div>
            <div className="font-semibold text-navy">
              Department of Higher &amp; Technical Education, Government of Jharkhand
            </div>
            <div className="font-mono text-[11px]">
              Version 1.0 (NIC Standard) | Best viewed in Chrome, Edge, Firefox
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Navy Banner */}
        <div className="w-full bg-navy text-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
            <p className="text-xs opacity-90 leading-relaxed">
              © 2026 Government of Jharkhand. All Rights Reserved. Content Owned, Maintained and
              Updated by Department of Higher &amp; Technical Education.
            </p>
            <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs text-white/70">
              <a href="#about-scheme" className="hover:text-turmeric hover:underline">
                About Samadhan Setu
              </a>
              <span>|</span>
              <a href="#accessibility" className="hover:text-turmeric hover:underline">
                Accessibility Statement
              </a>
              <span>|</span>
              <a href="#privacy" className="hover:text-turmeric hover:underline">
                Privacy Policy
              </a>
              <span>|</span>
              <a href="#terms" className="hover:text-turmeric hover:underline">
                Terms of Use
              </a>
              <span>|</span>
              <a href="#hyperlinking" className="hover:text-turmeric hover:underline">
                Hyperlinking Policy
              </a>
              <span>|</span>
              <a href="#sitemap" className="hover:text-turmeric hover:underline">
                Sitemap
              </a>
              <span>|</span>
              <a href="#help" className="hover:text-turmeric hover:underline">
                Helpdesk &amp; FAQs
              </a>
            </div>
            <div className="pt-2 text-[10px] sm:text-[11px] font-mono text-white/50">
              National Informatics Centre (NIC) Server Node: JH-RANCHI-01 · Last Updated: 10
              September 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
