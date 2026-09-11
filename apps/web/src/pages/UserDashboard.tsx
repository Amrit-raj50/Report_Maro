import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import {
  JHARKHAND_DISTRICTS,
  getBlocksForDistrict,
  getVillagesForBlock,
  type LgdVillageOrWard,
} from '../data/jharkhandLgd.js';

// Types for Citizen Challenges
export type ChallengeStatus = 'submitted' | 'verified' | 'assigned' | 'in_progress' | 'solved';

export interface ChallengeItem {
  id: string;
  code: string; // e.g. "CH-1024"
  title: string;
  description: string;
  category: string;
  district: string;
  taluka: string;
  village: string;
  lat: number;
  lng: number;
  status: ChallengeStatus;
  statusLabel: string;
  statusTone: 'amber' | 'blue' | 'purple' | 'green' | 'neutral';
  progress: number; // 0 - 100
  currentStage: string;
  submittedDate: string;
  whoAffected: string;
  peopleAffected: number;
  additionalInfo?: string;
  evidenceFiles: { name: string; type: 'image' | 'video' | 'doc'; url?: string }[];
  aiClassification?: {
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    communityImpact: string;
    confidence: string;
  };
  assignedUniversity?: {
    name: string;
    expertiseMatch: string;
    mentor: string;
    department: string;
  };
  industryPartner?: {
    name: string;
    supportType: string;
  };
  solutionProject?: {
    title: string;
    mentor: string;
    industry: string;
    progress: number;
    currentStage: string;
  };
  feedbackSubmitted?: boolean;
  feedbackData?: {
    rating: number;
    isSolved: 'Yes' | 'Partially' | 'No';
    comments: string;
    date: string;
  };
}

export interface CitizenNotification {
  id: string;
  title: string;
  message: string;
  challengeCode?: string;
  date: string;
  read: boolean;
  type: 'assignment' | 'stage_update' | 'feedback_request' | 'general';
}

const INITIAL_CHALLENGES: ChallengeItem[] = [
  {
    id: 'ch-1024',
    code: 'CH-1024',
    title: '💧 Water Quality & Arsenic Contamination in Village Borewells',
    description:
      'Community borewells in Salgadih village test positive for fluoride exceeding 3.8 mg/L and arsenic trace levels. Over 350 tribal families report chronic joint pain, dental fluorosis, and acute lack of safe potable drinking water.',
    category: 'Water & Sanitation',
    district: 'Ranchi',
    taluka: 'Tamar',
    village: 'Salgadih',
    lat: 23.0512,
    lng: 85.6421,
    status: 'assigned',
    statusLabel: '🟡 University Assigned',
    statusTone: 'amber',
    progress: 65,
    currentStage: 'Prototype Testing',
    submittedDate: '04 Sep 2026',
    whoAffected: 'Over 350 tribal families, agricultural laborers, and schoolchildren',
    peopleAffected: 420,
    additionalInfo: 'Groundwater turns reddish-brown upon standing for 2 hours.',
    evidenceFiles: [
      { name: 'borewell_fluoride_report.pdf', type: 'doc' },
      { name: 'salgadih_well_site.jpg', type: 'image' },
    ],
    aiClassification: {
      category: 'Water & Sanitation',
      priority: 'High',
      communityImpact: 'Severe (Community Drinking Water Crisis)',
      confidence: '94.6%',
    },
    assignedUniversity: {
      name: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
      expertiseMatch: '92% R&D Match',
      mentor: 'Dr. R. Sharma (Dept. of Chemical & Environmental Engineering)',
      department: 'Environmental Nanotechnology & Adsorption Lab',
    },
    industryPartner: {
      name: 'Tata Steel CSR Foundation',
      supportType: 'Materials & Sensor Fabrication Grant',
    },
    solutionProject: {
      title: 'Solar-Powered Low-Cost Nanocomposite Fluoride Filtration Unit',
      mentor: 'Dr. R. Sharma (BIT Mesra)',
      industry: 'Tata Steel CSR Foundation',
      progress: 65,
      currentStage: 'Prototype Lab Validation',
    },
  },
  {
    id: 'ch-1018',
    code: 'CH-1018',
    title: '⚡ Recurrent Low-Voltage Drops & Transformer Trips at Cold Storage',
    description:
      '3-phase electric distribution line fluctuates below 140V during peak harvesting season. 18 marginal vegetable growers cannot run solar-hybrid cold storage, causing spoilage of tomato and cauliflower yields.',
    category: 'Rural Infrastructure',
    district: 'Dhanbad',
    taluka: 'Govindpur',
    village: 'Baghmara Tola',
    lat: 23.8341,
    lng: 86.5122,
    status: 'verified',
    statusLabel: '🔵 Under Review',
    statusTone: 'blue',
    progress: 30,
    currentStage: 'AI Matched & Expert Review',
    submittedDate: '07 Sep 2026',
    whoAffected: 'Local vegetable farmers and cold storage cooperatives',
    peopleAffected: 180,
    additionalInfo: 'Repeated requests made to local sub-station remain pending.',
    evidenceFiles: [{ name: 'feeder_meter_reading.jpg', type: 'image' }],
    aiClassification: {
      category: 'Rural Infrastructure & Energy',
      priority: 'Medium',
      communityImpact: 'Economic & Supply Chain Disruption',
      confidence: '89.1%',
    },
  },
  {
    id: 'ch-0992',
    code: 'CH-0992',
    title: '♻️ Organic Market Waste & Decentralized Biogas Digestion Failure',
    description:
      'Sabzi Mandi produces 4.5 tons of organic vegetable waste daily, clogging drainage canals. Previously installed passive digester was blocked and non-functional for 8 months.',
    category: 'Energy & Environment',
    district: 'Bokaro',
    taluka: 'Chas',
    village: 'Chas Ward 9',
    lat: 23.6358,
    lng: 86.1772,
    status: 'solved',
    statusLabel: '🟢 Solved & Deployed',
    statusTone: 'green',
    progress: 100,
    currentStage: 'Community Handover & Measured Impact',
    submittedDate: '15 Aug 2026',
    whoAffected: 'Chas Municipal market traders and adjoining residential colony',
    peopleAffected: 1250,
    evidenceFiles: [{ name: 'biogas_restoration_report.pdf', type: 'doc' }],
    aiClassification: {
      category: 'Energy & Environment',
      priority: 'High',
      communityImpact: 'Sanitation & Renewable Energy',
      confidence: '96.2%',
    },
    assignedUniversity: {
      name: 'National Institute of Technology (NIT) Jamshedpur',
      expertiseMatch: '95% R&D Match',
      mentor: 'Prof. K. K. Verma (Biochemical Engineering)',
      department: 'Waste-to-Energy Research Cell',
    },
    industryPartner: {
      name: 'Bokaro Power Supply Co. (BPSCL CSR)',
      supportType: 'Implementation & Gas Flaring Setup',
    },
    solutionProject: {
      title: 'High-Rate Anaerobic Bio-Methanation System with Pre-Treatment Crusher',
      mentor: 'Prof. K. K. Verma (NIT Jsr)',
      industry: 'BPSCL CSR',
      progress: 100,
      currentStage: 'Operational (Generating 14kW Electric Equiv.)',
    },
    feedbackSubmitted: true,
    feedbackData: {
      rating: 5,
      isSolved: 'Yes',
      comments:
        'The plant is running reliably. The market canal is completely odor-free and traders are very satisfied with the clean surroundings!',
      date: '02 Sep 2026',
    },
  },
];

