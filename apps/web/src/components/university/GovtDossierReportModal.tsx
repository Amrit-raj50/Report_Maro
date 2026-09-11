import React, { useState, useMemo } from 'react';
import {
  ProjectItem,
  ChallengeItem,
} from './universityData.js';
import {
  compileDossierRecords,
  exportDossierToCSV,
  triggerDossierPrint,
  formatIndianCurrency,
} from '../../utils/dossierExporter.js';
import {
  X,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface GovtDossierReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  challenges: ChallengeItem[];
  institutionName?: string;
  institutionAishe?: string;
}

export const GovtDossierReportModal: React.FC<GovtDossierReportModalProps> = ({
  isOpen,
  onClose,
  projects,
  challenges,
  institutionName = 'Birla Institute of Technology (BIT) Mesra, Ranchi',
  institutionAishe = 'U-0205',
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('FY 2026-27 (Current)');
  const [isExporting, setIsExporting] = useState(false);

  // Compile records based on filter
  const records = useMemo(() => {
    return compileDossierRecords(projects, challenges, selectedDept);
  }, [projects, challenges, selectedDept]);

  // Aggregate Metrics
  const totalBudget = useMemo(
    () => records.reduce((acc, r) => acc + r.budgetAllocated, 0),
    [records]
  );
  const totalUtilized = useMemo(
    () => records.reduce((acc, r) => acc + r.fundsUtilized, 0),
    [records]
  );
  const avgUtilizationRate = useMemo(
    () => (totalBudget > 0 ? Math.round((totalUtilized / totalBudget) * 100) : 0),
    [totalBudget, totalUtilized]
  );
  const totalPersonnel = useMemo(
    () => records.reduce((acc, r) => acc + r.teamSize, 0) + records.length,
    [records]
  );
  const uniqueDistricts = useMemo(
    () => Array.from(new Set(records.map((r) => r.district))),
    [records]
  );

  const deptFilterLabels: Record<string, string> = {
    all: 'All Departments (Consolidated Executive Dossier)',
    water: 'Dept. of Drinking Water & Sanitation (DWSD)',
    agri: 'Dept. of Agriculture, Animal Husbandry & Co-operative',
    health: 'Dept. of Health, Medical Education & Family Welfare',
    mining: 'Dept. of Mines & Geology / Forest & Environment',
    energy: 'Dept. of Energy (JBVNL / JREDA)',
    it: 'Dept. of Information Technology & e-Governance',
  };

  const handlePrintPDF = () => {
    triggerDossierPrint('jharkhand-govt-dossier-print-content');
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    exportDossierToCSV(records, deptFilterLabels[selectedDept] || selectedDept);
    setTimeout(() => setIsExporting(false), 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-white border border-navy/20 shadow-2xl rounded-none text-ink">
        
        {/* MODAL CONTROL HEADER (Hidden during print) */}
        <div className="flex flex-wrap items-center justify-between border-b border-border bg-paper-light px-4 py-3 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center border border-navy/30 bg-navy text-white font-bold text-xs">
              JH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-forest bg-forest/10 px-1.5 py-0.2 border border-forest/20">
                  State Executive Dossier Engine
                </span>
                <span className="text-[11px] font-mono text-ink-muted">
                  REF: JH-DHTE/SS/EXEC-2026/088
                </span>
              </div>
              <h2 className="text-base font-bold text-navy">
                Govt / State Department Executive Progress Dossier
              </h2>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5 border border-border bg-white px-2 py-1 text-xs">
              <Filter className="h-3.5 w-3.5 text-ink-muted" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent font-medium text-ink focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All State Departments</option>
                <option value="water">Drinking Water & Sanitation (DWSD)</option>
                <option value="agri">Agriculture & Rural Irrigation</option>
                <option value="health">Health & Medical Education</option>
                <option value="mining">Mines, Geology & Environment</option>
                <option value="energy">Energy & Rural Electrification</option>
                <option value="it">IT & e-Governance</option>
              </select>
            </div>

            {/* Reporting Period */}
            <div className="flex items-center gap-1.5 border border-border bg-white px-2 py-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-ink-muted" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent font-medium text-ink focus:outline-none cursor-pointer text-xs"
              >
                <option value="FY 2026-27 (Current)">FY 2026-27 (Current)</option>
                <option value="Q2 2026 (Jul - Sep)">Q2 2026 (Jul - Sep)</option>
                <option value="Q1 2026 (Apr - Jun)">Q1 2026 (Apr - Jun)</option>
                <option value="Full Year 2025-26">Full Year 2025-26</option>
              </select>
            </div>

            {/* Print / Save to PDF Button */}
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 border border-navy bg-navy px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-navy-deep active:scale-95"
              title="Print or Save official PDF Dossier"
            >
              <Printer className="h-3.5 w-3.5 text-turmeric" />
              <span>Download PDF</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-1.5 border border-forest bg-forest px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-forest/90 active:scale-95 disabled:opacity-50"
              title="Download Excel/CSV Dataset"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-white" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="border border-border bg-white p-1.5 text-ink-muted transition hover:bg-paper hover:text-ink"
              title="Close Preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOSSIER SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-paper-light">
          
          {/* A4 PRINT CONTAINER */}
          <div
            id="jharkhand-govt-dossier-print-content"
            className="mx-auto max-w-5xl bg-white border border-border/80 p-6 sm:p-8 shadow-sm text-ink font-sans"
            style={{ minHeight: '1000px' }}
          >
            {/* OFFICIAL STATE LETTERHEAD */}
            <div className="border-b-2 border-navy pb-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                {/* Government Seal Visual */}
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 flex-col items-center justify-center border-2 border-navy bg-paper p-1 text-center">
                    <span className="text-[9px] font-black uppercase tracking-tight text-navy">GOVT OF</span>
                    <span className="font-display text-base font-black text-navy leading-none my-0.5">JH</span>
                    <span className="text-[8px] font-bold text-forest">झारखंड</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-widest text-navy/80 uppercase">
                      झारखंड सरकार · GOVERNMENT OF JHARKHAND
                    </div>
                    <h1 className="font-display text-lg sm:text-xl font-black text-navy uppercase tracking-tight">
                      Department of Higher & Technical Education
                    </h1>
                    <div className="text-xs font-semibold text-forest">
                      समाधान सेतु - राज्य नवाचार एवं नागरिक समस्या निवारण प्रकोष्ठ | State Innovation Mission
                    </div>
                    <div className="text-[10px] text-ink-muted mt-0.5">
                      State Civil Secretariat, Project Building, Dhurwa, Ranchi - 834004
                    </div>
                  </div>
                </div>

                {/* Dossier Metadata Stamp */}
                <div className="border border-navy/20 bg-paper p-3 text-right text-xs min-w-[210px]">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-forest">
                    OFFICIAL EXECUTIVE DOSSIER
                  </div>
                  <div className="font-mono text-xs font-bold text-navy mt-0.5">
                    REF: JH-DHTE/SS/EXEC-2026/088
                  </div>
                  <div className="text-[11px] text-ink-muted mt-1">
                    Audit Date: <span className="font-semibold text-ink">11 September 2026</span>
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    Cycle: <span className="font-semibold text-ink">{selectedPeriod}</span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-border/80 text-[10px] text-forest font-semibold">
                    STATUS: SANCTIONED & VERIFIED
                  </div>
                </div>
              </div>

              {/* Host University Accreditation Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border/80 pt-2 text-xs text-ink-muted">
                <div>
                  <span className="font-semibold text-navy">Reporting Institutional Node:</span>{' '}
                  <span className="font-bold text-ink">{institutionName}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>AISHE: <strong>{institutionAishe}</strong></span>
                  <span>·</span>
                  <span>NODE: <strong>JH-DHTE-RNC-04</strong></span>
                  <span>·</span>
                  <span className="text-forest font-sans font-semibold">NAAC Grade A+ (3.62 CGPA)</span>
                </div>
              </div>
            </div>

            {/* DOSSIER TITLE & SCOPE */}
            <div className="mb-6 bg-paper/60 border-l-4 border-navy p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-navy">
                    Executive Performance & Fund Utilization Dossier
                  </div>
                  <h2 className="text-base font-bold text-ink">
                    Target Jurisdiction: {deptFilterLabels[selectedDept]}
                  </h2>
                </div>
                <span className="border border-navy/20 bg-white px-2 py-1 text-[11px] font-mono font-semibold text-navy">
                  Projects Included: {records.length}
                </span>
              </div>
            </div>

            {/* SECTION 1: EXECUTIVE KPI SUMMARY (6 Cards) */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-navy mb-2 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-forest" />
                <span>1. Institutional Performance & Financial Indicators</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                
                {/* KPI 1: Sanctioned Budget */}
                <div className="border border-border bg-paper/40 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-ink-muted">Sanctioned Grant</div>
                  <div className="font-mono text-sm sm:text-base font-bold text-navy mt-1">
                    {formatIndianCurrency(totalBudget)}
                  </div>
                  <div className="text-[9px] text-forest mt-0.5">Govt + CSR Matched</div>
                </div>

                {/* KPI 2: Funds Utilized */}
                <div className="border border-border bg-paper/40 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-ink-muted">Funds Utilized</div>
                  <div className="font-mono text-sm sm:text-base font-bold text-forest mt-1">
                    {formatIndianCurrency(totalUtilized)}
                  </div>
                  <div className="text-[9px] text-ink-muted mt-0.5">Against verified bills</div>
                </div>

                {/* KPI 3: Utilization Rate */}
                <div className="border border-border bg-paper/40 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-ink-muted">Utilization Rate</div>
                  <div className="font-mono text-sm sm:text-base font-bold text-ink mt-1">
                    {avgUtilizationRate}%
                  </div>
                  <div className="text-[9px] text-forest mt-0.5">Compliant with State GFR</div>
                </div>

                {/* KPI 4: Active Projects */}
                <div className="border border-border bg-paper/40 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-ink-muted">Active R&D Units</div>
                  <div className="font-mono text-sm sm:text-base font-bold text-navy mt-1">
                    {records.length} Projects
                  </div>
                  <div className="text-[9px] text-ink-muted mt-0.5">Across 4 departments</div>
                </div>

                {/* KPI 5: Personnel Mobilized */}
                <div className="border border-border bg-paper/40 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-ink-muted">Researchers</div>
                  <div className="font-mono text-sm sm:text-base font-bold text-ink mt-1">
                    {totalPersonnel} Personnel
                  </div>
                  <div className="text-[9px] text-ink-muted mt-0.5">Faculty + Students</div>
                </div>

                {/* KPI 6: District Reach */}
                <div className="border border-border bg-paper/40 p-2.5">
                  <div className="text-[10px] font-bold uppercase text-ink-muted">District Reach</div>
                  <div className="font-mono text-sm sm:text-base font-bold text-navy mt-1">
                    {uniqueDistricts.length} Districts
                  </div>
                  <div className="text-[9px] text-forest mt-0.5">{uniqueDistricts.join(', ')}</div>
                </div>

              </div>
            </div>

            {/* SECTION 2: PROJECT PORTFOLIO & HEALTH MATRIX */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-navy mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-navy" />
                  <span>2. State Problem-Solving Project Portfolio & Milestones</span>
                </span>
                <span className="text-[10px] font-normal text-ink-muted lowercase">
                  *financial values compliant with Jharkhand Treasury Rules
                </span>
              </div>

              <div className="overflow-x-auto border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-paper text-[11px] font-bold text-navy">
                      <th className="p-2 border-r border-border">Code & Sector</th>
                      <th className="p-2 border-r border-border">Title & Challenge Ref</th>
                      <th className="p-2 border-r border-border">Target Department</th>
                      <th className="p-2 border-r border-border">Investigators</th>
                      <th className="p-2 border-r border-border text-right">Budget (₹)</th>
                      <th className="p-2 border-r border-border text-right">Utilized (₹)</th>
                      <th className="p-2 border-r border-border text-center">Util %</th>
                      <th className="p-2 border-r border-border text-center">Progress</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {records.map((rec) => (
                      <tr key={rec.projectCode} className="hover:bg-paper/30 transition">
                        <td className="p-2 border-r border-border font-mono text-[11px]">
                          <div className="font-bold text-navy">{rec.projectCode}</div>
                          <div className="text-[10px] text-ink-muted">{rec.sector}</div>
                        </td>
                        <td className="p-2 border-r border-border max-w-[200px]">
                          <div className="font-semibold text-ink leading-tight">{rec.projectTitle}</div>
                          <div className="text-[10px] font-mono text-ink-muted mt-0.5">
                            Ref: {rec.challengeRef} · {rec.district}
                          </div>
                        </td>
                        <td className="p-2 border-r border-border text-[11px] text-ink-muted max-w-[140px]">
                          {rec.targetDepartment}
                        </td>
                        <td className="p-2 border-r border-border text-[11px]">
                          <div className="font-medium text-navy">{rec.facultyMentor}</div>
                          <div className="text-[10px] text-ink-muted">Lead: {rec.studentLead}</div>
                        </td>
                        <td className="p-2 border-r border-border text-right font-mono font-semibold">
                          {formatIndianCurrency(rec.budgetAllocated)}
                        </td>
                        <td className="p-2 border-r border-border text-right font-mono text-forest font-semibold">
                          {formatIndianCurrency(rec.fundsUtilized)}
                        </td>
                        <td className="p-2 border-r border-border text-center font-mono">
                          <span className="bg-paper px-1.5 py-0.5 border border-border text-[10px] font-semibold">
                            {rec.utilizationRate}%
                          </span>
                        </td>
                        <td className="p-2 border-r border-border text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-12 bg-border h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-navy h-full"
                                style={{ width: `${rec.progressPercent}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] font-bold">{rec.progressPercent}%</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                              rec.healthStatus === 'Field Trial'
                                ? 'bg-forest/10 text-forest border-forest/30'
                                : rec.healthStatus === 'Ahead of Schedule'
                                ? 'bg-turmeric/10 text-ink border-turmeric/40'
                                : 'bg-navy/10 text-navy border-navy/30'
                            }`}
                          >
                            {rec.healthStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-navy bg-paper font-bold text-[11px] text-navy">
                      <td colSpan={4} className="p-2 border-r border-border text-right uppercase">
                        Consolidated Totals ({records.length} Projects):
                      </td>
                      <td className="p-2 border-r border-border text-right font-mono">
                        {formatIndianCurrency(totalBudget)}
                      </td>
                      <td className="p-2 border-r border-border text-right font-mono text-forest">
                        {formatIndianCurrency(totalUtilized)}
                      </td>
                      <td className="p-2 border-r border-border text-center font-mono">
                        {avgUtilizationRate}%
                      </td>
                      <td colSpan={2} className="p-2 text-center text-forest text-[10px] uppercase">
                        State Audit Compliant
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* SECTION 3: DISTRICT CITIZEN IMPACT & PROBLEM REDRESSAL */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-navy mb-2 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-forest" />
                <span>3. District-Level Citizen Impact & Evidence-Backed Redressal</span>
              </div>
              <div className="overflow-x-auto border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-paper text-[11px] font-bold text-navy">
                      <th className="p-2 border-r border-border w-28">District / Block</th>
                      <th className="p-2 border-r border-border">Civic Grievance & Citizen Evidence</th>
                      <th className="p-2 border-r border-border">Technological Intervention Deployed</th>
                      <th className="p-2">Beneficiary Reach & Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-[11px]">
                    {records.map((rec) => {
                      const challenge = challenges.find((c) => c.code === rec.challengeRef);
                      return (
                        <tr key={rec.challengeRef} className="hover:bg-paper/30">
                          <td className="p-2 border-r border-border font-semibold text-navy">
                            <div>{rec.district}</div>
                            <div className="text-[10px] font-normal text-ink-muted">
                              {challenge?.block || 'Urban Sub-division'}
                            </div>
                          </td>
                          <td className="p-2 border-r border-border max-w-[220px]">
                            <div className="font-semibold text-ink">{challenge?.title || rec.projectTitle}</div>
                            <div className="text-[10px] text-ink-muted mt-0.5 italic">
                              "{challenge?.citizenEvidence || 'Lab assay sheets & geo-tagged field evidence'}"
                            </div>
                          </td>
                          <td className="p-2 border-r border-border max-w-[200px]">
                            <div className="font-medium text-navy">{rec.currentMilestone}</div>
                            <div className="text-[10px] text-ink-muted">
                              Mentor: {rec.facultyMentor.split('(')[0]}
                            </div>
                          </td>
                          <td className="p-2 text-forest font-medium max-w-[240px]">
                            {rec.citizenImpact}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 4: UTILIZATION CERTIFICATE (UC) & FORMAL SIGN-OFF */}
            <div className="border border-navy/20 bg-paper/30 p-4 mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-navy mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-forest" />
                <span>4. Utilization Certificate (UC) Compliance & Authentication Endorsement</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed mb-4">
                Certified that out of <strong>{formatIndianCurrency(totalBudget)}</strong> of State Government grants
                sanctioned during the current cycle under <em>Samadhan Setu State Innovation Mission</em>, a sum of{' '}
                <strong>{formatIndianCurrency(totalUtilized)}</strong> has been utilized for the specified civic
                R&D deliverables and field pilots. The balance of{' '}
                <strong>{formatIndianCurrency(totalBudget - totalUtilized)}</strong> remains allocated for upcoming
                validation milestones as per General Financial Rules (GFR 2017) Rule 238(1).
              </p>

              {/* THREE-TIER OFFICIAL SIGNATURE STAMPS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                
                {/* Signature 1: Dean R&D */}
                <div className="border border-border/80 bg-white p-3 text-center">
                  <div className="h-10 flex items-center justify-center font-display italic text-navy text-sm font-bold opacity-80 select-none">
                    Dr. Rajesh Sharma
                  </div>
                  <div className="border-t border-border pt-1">
                    <div className="text-[11px] font-bold text-navy">Dean (Research & Development)</div>
                    <div className="text-[10px] text-ink-muted">{institutionName}</div>
                    <div className="text-[9px] font-mono text-forest mt-0.5">UID: BIT-RND-DEAN-04</div>
                  </div>
                </div>

                {/* Signature 2: State Nodal Officer */}
                <div className="border border-border/80 bg-white p-3 text-center">
                  <div className="h-10 flex items-center justify-center font-display italic text-forest text-sm font-bold opacity-80 select-none">
                    Er. Alok Ranjan, IAS
                  </div>
                  <div className="border-t border-border pt-1">
                    <div className="text-[11px] font-bold text-forest">State Nodal Officer</div>
                    <div className="text-[10px] text-ink-muted">Samadhan Setu Innovation Mission, Ranchi</div>
                    <div className="text-[9px] font-mono text-ink-muted mt-0.5">DISPATCHED: 11-SEP-2026</div>
                  </div>
                </div>

                {/* Signature 3: Principal Secretary */}
                <div className="border border-border/80 bg-white p-3 text-center">
                  <div className="h-10 flex items-center justify-center font-display italic text-navy text-sm font-bold opacity-80 select-none">
                    Countersigned (e-Seal)
                  </div>
                  <div className="border-t border-border pt-1">
                    <div className="text-[11px] font-bold text-navy">Principal Secretary to Govt.</div>
                    <div className="text-[10px] text-ink-muted">Dept. of Higher & Technical Education</div>
                    <div className="text-[9px] font-mono text-forest mt-0.5">COUNTERSIGNED & ARCHIVED</div>
                  </div>
                </div>

              </div>
            </div>

            {/* VERIFICATION FOOTER WITH QR CODE MATRIX */}
            <div className="flex flex-wrap items-center justify-between border-t border-navy/20 pt-3 text-[10px] text-ink-muted gap-2">
              <div className="flex items-center gap-3">
                {/* SVG Visual Representation of QR Verification Stamp */}
                <div className="h-11 w-11 border border-navy/30 bg-white p-0.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="h-2.5 w-2.5 bg-navy" />
                    <div className="h-2.5 w-2.5 bg-navy" />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-2 w-2 bg-forest" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-2.5 w-2.5 bg-navy" />
                    <div className="h-1.5 w-1.5 bg-ink-muted" />
                  </div>
                </div>
                <div>
                  <div className="font-mono font-bold text-navy">
                    VERIFICATION HASH: SHA-256: e9c18f3a027bc93f412d98ab771092e0
                  </div>
                  <div>
                    Verify authenticity online at: <code>https://samadhansetu.jharkhand.gov.in/verify/dossier/088</code>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-navy">Government of Jharkhand · Samadhan Setu Portal</div>
                <div>Classified Official Document · Not for Public Redissemination</div>
              </div>
            </div>

          </div>
        </div>

        {/* MODAL FOOTER BAR */}
        <div className="border-t border-border bg-white px-4 py-2.5 flex items-center justify-between text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-forest" />
            <span>Ready for official departmental dispatch and printable archive.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 border border-navy bg-navy text-white px-3 py-1 font-bold text-xs uppercase tracking-wider hover:bg-navy-deep transition"
            >
              <Printer className="h-3.5 w-3.5 text-turmeric" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="border border-border bg-paper hover:bg-paper-light px-3 py-1 text-ink font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
