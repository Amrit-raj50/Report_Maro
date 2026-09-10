import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { StatsOverview } from '@sih/shared-types';
import { apiClient } from '../lib/apiClient.js';

/* ─────────────────────────────────────────────────────────
   Type definitions
   ───────────────────────────────────────────────────────── */

interface DomainItem {
  name: string;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  colorClass: string;
}

interface DistrictItem {
  name: string;
  total: number;
  breakdown: Record<string, number>;
}

interface PipelineStep {
  stage: string;
  count: number;
  pct: number;
}

interface AttentionProject {
  id: string;
  title: string;
  district: string;
  reason: string;
  severity: 'critical' | 'high' | 'medium';
  university: string;
  daysSince: number;
}

interface UniversityRow {
  name: string;
  challenges: number;
  projects: number;
  completed: number;
  deployed: number;
  students: number;
  faculty: number;
}

interface IndustryRow {
  name: string;
  projects: number;
  funding: string;
  pilots: number;
  mentorships: number;
}

interface ChallengeRow {
  id: string;
  title: string;
  district: string;
  domain: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: string;
}

interface ImpactSector {
  sector: string;
  people: number;
}

/* ─────────────────────────────────────────────────────────
   Seeded data — real DB values in production; demo-ready now
   ───────────────────────────────────────────────────────── */

const DOMAINS: DomainItem[] = [
  { name: 'Agriculture', count: 520, critical: 82, high: 174, medium: 201, low: 63, colorClass: 'bg-cat-agriculture' },
  { name: 'Healthcare', count: 390, critical: 64, high: 120, medium: 146, low: 60, colorClass: 'bg-cat-health' },
  { name: 'Water & Sanitation', count: 310, critical: 51, high: 98, medium: 112, low: 49, colorClass: 'bg-cat-water' },
  { name: 'Education', count: 270, critical: 32, high: 84, medium: 104, low: 50, colorClass: 'bg-cat-education' },
  { name: 'Environment', count: 240, critical: 28, high: 66, medium: 96, low: 50, colorClass: 'bg-cat-environment' },
  { name: 'Infrastructure', count: 180, critical: 42, high: 58, medium: 60, low: 20, colorClass: 'bg-cat-urban' },
  { name: 'Energy', count: 150, critical: 21, high: 49, medium: 55, low: 25, colorClass: 'bg-cat-energy' },
  { name: 'Accessibility', count: 120, critical: 15, high: 35, medium: 48, low: 22, colorClass: 'bg-cat-accessibility' },
];

const DISTRICTS: DistrictItem[] = [
  { name: 'Ranchi', total: 342, breakdown: { Agriculture: 72, Healthcare: 64, 'Water & San.': 51, Education: 47, Infra: 42, Others: 66 } },
  { name: 'Dhanbad', total: 287, breakdown: { Agriculture: 48, Healthcare: 55, 'Water & San.': 62, Education: 39, Infra: 50, Others: 33 } },
  { name: 'East Singhbhum', total: 251, breakdown: { Agriculture: 38, Healthcare: 52, 'Water & San.': 45, Education: 43, Infra: 48, Others: 25 } },
  { name: 'Bokaro', total: 198, breakdown: { Agriculture: 41, Healthcare: 38, 'Water & San.': 37, Education: 32, Infra: 30, Others: 20 } },
  { name: 'Hazaribagh', total: 164, breakdown: { Agriculture: 55, Healthcare: 29, 'Water & San.': 30, Education: 25, Infra: 15, Others: 10 } },
  { name: 'Deoghar', total: 142, breakdown: { Agriculture: 40, Healthcare: 32, 'Water & San.': 28, Education: 22, Infra: 12, Others: 8 } },
  { name: 'Dumka', total: 128, breakdown: { Agriculture: 44, Healthcare: 26, 'Water & San.': 22, Education: 18, Infra: 10, Others: 8 } },
  { name: 'Giridih', total: 118, breakdown: { Agriculture: 38, Healthcare: 24, 'Water & San.': 20, Education: 16, Infra: 12, Others: 8 } },
];