const INITIAL_NOTIFICATIONS: CitizenNotification[] = [
  {
    id: 'notif-1',
    title: 'University Assigned',
    message: 'Your challenge CH-1024 has been assigned to Birla Institute of Technology (BIT) Mesra.',
    challengeCode: 'CH-1024',
    date: '2 hours ago',
    read: false,
    type: 'assignment',
  },
  {
    id: 'notif-2',
    title: 'Stage Progression',
    message: 'Prototype testing has started for your Water Quality challenge in Tamar, Ranchi.',
    challengeCode: 'CH-1024',
    date: 'Yesterday',
    read: false,
    type: 'stage_update',
  },
  {
    id: 'notif-3',
    title: 'Feedback Requested',
    message: 'Community validation requested: Has the Chas Biogas waste unit solved the drainage issue?',
    challengeCode: 'CH-0992',
    date: '3 days ago',
    read: true,
    type: 'feedback_request',
  },
];

const CATEGORIES = [
  'Water & Sanitation',
  'Agriculture & Irrigation',
  'Healthcare & Nutrition',
  'Rural Infrastructure',
  'Energy & Environment',
  'Education & Skill',
  'Public Safety & Disaster',
  'Other Societal Issue',
];

const PROGRESS_STAGES = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'validated', label: 'Validated' },
  { key: 'ai_matched', label: 'AI Matched' },
  { key: 'assigned', label: 'University Assigned' },
  { key: 'started', label: 'Project Started' },
  { key: 'prototype', label: 'Prototype' },
  { key: 'pilot', label: 'Pilot' },
  { key: 'deployment', label: 'Deployment' },
  { key: 'impact', label: 'Impact Measured' },
];

