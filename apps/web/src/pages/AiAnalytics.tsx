import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { JHARKHAND_DISTRICTS } from '../data/jharkhandLgd.js';

interface DomainMetric {
  id: string;
  name: string;
  hindiName: string;
  code: string;
  count: number;
  solved: number;
  confidence: number;
  leadUniversity: string;
  sampleKeywords: string[];
  color: string;
  bgLight: string;
}

const DOMAIN_METRICS: DomainMetric[] = [
  {
    id: 'water',
    name: 'Water Resources & Sanitation',
    hindiName: 'जल संसाधन एवं पेयजल स्वच्छता',
    code: 'SEC-01',
    count: 789,
    solved: 124,
    confidence: 95.4,
    leadUniversity: 'BIT Mesra, Ranchi',
    sampleKeywords: ['Arsenic contamination', 'Fluoride > 3.5mg/L', 'Dry borewell', 'Bacteriological test', 'Jal Jeevan pipeline'],
    color: '#0284c7',
    bgLight: 'bg-sky-50 border-sky-200 text-sky-900',
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Irrigation',
    hindiName: 'कृषि एवं सूक्ष्म सिंचाई तंत्र',
    code: 'SEC-02',
    count: 845,
    solved: 142,
    confidence: 93.8,
    leadUniversity: 'Birsa Agricultural University (BAU)',
    sampleKeywords: ['Micro-drip clogging', 'Soil acidity pH 4.8', 'Lac pest infection', 'Solar pump inverter trip'],
    color: '#15803d',
    bgLight: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  },
  {
    id: 'energy',
    name: 'Energy & Grid Reliability',
    hindiName: 'ऊर्जा एवं सौर माइक्रोग्रिड',
    code: 'SEC-03',
    count: 298,
    solved: 86,
    confidence: 92.1,
    leadUniversity: 'NIT Jamshedpur',
    sampleKeywords: ['Phase imbalance 130V', 'Transformer burst', 'Hill village off-grid', 'Cold storage battery drop'],
    color: '#d97706',
    bgLight: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  {
    id: 'health',
    name: 'Healthcare Diagnostics',
    hindiName: 'प्राथमिक स्वास्थ्य एवं टेलीमेडिसिन',
    code: 'SEC-04',
    count: 540,
    solved: 98,
    confidence: 96.2,
    leadUniversity: 'RIMS Ranchi & BIT Mesra',
    sampleKeywords: ['Sickle cell screening', 'Cold chain vaccine box', 'Remote PHC ultrasound', 'Malaria rapid kit'],
    color: '#dc2626',
    bgLight: 'bg-rose-50 border-rose-200 text-rose-900',
  },
  {
    id: 'environment',
    name: 'Environment & Mine Tailing',
    hindiName: 'पर्यावरण एवं खनन अवशेष सुधार',
    code: 'SEC-05',
    count: 324,
    solved: 64,
    confidence: 94.7,
    leadUniversity: 'IIT (ISM) Dhanbad',
    sampleKeywords: ['Coal mine dust PM10', 'Overburden erosion', 'Acid mine drainage', 'Elephant corridor geo-fence'],
    color: '#059669',
    bgLight: 'bg-teal-50 border-teal-200 text-teal-900',
  },
  {
    id: 'infrastructure',
    name: 'Rural Infrastructure & Roads',
    hindiName: 'ग्रामीण संपर्क एवं पुलिया निर्माण',
    code: 'SEC-06',
    count: 518,
    solved: 110,
    confidence: 91.5,
    leadUniversity: 'Govt. Polytechnic Ranchi',
    sampleKeywords: ['Monsoon culvert washout', 'Black cotton soil road', 'Check dam sluice failure'],
    color: '#475569',
    bgLight: 'bg-slate-50 border-slate-200 text-slate-900',
  },
  {
    id: 'education',
    name: 'Education & Vernacular STEM',
    hindiName: 'शिक्षा एवं स्थानीय भाषा शिक्षण',
    code: 'SEC-07',
    count: 612,
    solved: 156,
    confidence: 94.1,
    leadUniversity: 'Ranchi University & Kolhan Univ',
    sampleKeywords: ['Offline Santhali tablets', 'Rural smart classroom', 'Solar projector battery', 'KGBV digital attendance'],
    color: '#4f46e5',
    bgLight: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  },
  {
    id: 'accessibility',
    name: 'Assistive Tech & Inclusion',
    hindiName: 'दिव्यांगजन सुगमता एवं सहायक यंत्र',
    code: 'SEC-08',
    count: 415,
    solved: 72,
    confidence: 90.9,
    leadUniversity: 'BIT Mesra Bio-Medical Lab',
    sampleKeywords: ['Agri-worker prosthetic', 'Screen reader Ho language', 'Tricycle battery charger'],
    color: '#7c3aed',
    bgLight: 'bg-purple-50 border-purple-200 text-purple-900',
  },
  {
    id: 'livelihood',
    name: 'Rural Livelihoods & Agro-Processing',
    hindiName: 'ग्रामीण आजीविका एवं कुटीर उद्योग',
    code: 'SEC-09',
    count: 480,
    solved: 95,
    confidence: 93.3,
    leadUniversity: 'VBU Hazaribagh & BAU',
    sampleKeywords: ['Motorized Sal plate press', 'Tussar silk reeler', 'Mahuwa drying shed', 'Honey centrifugal drum'],
    color: '#b45309',
    bgLight: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  },
];

interface TriageStreamItem {
  id: string;
  code: string;
  district: string;
  taluka: string;
  title: string;
  domain: string;
  aiScore: number;
  priority: 'Critical' | 'High' | 'Medium';
  clusterMatch: string;
  assignedNode: string;
  timestamp: string;
}

const LIVE_STREAM_MOCK: TriageStreamItem[] = [
  {
    id: 'ch-801',
    code: 'CH-26043-801',
    district: 'Ranchi',
    taluka: 'Tamar',
    title: 'Arsenic & Fluoride trace exceeding 4.2mg/L in primary school borewell',
    domain: 'Water Resources & Sanitation',
    aiScore: 98.4,
    priority: 'Critical',
    clusterMatch: 'Merged into Cluster #W-104 (3 Reports)',
    assignedNode: 'BIT Mesra (Environmental Nanotech Lab)',
    timestamp: '2 mins ago',
  },
  {
    id: 'ch-800',
    code: 'CH-26043-800',
    district: 'Dhanbad',
    taluka: 'Govindpur',
    title: 'Peak daytime feeder line drops below 135V tripping cold storage chiller',
    domain: 'Energy & Grid Reliability',
    aiScore: 94.2,
    priority: 'High',
    clusterMatch: 'New Incident Cluster #E-089',
    assignedNode: 'IIT (ISM) Dhanbad (Power Systems Cell)',
    timestamp: '6 mins ago',
  },
  {
    id: 'ch-799',
    code: 'CH-26043-799',
    district: 'East Singhbhum',
    taluka: 'Potka',
    title: 'Runoff from abandoned quartz quarry silts agricultural paddy canals',
    domain: 'Environment & Mine Tailing',
    aiScore: 96.7,
    priority: 'High',
    clusterMatch: 'Merged into Cluster #ENV-042 (2 Reports)',
    assignedNode: 'NIT Jamshedpur (Civil & Geo-Engineering)',
    timestamp: '14 mins ago',
  },
  {
    id: 'ch-798',
    code: 'CH-26043-798',
    district: 'Palamu',
    taluka: 'Satbarwa',
    title: 'Whitefly infestation resistance to neem extracts on chili plantations',
    domain: 'Agriculture & Irrigation',
    aiScore: 92.1,
    priority: 'Medium',
    clusterMatch: 'Merged into Cluster #AG-210 (5 Reports)',
    assignedNode: 'Birsa Agricultural University (Entomology Lab)',
    timestamp: '21 mins ago',
  },
  {
    id: 'ch-797',
    code: 'CH-26043-797',
    district: 'West Singhbhum',
    taluka: 'Chaibasa',
    title: 'Absence of digital Santhali and Ho script screen reader for rural students',
    domain: 'Accessibility & Assistive Tech',
    aiScore: 91.0,
    priority: 'Medium',
    clusterMatch: 'New Incident Cluster #ACC-033',
    assignedNode: 'Kolhan University (Language & Computing Lab)',
    timestamp: '35 mins ago',
  },
  {
    id: 'ch-796',
    code: 'CH-26043-796',
    district: 'Bokaro',
    taluka: 'Chas',
    title: 'Market yard vegetable scrap decomposition choking municipal drain line',
    domain: 'Urban Development & Sanitation',
    aiScore: 95.8,
    priority: 'High',
    clusterMatch: 'Prototype Solved · Cluster #U-099',
    assignedNode: 'BIT Mesra Bio-energy Centre',
    timestamp: '48 mins ago',
  },
];

export default function AiAnalytics() {
  const [selectedDomain, setSelectedDomain] = useState<string>('water');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Ranchi');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const activeDomainObj = useMemo(() => {
    return DOMAIN_METRICS.find((d) => d.id === selectedDomain) || DOMAIN_METRICS[0];
  }, [selectedDomain]);

  const filteredStream = useMemo(() => {
    if (filterPriority === 'all') return LIVE_STREAM_MOCK;
    return LIVE_STREAM_MOCK.filter((i) => i.priority.toLowerCase() === filterPriority.toLowerCase());
  }, [filterPriority]);

  const handleExportDossier = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Code,District,Taluka,Domain,AI Confidence,Priority,Assigned University,Status\n' +
      LIVE_STREAM_MOCK.map(
        (m) =>
          `"${m.id}","${m.code}","${m.district}","${m.taluka}","${m.domain}","${m.aiScore}%","${m.priority}","${m.assignedNode}","Active"`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SamadhanSetu_AI_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-ink py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">
        {/* ========================================================================= */}
        {/* HEADER BANNER                                                             */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-navy rounded-[2px] p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-wider">
                  झारखंड सरकार · सूचना प्रौद्योगिकी एवं ई-गवर्नेंस विभाग
                </span>
                <span className="text-[10px] font-mono bg-turmeric text-ink font-bold px-2 py-0.5 rounded-[2px]">
                  AI TRIAGE ENGINE v3.4
                </span>
                <span className="text-[10px] font-mono bg-paper px-2 py-0.5 border border-border text-ink-muted">
                  SIH 2026 PS 26043
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                State Civic AI Analytics &amp; Triage Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-3xl leading-relaxed">
                Autonomous Natural Language Processing pipeline clustering civic complaints across 24 Jharkhand districts, deduplicating geographic hardships, and auto-dispatching accredited research challenges to premier state universities.
              </p>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExportDossier}
                className="px-3 py-1.5 bg-navy text-white text-xs font-bold rounded-[2px] hover:bg-navy-deep transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Dossier (CSV)</span>
              </button>
              <button
                type="button"
                onClick={handleCopyShare}
                className="px-3 py-1.5 bg-paper text-ink border border-border text-xs font-semibold rounded-[2px] hover:bg-white transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span>{copiedNotification ? 'Link Copied!' : 'Share Analytics URL'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TOP 5 METRICS STRIP                                                       */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-5 text-center sm:text-left">
            <div className="p-3 bg-paper border border-border rounded-[2px]">
              <div className="text-[11px] font-mono text-ink-muted uppercase">Total Grievances Processed</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-navy mt-0.5">4,821</div>
              <div className="text-[10px] font-mono text-forest mt-1">▲ 142 ingested this week</div>
            </div>

            <div className="p-3 bg-paper border border-border rounded-[2px]">
              <div className="text-[11px] font-mono text-ink-muted uppercase">AI Classification Accuracy</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-forest mt-0.5">94.6%</div>
              <div className="text-[10px] font-mono text-ink-muted mt-1">Transformer Zero-Shot F1</div>
            </div>

            <div className="p-3 bg-paper border border-border rounded-[2px]">
              <div className="text-[11px] font-mono text-ink-muted uppercase">Deduplication &amp; Clustering</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-navy mt-0.5">87.2%</div>
              <div className="text-[10px] font-mono text-ink-muted mt-1">Eliminating redundant tasks</div>
            </div>

            <div className="p-3 bg-paper border border-border rounded-[2px]">
              <div className="text-[11px] font-mono text-ink-muted uppercase">Mean Triage Latency</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-turmeric-deep mt-0.5">1.8s</div>
              <div className="text-[10px] font-mono text-ink-muted mt-1">Real-time GPU inference</div>
            </div>

            <div className="p-3 bg-paper border border-border rounded-[2px] col-span-2 sm:col-span-1">
              <div className="text-[11px] font-mono text-ink-muted uppercase">Participating Higher Ed Labs</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-navy mt-0.5">38</div>
              <div className="text-[10px] font-mono text-forest mt-1">24 / 24 Districts Active</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: INTERACTIVE DOMAIN TAXONOMY (9-DOMAIN DEEP-DIVE)               */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-navy rounded-[2px] p-5 sm:p-7 shadow-sm space-y-6">
          <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-wider">
                वर्गीकरण विश्लेषण · Domain Distribution &amp; Lab Assignment
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-navy">
                Thematic AI Classification Breakdown
              </h2>
            </div>
            <span className="text-xs text-ink-muted font-mono">
              Click any domain card to inspect AI keywords and assigned university node
            </span>
          </div>

          {/* Grid of 9 Domains */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOMAIN_METRICS.map((d) => {
              const isSelected = d.id === selectedDomain;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDomain(d.id)}
                  className={`p-3.5 text-left border rounded-[2px] transition-all cursor-pointer ${
                    isSelected
                      ? 'border-navy bg-navy/5 shadow-sm ring-2 ring-navy/20'
                      : 'border-border bg-white hover:border-navy/60 hover:bg-paper/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] font-bold text-ink-muted">{d.code}</span>
                    <span className="font-mono text-[10px] font-bold text-forest bg-forest/10 px-1.5 py-0.2 rounded">
                      {d.confidence}% AI Confidence
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-navy">{d.name}</h3>
                  <div className="text-[11px] text-forest font-semibold">{d.hindiName}</div>

                  <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs font-mono">
                    <span className="text-ink font-bold">{d.count} Problems</span>
                    <span className="text-forest font-semibold">{d.solved} Solved</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Inspector for Selected Domain */}
          {activeDomainObj && (
            <div className="p-4 sm:p-5 bg-paper border border-navy/30 rounded-[2px] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-muted font-bold">
                    ACTIVE SECTOR INSPECTION · {activeDomainObj.code}
                  </span>
                  <h3 className="font-display text-lg font-bold text-navy">
                    {activeDomainObj.name} ({activeDomainObj.hindiName})
                  </h3>
                </div>
                <div className="font-mono text-xs text-navy font-bold bg-white px-3 py-1 border border-border">
                  Lead Nodal University: <span className="text-forest">{activeDomainObj.leadUniversity}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold uppercase tracking-wider text-ink-muted mb-2 font-mono text-[11px]">
                    Key Extracted AI NLP Tokens &amp; Root Hardships:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDomainObj.sampleKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white border border-border text-ink font-mono rounded-[2px]"
                      >
                        🏷️ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between p-3 bg-white border border-border rounded-[2px]">
                  <div>
                    <span className="font-bold text-navy block text-xs">Automated R&amp;D Matching Engine</span>
                    <p className="text-ink-muted text-[11px] mt-1 leading-relaxed">
                      Complaints tagged under <strong>{activeDomainObj.name}</strong> with geotags in rural areas are prioritized for final-year engineering capstones at <strong>{activeDomainObj.leadUniversity}</strong> under the State Innovation Directive.
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[11px]">
                    <span className="font-mono text-forest font-bold">✓ Ready for Prototype Grant</span>
                    <Link to="/problems" className="font-bold text-navy hover:underline">
                      View Open Challenges in this Sector →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: GEOGRAPHIC HEATMAP & 24 DISTRICT TELEMETRY                     */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-navy rounded-[2px] p-5 sm:p-7 shadow-sm space-y-5">
          <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-wider">
                भौगोलिक घनत्व · Geographic Heatmap &amp; Cluster Telemetry
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-navy">
                Jharkhand 24 Districts Problem Density Heatmap
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-ink-muted">Select District:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-2.5 py-1 text-xs border border-border rounded-[2px] bg-paper text-ink font-semibold"
              >
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d.code} value={d.name}>
                    {d.name} ({d.nameLocal})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick District Grid Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            {JHARKHAND_DISTRICTS.slice(0, 12).map((d) => {
              const countMock = ((d.code * 17) % 350) + 80;
              const isSelected = d.name === selectedDistrict;
              return (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => setSelectedDistrict(d.name)}
                  className={`p-2 text-left border rounded-[2px] transition-all cursor-pointer ${
                    isSelected
                      ? 'border-navy bg-navy text-white shadow-sm'
                      : 'border-border bg-paper hover:bg-white text-ink'
                  }`}
                >
                  <div className="font-bold truncate text-[11px]">{d.name}</div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-turmeric' : 'text-ink-muted'}`}>
                    {countMock} Cases
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-paper/60 border border-border rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-navy">District Node Focus: {selectedDistrict}</span>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Full spatial clustering and GIS coordinate tracking verified under Jharkhand State LGD Directory.
              </p>
            </div>
            <Link
              to={`/problems?district=${encodeURIComponent(selectedDistrict)}`}
              className="px-3 py-1.5 bg-white border border-navy text-navy font-bold hover:bg-navy hover:text-white transition-colors rounded-[2px] shrink-0"
            >
              Inspect {selectedDistrict} Problems →
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: REAL-TIME AI TRIAGE STREAM                                     */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-navy rounded-[2px] p-5 sm:p-7 shadow-sm space-y-5">
          <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono text-forest uppercase font-bold tracking-wider">
                लाइव ट्राइएज स्ट्रीम · Real-Time Incident Clustering Stream
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-navy">
                Live Ingested Hardships &amp; Machine Decisions
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-ink-muted">Filter Priority:</span>
              <div className="inline-flex rounded-[2px] border border-border overflow-hidden text-[11px] font-mono">
                {['all', 'critical', 'high', 'medium'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFilterPriority(p)}
                    className={`px-2 py-1 uppercase ${
                      filterPriority === p ? 'bg-navy text-white font-bold' : 'bg-white text-ink hover:bg-paper'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-border">
              <thead className="bg-paper border-b border-border text-[11px] font-mono uppercase text-ink-muted">
                <tr>
                  <th className="p-2.5">Code / LGD Location</th>
                  <th className="p-2.5">Citizen Hardship Description</th>
                  <th className="p-2.5">Classified Domain</th>
                  <th className="p-2.5">AI Confidence</th>
                  <th className="p-2.5">Priority</th>
                  <th className="p-2.5">Dispatched R&amp;D Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStream.map((item) => (
                  <tr key={item.id} className="hover:bg-paper/50 transition-colors">
                    <td className="p-2.5 font-mono whitespace-nowrap">
                      <div className="font-bold text-navy">{item.code}</div>
                      <div className="text-[10px] text-ink-muted">{item.district}, {item.taluka}</div>
                    </td>
                    <td className="p-2.5 max-w-xs">
                      <div className="font-semibold text-ink leading-snug">{item.title}</div>
                      <div className="text-[10px] font-mono text-forest mt-0.5">{item.clusterMatch}</div>
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-paper border border-border text-ink-muted rounded-[2px] font-mono text-[10px]">
                        {item.domain}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono whitespace-nowrap font-bold text-forest">
                      {item.aiScore}%
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-[2px] font-bold text-[10px] uppercase font-mono ${
                          item.priority === 'Critical'
                            ? 'bg-urgent/15 text-urgent border border-urgent/30'
                            : item.priority === 'High'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-paper text-ink border border-border'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-2.5 text-navy font-medium text-[11px]">
                      {item.assignedNode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Administrative Queue Callout */}
          <div className="p-4 bg-navy text-white rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-turmeric font-mono">
                🏛️ Departmental Administration &amp; Officer Verification
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Government officers and District Magistrates can review AI-flagged duplicate clusters and override lab assignments.
              </p>
            </div>
            <Link
              to="/admin"
              className="px-4 py-2 bg-turmeric text-ink font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-turmeric-deep transition-colors shrink-0 shadow-sm"
            >
              Open Admin Triage Queue →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