const PIPELINE: PipelineStep[] = [
  { stage: 'Submitted', count: 2438, pct: 100 },
  { stage: 'Validated', count: 1940, pct: 80 },
  { stage: 'Domain Matched', count: 1240, pct: 51 },
  { stage: 'Univ. Assigned', count: 1020, pct: 42 },
  { stage: 'Project Active', count: 542, pct: 22 },
  { stage: 'Completed', count: 213, pct: 9 },
  { stage: 'Pilot', count: 96, pct: 4 },
  { stage: 'Deployed', count: 87, pct: 4 },
];

const ATTENTION: AttentionProject[] = [
  { id: 'JH-AGR-2026-01082', title: 'Smart Solar Irrigation Mesh', district: 'Hazaribagh', reason: 'No milestone update received', severity: 'high', university: 'Birsa Agricultural University', daysSince: 18 },
  { id: 'JH-HLT-2026-01094', title: 'Rural Tele-Healthcare Diagnostic Unit', district: 'Dhanbad', reason: 'Industry partner marked inactive; funding paused', severity: 'critical', university: 'BIT Sindri', daysSince: 24 },
  { id: 'JH-WTR-2026-01102', title: 'Arsenic Water Filtration Sensor Array', district: 'Ranchi', reason: 'Field deployment delayed — permit pending', severity: 'medium', university: 'Ranchi University', daysSince: 21 },
  { id: 'JH-EDU-2026-01118', title: 'AI-based Dropout Prediction System', district: 'Dumka', reason: 'Faculty mentor resigned; replacement pending', severity: 'high', university: 'Sido Kanhu Murmu University', daysSince: 12 },
];

const UNIVERSITIES: UniversityRow[] = [
  { name: 'BIT Mesra', challenges: 142, projects: 48, completed: 22, deployed: 14, students: 240, faculty: 18 },
  { name: 'Birsa Agricultural University', challenges: 120, projects: 42, completed: 18, deployed: 11, students: 190, faculty: 14 },
  { name: 'NIT Jamshedpur', challenges: 98, projects: 35, completed: 14, deployed: 9, students: 165, faculty: 12 },
  { name: 'IIT (ISM) Dhanbad', challenges: 84, projects: 31, completed: 12, deployed: 8, students: 140, faculty: 11 },
  { name: 'Ranchi University', challenges: 76, projects: 27, completed: 9, deployed: 5, students: 120, faculty: 9 },
  { name: 'Sido Kanhu Murmu Univ.', challenges: 64, projects: 22, completed: 7, deployed: 3, students: 98, faculty: 7 },
];

const INDUSTRIES: IndustryRow[] = [
  { name: 'Tata Steel CSR Foundation', projects: 14, funding: '₹45L', pilots: 9, mentorships: 22 },
  { name: 'BCCL Innovation Lab', projects: 10, funding: '₹32L', pilots: 7, mentorships: 18 },
  { name: 'Jindal Steel & Power', projects: 8, funding: '₹25L', pilots: 5, mentorships: 14 },
  { name: 'Jharkhand Renewable Energy Corp.', projects: 6, funding: '₹18L', pilots: 4, mentorships: 11 },
  { name: 'Adityapur Industrial Area Dev. Auth.', projects: 5, funding: '₹12L', pilots: 3, mentorships: 8 },
];

const CHALLENGES: ChallengeRow[] = [
  { id: 'JH-WTR-2026-01023', title: 'Groundwater Arsenic Contamination in Peri-urban Wells', district: 'Ranchi', domain: 'Water & Sanitation', priority: 'Critical', status: 'Univ. Assigned' },
  { id: 'JH-AGR-2026-01024', title: 'Paddy Blast Disease Detection via Imagery', district: 'Dhanbad', domain: 'Agriculture', priority: 'High', status: 'Project Active' },
  { id: 'JH-ENR-2026-01025', title: 'Solar-Powered Cold Storage for Tribal Markets', district: 'Bokaro', domain: 'Energy', priority: 'High', status: 'Pilot Phase' },
  { id: 'JH-HLT-2026-01026', title: 'Primary Health Sub-Centre Tele-link System', district: 'Hazaribagh', domain: 'Healthcare', priority: 'Medium', status: 'Completed' },
  { id: 'JH-INF-2026-01027', title: 'Bridge Structural Micro-crack Sensor Network', district: 'East Singhbhum', domain: 'Infrastructure', priority: 'Critical', status: 'Validated' },
  { id: 'JH-EDU-2026-01028', title: 'Vernacular Language EdTech Content Pipeline', district: 'Dumka', domain: 'Education', priority: 'Medium', status: 'Project Active' },
  { id: 'JH-ENV-2026-01029', title: 'Damodar River Effluent Monitoring Buoy', district: 'Bokaro', domain: 'Environment', priority: 'High', status: 'Validated' },
];