export default function UserDashboard({
  initialTab = 'overview',
}: {
  initialTab?: 'overview' | 'report' | 'challenges' | 'notifications' | 'feedback' | 'profile';
}) {
  const navigate = useNavigate();
  const { user, clearSession } = useAuthStore();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'report' | 'challenges' | 'detail' | 'notifications' | 'feedback' | 'profile' | 'settings'
  >(initialTab);

  // Selected challenge for detail view
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('ch-1024');

  // Challenge List State
  const [challenges, setChallenges] = useState<ChallengeItem[]>(INITIAL_CHALLENGES);

  // Notifications State
  const [notifications, setNotifications] = useState<CitizenNotification[]>(INITIAL_NOTIFICATIONS);

  // =========================================================================
  // REPORT FORM STATE
  // =========================================================================
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportCategory, setReportCategory] = useState<string>(CATEGORIES[0] ?? 'Water & Sanitation');
  const [reportDistrict, setReportDistrict] = useState(user?.district || 'Ranchi');
  const [reportTaluka, setReportTaluka] = useState(user?.taluka || 'Kanke');
  const [reportVillage, setReportVillage] = useState(user?.village_or_city || '');
  const [reportLat, setReportLat] = useState<number>(23.3441);
  const [reportLng, setReportLng] = useState<number>(85.3096);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [reportWhoAffected, setReportWhoAffected] = useState('');
  const [reportPeopleAffected, setReportPeopleAffected] = useState('150');
  const [reportAdditional, setReportAdditional] = useState('');
  const [reportFiles, setReportFiles] = useState<{ name: string; type: 'image' | 'doc' }[]>([]);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccessCode, setReportSuccessCode] = useState<string | null>(null);

  // =========================================================================
  // FEEDBACK FORM STATE (For Solved Challenge)
  // =========================================================================
  const [feedbackChallengeId, setFeedbackChallengeId] = useState<string>('ch-0992');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackIsSolved, setFeedbackIsSolved] = useState<'Yes' | 'Partially' | 'No'>('Yes');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSuccessMessage, setFeedbackSuccessMessage] = useState<string | null>(null);

  // Cascading LGD data for the Report Form
  const availableBlocks = useMemo(() => {
    return getBlocksForDistrict(reportDistrict);
  }, [reportDistrict]);

  const availableVillages: LgdVillageOrWard[] = useMemo(() => {
    if (!reportTaluka) return [];
    return getVillagesForBlock(reportTaluka);
  }, [reportTaluka]);

  // When district changes, update taluka
  const handleDistrictChange = (dist: string) => {
    setReportDistrict(dist);
    const blocks = getBlocksForDistrict(dist);
    if (blocks.length > 0 && blocks[0]) {
      setReportTaluka(blocks[0].name);
      const vills = getVillagesForBlock(blocks[0].name);
      if (vills.length > 0 && vills[0]) {
        setReportVillage(vills[0].name);
      } else {
        setReportVillage('');
      }
    }
  };

  // When taluka changes, update village
  const handleTalukaChange = (blk: string) => {
    setReportTaluka(blk);
    const vills = getVillagesForBlock(blk);
    if (vills.length > 0 && vills[0]) {
      setReportVillage(vills[0].name);
    } else {
      setReportVillage('');
    }
  };

  // GPS Auto-detect
  const handleDetectGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setReportLat(Number(pos.coords.latitude.toFixed(4)));
          setReportLng(Number(pos.coords.longitude.toFixed(4)));
          setGpsDetected(true);
        },
        () => {
          alert('GPS location permission denied or unavailable. Using standard Jharkhand coordinates.');
        },
      );
    }
  };

  // Add dummy file evidence simulator
  const handleSimulateAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems: { name: string; type: 'image' | 'doc' }[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f) {
          const isImg = f.type.startsWith('image/');
          newItems.push({ name: f.name, type: isImg ? 'image' : 'doc' });
        }
      }
      setReportFiles((prev) => [...prev, ...newItems]);
    }
  };

  // Submit Challenge Form
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDescription.trim()) return;

    setReportSubmitting(true);

    setTimeout(() => {
      const nextNum = challenges.length + 1025;
      const newCode = `CH-${nextNum}`;
      const newId = `ch-${nextNum}`;

      const newChallenge: ChallengeItem = {
        id: newId,
        code: newCode,
        title: reportTitle.trim(),
        description: reportDescription.trim(),
        category: reportCategory,
        district: reportDistrict,
        taluka: reportTaluka,
        village: reportVillage || 'Gram Panchayat Center',
        lat: reportLat,
        lng: reportLng,
        status: 'submitted',
        statusLabel: '⚪ Submitted',
        statusTone: 'neutral',
        progress: 15,
        currentStage: 'Submitted & Enqueued for AI Review',
        submittedDate: 'Just now',
        whoAffected: reportWhoAffected || 'Local residents & village community',
        peopleAffected: Number(reportPeopleAffected) || 100,
        additionalInfo: reportAdditional,
        evidenceFiles:
          reportFiles.length > 0
            ? reportFiles.map((f) => ({ ...f, type: f.type }))
            : [{ name: 'ground_photo_1.jpg', type: 'image' }],
        aiClassification: {
          category: reportCategory,
          priority: 'High',
          communityImpact: 'Local Community Cluster',
          confidence: '91.8%',
        },
      };

      setChallenges([newChallenge, ...challenges]);
      setReportSubmitting(false);
      setReportSuccessCode(newCode);

      // Add a notification
      const newNotif: CitizenNotification = {
        id: `notif-${Date.now()}`,
        title: 'Challenge Registered',
        message: `Your challenge ${newCode} was successfully received by the State Innovation Cell.`,
        challengeCode: newCode,
        date: 'Just now',
        read: false,
        type: 'general',
      };
      setNotifications([newNotif, ...notifications]);

      // Reset fields
      setReportTitle('');
      setReportDescription('');
      setReportFiles([]);
    }, 800);
  };

  // Submit Community Feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === feedbackChallengeId) {
          return {
            ...ch,
            feedbackSubmitted: true,
            feedbackData: {
              rating: feedbackRating,
              isSolved: feedbackIsSolved,
              comments: feedbackComments.trim() || 'Verified by community representative.',
              date: 'Today',
            },
          };
        }
        return ch;
      }),
    );
    setFeedbackSuccessMessage('Dhanyawad! Your community feedback has been recorded and submitted to the state R&D cell.');
  };

  // Selected Challenge for Detail View
  const selectedChallenge = useMemo(() => {
    return challenges.find((c) => c.id === selectedChallengeId) || challenges[0];
  }, [challenges, selectedChallengeId]);

  // Metrics Count
  const stats = useMemo(() => {
    const reported = challenges.length;
    const underReview = challenges.filter((c) => c.status === 'submitted' || c.status === 'verified').length;
    const inProgress = challenges.filter((c) => c.status === 'assigned' || c.status === 'in_progress').length;
    const solved = challenges.filter((c) => c.status === 'solved').length;
    return { reported, underReview, inProgress, solved };
  }, [challenges]);

  // Solved challenges list for feedback gating
  const solvedChallenges = useMemo(() => {
    return challenges.filter((c) => c.status === 'solved');
  }, [challenges]);

  // Citizen Name
  const citizenName = user?.full_name || 'Himmat Kumar';

  return (
    <div className="min-h-[85vh] bg-paper text-ink flex flex-col md:flex-row border-b border-border">
      {/* =================================================================== */}
      {/* LEFT SIDEBAR NAVIGATION                                            */}
      {/* =================================================================== */}
      <aside className="w-full md:w-64 bg-white border-r-2 border-navy flex-shrink-0 p-4 flex flex-col justify-between">
        <div>
          {/* State Brand Header */}
          <div className="pb-4 mb-4 border-b border-border">
            <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider block">
              Govt. of Jharkhand · DHTE
            </span>
            <div className="text-sm font-display font-bold text-navy flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-turmeric text-lg">account_balance</span>
              <span>Citizen Portal / नागरिक</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                setReportSuccessCode(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] text-left transition-colors ${
                activeTab === 'overview' ? 'bg-navy text-white font-bold' : 'hover:bg-paper text-ink'
              }`}
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              <span>Dashboard / अवलोकन</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('report');
                setReportSuccessCode(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[2px] text-left transition-colors ${
                activeTab === 'report' ? 'bg-navy text-white font-bold' : 'hover:bg-paper text-ink'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base">campaign</span>
                <span>Report Challenge</span>
              </div>
              <span className="px-1.5 py-0.2 bg-turmeric text-ink font-mono text-[9px] font-bold rounded-[2px]">
                NEW
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('challenges');
                setReportSuccessCode(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[2px] text-left transition-colors ${
                activeTab === 'challenges' || activeTab === 'detail'
                  ? 'bg-navy text-white font-bold'
                  : 'hover:bg-paper text-ink'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base">format_list_bulleted</span>
                <span>My Challenges</span>
              </div>
              <span className="font-mono text-[11px] bg-paper-dark px-1.5 rounded-[2px]">
                {challenges.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('notifications');
                setReportSuccessCode(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[2px] text-left transition-colors ${
                activeTab === 'notifications' ? 'bg-navy text-white font-bold' : 'hover:bg-paper text-ink'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base">notifications</span>
                <span>Notifications</span>
              </div>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="px-1.5 py-0.2 bg-urgent text-white font-mono text-[10px] font-bold rounded-full">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('feedback');
                setReportSuccessCode(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[2px] text-left transition-colors ${
                activeTab === 'feedback' ? 'bg-navy text-white font-bold' : 'hover:bg-paper text-ink'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base">rate_review</span>
                <span>Feedback / प्रतिक्रिया</span>
              </div>
              {solvedChallenges.length > 0 && (
                <span className="px-1.5 py-0.2 bg-forest text-white font-mono text-[9px] font-bold rounded-[2px]">
                  SOLVED
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('profile');
                setReportSuccessCode(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] text-left transition-colors ${
                activeTab === 'profile' ? 'bg-navy text-white font-bold' : 'hover:bg-paper text-ink'
              }`}
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span>Profile / प्रोफ़ाइल</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-border space-y-2">
          <button
            type="button"
            onClick={() => {
              clearSession();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-urgent hover:bg-urgent/10 font-bold rounded-[2px] transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Logout / लॉग आउट</span>
          </button>
          <div className="text-[10px] font-mono text-ink-muted text-center pt-1">
            Samadhan Setu v2.1 · Citizen Desk
          </div>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MAIN CONTENT AREA                                                  */}
      {/* =================================================================== */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl overflow-y-auto">
        {/* ================================================================= */}
        {/* VIEW 1: DASHBOARD OVERVIEW                                        */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white border-2 border-navy p-5 sm:p-6 rounded-[2px] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                    Welcome back, {citizenName} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-ink-muted mt-1">
                    Help make Jharkhand better by reporting local societal challenges &amp; civic problems.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-navy text-white font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-navy-deep border-2 border-navy transition-colors whitespace-nowrap shadow-sm"
                >
                  <span className="material-symbols-outlined text-base text-turmeric">add_circle</span>
                  <span>+ Report a Challenge</span>
                </button>
              </div>

              {/* Top Stats 4-Column Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border">
                <div className="border border-border p-3 rounded-[2px] bg-paper/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                    Reported / कुल दर्ज
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-navy mt-0.5 block">
                    {stats.reported}
                  </span>
                </div>

                <div className="border border-border p-3 rounded-[2px] bg-paper/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-routed block">
                    Under Review / समीक्षाधीन
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-routed mt-0.5 block">
                    {stats.underReview}
                  </span>
                </div>

                <div className="border border-border p-3 rounded-[2px] bg-paper/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-turmeric-deep block">
                    In Progress / प्रगति पर
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-navy mt-0.5 block">
                    {stats.inProgress}
                  </span>
                </div>

                <div className="border border-border p-3 rounded-[2px] bg-paper/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
                    Solved / समाधान प्राप्त
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-forest mt-0.5 block">
                    {stats.solved}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Challenges Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-forest">history</span>
                  <span>Recent Challenges / हालिया समस्याएँ</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('challenges')}
                  className="text-xs font-bold text-navy hover:underline flex items-center gap-0.5"
                >
                  <span>View All ({challenges.length})</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="space-y-3">
                {challenges.slice(0, 3).map((item) => (
                  <ChallengeCard
                    key={item.id}
                    challenge={item}
                    onViewDetails={() => {
                      setSelectedChallengeId(item.id);
                      setActiveTab('detail');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: REPORT A CHALLENGE                                        */}
        {/* ================================================================= */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider">
                  Phase 1 · Civic Intake
                </span>
                <h1 className="font-display text-2xl font-bold text-navy mt-0.5">
                  Report a Societal Challenge / समस्या दर्ज करें
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-xs font-bold text-ink-muted hover:text-navy"
              >
                ← Back to Dashboard
              </button>
            </div>

            {reportSuccessCode ? (
              <div className="bg-white border-2 border-forest p-6 rounded-[2px] shadow-sm text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-forest">check_circle</span>
                <h2 className="font-display text-xl font-bold text-navy">
                  Challenge Registered Successfully!
                </h2>
                <p className="font-mono text-lg font-bold text-forest bg-forest/10 inline-block px-3 py-1 rounded-[2px]">
                  Challenge ID: {reportSuccessCode}
                </p>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  Your grievance has been transmitted to the state intake system. The AI classification pipeline
                  will review urgency and match this problem with a university research cell within Jharkhand.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChallengeId(challenges[0]?.id || 'ch-1024');
                      setActiveTab('detail');
                    }}
                    className="px-4 py-2 bg-navy text-white text-xs font-bold uppercase rounded-[2px]"
                  >
                    View Progress Pipeline →
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportSuccessCode(null)}
                    className="px-4 py-2 bg-paper text-ink border border-border text-xs font-bold uppercase rounded-[2px]"
                  >
                    Report Another Problem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-5 bg-white border-2 border-navy p-5 sm:p-7 rounded-[2px]">
                {/* 1. Basic Information */}
                <div className="border border-border p-4 bg-paper/40 rounded-[2px] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 flex items-center justify-between">
                    <span>1. Basic Information / बुनियादी विवरण</span>
                    <span className="text-[10px] font-mono text-ink-muted lowercase">
                      (priority/impact assigned after submission)
                    </span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                      Challenge Title / शीर्षक <span className="text-urgent">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Severe Fluoride Contamination in Salgadih Village Well"
                      className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-sans"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                        Category / श्रेणी <span className="text-urgent">*</span>
                      </label>
                      <select
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-sans"
                        value={reportCategory}
                        onChange={(e) => setReportCategory(e.target.value)}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                        Impact Severity Level
                      </label>
                      <div className="px-3 py-2 text-xs bg-paper-dark border border-border text-ink-muted font-mono rounded-[2px]">
                        ⚡ AI Auto-classified upon submission
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                      Detailed Description / समस्या का विस्तृत विवरण <span className="text-urgent">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe what the issue is, since when it has been occurring, what has been tried, and why technical/R&D intervention is required..."
                      className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-sans"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                    />
                  </div>
                </div>

                {/* 2. Location Details (Powered by official LGD data) */}
                <div className="border border-border p-4 bg-paper/40 rounded-[2px] space-y-3">
                  <div className="border-b border-border pb-1.5 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>2. Geographic Location / झारखंड LGD प्रशासनिक पता</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      className="text-[11px] font-bold text-navy hover:text-forest flex items-center gap-1 bg-paper px-2 py-0.5 border border-border rounded-[2px]"
                    >
                      <span className="material-symbols-outlined text-sm text-turmeric">my_location</span>
                      <span>{gpsDetected ? '✓ GPS Captured' : 'Detect GPS Location'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                        District / जिला <span className="text-urgent">*</span>
                      </label>
                      <select
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                        value={reportDistrict}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                      >
                        {JHARKHAND_DISTRICTS.map((d) => (
                          <option key={d.code} value={d.name}>
                            {d.name} ({d.nameLocal})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                        Block / प्रखंड <span className="text-urgent">*</span>
                      </label>
                      <select
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                        value={reportTaluka}
                        onChange={(e) => handleTalukaChange(e.target.value)}
                      >
                        {availableBlocks.map((b) => (
                          <option key={b.code} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                        Village / Ward / गाँव / वार्ड <span className="text-urgent">*</span>
                      </label>
                      <select
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                        value={reportVillage}
                        onChange={(e) => setReportVillage(e.target.value)}
                      >
                        {availableVillages.length > 0 ? (
                          availableVillages.map((v) => (
                            <option key={v.code} value={v.name}>
                              {v.name} ({v.type})
                            </option>
                          ))
                        ) : (
                          <option value="Central Ward">Main Panchayat Area</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-ink-muted font-mono uppercase">Latitude</span>
                      <input
                        type="number"
                        step="0.0001"
                        className="w-full rounded-[2px] border border-border px-2.5 py-1.5 bg-white text-ink font-mono"
                        value={reportLat}
                        onChange={(e) => setReportLat(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted font-mono uppercase">Longitude</span>
                      <input
                        type="number"
                        step="0.0001"
                        className="w-full rounded-[2px] border border-border px-2.5 py-1.5 bg-white text-ink font-mono"
                        value={reportLng}
                        onChange={(e) => setReportLng(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Evidence Upload */}
                <div className="border border-border p-4 bg-paper/40 rounded-[2px] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">attach_file</span>
                    <span>3. Evidence &amp; Field Media / साक्ष्य एवं तस्वीरें</span>
                  </h3>

                  <div className="border-2 border-dashed border-border p-4 text-center rounded-[2px] bg-white">
                    <span className="material-symbols-outlined text-3xl text-ink-muted">cloud_upload</span>
                    <p className="text-xs font-bold text-navy mt-1">Upload Photos, Videos or Water/Soil Test PDFs</p>
                    <p className="text-[11px] text-ink-muted">PNG, JPG, MP4 or PDF up to 15MB</p>
                    <label className="mt-2.5 inline-block px-3 py-1.5 bg-paper border border-border hover:border-navy text-navy text-xs font-bold rounded-[2px] cursor-pointer">
                      <span>Browse Files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf"
                        className="hidden"
                        onChange={handleSimulateAddFile}
                      />
                    </label>
                  </div>

                  {reportFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {reportFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-border rounded-[2px] text-xs font-mono"
                        >
                          <span className="material-symbols-outlined text-sm text-forest">
                            {file.type === 'image' ? 'image' : 'description'}
                          </span>
                          <span className="max-w-[140px] truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setReportFiles(reportFiles.filter((_, i) => i !== idx))}
                            className="text-urgent hover:font-bold ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Community Impact */}
                <div className="border border-border p-4 bg-paper/40 rounded-[2px] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest border-b border-border pb-1.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">groups</span>
                    <span>4. Community Impact / प्रभावित समुदाय का दायरा</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                        Who is Affected? / कौन प्रभावित है? <span className="text-urgent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Smallholder farmers, women fetching water"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                        value={reportWhoAffected}
                        onChange={(e) => setReportWhoAffected(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                        Approx. Number of People Affected <span className="text-urgent">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 350"
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy font-mono"
                        value={reportPeopleAffected}
                        onChange={(e) => setReportPeopleAffected(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                      Additional Notes / अतिरिक्त सूचना
                    </label>
                    <input
                      type="text"
                      placeholder="Any local administrative contacts, past memorandums, or emergency factors"
                      className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                      value={reportAdditional}
                      onChange={(e) => setReportAdditional(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="w-full py-3 bg-navy text-white text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-navy-deep transition-colors shadow-sm disabled:opacity-50"
                  >
                    {reportSubmitting
                      ? 'Transmitting Challenge to State Intake...'
                      : 'Submit Challenge / समस्या सबमिट करें →'}
                  </button>
                  <p className="text-[11px] text-ink-muted text-center font-mono mt-2">
                    Official grievance submission node under State R&amp;D Matching Cell, Govt. of Jharkhand.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: MY CHALLENGES LIST                                        */}
        {/* ================================================================= */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider">
                  Citizen Tracker
                </span>
                <h1 className="font-display text-2xl font-bold text-navy mt-0.5">
                  My Challenges / मेरी दर्ज समस्याएँ
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className="px-3 py-1.5 bg-navy text-white text-xs font-bold uppercase rounded-[2px]"
              >
                + New Challenge
              </button>
            </div>

            {/* List of Challenge Cards */}
            <div className="space-y-3">
              {challenges.map((item) => (
                <ChallengeCard
                  key={item.id}
                  challenge={item}
                  onViewDetails={() => {
                    setSelectedChallengeId(item.id);
                    setActiveTab('detail');
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 4: CHALLENGE DETAIL + PROGRESS (MERGED SINGLE PAGE)          */}
        {/* ================================================================= */}
        {activeTab === 'detail' && selectedChallenge && (
          <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('challenges')}
                className="text-xs font-bold text-navy hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to My Challenges</span>
              </button>
              <span className="font-mono text-xs font-bold bg-navy text-white px-2.5 py-0.5 rounded-[2px]">
                {selectedChallenge.code}
              </span>
            </div>

            {/* PROGRESS CHECKLIST (Top of Page Lifecycle) */}
            <div className="bg-white border-2 border-navy p-5 rounded-[2px] shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-turmeric">linear_scale</span>
                  <span>10-Stage Resolution Lifecycle / प्रगति स्थिति</span>
                </h2>
                <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-[2px]">
                  {selectedChallenge.progress}% Completed
                </span>
              </div>

              {/* Graphical Progress Bar */}
              <div className="w-full bg-paper border border-border h-3 rounded-[2px] overflow-hidden mb-5">
                <div
                  className="bg-navy h-full transition-all duration-500"
                  style={{ width: `${selectedChallenge.progress}%` }}
                />
              </div>

              {/* Visual Checklist Stages */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                {PROGRESS_STAGES.map((stage, idx) => {
                  const stageThreshold = ((idx + 1) / PROGRESS_STAGES.length) * 100;
                  const isDone = selectedChallenge.progress >= stageThreshold;
                  const isCurrent =
                    selectedChallenge.progress < stageThreshold &&
                    selectedChallenge.progress >= (idx / PROGRESS_STAGES.length) * 100;

                  return (
                    <div
                      key={stage.key}
                      className={`p-2 border rounded-[2px] text-center ${
                        isDone
                          ? 'bg-forest/10 border-forest text-forest font-bold'
                          : isCurrent
                            ? 'bg-turmeric/10 border-turmeric text-navy font-bold ring-1 ring-turmeric'
                            : 'bg-paper/40 border-border text-ink-muted'
                      }`}
                    >
                      <div className="text-base leading-none mb-1">
                        {isDone ? '✓' : isCurrent ? '●' : '○'}
                      </div>
                      <div className="text-[11px] leading-tight">{stage.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Challenge Info Card */}
            <div className="bg-white border border-border p-5 rounded-[2px] space-y-4">
              <div>
                <span className="text-[10px] font-mono text-ink-muted uppercase">
                  Category: {selectedChallenge.category} · Submitted: {selectedChallenge.submittedDate}
                </span>
                <h1 className="font-display text-xl font-bold text-navy mt-0.5">
                  {selectedChallenge.title}
                </h1>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
                  {selectedChallenge.description}
                </p>
              </div>

              {/* Location & Impact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink-muted block">
                    Location / स्थान विवरण
                  </span>
                  <div className="font-mono text-navy font-medium">
                    📍 {selectedChallenge.village}, {selectedChallenge.taluka} Block, {selectedChallenge.district},{' '}
                    Jharkhand
                  </div>
                  <div className="text-[11px] font-mono text-ink-muted">
                    GPS: {selectedChallenge.lat}, {selectedChallenge.lng}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink-muted block">
                    Community Impact / प्रभावित आबादी
                  </span>
                  <div className="font-medium text-navy">
                    👥 Approx. {selectedChallenge.peopleAffected} citizens affected
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {selectedChallenge.whoAffected}
                  </div>
                </div>
              </div>

              {/* Evidence Media Preview */}
              {selectedChallenge.evidenceFiles.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] font-bold uppercase text-ink-muted block mb-2">
                    Evidence Attached / साक्ष्य
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.evidenceFiles.map((ev, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1.5 bg-paper border border-border rounded-[2px] text-xs font-mono flex items-center gap-1.5 text-navy"
                      >
                        <span className="material-symbols-outlined text-sm text-forest">
                          {ev.type === 'image' ? 'image' : 'description'}
                        </span>
                        <span>{ev.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis Box */}
            {selectedChallenge.aiClassification && (
              <div className="bg-paper-dark/60 border border-border p-4 rounded-[2px]">
                <div className="flex items-center gap-1.5 text-navy font-bold text-xs uppercase tracking-wider mb-2 border-b border-border pb-1">
                  <span className="material-symbols-outlined text-base text-turmeric">neurology</span>
                  <span>AI Classification &amp; Triaging / एआई वर्गीकरण</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase block">Category</span>
                    <span className="font-bold text-navy">{selectedChallenge.aiClassification.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase block">Priority</span>
                    <span className="font-bold text-urgent">{selectedChallenge.aiClassification.priority}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase block">Impact Scope</span>
                    <span className="font-bold text-navy">{selectedChallenge.aiClassification.communityImpact}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase block">Confidence</span>
                    <span className="font-mono font-bold text-forest">
                      {selectedChallenge.aiClassification.confidence}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Assigned Organizations (University & Industry) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* University Match */}
              <div className="bg-white border-2 border-navy p-4 rounded-[2px]">
                <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider block">
                  Academic R&amp;D Partner
                </span>
                <h3 className="font-display text-sm font-bold text-navy mt-1">
                  {selectedChallenge.assignedUniversity
                    ? selectedChallenge.assignedUniversity.name
                    : 'Awaiting University Allocation'}
                </h3>
                {selectedChallenge.assignedUniversity ? (
                  <div className="mt-2 space-y-1 text-xs">
                    <span className="inline-block px-2 py-0.5 bg-forest/10 text-forest font-mono text-[10px] font-bold rounded-[2px]">
                      {selectedChallenge.assignedUniversity.expertiseMatch}
                    </span>
                    <div className="text-ink-muted pt-1">
                      <strong>Lead Mentor:</strong> {selectedChallenge.assignedUniversity.mentor}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted mt-2">
                    Our matching algorithm is evaluating department proposals from Jharkhand HEIs (BIT, NIT, Ranchi Univ).
                  </p>
                )}
              </div>

              {/* Industry Partner */}
              <div className="bg-white border-2 border-navy p-4 rounded-[2px]">
                <span className="text-[10px] font-mono text-turmeric-deep uppercase font-bold tracking-wider block">
                  Industry &amp; CSR Partner
                </span>
                <h3 className="font-display text-sm font-bold text-navy mt-1">
                  {selectedChallenge.industryPartner
                    ? selectedChallenge.industryPartner.name
                    : 'CSR / Co-Funding Review'}
                </h3>
                {selectedChallenge.industryPartner ? (
                  <div className="mt-2 space-y-1 text-xs">
                    <span className="inline-block px-2 py-0.5 bg-turmeric/15 text-navy font-mono text-[10px] font-bold rounded-[2px]">
                      {selectedChallenge.industryPartner.supportType}
                    </span>
                    <div className="text-ink-muted pt-1">
                      <strong>Support Track:</strong> Prototyping &amp; Field Pilot Deployment
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted mt-2">
                    Open for CSR sponsorship proposals under Jharkhand state industrial collaboration guidelines.
                  </p>
                )}
              </div>
            </div>

            {/* Solution Project Info Card */}
            {selectedChallenge.solutionProject && (
              <div className="bg-white border-2 border-forest p-5 rounded-[2px]">
                <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider">
                  Active Solution Project / समाधान परियोजना
                </span>
                <h3 className="font-display text-lg font-bold text-navy mt-0.5">
                  {selectedChallenge.solutionProject.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-border text-xs">
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase block">University Mentor</span>
                    <span className="font-medium text-navy">{selectedChallenge.solutionProject.mentor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase block">Industry Partner</span>
                    <span className="font-medium text-navy">{selectedChallenge.solutionProject.industry}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase block">Stage</span>
                    <span className="font-bold text-forest">{selectedChallenge.solutionProject.currentStage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase block">Progress</span>
                    <span className="font-mono font-bold text-navy">
                      {selectedChallenge.solutionProject.progress}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Button if Solved */}
            {selectedChallenge.status === 'solved' && (
              <div className="bg-forest/10 border border-forest p-4 rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-forest text-sm">Challenge Marked as Solved</h4>
                  <p className="text-xs text-ink-muted">
                    Your assessment validates whether the on-ground issue has truly been resolved for the community.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackChallengeId(selectedChallenge.id);
                    setActiveTab('feedback');
                  }}
                  className="px-4 py-2 bg-forest text-white text-xs font-bold uppercase tracking-wider rounded-[2px] whitespace-nowrap"
                >
                  {selectedChallenge.feedbackSubmitted ? 'View Feedback' : 'Give Community Feedback ★'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 5: NOTIFICATIONS FEED                                        */}
        {/* ================================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider">
                  Real-time Alerts
                </span>
                <h1 className="font-display text-2xl font-bold text-navy mt-0.5">
                  Notifications / सूचनाएं
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                className="text-xs font-bold text-navy hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-[2px] border transition-colors ${
                    notif.read ? 'bg-white border-border' : 'bg-paper-dark border-navy/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-lg text-turmeric mt-0.5">
                        {notif.type === 'assignment'
                          ? 'school'
                          : notif.type === 'stage_update'
                            ? 'upgrade'
                            : notif.type === 'feedback_request'
                              ? 'rate_review'
                              : 'notifications'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs text-navy">{notif.title}</h3>
                          {notif.challengeCode && (
                            <span className="font-mono text-[10px] bg-navy text-white px-1.5 rounded-[2px]">
                              {notif.challengeCode}
                            </span>
                          )}
                          {!notif.read && (
                            <span className="w-2 h-2 bg-urgent rounded-full" title="Unread" />
                          )}
                        </div>
                        <p className="text-xs text-ink mt-0.5">{notif.message}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-ink-muted whitespace-nowrap">{notif.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 6: FEEDBACK (GATED ON STATUS === SOLVED)                     */}
        {/* ================================================================= */}
        {activeTab === 'feedback' && (
          <div className="space-y-5">
            <div className="border-b border-border pb-3">
              <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider">
                Community Validation Node
              </span>
              <h1 className="font-display text-2xl font-bold text-navy mt-0.5">
                Community Feedback / समाधान सत्यापन
              </h1>
              <p className="text-xs text-ink-muted mt-1">
                Feedback is exclusively enabled for challenges with status <strong>Solved</strong> to measure
                authentic societal impact.
              </p>
            </div>

            {solvedChallenges.length === 0 ? (
              <div className="bg-white border border-border p-6 rounded-[2px] text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-ink-muted">lock</span>
                <h3 className="font-bold text-sm text-navy">No Solved Challenges Awaiting Feedback</h3>
                <p className="text-xs text-ink-muted max-w-sm mx-auto">
                  Once an allocated university and industry team finishes pilot deployment and marks your challenge as
                  solved, the community verification form will activate here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Select which solved challenge to review */}
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                    Select Solved Challenge / समाधान की गई समस्या चुनें:
                  </label>
                  <select
                    className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink font-sans focus:outline-none focus:border-navy"
                    value={feedbackChallengeId}
                    onChange={(e) => {
                      setFeedbackChallengeId(e.target.value);
                      setFeedbackSuccessMessage(null);
                    }}
                  >
                    {solvedChallenges.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.code}: {sc.title} ({sc.district})
                      </option>
                    ))}
                  </select>
                </div>

                {feedbackSuccessMessage ? (
                  <div className="bg-forest/10 border border-forest p-4 rounded-[2px] text-forest text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>{feedbackSuccessMessage}</span>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="bg-white border-2 border-navy p-5 rounded-[2px] space-y-4">
                    {/* Star Rating */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1.5">
                        How well did this solution address the problem? / समाधान कितना प्रभावी रहा?
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                          >
                            <span
                              className={star <= feedbackRating ? 'text-turmeric' : 'text-slate-300'}
                            >
                              ★
                            </span>
                          </button>
                        ))}
                        <span className="text-xs font-mono font-bold text-navy ml-2">
                          {feedbackRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    {/* Problem Solved Radio/Buttons */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1.5">
                        Was the problem actually solved on the ground? / क्या जमीनी स्तर पर समस्या हल हुई?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Yes', 'Partially', 'No'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFeedbackIsSolved(opt)}
                            className={`py-2 px-3 text-xs font-bold rounded-[2px] border transition-colors text-center ${
                              feedbackIsSolved === opt
                                ? 'bg-navy text-white border-navy'
                                : 'bg-paper text-ink border-border hover:border-navy'
                            }`}
                          >
                            {opt === 'Yes' && '✓ '}
                            {opt === 'Partially' && '◐ '}
                            {opt === 'No' && '✗ '}
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Comments */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted mb-1">
                        Your Feedback / आपकी विस्तृत राय <span className="text-urgent">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Detail the operational status, water/light delivery, response of the local maintenance team, etc."
                        className="w-full rounded-[2px] border border-border px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-navy"
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-forest text-white text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-forest/90 transition-colors"
                    >
                      Submit Feedback / प्रतिक्रिया दर्ज करें →
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 7: PROFILE                                                   */}
        {/* ================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <div className="border-b border-border pb-3">
              <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider">
                Resident Profile
              </span>
              <h1 className="font-display text-2xl font-bold text-navy mt-0.5">
                Citizen Profile / नागरिक प्रोफ़ाइल
              </h1>
            </div>

            <div className="bg-white border-2 border-navy p-5 sm:p-6 rounded-[2px] space-y-5">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <div className="w-14 h-14 bg-navy text-turmeric font-display text-2xl font-bold rounded-[2px] flex items-center justify-center border-2 border-navy">
                  {citizenName.charAt(0)}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">{citizenName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-forest/10 text-forest text-[11px] font-bold font-mono rounded-[2px] border border-forest/30">
                      ✓ Verified Resident (नागरिक)
                    </span>
                    <span className="text-xs text-ink-muted font-mono">
                      State Code: 20 (Jharkhand)
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="border border-border p-3 rounded-[2px] bg-paper/40">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">Full Name</span>
                  <span className="font-medium text-navy text-sm">{citizenName}</span>
                </div>

                <div className="border border-border p-3 rounded-[2px] bg-paper/40">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">Email Address</span>
                  <span className="font-mono text-navy text-sm">{user?.email || 'citizen@jharkhand.in'}</span>
                </div>

                <div className="border border-border p-3 rounded-[2px] bg-paper/40">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">Mobile Number</span>
                  <span className="font-mono text-navy text-sm">{user?.phone ? `+91 ${user.phone}` : '+91 9835123456'}</span>
                </div>

                <div className="border border-border p-3 rounded-[2px] bg-paper/40">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">District</span>
                  <span className="font-medium text-navy text-sm">{user?.district || 'Ranchi'}</span>
                </div>

                <div className="border border-border p-3 rounded-[2px] bg-paper/40">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">Taluka / Block</span>
                  <span className="font-medium text-navy text-sm">{user?.taluka || 'Kanke'}</span>
                </div>

                <div className="border border-border p-3 rounded-[2px] bg-paper/40">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">City / Village / Ward</span>
                  <span className="font-medium text-navy text-sm">{user?.village_or_city || 'Morabadi Ward 12'}</span>
                </div>
              </div>

              {/* Citizen Stats */}
              <div className="border-t border-border pt-4">
                <span className="text-xs font-bold uppercase text-navy block mb-2">
                  Civic Contributions Summary
                </span>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 bg-paper rounded-[2px] border border-border">
                    <span className="text-[10px] uppercase text-ink-muted block">Challenges Logged</span>
                    <span className="font-display text-xl font-bold text-navy">{challenges.length}</span>
                  </div>
                  <div className="p-2.5 bg-paper rounded-[2px] border border-border">
                    <span className="text-[10px] uppercase text-ink-muted block">Under R&amp;D Matching</span>
                    <span className="font-display text-xl font-bold text-turmeric-deep">
                      {challenges.filter((c) => c.status !== 'solved').length}
                    </span>
                  </div>
                  <div className="p-2.5 bg-paper rounded-[2px] border border-border">
                    <span className="text-[10px] uppercase text-ink-muted block">Community Solved</span>
                    <span className="font-display text-xl font-bold text-forest">{stats.solved}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// =========================================================================
// REUSABLE CHALLENGE CARD COMPONENT
// =========================================================================
function ChallengeCard({
  challenge,
  onViewDetails,
}: {
  challenge: ChallengeItem;
  onViewDetails: () => void;
}) {
  return (
    <div className="bg-white border-2 border-navy p-4 sm:p-5 rounded-[2px] shadow-sm hover:border-navy-deep transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold bg-navy text-white px-2 py-0.2 rounded-[2px]">
              {challenge.code}
            </span>
            <span className="text-xs text-ink-muted">
              {challenge.category} • {challenge.district}
            </span>
          </div>

          <h3 className="font-display text-base sm:text-lg font-bold text-navy leading-snug">
            {challenge.title}
          </h3>

          <div className="text-xs font-semibold text-navy flex items-center gap-1.5 pt-0.5">
            <span>Status:</span>
            <span>{challenge.statusLabel}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="self-start sm:self-center px-3 py-1.5 bg-paper hover:bg-navy hover:text-white border border-navy text-navy font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors whitespace-nowrap"
        >
          View Details →
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 pt-3 border-t border-border flex items-center gap-3">
        <div className="flex-1 bg-paper border border-border h-2.5 rounded-[2px] overflow-hidden">
          <div
            className="bg-navy h-full transition-all duration-300"
            style={{ width: `${challenge.progress}%` }}
          />
        </div>
        <span className="font-mono text-xs font-bold text-navy min-w-[3rem] text-right">
          {challenge.progress}%
        </span>
      </div>
    </div>
  );
}
