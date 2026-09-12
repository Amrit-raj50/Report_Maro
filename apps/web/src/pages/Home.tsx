import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient.js';
import { useLanguageStore } from '../store/languageStore.js';
import { translations } from '../utils/translations.js';

interface DashboardStats {
  total: number;
  byCategory: { _id: string; count: number }[];
  byStatus: { _id: string; count: number }[];
  byDistrict: { _id: string; count: number }[];
  lastUpdated: string;
}

export default function Home() {
  const lang = useLanguageStore((s) => s.lang);
  const t = translations[lang];
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [universitiesCount, setUniversitiesCount] = useState<number>(38);
  const [projectsCount, setProjectsCount] = useState<number>(212);
  const [loading, setLoading] = useState(true);

  // Fetch real-time metrics from backend / mock API
  useEffect(() => {
    let isMounted = true;
    async function loadLiveData() {
      try {
        const [statsRes, projectsRes, univRes] = await Promise.allSettled([
          apiClient.get('/problems/stats/dashboard'),
          apiClient.get('/projects'),
          apiClient.get('/users?role=university'),
        ]);

        if (!isMounted) return;

        if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
          setStats(statsRes.value.data.data);
        }
        if (projectsRes.status === 'fulfilled' && projectsRes.value.data?.success) {
          const list = projectsRes.value.data.data || [];
          if (list.length > 0) setProjectsCount(list.length);
        }
        if (univRes.status === 'fulfilled' && univRes.value.data?.success) {
          const list = univRes.value.data.data || [];
          if (list.length > 0) setUniversitiesCount(list.length);
        }
      } catch (err) {
        console.warn('Using default baseline metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLiveData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to extract category count dynamically
  const getCategoryCount = (categoryKey: string, baselineCount: number) => {
    if (!stats?.byCategory || !Array.isArray(stats.byCategory)) return baselineCount;
    const found = stats.byCategory.find(
      (c) => typeof c?._id === 'string' && c._id.toLowerCase() === categoryKey.toLowerCase()
    );
    return found ? found.count : baselineCount;
  };

  const totalProblemsCount = stats?.total ?? 4821;
  const verifiedCount = stats?.byStatus?.find((s) => s?._id === 'verified')?.count ?? 142;
  const districtCoverage = stats?.byDistrict && Array.isArray(stats.byDistrict) && stats.byDistrict.length > 0
    ? `${Math.max(stats.byDistrict.length, 24)} / 24`
    : '24 / 24';

  return (
    <div className="flex flex-col w-full bg-paper text-ink font-sans">
      {/* ============================================================ */}
      {/* 1. HERO SECTION: AUTHENTIC JHARKHAND BANNER & ANGULAR ACCENT */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden bg-navy">
        <div className="relative w-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex items-center">
          {/* Authentic Documentary Field Collaboration Image */}
          <img
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.38] contrast-[1.08]"
            alt="University researchers and village elders collaborating on civic challenge in Jharkhand"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxR3MfECAWEqFr2MnC-B7Ci2axbmx72zSVh0SCGD3mfAKDykyF1gzmMDu_rV1qmNpB81CKwhh1J3gRTXRZnHuuyM-RznTmIDKzlGHZzGO8YzcEGbc9NkLriZciANx-SSURt3G4qDbgYi0WcSUJwM8R4VRtyXRXDZYzWpYWtr3ldFqNtKsNbUymKRT1pu7FRK-O0-Sg6HUv4yTEhkzKpiLt_2jHw7ak4LYGAz_9FVYhNUb4dfFIJI8"
          />

          {/* Crisp Angular Mustard Government Banner Overlay bleeding from top-left */}
          <div
            className="absolute top-0 left-0 w-44 sm:w-64 md:w-96 h-16 sm:h-24 md:h-28 bg-turmeric pointer-events-none opacity-95"
            style={{ clipPath: 'polygon(0 0, 100% 0, 68% 100%, 0 100%)' }}
          />
          <div className="absolute top-2 left-3 sm:left-4 text-ink font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase pointer-events-none">
            {t.initiativeTag}
          </div>

          {/* Hero Content Box */}
          <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
            <div className="max-w-3xl space-y-4 sm:space-y-5">
              {/* Gazette Serif Title */}
              <h1 className="font-display text-2xl sm:text-4xl md:text-5xl text-white font-bold leading-tight tracking-tight drop-shadow-sm">
                {t.heroTitleLine1} <br className="hidden sm:inline" />
                <span className="text-turmeric">{t.heroTitleLine2}</span>
              </h1>

              {/* Official Description Subtext */}
              <p className="text-xs sm:text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
                {t.heroSubtext}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/submit"
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-turmeric text-ink font-bold text-xs sm:text-sm tracking-wider uppercase border border-turmeric-deep hover:bg-turmeric-deep transition-colors rounded-[2px]"
                >
                  {t.btnSubmitProblem}
                </Link>
                <Link
                  to="/university"
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/30 transition-colors rounded-[2px]"
                >
                  <span>{t.btnUniversityPortal}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-transparent hover:bg-white/10 text-white/90 font-medium text-xs sm:text-sm border border-white/20 transition-colors rounded-[2px]"
                >
                  <span className="text-turmeric text-sm">▶</span>
                  <span>{t.btnVideoGuide}</span>
                </button>
              </div>

              {/* Gazette Quick Verification Note */}
              <div className="pt-2 text-white/80 font-mono text-[10px] sm:text-xs flex items-center gap-1.5">
                <span className="text-turmeric">●</span>
                <span>
                  {t.nicSecurityNote}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. LIVE STATISTICS MONOSPACE STRIP                          */}
      {/* ============================================================ */}
      <section className="w-full bg-navy border-b-2 border-turmeric text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {/* Stat 1 */}
            <div className="py-4 sm:py-5 px-3 sm:px-4 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                {t.statProblemsSubmitted}
              </div>
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">
                {loading ? '...' : totalProblemsCount.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono text-turmeric mt-1.5 flex items-center gap-1">
                <span>▲ {verifiedCount}</span> {t.statVerifiedToday}
              </div>
            </div>

            {/* Stat 2 */}
            <div className="py-4 sm:py-5 px-3 sm:px-4 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                {t.statUniversitiesOnboarded}
              </div>
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">
                {loading ? '...' : universitiesCount}
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono text-white/70 mt-1.5">
                {lang === 'hi' ? 'बीआईटी मेसरा, एनआईटी, आरयू एवं वीबीयू' : 'BIT Mesra, NIT, RU & VBU'}
              </div>
            </div>

            {/* Stat 3 */}
            <div className="py-4 sm:py-5 px-3 sm:px-4 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                {t.statProjectsInProgress}
              </div>
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-turmeric tracking-tight leading-none">
                {loading ? '...' : projectsCount}
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono text-white/70 mt-1.5">
                {t.statFieldValidation}
              </div>
            </div>

            {/* Stat 4 */}
            <div className="py-4 sm:py-5 px-3 sm:px-4 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                {t.statDistrictsCovered}
              </div>
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">
                {districtCoverage}
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono text-forest mt-1.5 bg-white px-1.5 py-0.2 rounded font-bold">
                {t.statOutreach}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. ABOUT THE SCHEME SECTION                                 */}
      {/* ============================================================ */}
      <section
        id="about-scheme"
        className="w-full py-10 sm:py-14 md:py-16 bg-[#F5F2E9] border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header with Hindi Sub-heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-3 mb-6 sm:mb-8 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                {t.aboutMandateTag}
              </span>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-navy font-bold mt-0.5">
                {t.aboutTitle}
              </h2>
            </div>
            <div className="font-mono text-[11px] sm:text-xs bg-white px-2.5 py-1 border border-border text-ink-muted inline-block shrink-0">
              {t.officialDirective}
            </div>
          </div>

          {/* Formal Gazette Decree Badge & Two-Column Gazette Narrative */}
          <div className="bg-white border border-border p-5 sm:p-7 md:p-8 rounded-[2px] mb-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-paper border border-border font-mono text-[11px] sm:text-xs text-navy mb-5">
              <span className="font-bold text-turmeric">● {lang === 'hi' ? 'शासनादेश:' : 'DECREE:'}</span> {t.decreeBadge}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-ink text-xs sm:text-sm md:text-base leading-relaxed text-justify">
              <div className="space-y-3 sm:space-y-4">
                <p>{t.aboutPara1}</p>
                <p>{t.aboutPara2}</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <p>{t.aboutPara3}</p>
                <p>{t.aboutPara4}</p>
              </div>
            </div>

            {/* Tripartite Flow Indicator Bar */}
            <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="bg-paper p-3.5 border border-border rounded-[2px]">
                <div className="font-mono text-xs text-forest font-bold">{lang === 'hi' ? 'चरण 01' : 'STAGE 01'}</div>
                <div className="font-display text-sm font-bold text-navy mt-1">
                  {t.stage01Title}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  {t.stage01Desc}
                </div>
              </div>

              <div className="bg-paper p-3.5 border border-border rounded-[2px]">
                <div className="font-mono text-xs text-forest font-bold">{lang === 'hi' ? 'चरण 02' : 'STAGE 02'}</div>
                <div className="font-display text-sm font-bold text-navy mt-1">
                  {t.stage02Title}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  {t.stage02Desc}
                </div>
              </div>

              <div className="bg-paper p-3.5 border border-border rounded-[2px]">
                <div className="font-mono text-xs text-forest font-bold">{lang === 'hi' ? 'चरण 03' : 'STAGE 03'}</div>
                <div className="font-display text-sm font-bold text-navy mt-1">
                  {t.stage03Title}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  {t.stage03Desc}
                </div>
              </div>

              <div className="bg-paper p-3.5 border border-border rounded-[2px]">
                <div className="font-mono text-xs text-forest font-bold">{lang === 'hi' ? 'चरण 04' : 'STAGE 04'}</div>
                <div className="font-display text-sm font-bold text-navy mt-1">
                  {t.stage04Title}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  {t.stage04Desc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. LEADERSHIP & DEPARTMENTAL DIRECTION ("WHO'S WHO")         */}
      {/* ============================================================ */}
      <section className="w-full py-10 sm:py-14 md:py-16 bg-paper border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              {t.leadershipTag}
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-navy font-bold mt-1">
              {t.leadershipTitle}
            </h2>
            <div className="w-16 h-1 bg-turmeric mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Dignitary 1: Chief Minister */}
            <div className="bg-white border border-border p-5 sm:p-6 text-center flex flex-col items-center rounded-[2px] shadow-sm hover:border-navy transition-colors">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-turmeric p-1 mb-3 sm:mb-4 bg-paper">
                <img
                  className="w-full h-full object-cover rounded-full"
                  alt="Hon'ble Chief Minister of Jharkhand"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFBelaJAi1q9w74vEYtbiXjgFtCtZKqkWpJaAniocGVs63GYfUHT22V90JBxZsHS7nJx5IOYg1QZPgQiKr9B0l7idlfw5yB3Gs8jIzCxKOkREJHAxwiuIrTi_nAJ2H1Pnpowik66DPB444_q3DVEaQhuEpG2EIIWmu3opPvWsPPh9T7FZjqx2ruyChxOsAUu2S7e3HjKVGDXuFwyBcMaSdC8jbhX6RAw8ZPs2T-h1nvyVu7WDzF7g"
                />
              </div>
              <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                {t.cmName}
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-forest uppercase tracking-wider mt-0.5 sm:mt-1">
                {t.cmDesignation}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">{t.cmGovt}</p>
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border w-full font-mono text-[10px] sm:text-xs text-navy font-semibold">
                {t.cmRole}
              </div>
            </div>

            {/* Dignitary 2: Minister HTE */}
            <div className="bg-white border border-border p-5 sm:p-6 text-center flex flex-col items-center rounded-[2px] shadow-sm hover:border-navy transition-colors">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-turmeric p-1 mb-3 sm:mb-4 bg-paper">
                <img
                  className="w-full h-full object-cover rounded-full"
                  alt="Hon'ble Minister, Higher & Technical Education"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxywVtqXkZtHJwyh62z8GPw9mT9l1fhkHK-COi85gPXIFvTHspC6MQZPXHrcPXY62fVqjOCt6zqZjPu1b01gWAocH75vabji042Gf_MLI0BX5Yms-q44M2nI6CpqOu0lMaBp8Rkcth6Vij4kTYETG4RaARmEoxP1-3KP6ctI2_pxjHULbe_iLnn3DH9jj8YXxKU3ZpzUbHwxicU8xO3k_GfDvA8hgT5sp9IlM6m_0EZfNOkmhqtSE"
                />
              </div>
              <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                {t.ministerName}
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-forest uppercase tracking-wider mt-0.5 sm:mt-1">
                {t.ministerDesignation}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">
                {t.ministerDept}
              </p>
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border w-full font-mono text-[10px] sm:text-xs text-navy font-semibold">
                {t.ministerRole}
              </div>
            </div>

            {/* Dignitary 3: Principal Secretary */}
            <div className="bg-white border border-border p-5 sm:p-6 text-center flex flex-col items-center rounded-[2px] shadow-sm hover:border-navy transition-colors sm:col-span-2 md:col-span-1">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-border p-1 mb-3 sm:mb-4 bg-paper">
                <img
                  className="w-full h-full object-cover rounded-full"
                  alt="Principal Secretary IAS, Higher & Technical Education"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVdW_ljsoYYvXeZHyjjf9l33qPcc05q7_QoMHMGvdpLAhO_sp9OO86H3Rl8zQPo2RvDDlEku_Tzmim579oOfNE8hrZVZNXynyjHzOLK1wnPfCwT5qYg4QR1ILQGt1wvB_wJ2CmjMuNMZuH7Nt8bUQ4K7uUsaSFLCfkGzFMc5ZvTFoEcfq8-UxIAlv0wDy4Xrzr-3B6Bo3AeLe7duZyc5baN32mfCrHSmALMAIdpMs4_RnTU-JU9bY"
                />
              </div>
              <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                {t.secretaryName}
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-forest uppercase tracking-wider mt-0.5 sm:mt-1">
                {t.secretaryDesignation}
              </p>
              <p className="text-[11px] sm:text-xs text-ink-muted">
                {t.secretaryDept}
              </p>
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border w-full font-mono text-[10px] sm:text-xs text-navy font-semibold">
                {t.secretaryRole}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. KEY PROBLEM SECTORS (9-DOMAIN TAXONOMY GRID)             */}
      {/* ============================================================ */}
      <section className="w-full py-10 sm:py-14 md:py-16 bg-[#F5F2E9] border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-3 border-b border-border gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                {t.sectorsTag}
              </span>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-navy font-bold mt-1">
                {t.sectorsTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted">
              {t.sectorsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Sector 1: Education */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-education">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <span className="font-mono text-xs text-cat-education font-bold bg-cat-education/10 px-2 py-0.5 border border-cat-education/30">
                    {getCategoryCount('education', 612)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">{t.secEducationTitle}</h3>
                <p className="text-xs font-semibold text-forest">{t.secEducationSub}</p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secEducationDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=education"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-01' : 'SEC-01'}</span>
              </div>
            </div>

            {/* Sector 2: Healthcare */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-health">
                    <span className="material-symbols-outlined text-2xl">local_hospital</span>
                  </div>
                  <span className="font-mono text-xs text-cat-health font-bold bg-cat-health/10 px-2 py-0.5 border border-cat-health/30">
                    {getCategoryCount('health', 540)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                  {t.secHealthTitle}
                </h3>
                <p className="text-xs font-semibold text-forest">
                  {t.secHealthSub}
                </p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secHealthDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=health"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-02' : 'SEC-02'}</span>
              </div>
            </div>

            {/* Sector 3: Agriculture */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-agriculture">
                    <span className="material-symbols-outlined text-2xl">agriculture</span>
                  </div>
                  <span className="font-mono text-xs text-cat-agriculture font-bold bg-cat-agriculture/10 px-2 py-0.5 border border-cat-agriculture/30">
                    {getCategoryCount('agriculture', 845)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                  {t.secAgriTitle}
                </h3>
                <p className="text-xs font-semibold text-forest">{t.secAgriSub}</p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secAgriDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=agriculture"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-03' : 'SEC-03'}</span>
              </div>
            </div>

            {/* Sector 4: Water Resources */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-water">
                    <span className="material-symbols-outlined text-2xl">water_drop</span>
                  </div>
                  <span className="font-mono text-xs text-cat-water font-bold bg-cat-water/10 px-2 py-0.5 border border-cat-water/30">
                    {getCategoryCount('water', 789)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                  {t.secWaterTitle}
                </h3>
                <p className="text-xs font-semibold text-forest">{t.secWaterSub}</p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secWaterDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=water"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-04' : 'SEC-04'}</span>
              </div>
            </div>

            {/* Sector 5: Environment */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-environment">
                    <span className="material-symbols-outlined text-2xl">forest</span>
                  </div>
                  <span className="font-mono text-xs text-cat-environment font-bold bg-cat-environment/10 px-2 py-0.5 border border-cat-environment/30">
                    {getCategoryCount('environment', 324)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                  {t.secEnvTitle}
                </h3>
                <p className="text-xs font-semibold text-forest">{t.secEnvSub}</p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secEnvDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=environment"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-05' : 'SEC-05'}</span>
              </div>
            </div>

            {/* Sector 6: Energy */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-energy">
                    <span className="material-symbols-outlined text-2xl">bolt</span>
                  </div>
                  <span className="font-mono text-xs text-cat-energy font-bold bg-cat-energy/10 px-2 py-0.5 border border-cat-energy/30">
                    {getCategoryCount('energy', 298)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">{t.secEnergyTitle}</h3>
                <p className="text-xs font-semibold text-forest">{t.secEnergySub}</p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secEnergyDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=energy"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-06' : 'SEC-06'}</span>
              </div>
            </div>

            {/* Sector 7: Urban Development */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-urban">
                    <span className="material-symbols-outlined text-2xl">apartment</span>
                  </div>
                  <span className="font-mono text-xs text-cat-urban font-bold bg-cat-urban/10 px-2 py-0.5 border border-cat-urban/30">
                    {getCategoryCount('road', 518)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                  {t.secUrbanTitle}
                </h3>
                <p className="text-xs font-semibold text-forest">{t.secUrbanSub}</p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secUrbanDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=road"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-07' : 'SEC-07'}</span>
              </div>
            </div>

            {/* Sector 8: Accessibility */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-accessibility">
                    <span className="material-symbols-outlined text-2xl">accessible_forward</span>
                  </div>
                  <span className="font-mono text-xs text-cat-accessibility font-bold bg-cat-accessibility/10 px-2 py-0.5 border border-cat-accessibility/30">
                    {getCategoryCount('accessibility', 415)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                  {t.secAccessTitle}
                </h3>
                <p className="text-xs font-semibold text-forest">
                  {t.secAccessSub}
                </p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secAccessDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=other"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-08' : 'SEC-08'}</span>
              </div>
            </div>

            {/* Sector 9: Rural Livelihoods */}
            <div className="bg-white border border-border p-4 sm:p-5 hover:border-navy transition-all flex flex-col justify-between rounded-[2px] shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-paper flex items-center justify-center border border-border text-cat-livelihood">
                    <span className="material-symbols-outlined text-2xl">work</span>
                  </div>
                  <span className="font-mono text-xs text-cat-livelihood font-bold bg-cat-livelihood/10 px-2 py-0.5 border border-cat-livelihood/30">
                    {getCategoryCount('other', 480)} {t.openChallengesBadge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                  {t.secLivelihoodTitle}
                </h3>
                <p className="text-xs font-semibold text-forest">
                  {t.secLivelihoodSub}
                </p>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-normal">
                  {t.secLivelihoodDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-navy">
                <Link
                  to="/problems?category=other"
                  className="hover:underline flex items-center gap-1"
                >
                  {t.viewSectorBrief}
                </Link>
                <span className="font-mono text-ink-muted">{lang === 'hi' ? 'प्रभाग-09' : 'SEC-09'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. OFFICIAL NOTICES & CIRCULARS GAZETTE BOARD               */}
      {/* ============================================================ */}
      <section id="notices" className="w-full py-10 sm:py-14 md:py-16 bg-paper">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white border-2 border-navy rounded-[2px] overflow-hidden shadow-sm">
            {/* Header Bar */}
            <div className="bg-navy px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b-2 border-turmeric text-white">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-turmeric inline-block shrink-0" />
                <h3 className="font-display text-base sm:text-lg md:text-xl font-bold">
                  {t.noticesTitle}
                </h3>
              </div>
              <div className="font-mono text-[11px] sm:text-xs text-white/70">
                {t.noticesGazetteRef}
              </div>
            </div>

            {/* Gazette Table Rows */}
            <div className="divide-y divide-border text-xs sm:text-sm">
              {/* Notice 1 */}
              <div className="p-3.5 sm:p-4 md:px-6 md:py-4 hover:bg-[#F5F2E9] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-urgent font-bold text-base sm:text-lg leading-none mt-0.5">
                    *
                  </span>
                  <div>
                    <Link
                      to="/university"
                      className="font-semibold text-navy hover:underline block leading-snug"
                    >
                      {t.notice1Title}
                    </Link>
                    <div className="font-mono text-[11px] text-ink-muted mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                      <span className="font-bold text-forest">[{lang === 'hi' ? 'संदर्भ' : 'Ref'}: DHTE/NOT/2026/042]</span>
                      <span>{t.notice1Dept}</span>
                      <Link
                        to="/university"
                        className="text-forest font-semibold bg-forest/10 px-1.5 py-0.2 rounded hover:underline"
                      >
                        {t.notice1Action}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-ink-muted shrink-0 md:text-right">
                  {lang === 'hi' ? '24 फरवरी 2026' : '24 Feb 2026'}
                </div>
              </div>

              {/* Notice 2 */}
              <div className="p-3.5 sm:p-4 md:px-6 md:py-4 hover:bg-[#F5F2E9] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-urgent font-bold text-base sm:text-lg leading-none mt-0.5">
                    *
                  </span>
                  <div>
                    <Link
                      to="/problems"
                      className="font-semibold text-navy hover:underline block leading-snug"
                    >
                      {t.notice2Title}
                    </Link>
                    <div className="font-mono text-[11px] text-ink-muted mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                      <span className="font-bold text-forest">[{lang === 'hi' ? 'संदर्भ' : 'Ref'}: JHK/GAZ/ORD-811]</span>
                      <span>{t.notice2Dept}</span>
                      <span className="text-forest font-semibold bg-forest/10 px-1.5 py-0.2 rounded">
                        {lang === 'hi' ? 'पीडीएफ (840 KB)' : 'PDF (840 KB)'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-ink-muted shrink-0 md:text-right">
                  {lang === 'hi' ? '19 फरवरी 2026' : '19 Feb 2026'}
                </div>
              </div>

              {/* Notice 3 */}
              <div className="p-3.5 sm:p-4 md:px-6 md:py-4 hover:bg-[#F5F2E9] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-urgent font-bold text-base sm:text-lg leading-none mt-0.5">
                    *
                  </span>
                  <div>
                    <Link
                      to="/industry"
                      className="font-semibold text-navy hover:underline block leading-snug"
                    >
                      {t.notice3Title}
                    </Link>
                    <div className="font-mono text-[11px] text-ink-muted mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                      <span className="font-bold text-forest">[{lang === 'hi' ? 'संदर्भ' : 'Ref'}: DHTE/CSR-RND/009]</span>
                      <span>{t.notice3Dept}</span>
                      <span className="text-forest font-semibold bg-forest/10 px-1.5 py-0.2 rounded">
                        {lang === 'hi' ? 'पीडीएफ (2.1 MB)' : 'PDF (2.1 MB)'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-ink-muted shrink-0 md:text-right">
                  {lang === 'hi' ? '14 फरवरी 2026' : '14 Feb 2026'}
                </div>
              </div>

              {/* Notice 4 */}
              <div className="p-3.5 sm:p-4 md:px-6 md:py-4 hover:bg-[#F5F2E9] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-urgent font-bold text-base sm:text-lg leading-none mt-0.5">
                    *
                  </span>
                  <div>
                    <Link
                      to="/submit"
                      className="font-semibold text-navy hover:underline block leading-snug"
                    >
                      {t.notice4Title}
                    </Link>
                    <div className="font-mono text-[11px] text-ink-muted mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                      <span className="font-bold text-forest">[{lang === 'hi' ? 'संदर्भ' : 'Ref'}: NIC-SOP-V3.4]</span>
                      <span>{t.notice4Dept}</span>
                      <span className="text-forest font-semibold bg-forest/10 px-1.5 py-0.2 rounded">
                        {lang === 'hi' ? 'पीडीएफ (620 KB)' : 'PDF (620 KB)'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-ink-muted shrink-0 md:text-right">
                  {lang === 'hi' ? '08 फरवरी 2026' : '08 Feb 2026'}
                </div>
              </div>
            </div>

            {/* Gazette Notice Footer */}
            <div className="bg-[#F5F2E9] p-3.5 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
              <div className="text-ink-muted font-mono text-center sm:text-left">
                {t.noticesArchiveNote}
              </div>
              <Link
                to="/problems"
                className="inline-flex items-center px-3 py-1.5 bg-white border border-border text-navy font-semibold hover:bg-paper transition-colors rounded-[2px]"
              >
                {t.browseAllChallenges}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. HOW IT WORKS MODAL                                        */}
      {/* ============================================================ */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border-2 border-navy max-w-2xl w-full p-5 sm:p-6 space-y-4 rounded-[2px] shadow-lg">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base sm:text-lg text-navy font-bold">
                {t.videoModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1 text-ink hover:bg-paper font-bold text-xl leading-none"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="aspect-video bg-navy flex flex-col items-center justify-center text-white p-4 sm:p-6 border border-border">
              <span className="material-symbols-outlined text-4xl sm:text-6xl text-turmeric mb-2">
                play_circle
              </span>
              <p className="font-display text-sm sm:text-base font-semibold text-center">
                {t.videoModalSub}
              </p>
              <p className="font-mono text-[10px] sm:text-xs text-white/70 mt-1 text-center">
                {t.videoModalDuration}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2">
              <span className="font-mono text-[11px] text-ink-muted">
                {t.videoModalNode}
              </span>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="w-full sm:w-auto px-4 py-1.5 bg-navy text-white text-xs font-semibold hover:bg-navy-deep rounded-[2px]"
              >
                {t.videoModalClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