const IMPACT_BY_SECTOR: ImpactSector[] = [
  { sector: 'Healthcare', people: 12400 },
  { sector: 'Agriculture', people: 9800 },
  { sector: 'Water & Sanitation', people: 8200 },
  { sector: 'Education', people: 6400 },
  { sector: 'Accessibility', people: 5200 },
];

/* Sidebar navigation items */
const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'districts', label: 'Districts' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'attention', label: 'Attention' },
  { id: 'universities', label: 'Universities' },
  { id: 'industry', label: 'Industry' },
  { id: 'impact', label: 'Impact' },
  { id: 'search', label: 'Search' },
  { id: 'reports', label: 'Reports' },
] as const;

/* ─────────────────────────────────────────────────────────
   Reusable micro-components (co-located, dashboard-only)
   ───────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
      {children}
    </span>
  );
}

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div id={id} className="scroll-mt-4 pb-3 border-b border-border">
      <h2 className="font-display text-xl font-medium text-ink">{title}</h2>
      {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}

function SeverityBadge({ level }: { level: 'critical' | 'high' | 'medium' | 'low' | string }) {
  const cls =
    level === 'critical' || level === 'Critical' ? 'bg-urgent/10 text-urgent' :
    level === 'high' || level === 'High' ? 'bg-st-review/10 text-st-review' :
    level === 'medium' || level === 'Medium' ? 'bg-st-routed/10 text-st-routed' :
    'bg-st-submitted/10 text-st-submitted';
  return (
    <span className={`inline-block rounded-[3px] px-2 py-0.5 text-[10px] font-semibold uppercase ${cls}`}>
      {level}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────────────── */

export default function GovernmentDashboard() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [selectedDomain, setSelectedDomain] = useState<DomainItem>(DOMAINS[0]!);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem>(DISTRICTS[0]!);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [backendLive, setBackendLive] = useState(false);
  const [realStats, setRealStats] = useState<StatsOverview['data'] | null>(null);

  /* Try to connect to backend's real stats endpoint */
  useEffect(() => {
    apiClient.get<StatsOverview>('/problems/stats/dashboard')
      .then((res) => {
        if (res.data.data) {
          setRealStats(res.data.data);
          setBackendLive(true);
        }
      })
      .catch(() => { setBackendLive(false); });
  }, []);

  /* Scroll sidebar → section */
  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Challenge search / filter logic */
  const filteredChallenges = useMemo(() => {
    return CHALLENGES.filter((ch) => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || ch.title.toLowerCase().includes(q) || ch.id.toLowerCase().includes(q);
      const matchDom = filterDomain === 'All' || ch.domain === filterDomain;
      const matchDist = filterDistrict === 'All' || ch.district === filterDistrict;
      const matchPri = filterPriority === 'All' || ch.priority === filterPriority;
      return matchQ && matchDom && matchDist && matchPri;
    });
  }, [searchQuery, filterDomain, filterDistrict, filterPriority]);

  /* CSV export */
  const exportCsv = (filename = 'jharkhand-challenges-export.csv') => {
    const hdr = ['Ref. No.', 'Title', 'District', 'Domain', 'Priority', 'Status'];
    const rows = filteredChallenges.map((c) =>
      [c.id, `"${c.title}"`, c.district, c.domain, c.priority, c.status],
    );
    const csv = [hdr.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ─── JSX ─── */
  return (
    <div className="flex h-screen overflow-hidden bg-paper text-ink">

      {/* ═══════════════ LEFT SIDEBAR ═══════════════ */}
      <aside className="flex w-[232px] shrink-0 flex-col border-r border-border bg-paper">
        {/* Brand block */}
        <div className="border-b border-border px-5 py-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Government of Jharkhand
          </div>
          <div className="font-display text-lg font-semibold text-navy leading-tight mt-1">
            समाधान सेतु
          </div>
          <div className="text-[11px] text-ink-muted mt-0.5">Samadhan Setu</div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left rounded-[3px] px-3 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                activeSection === item.id
                  ? 'bg-navy text-white'
                  : 'text-ink-muted hover:bg-navy/5 hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer link */}
        <div className="border-t border-border px-5 py-3">
          <Link to="/" className="text-[11px] font-medium text-turmeric hover:text-turmeric-deep">
            ← Back to Portal
          </Link>
        </div>
      </aside>

      {/* ═══════════════ MAIN CONTENT AREA ═══════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ── Band 1 — Utility bar ── */}
        <div className="flex h-8 items-center justify-between bg-navy px-5 text-[11px] text-white/80">
          <div className="flex items-center gap-4">
            <span>☎ 1800-XXX-XXXX</span>
            <span>✉ helpdesk@samadhan-setu.jharkhand.gov.in</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer hover:text-white">A+</span>
            <span className="cursor-pointer hover:text-white">A</span>
            <span className="cursor-pointer hover:text-white">A-</span>
            <span className="text-white/40">|</span>
            <span className="cursor-pointer hover:text-white">English</span>
            <span className="cursor-pointer hover:text-white">हिन्दी</span>
            {backendLive && (
              <>
                <span className="text-white/40">|</span>
                <span className="flex items-center gap-1 text-green-300">
                  <span className="block h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  Live DB
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Band 2 — Identity bar ── */}
        <div className="flex items-center justify-between border-b border-border bg-paper px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-navy/20 bg-navy/5 text-xl">
              🏛
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                Department of Higher & Technical Education · Government of Jharkhand
              </div>
              <h1 className="font-display text-xl font-semibold text-ink leading-tight">
                Societal Innovation Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <button
              onClick={() => exportCsv()}
              className="rounded-[3px] border border-border bg-white px-3 py-1.5 font-medium text-ink-muted hover:bg-navy/5 transition cursor-pointer"
            >
              Export CSV
            </button>
            <div className="flex items-center gap-1.5 rounded-[3px] border border-urgent/20 bg-urgent/5 px-2.5 py-1.5 text-urgent font-medium">
              <span className="block h-2 w-2 rounded-full bg-urgent animate-pulse"></span>
              {ATTENTION.length} Alerts
            </div>
          </div>
        </div>

        {/* ── Scrollable main content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1280px] px-6 py-6 space-y-8">

            {/* ══════════════════════════════════════════
                SECTION 1 — KPI Stat Cards
               ══════════════════════════════════════════ */}
            <section id="overview">
              <Eyebrow>State-Level Indicators</Eyebrow>
              <div className="mt-3 grid grid-cols-4 gap-px bg-border lg:grid-cols-7">
                {[
                  { label: 'Problems Submitted', value: realStats?.total ?? 2438, sub: '24 / 24 districts' },
                  { label: 'Active Projects', value: 542, sub: '38 universities' },
                  { label: 'Completed', value: 213, sub: 'Solutions tested' },
                  { label: 'Deployed', value: 87, sub: 'In public field' },
                  { label: 'Universities', value: 32, sub: 'Onboarded' },
                  { label: 'Industry Partners', value: 86, sub: '₹2.4 Cr committed' },
                  { label: 'People Impacted', value: '42,000+', sub: '86 villages reached' },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-paper px-4 py-4">
                    <div className="text-[11px] font-medium text-ink-muted">{kpi.label}</div>
                    <div className="mt-1 font-mono text-2xl font-medium text-ink">
                      {typeof kpi.value === 'number' ? kpi.value.toLocaleString('en-IN') : kpi.value}
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-muted">{kpi.sub}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 2 & 3 — Domain Analytics + District Map
               ══════════════════════════════════════════ */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* — Challenges by Domain — */}
              <section id="challenges" className="border border-border bg-white p-5">
                <SectionHeading id="challenges-h" title="Challenges by Domain" subtitle="Click any sector for severity breakdown" />

                <div className="mt-4 space-y-2.5">
                  {DOMAINS.map((dom) => {
                    const pct = Math.round((dom.count / 550) * 100);
                    const active = selectedDomain.name === dom.name;
                    return (
                      <button
                        key={dom.name}
                        onClick={() => setSelectedDomain(dom)}
                        className={`block w-full rounded-[3px] p-2.5 text-left transition cursor-pointer ${
                          active ? 'bg-navy/5 ring-1 ring-navy/20' : 'hover:bg-navy/[0.02]'
                        }`}
                      >
                        <div className="flex items-baseline justify-between text-[13px]">
                          <span className="font-medium text-ink">{dom.name}</span>
                          <span className="font-mono text-[13px] font-medium text-ink">{dom.count}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full rounded-[2px] bg-border/60 overflow-hidden">
                          <div className={`h-full rounded-[2px] ${dom.colorClass}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Drilldown severity card */}
                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <Eyebrow>{selectedDomain.name} — Severity Distribution</Eyebrow>
                    <span className="font-mono text-[12px] font-medium text-ink">Total: {selectedDomain.count}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-[3px] bg-urgent/8 p-2">
                      <div className="font-mono text-base font-medium text-urgent">{selectedDomain.critical}</div>
                      <div className="text-[10px] font-semibold uppercase text-urgent/70">Critical</div>
                    </div>
                    <div className="rounded-[3px] bg-st-review/8 p-2">
                      <div className="font-mono text-base font-medium text-st-review">{selectedDomain.high}</div>
                      <div className="text-[10px] font-semibold uppercase text-st-review/70">High</div>
                    </div>
                    <div className="rounded-[3px] bg-st-routed/8 p-2">
                      <div className="font-mono text-base font-medium text-st-routed">{selectedDomain.medium}</div>
                      <div className="text-[10px] font-semibold uppercase text-st-routed/70">Medium</div>
                    </div>
                    <div className="rounded-[3px] bg-st-submitted/8 p-2">
                      <div className="font-mono text-base font-medium text-st-submitted">{selectedDomain.low}</div>
                      <div className="text-[10px] font-semibold uppercase text-st-submitted/70">Low</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* — District Hotspots — */}
              <section id="districts" className="border border-border bg-white p-5 flex flex-col">
                <SectionHeading id="districts-h" title="District-wise Challenge Map" subtitle="Click a district to view sector breakdown" />

                {/* Grid-based district map simulation */}
                <div className="mt-4 flex-1 rounded-[3px] border border-dashed border-border bg-paper/50 p-4">
                  <div className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted mb-3">
                    Jharkhand · 24 Districts
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {DISTRICTS.map((d) => {
                      const active = selectedDistrict.name === d.name;
                      const heat =
                        d.total >= 300 ? 'border-urgent text-urgent' :
                        d.total >= 200 ? 'border-st-review text-st-review' :
                        d.total >= 150 ? 'border-st-routed text-st-routed' :
                        'border-st-submitted text-st-submitted';
                      return (
                        <button
                          key={d.name}
                          onClick={() => setSelectedDistrict(d)}
                          className={`rounded-[3px] border p-2 text-left transition cursor-pointer ${
                            active
                              ? 'border-navy bg-navy/5 ring-1 ring-navy/30'
                              : `${heat} bg-white hover:bg-navy/[0.02]`
                          }`}
                        >
                          <div className="text-[11px] font-semibold text-ink truncate">{d.name}</div>
                          <div className={`font-mono text-sm font-medium mt-0.5 ${active ? 'text-navy' : ''}`}>
                            {d.total}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected district breakdown */}
                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-base font-medium text-ink">{selectedDistrict.name}</span>
                      <span className="ml-2 text-[11px] text-ink-muted">District Innovation Profile</span>
                    </div>
                    <span className="font-mono text-base font-medium text-ink">{selectedDistrict.total}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {Object.entries(selectedDistrict.breakdown).map(([sector, count]) => (
                      <div key={sector} className="rounded-[3px] border border-border bg-paper px-2 py-1.5 text-center">
                        <div className="font-mono text-sm font-medium text-ink">{count}</div>
                        <div className="text-[10px] text-ink-muted truncate">{sector}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 4 — Challenge → Project Pipeline Funnel
               ══════════════════════════════════════════ */}
            <section id="pipeline" className="border border-border bg-white p-5">
              <SectionHeading id="pipeline-h" title="Challenge → Project Lifecycle" subtitle="Conversion funnel from citizen report to societal deployment" />

              <div className="mt-5">
                {PIPELINE.map((step, idx) => (
                  <div key={step.stage} className="flex items-center gap-4">
                    {/* Funnel bar */}
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-[12px] font-medium text-ink">
                          <span className="font-mono text-ink-muted mr-1.5">{String(idx + 1).padStart(2, '0')}</span>
                          {step.stage}
                        </span>
                        <span className="font-mono text-[13px] font-medium text-ink">{step.count.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-5 w-full rounded-[2px] bg-border/40 overflow-hidden">
                        <div
                          className="h-full rounded-[2px] bg-navy transition-all duration-500"
                          style={{ width: `${step.pct}%`, opacity: 0.15 + (step.pct / 100) * 0.85 }}
                        ></div>
                      </div>
                    </div>
                    {/* Arrow connector */}
                    {idx < PIPELINE.length - 1 && (
                      <div className="w-4 text-center text-border text-xs">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 5 — Projects Requiring Attention
               ══════════════════════════════════════════ */}
            <section id="attention" className="border border-urgent/20 bg-urgent/[0.03] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-urgent/10">
                <div className="flex items-center gap-2">
                  <span className="block h-2.5 w-2.5 rounded-full bg-urgent animate-pulse"></span>
                  <h2 className="font-display text-lg font-medium text-ink">Projects Requiring Attention</h2>
                </div>
                <Eyebrow>{ATTENTION.length} flagged</Eyebrow>
              </div>

              <div className="mt-4 space-y-3">
                {ATTENTION.map((p) => (
                  <div key={p.id} className="flex items-start justify-between gap-4 rounded-[3px] border border-border bg-white p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[12px] font-medium text-ink-muted">{p.id}</span>
                        <SeverityBadge level={p.severity} />
                      </div>
                      <h3 className="mt-1 text-[14px] font-medium text-ink truncate">{p.title}</h3>
                      <p className="mt-1 text-[12px] text-urgent font-medium">{p.reason}</p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-muted">
                        <span>{p.district}</span>
                        <span className="text-border">·</span>
                        <span>{p.university}</span>
                        <span className="text-border">·</span>
                        <span className="font-mono">{p.daysSince} days</span>
                      </div>
                    </div>
                    <button className="shrink-0 rounded-[3px] border border-navy/20 px-3 py-1.5 text-[11px] font-semibold text-navy hover:bg-navy/5 transition cursor-pointer">
                      View Project
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 6 & 7 — Universities + Industry
               ══════════════════════════════════════════ */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* University Performance */}
              <section id="universities" className="border border-border bg-white p-5">
                <SectionHeading id="univ-h" title="University Participation" subtitle="Institutional uptake and solution progress" />

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-border text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                        <th className="pb-2 pr-3">Institution</th>
                        <th className="pb-2 pr-2 text-right">Chal.</th>
                        <th className="pb-2 pr-2 text-right">Proj.</th>
                        <th className="pb-2 pr-2 text-right">Done</th>
                        <th className="pb-2 pr-2 text-right">Depl.</th>
                        <th className="pb-2 text-right">Students</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {UNIVERSITIES.map((u) => (
                        <tr key={u.name} className="hover:bg-navy/[0.02]">
                          <td className="py-2.5 pr-3 font-medium text-ink">{u.name}</td>
                          <td className="py-2.5 pr-2 text-right font-mono">{u.challenges}</td>
                          <td className="py-2.5 pr-2 text-right font-mono text-st-routed">{u.projects}</td>
                          <td className="py-2.5 pr-2 text-right font-mono text-st-resolved">{u.completed}</td>
                          <td className="py-2.5 pr-2 text-right font-mono text-forest">{u.deployed}</td>
                          <td className="py-2.5 text-right font-mono text-ink-muted">{u.students}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Industry Engagement */}
              <section id="industry" className="border border-border bg-white p-5 flex flex-col">
                <SectionHeading id="ind-h" title="Industry Engagement" subtitle="Private-sector co-sponsorship and field pilots" />

                {/* Summary row */}
                <div className="mt-4 grid grid-cols-3 gap-px bg-border">
                  <div className="bg-paper px-3 py-3 text-center">
                    <div className="font-mono text-lg font-medium text-ink">₹2.4 Cr</div>
                    <div className="text-[10px] font-semibold uppercase text-ink-muted">Funding</div>
                  </div>
                  <div className="bg-paper px-3 py-3 text-center">
                    <div className="font-mono text-lg font-medium text-ink">43</div>
                    <div className="text-[10px] font-semibold uppercase text-ink-muted">Pilots</div>
                  </div>
                  <div className="bg-paper px-3 py-3 text-center">
                    <div className="font-mono text-lg font-medium text-ink">124</div>
                    <div className="text-[10px] font-semibold uppercase text-ink-muted">Mentors</div>
                  </div>
                </div>

                {/* Partners table */}
                <div className="mt-4 flex-1 overflow-x-auto">
                  <Eyebrow>Top Contributing Partners</Eyebrow>
                  <table className="mt-2 w-full text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-border text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                        <th className="pb-2 pr-3">Partner</th>
                        <th className="pb-2 pr-2 text-right">Proj.</th>
                        <th className="pb-2 pr-2 text-right">Funding</th>
                        <th className="pb-2 text-right">Pilots</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {INDUSTRIES.map((ind) => (
                        <tr key={ind.name} className="hover:bg-navy/[0.02]">
                          <td className="py-2.5 pr-3 font-medium text-ink">{ind.name}</td>
                          <td className="py-2.5 pr-2 text-right font-mono">{ind.projects}</td>
                          <td className="py-2.5 pr-2 text-right font-mono text-forest font-medium">{ind.funding}</td>
                          <td className="py-2.5 text-right font-mono">{ind.pilots}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* ══════════════════════════════════════════
                SECTION 8 — Social Impact + Innovation Outcomes
               ══════════════════════════════════════════ */}
            <section id="impact" className="border border-forest/20 bg-forest/[0.03] p-5">
              <SectionHeading id="impact-h" title="Measurable Social Impact" subtitle="Did this actually improve people's lives?" />

              {/* Top-line metrics */}
              <div className="mt-5 grid grid-cols-3 gap-px bg-forest/10 lg:grid-cols-6">
                {[
                  { val: '42,000+', label: 'People Impacted' },
                  { val: '86', label: 'Villages Reached' },
                  { val: '87', label: 'Solutions Deployed' },
                  { val: '156', label: 'Prototypes Validated' },
                  { val: '12', label: 'Startups Incubated' },
                  { val: '8', label: 'Patents Filed' },
                ].map((m) => (
                  <div key={m.label} className="bg-paper px-4 py-3 text-center">
                    <div className="font-mono text-xl font-medium text-forest">{m.val}</div>
                    <div className="text-[10px] font-semibold uppercase text-ink-muted mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Impact by sector */}
              <div className="mt-5 border-t border-forest/10 pt-4">
                <Eyebrow>Impact by Sector</Eyebrow>
                <div className="mt-3 space-y-2">
                  {IMPACT_BY_SECTOR.map((s) => {
                    const maxPeople = 13000;
                    const pct = Math.round((s.people / maxPeople) * 100);
                    return (
                      <div key={s.sector} className="flex items-center gap-3">
                        <span className="w-28 text-[12px] font-medium text-ink truncate">{s.sector}</span>
                        <div className="flex-1 h-3 rounded-[2px] bg-forest/10 overflow-hidden">
                          <div className="h-full rounded-[2px] bg-forest/40" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="font-mono text-[12px] font-medium text-ink w-16 text-right">
                          {s.people.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Innovation Outcomes row */}
              <div className="mt-5 border-t border-forest/10 pt-4">
                <Eyebrow>Innovation Outcomes</Eyebrow>
                <div className="mt-3 grid grid-cols-4 gap-px bg-forest/10 lg:grid-cols-7">
                  {[
                    { val: 213, label: 'Projects Completed' },
                    { val: 156, label: 'Prototypes Developed' },
                    { val: 87, label: 'Solutions Deployed' },
                    { val: 8, label: 'Patents Generated' },
                    { val: 12, label: 'Startups Created' },
                    { val: 43, label: 'Industry Pilots' },
                    { val: 124, label: 'Research Projects' },
                  ].map((o) => (
                    <div key={o.label} className="bg-paper px-3 py-2.5 text-center">
                      <div className="font-mono text-base font-medium text-ink">{o.val}</div>
                      <div className="text-[9px] font-semibold uppercase text-ink-muted mt-0.5 leading-tight">{o.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 9 — Challenge Search & Filter
               ══════════════════════════════════════════ */}
            <section id="search" className="border border-border bg-white p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h2 className="font-display text-lg font-medium text-ink">Challenge Registry</h2>
                  <p className="text-[12px] text-ink-muted">Search and filter civic issues across departments</p>
                </div>
                <button
                  onClick={() => exportCsv('state-challenge-registry.csv')}
                  className="rounded-[3px] bg-turmeric px-4 py-2 text-[12px] font-semibold text-ink hover:bg-turmeric-deep transition cursor-pointer"
                >
                  Export Registry
                </button>
              </div>

              {/* Filters */}
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <input
                  type="text"
                  placeholder="Search by Ref. No. or keyword…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-[3px] border border-border bg-paper px-3 py-2 text-[12px] text-ink placeholder:text-ink-muted/50 focus:border-navy focus:outline-none"
                />
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="rounded-[3px] border border-border bg-paper px-3 py-2 text-[12px] text-ink cursor-pointer focus:border-navy focus:outline-none"
                >
                  <option value="All">All Domains</option>
                  {DOMAINS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="rounded-[3px] border border-border bg-paper px-3 py-2 text-[12px] text-ink cursor-pointer focus:border-navy focus:outline-none"
                >
                  <option value="All">All Districts</option>
                  {DISTRICTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="rounded-[3px] border border-border bg-paper px-3 py-2 text-[12px] text-ink cursor-pointer focus:border-navy focus:outline-none"
                >
                  <option value="All">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Results table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="border-b border-border text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                      <th className="pb-2 pr-3">Ref. No.</th>
                      <th className="pb-2 pr-3">Title</th>
                      <th className="pb-2 pr-3">District</th>
                      <th className="pb-2 pr-3">Domain</th>
                      <th className="pb-2 pr-3">Priority</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredChallenges.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-ink-muted">
                          No matching challenges found.
                        </td>
                      </tr>
                    ) : (
                      filteredChallenges.map((ch) => (
                        <tr key={ch.id} className="hover:bg-navy/[0.02]">
                          <td className="py-2.5 pr-3 font-mono text-[11px] font-medium text-ink-muted">{ch.id}</td>
                          <td className="py-2.5 pr-3 font-medium text-ink">{ch.title}</td>
                          <td className="py-2.5 pr-3 text-ink-muted">{ch.district}</td>
                          <td className="py-2.5 pr-3 text-ink-muted">{ch.domain}</td>
                          <td className="py-2.5 pr-3"><SeverityBadge level={ch.priority} /></td>
                          <td className="py-2.5">
                            <span className="rounded-[3px] bg-navy/5 px-2 py-0.5 text-[10px] font-semibold text-navy uppercase">
                              {ch.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 10 — Reports
               ══════════════════════════════════════════ */}
            <section id="reports" className="border border-border bg-white p-5">
              <SectionHeading id="reports-h" title="Reports" subtitle="Downloadable summaries for offline circulation" />
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  'Monthly Challenge Report',
                  'District Performance Report',
                  'University Performance Report',
                  'Industry Engagement Report',
                  'Social Impact Report',
                  'Innovation Outcomes Summary',
                ].map((r) => (
                  <button
                    key={r}
                    onClick={() => exportCsv(`${r.toLowerCase().replace(/ /g, '-')}.csv`)}
                    className="flex items-center justify-between rounded-[3px] border border-border bg-paper px-4 py-3 text-[13px] font-medium text-ink hover:bg-navy/[0.03] transition cursor-pointer"
                  >
                    <span>{r}</span>
                    <span className="text-ink-muted text-[11px]">CSV ↓</span>
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* ── Footer ── */}
          <footer className="mt-6 border-t border-border">
            <div className="mx-auto max-w-[1280px] px-6 py-4 text-[11px] text-ink-muted">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>Developed by Team Samadhan Setu · Smart India Hackathon 2026 · PS 26043</span>
                <span>Department of Higher & Technical Education, Government of Jharkhand</span>
                <span>Version 1.0 | Last updated: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>
            <div className="bg-navy px-6 py-2.5 text-center text-[11px] text-white/70">
              © 2026 Government of Jharkhand. All Rights Reserved. | Accessibility | Privacy Policy | Sitemap
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
