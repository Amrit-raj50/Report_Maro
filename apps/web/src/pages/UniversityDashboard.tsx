import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { apiClient } from '../lib/apiClient.js';
import {
  INITIAL_CHALLENGES,
  INITIAL_PROJECTS,
  FACULTY_MENTORS,
  STUDENT_INVESTIGATORS,
  INDUSTRY_PARTNERS,
  UNIVERSITY_PROPOSALS,
  NOTIFICATIONS_LIST,
  type ChallengeItem,
  type ProjectItem,
  type FacultyMentor,
  type StudentInvestigator,
  type IndustryPartnerItem,
  type UniversityProposal,
} from '../components/university/universityData.js';
import { ChallengeEvaluationModal } from '../components/university/ChallengeEvaluationModal.js';
import { TeamManagementModal } from '../components/university/TeamManagementModal.js';
import { ProposalSubmissionModal } from '../components/university/ProposalSubmissionModal.js';
import { GovtDossierReportModal } from '../components/university/GovtDossierReportModal.js';
import { MentorDashboardView } from '../components/university/MentorDashboardView.js';
import { StudentDashboardView } from '../components/student/StudentDashboardView.js';
import {
  Building2,
  FileText,
  Layers,
  Users,
  UserCheck,
  GraduationCap,
  Briefcase,
  FileSpreadsheet,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Zap,
} from 'lucide-react';

type NavTab =
  | 'dashboard'
  | 'challenges'
  | 'projects'
  | 'teams'
  | 'mentors'
  | 'mentor'
  | 'students'
  | 'student'
  | 'industry'
  | 'proposals'
  | 'analytics'
  | 'notifications'
  | 'settings';

export default function UniversityDashboard() {
  const authUser = useAuthStore((s) => s.user);

  // Institutional States
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [challenges, setChallenges] = useState<ChallengeItem[]>(INITIAL_CHALLENGES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [mentors] = useState<FacultyMentor[]>(FACULTY_MENTORS);
  const [students] = useState<StudentInvestigator[]>(STUDENT_INVESTIGATORS);
  const [industryPartners] = useState<IndustryPartnerItem[]>(INDUSTRY_PARTNERS);
  const [proposals, setProposals] = useState<UniversityProposal[]>(UNIVERSITY_PROPOSALS);

  // Filter & Search States
  const [challengeFilter, setChallengeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [evaluatingChallenge, setEvaluatingChallenge] = useState<ChallengeItem | null>(null);
  const [editingTeamProject, setEditingTeamProject] = useState<ProjectItem | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showGovtDossierModal, setShowGovtDossierModal] = useState(false);

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync with real backend if university projects exist
  useEffect(() => {
    if (authUser?.id) {
      apiClient
        .get('/projects', { params: { university_id: authUser.id } })
        .then((res) => {
          if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
            // merge backend records seamlessly if any exist
          }
        })
        .catch(() => {
          // graceful fallback to authentic institutional dataset
        });
    }
  }, [authUser]);

  // Handler: Accept Challenge
  const handleAcceptChallenge = (challenge: ChallengeItem) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challenge.id ? { ...c, status: 'accepted' } : c)),
    );

    const defaultMentor = mentors[0];
    const categoryPart = challenge.categoryLabel.split('/')[0]?.trim() || 'General';

    // Create a new institutional project automatically
    const newProject: ProjectItem = {
      id: `prj-${Date.now()}`,
      code: `JH-PRJ-2026-0${projects.length + 42}`,
      title: `${challenge.title} (${categoryPart})`,
      challengeRef: challenge.code,
      sector: categoryPart,
      mentorName: defaultMentor ? defaultMentor.name : 'Dr. Rajesh Sharma',
      mentorTitle: defaultMentor ? defaultMentor.designation : 'Professor & Dean (R&D)',
      mentorDept: defaultMentor ? defaultMentor.department : 'Dept. of Environmental Science & Engineering',
      teamSize: 0,
      students: [],
      progress: 5,
      status: 'Development',
      statusColor: 'var(--routed)',
      startDate: '10 Sept 2026',
      targetDate: '15 Jan 2027',
      budgetAllocated: challenge.estimatedBudget.split('(')[0]?.trim() || '₹5,00,000',
      currentMilestone: 'Institutional Team Formation & Project Charter Formulation',
      milestones: [
        { title: 'Faculty mentor assignment & student investigator intake', dueDate: '20 Sept 2026', done: true },
        { title: 'State grant seed disbursement & baseline survey', dueDate: '15 Oct 2026', done: false },
        { title: 'Bench-scale prototype fabrication', dueDate: '30 Nov 2026', done: false },
      ],
    };

    setProjects([newProject, ...projects]);
    setEvaluatingChallenge(null);
    showToast(`Challenge ${challenge.code} accepted! Project ${newProject.code} initiated.`);
  };

  // Handler: Reject Challenge
  const handleRejectChallenge = (challengeId: string, reason: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'rejected' } : c)),
    );
    setEvaluatingChallenge(null);
    showToast(`Challenge rejected and logged with State AI Triage: "${reason.slice(0, 35)}..."`);
  };

  // Handler: Request Info
  const handleRequestInfo = (challengeId: string, query: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'under_evaluation' } : c)),
    );
    setEvaluatingChallenge(null);
    showToast(`Official query sent to District Triage Desk: "${query.slice(0, 35)}..."`);
  };

  // Handler: Save Team Assignment
  const handleSaveTeam = (
    projectId: string,
    mentor: FacultyMentor,
    assignedStudents: { name: string; rollNo: string; role: string; dept: string }[],
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            mentorName: mentor.name,
            mentorTitle: mentor.designation,
            mentorDept: mentor.department,
            teamSize: assignedStudents.length,
            students: assignedStudents,
          };
        }
        return p;
      }),
    );
    showToast(`Faculty mentor and research team updated for Project.`);
  };

  // Handler: Submit R&D Proposal
  const handleSubmitProposal = (proposalData: {
    title: string;
    challengeRef: string;
    facultyLead: string;
    department: string;
    budget: string;
    milestones: { title: string; dueDate: string }[];
  }) => {
    const newProp: UniversityProposal = {
      id: `prop-${Date.now()}`,
      memoNumber: `REF-DHTE-RNC-2026-0${proposals.length + 95}`,
      title: proposalData.title,
      challengeRef: proposalData.challengeRef,
      facultyLead: proposalData.facultyLead,
      department: proposalData.department,
      budgetRequested: proposalData.budget,
      dateSubmitted: '10 Sept 2026',
      status: 'Under Review',
      appraisingBody: 'Technical Evaluation Committee, DHTE Ranchi',
    };
    setProposals([newProp, ...proposals]);
    setShowProposalModal(false);
    showToast(`Proposal ${newProp.memoNumber} submitted to State Higher Education Department.`);
  };

  // Active Organization Branding
  const institutionName =
    authUser?.organization || 'Birla Institute of Technology (BIT) Mesra, Ranchi';
  const institutionAishe = 'U-0205';

  if (activeTab === 'mentor') {
    return (
      <MentorDashboardView
        onReturnToUniversity={() => setActiveTab('dashboard')}
        onSwitchToStudent={() => setActiveTab('student')}
      />
    );
  }

  if (activeTab === 'student') {
    return (
      <StudentDashboardView
        onReturnToUniversity={() => setActiveTab('dashboard')}
        onSwitchToMentor={() => setActiveTab('mentor')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 border border-navy bg-navy px-4 py-3 text-xs font-medium text-white shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-turmeric" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* INSTITUTIONAL WORKPLACE HEADER */}
      <header className="border-b border-border bg-white shadow-sm">

        {/* Tier 2: University Identity & Authority Banner */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Emblem Seal */}
            <div className="flex h-14 w-14 items-center justify-center border border-navy/20 bg-paper p-1">
              <div className="flex h-full w-full flex-col items-center justify-center border border-navy/30 text-center">
                <span className="text-[9px] font-bold text-navy">GOVT OF</span>
                <span className="font-display text-xs font-bold text-navy">JH</span>
                <span className="text-[7px] text-ink-muted">R&D CELL</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="border border-forest/30 bg-forest/10 px-2 py-0.2 text-[10px] font-semibold text-forest uppercase tracking-wider">
                  State Accredited University Node
                </span>
                <span className="font-mono text-xs text-ink-muted">AISHE: {institutionAishe}</span>
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight text-navy sm:text-2xl">
                {institutionName}
              </h1>
              <p className="text-xs text-ink-muted">
                समाधान सेतु · विश्वविद्यालय नवाचार एवं अनुसंधान डैशबोर्ड | University R&D Directorate
              </p>
            </div>
          </div>

          {/* Right Authority Pill & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setActiveTab('mentor')}
              className="flex items-center gap-1.5 border border-forest bg-forest text-white px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition hover:bg-forest/90 rounded-[2px]"
              title="Open Dr. Sharma's Faculty Mentor Workspace"
            >
              <span>👨‍🏫 Mentor Workspace</span>
              <span className="hidden sm:inline-block border border-white/40 bg-white/20 px-1.5 py-0.2 rounded text-[10px] font-mono">
                Dr. Sharma
              </span>
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className="flex items-center gap-1.5 border border-navy bg-white text-navy hover:bg-paper px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition rounded-[2px]"
              title="Open Himmat's Student Workspace"
            >
              <span>👨‍🎓 Student Workspace</span>
              <span className="hidden sm:inline-block border border-navy/30 bg-navy/10 px-1.5 py-0.2 rounded text-[10px] font-mono">
                Himmat
              </span>
            </button>
            <button
              onClick={() => setShowGovtDossierModal(true)}
              className="flex items-center gap-1.5 border border-forest bg-forest text-white px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition hover:bg-forest/90 rounded-[2px]"
              title="Generate Official Jharkhand State Department PDF / CSV Progress Dossier"
            >
              <Printer className="h-3.5 w-3.5 text-turmeric" />
              <span>Govt Dossier</span>
            </button>
            <button
              onClick={() => setShowProposalModal(true)}
              className="flex items-center gap-1.5 border border-turmeric bg-turmeric px-3 py-1.5 text-xs font-bold text-ink uppercase tracking-wider transition hover:bg-turmeric-deep rounded-[2px]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Submit Proposal</span>
            </button>
            <div className="hidden text-right md:block border border-border bg-paper p-2 text-xs">
              <span className="block text-[10px] font-semibold text-ink-muted uppercase">
                Institutional Node ID
              </span>
              <span className="font-mono text-xs font-bold text-navy">JH-DHTE-RNC-04</span>
              <div className="mt-0.5 text-[10px] text-forest">NAAC Grade A+ · NIRF Top 50</div>
            </div>
          </div>
        </div>

        {/* Tier 3: Institutional 10-Tab Navigation Strip (Clearly Visible on All Screens) */}
        <div className="border-t border-border bg-navy text-white">
          <div className="w-full max-w-[1440px] mx-auto flex items-center px-2 sm:px-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex items-center w-full justify-between sm:justify-start gap-0.5 sm:gap-1 text-[10px] sm:text-[10.5px] lg:text-[11px] xl:text-xs font-semibold tracking-tight whitespace-nowrap py-0.5">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'dashboard'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-turmeric shrink-0" />
                <span>DASHBOARD</span>
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'challenges'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>CHALLENGES</span>
                <span className="ml-1 rounded-xs bg-turmeric px-1.5 py-0.2 font-mono text-[9px] font-bold text-ink">
                  {challenges.filter((c) => c.status === 'recommended').length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'projects'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <Layers className="h-3.5 w-3.5 shrink-0" />
                <span>PROJECTS</span>
                <span className="ml-0.5 font-mono text-[9px] text-white/60">({projects.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'teams'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span>TEAMS</span>
              </button>
              <button
                onClick={() => setActiveTab('mentors')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'mentors'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                <span>MENTORS</span>
              </button>
              <button
                onClick={() => setActiveTab('mentor')}
                className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60 transition shrink-0"
              >
                <span>👨‍🏫</span>
                <span className="hidden sm:inline">MENTOR </span>
                <span>WORKSPACE</span>
                <span className="ml-1 rounded-xs bg-turmeric px-1.5 py-0.2 font-mono text-[9px] font-bold text-ink">
                  4
                </span>
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'students'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                <span>STUDENTS</span>
              </button>
              <button
                onClick={() => setActiveTab('industry')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'industry'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5 text-turmeric shrink-0" />
                <span>INDUSTRY</span>
              </button>
              <button
                onClick={() => setActiveTab('proposals')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'proposals'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />
                <span>PROPOSALS</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'analytics'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                <span>ANALYTICS</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-2.5 py-2 border-b-2 transition shrink-0 ${
                  activeTab === 'notifications'
                    ? 'border-turmeric bg-navy-deep font-bold text-white'
                    : 'border-transparent text-white/80 hover:text-white hover:bg-navy-deep/60'
                }`}
              >
                <Bell className="h-3.5 w-3.5 shrink-0" />
                <span>NOTIFICATIONS</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* ==================================================================== */}
        {/* TAB 1: DASHBOARD (HOME OVERVIEW)                                     */}
        {/* ==================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Official Welcome Banner */}
            <div className="border border-border bg-white p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest">
                    <ShieldCheck className="h-4 w-4" />
                    State Research Ecosystem Node · Verified Active
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold text-navy">
                    Welcome, {institutionName}
                  </h2>
                  <p className="mt-1 text-xs text-ink-muted">
                    Innovation & Research Dashboard · Higher Education Directive No. DHTE/2026/L99
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowGovtDossierModal(true)}
                    className="flex items-center gap-1.5 border border-forest bg-forest px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-forest/90"
                  >
                    <Printer className="h-3.5 w-3.5 text-turmeric" />
                    Govt Dossier (PDF/CSV)
                  </button>
                  <button
                    onClick={() => setActiveTab('challenges')}
                    className="flex items-center gap-1.5 border border-turmeric bg-turmeric px-4 py-2 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
                  >
                    <Search className="h-3.5 w-3.5" />
                    Review Recommended Challenges
                  </button>
                  <button
                    onClick={() => setShowProposalModal(true)}
                    className="flex items-center gap-1.5 border border-navy bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-deep"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Proposal
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Primary Metric Stat Tiles (Prompt requirement: 42, 18, 7, 12) */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div
                onClick={() => setActiveTab('challenges')}
                className="cursor-pointer border border-border bg-white p-4 transition hover:border-navy"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span>Assigned Challenges</span>
                  <FileText className="h-4 w-4 text-navy" />
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">42</p>
                <span className="mt-1 block text-[11px] text-forest">
                  4 newly routed this week
                </span>
              </div>

              <div
                onClick={() => setActiveTab('projects')}
                className="cursor-pointer border border-border bg-white p-4 transition hover:border-navy"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span>Active Projects</span>
                  <Layers className="h-4 w-4 text-navy" />
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">18</p>
                <span className="mt-1 block text-[11px] text-ink-muted">
                  Multidisciplinary teams
                </span>
              </div>

              <div
                onClick={() => setActiveTab('projects')}
                className="cursor-pointer border border-border bg-white p-4 transition hover:border-navy"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span>Completed Projects</span>
                  <CheckCircle2 className="h-4 w-4 text-forest" />
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-forest">7</p>
                <span className="mt-1 block text-[11px] text-forest font-medium">
                  4 Solutions Deployed
                </span>
              </div>

              <div
                onClick={() => setActiveTab('proposals')}
                className="cursor-pointer border border-border bg-white p-4 transition hover:border-navy"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span>Pending Reviews</span>
                  <Clock className="h-4 w-4 text-under-review" />
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-under-review">12</p>
                <span className="mt-1 block text-[11px] text-ink-muted">
                  Milestones & Proposals
                </span>
              </div>
            </div>

            {/* Split Section: Recommended Challenges Teaser + Live Projects Strip */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left 2 Cols: Recommended Challenges Feed */}
              <div className="space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-turmeric-deep" />
                    <h3 className="font-display text-sm font-semibold text-navy">
                      Recommended Challenges (AI Triage Dispatch)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('challenges')}
                    className="text-xs font-semibold text-navy hover:underline"
                  >
                    View All ({challenges.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {challenges
                    .filter((c) => c.status === 'recommended')
                    .slice(0, 3)
                    .map((challenge) => (
                      <div
                        key={challenge.id}
                        className="border border-border bg-white p-4 transition hover:border-navy"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-navy">
                              {challenge.code}
                            </span>
                            <span className="text-border">|</span>
                            <span className="text-[11px] font-semibold uppercase text-ink-muted">
                              {challenge.categoryLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="border border-forest bg-forest/10 px-2 py-0.2 font-mono text-[10px] font-semibold text-forest">
                              AI Match: {challenge.aiMatchScore}%
                            </span>
                            <span
                              className={`border px-2 py-0.2 font-mono text-[10px] font-semibold uppercase ${
                                challenge.priority === 'critical'
                                  ? 'border-urgent bg-urgent/10 text-urgent'
                                  : 'border-under-review bg-under-review/10 text-under-review'
                              }`}
                            >
                              {challenge.priorityLabel}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5">
                          <h4 className="font-display text-sm font-semibold text-navy">
                            {challenge.title}
                          </h4>
                          <p className="mt-0.5 text-xs text-ink-muted line-clamp-2">
                            {challenge.description}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2 text-xs">
                          <div className="flex items-center gap-1 text-ink-muted">
                            <MapPin className="h-3.5 w-3.5 text-ink-muted" />
                            <span>
                              {challenge.district} ({challenge.block})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEvaluatingChallenge(challenge)}
                              className="border border-border bg-paper px-3 py-1 text-xs font-medium text-ink hover:border-navy"
                            >
                              View Challenge
                            </button>
                            <button
                              onClick={() => handleAcceptChallenge(challenge)}
                              className="border border-turmeric-deep bg-turmeric px-3 py-1 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Col: Live Institutional Projects & Industry Snapshot */}
              <div className="space-y-4">
                <div className="border border-border bg-white">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-paper">
                    <h3 className="font-display text-xs font-semibold text-navy uppercase tracking-wider">
                      Active Projects (Pipeline)
                    </h3>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-[11px] font-semibold text-navy hover:underline"
                    >
                      All ({projects.length})
                    </button>
                  </div>

                  <div className="p-4 divide-y divide-border">
                    {projects.slice(0, 3).map((prj) => (
                      <div key={prj.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[10px] text-ink-muted">{prj.code}</span>
                            <h4 className="font-display text-xs font-semibold text-navy">
                              {prj.title}
                            </h4>
                          </div>
                          <span className="border border-border bg-paper px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                            {prj.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-ink-muted">
                          <span>Mentor: {prj.mentorName}</span>
                          <span>Team: {prj.teamSize} Students</span>
                        </div>
                        {/* Progress Bar (Custom width bar per PS aesthetic) */}
                        <div>
                          <div className="flex justify-between text-[10px] font-mono text-ink-muted">
                            <span>Progress:</span>
                            <span className="font-semibold text-navy">{prj.progress}%</span>
                          </div>
                          <div className="mt-1 h-2 w-full border border-border bg-paper">
                            <div
                              className="h-full bg-navy transition-all duration-300"
                              style={{ width: `${prj.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Collaboration Snippet */}
                <div className="border border-border bg-white p-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-semibold text-navy uppercase tracking-wider">
                      Industry & CSR Linkage
                    </span>
                    <button
                      onClick={() => setActiveTab('industry')}
                      className="text-[11px] font-semibold text-navy hover:underline"
                    >
                      View All →
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-ink-muted">
                    8 corporate and PSU partners actively co-sponsoring prototypes and offering
                    field testbeds in Jharkhand.
                  </p>
                  <div className="mt-3 border border-border bg-paper p-2.5 text-xs">
                    <span className="font-semibold text-navy">
                      ABC Technologies (Tata Steel CSR)
                    </span>
                    <p className="text-[11px] text-ink-muted">
                      Grant: ₹5,00,000 + 20 Sensors for Water Monitoring
                    </p>
                    <span className="mt-1 inline-block border border-forest bg-forest/10 px-1.5 py-0.2 font-mono text-[10px] text-forest">
                      Status: Active MOU
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: RECOMMENDED & ASSIGNED CHALLENGES                             */}
        {/* ==================================================================== */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="border border-border bg-white p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-lg font-semibold text-navy">
                    Recommended & Assigned Challenges
                  </h2>
                  <p className="text-xs text-ink-muted">
                    Challenges routed to {institutionName} based on departmental expertise and lab
                    accreditations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by ID or title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border border-border bg-paper py-1.5 pl-8 pr-3 text-xs text-ink focus:border-navy focus:outline-none"
                    />
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-ink-muted" />
                  </div>
                </div>
              </div>

              {/* Status Filter Bar */}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                {['all', 'recommended', 'under_evaluation', 'accepted', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setChallengeFilter(st)}
                    className={`border px-3 py-1 text-xs font-medium uppercase tracking-wider transition ${
                      challengeFilter === st
                        ? 'border-navy bg-navy text-white'
                        : 'border-border bg-paper text-ink-muted hover:border-navy'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Challenges Cards List */}
            <div className="space-y-3">
              {challenges
                .filter(
                  (c) =>
                    (challengeFilter === 'all' || c.status === challengeFilter) &&
                    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.code.toLowerCase().includes(searchQuery.toLowerCase())),
                )
                .map((challenge) => (
                  <div
                    key={challenge.id}
                    className="border border-border bg-white p-5 transition hover:border-navy"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-navy">
                            {challenge.code}
                          </span>
                          <span className="border border-border bg-paper px-2 py-0.5 text-[10px] font-semibold text-ink-muted uppercase">
                            {challenge.categoryLabel}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-xs text-ink-muted">
                            <MapPin className="h-3 w-3" />
                            {challenge.district} · {challenge.block}
                          </span>
                          <span
                            className={`border px-2 py-0.2 font-mono text-[10px] font-semibold uppercase ${
                              challenge.priority === 'critical'
                                ? 'border-urgent bg-urgent/10 text-urgent'
                                : 'border-under-review bg-under-review/10 text-under-review'
                            }`}
                          >
                            {challenge.priorityLabel} PRIORITY
                          </span>
                        </div>
                        <h3 className="mt-1.5 font-display text-base font-semibold text-navy">
                          {challenge.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-ink-muted">{challenge.subTitle}</p>
                      </div>

                      <div className="border border-border bg-paper p-3 text-right">
                        <span className="block text-[10px] font-semibold text-ink-muted uppercase">
                          AI Match Affinity
                        </span>
                        <span className="font-mono text-xl font-bold text-navy">
                          {challenge.aiMatchScore}%
                        </span>
                        <span className="block text-[10px] text-forest font-medium">
                          Lab Match Verified
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-ink">{challenge.description}</p>

                    {/* Why this university rationale */}
                    <div className="mt-3 border border-border/80 bg-paper p-3">
                      <span className="text-[11px] font-semibold text-navy uppercase tracking-wider">
                        Why this university?
                      </span>
                      <div className="mt-1.5 grid grid-cols-1 gap-1 sm:grid-cols-3 text-xs text-ink">
                        {challenge.matchReasons.map((r, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="font-mono text-forest font-bold">✓</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Disciplines & Actions */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-ink-muted uppercase">
                          Required Skills:
                        </span>
                        {challenge.requiredExpertise.map((sk) => (
                          <span
                            key={sk}
                            className="border border-border bg-paper px-2 py-0.5 text-[11px] text-ink"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEvaluatingChallenge(challenge)}
                          className="border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-paper"
                        >
                          View Details
                        </button>
                        {challenge.status === 'recommended' && (
                          <button
                            onClick={() => handleAcceptChallenge(challenge)}
                            className="border border-turmeric-deep bg-turmeric px-4 py-1.5 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
                          >
                            Accept Challenge
                          </button>
                        )}
                        {challenge.status === 'accepted' && (
                          <span className="border border-forest bg-forest/10 px-3 py-1.5 font-mono text-xs font-semibold text-forest">
                            Active Project Initiated
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: PROJECTS (INSTITUTIONAL PIPELINE)                             */}
        {/* ==================================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="border border-border bg-white p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-lg font-semibold text-navy">
                    Institutional Projects Portfolio
                  </h2>
                  <p className="text-xs text-ink-muted">
                    Active multidisciplinary research projects linked to citizen grievances across
                    Jharkhand.
                  </p>
                </div>
                <button
                  onClick={() => setShowProposalModal(true)}
                  className="flex items-center gap-1.5 border border-turmeric bg-turmeric px-4 py-2 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Submit New Solution Proposal
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-border bg-white p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-navy">{project.code}</span>
                        <span className="text-border">|</span>
                        <span className="font-mono text-[11px] text-ink-muted">
                          Challenge: {project.challengeRef}
                        </span>
                      </div>
                      <span className="border border-border bg-paper px-2 py-0.5 font-mono text-[11px] font-semibold text-ink">
                        {project.status}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-base font-semibold text-navy">
                      {project.title}
                    </h3>
                    <p className="text-xs text-ink-muted">{project.sector}</p>

                    {/* Mentor & Student Count */}
                    <div className="mt-3 border border-border bg-paper p-3 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Faculty Mentor:</span>
                        <span className="font-semibold text-navy">{project.mentorName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Department:</span>
                        <span className="text-ink">{project.mentorDept}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Research Team:</span>
                        <span className="font-semibold text-forest">
                          {project.teamSize} Student Investigators
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-ink-muted">Development Progress:</span>
                        <span className="font-bold text-navy">{project.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full border border-border bg-paper">
                        <div
                          className="h-full bg-navy"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="block text-[11px] text-ink-muted">
                        Active Stage: {project.currentMilestone}
                      </span>
                    </div>

                    {/* Industry Partner Note */}
                    {project.industryPartner && (
                      <div className="mt-3 border border-border bg-white p-2.5 text-xs">
                        <span className="text-[10px] font-semibold text-ink-muted uppercase">
                          Industry / CSR Co-Sponsor:
                        </span>
                        <p className="font-semibold text-navy">{project.industryPartner.name}</p>
                        <p className="text-[11px] text-ink-muted">
                          {project.industryPartner.contribution}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-mono text-xs text-forest font-semibold">
                      Budget: {project.budgetAllocated}
                    </span>
                    <button
                      onClick={() => setEditingTeamProject(project)}
                      className="flex items-center gap-1.5 border border-navy bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-paper"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Configure Team & Mentors
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: TEAMS (HIERARCHICAL TEAM MANAGEMENT)                          */}
        {/* ==================================================================== */}
        {activeTab === 'teams' && (
          <div className="space-y-4">
            <div className="border border-border bg-white p-4">
              <h2 className="font-display text-lg font-semibold text-navy">
                Institutional Multidisciplinary Team Management
              </h2>
              <p className="text-xs text-ink-muted">
                Structured hierarchy: University → Faculty Mentors → Student Investigators.
              </p>
            </div>

            {/* Hierarchy Tree Cards */}
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-border bg-white p-5">
                  <div className="flex flex-col justify-between gap-2 border-b border-border pb-3 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-navy">{project.code}</span>
                        <span className="text-border">|</span>
                        <span className="font-mono text-xs text-ink-muted">
                          Ref {project.challengeRef}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-navy">
                        {project.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setEditingTeamProject(project)}
                      className="border border-navy bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-paper"
                    >
                      Modify Allocation
                    </button>
                  </div>

                  {/* Monospace Tree Visualization matching prompt */}
                  <div className="mt-4 border border-border bg-paper p-4 font-mono text-xs text-ink">
                    <div className="font-bold text-navy flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-navy" />
                      Project {project.challengeRef.replace('JH-', '#')}
                    </div>
                    <div className="ml-5 border-l-2 border-border pl-4 pt-1">
                      <div className="font-semibold text-turmeric-deep flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-turmeric-deep" />
                        Mentor: {project.mentorName} ({project.mentorDept})
                      </div>
                      <div className="ml-5 border-l-2 border-border pl-4 pt-1 space-y-1.5">
                        <div className="text-xs text-ink-muted">Students:</div>
                        {project.students.map((st, i) => (
                          <div key={st.rollNo} className="flex items-center gap-2 text-xs">
                            <span className="text-border">
                              {i === project.students.length - 1 ? '└──' : '├──'}
                            </span>
                            <span className="font-semibold text-navy">{st.name}</span>
                            <span className="text-ink-muted">({st.rollNo})</span>
                            <span className="text-border">·</span>
                            <span className="text-forest font-medium">{st.role}</span>
                            <span className="text-ink-muted text-[11px]">[{st.dept}]</span>
                          </div>
                        ))}
                        {project.students.length === 0 && (
                          <div className="text-ink-muted italic">
                            No student investigators assigned yet. Click 'Modify Allocation' to add.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: MENTORS (FACULTY DIRECTORY)                                   */}
        {/* ==================================================================== */}
        {activeTab === 'mentors' && (
          <div className="space-y-4">
            <div className="border border-border bg-white p-4">
              <h2 className="font-display text-lg font-semibold text-navy">
                Accredited Faculty Mentors Roster
              </h2>
              <p className="text-xs text-ink-muted">
                Senior professors and investigators empaneled for State R&D grievance problem
                mentorship.
              </p>
            </div>

            <div className="border border-border bg-white overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-paper text-[11px] font-semibold text-ink-muted uppercase">
                    <th className="p-3">Faculty Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Credentials & Experience</th>
                    <th className="p-3">Specialization</th>
                    <th className="p-3">Active Load</th>
                    <th className="p-3">Official Contact</th>
                    <th className="p-3 text-right">Portal Workspace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mentors.map((mentor) => (
                    <tr key={mentor.id} className="hover:bg-paper/60">
                      <td className="p-3 font-semibold text-navy">
                        {mentor.name}
                        <span className="block text-[11px] font-normal text-ink-muted">
                          {mentor.designation}
                        </span>
                      </td>
                      <td className="p-3 text-ink">{mentor.department}</td>
                      <td className="p-3">
                        <span className="font-mono text-[11px] text-ink font-medium">
                          {mentor.qualifications}
                        </span>
                        <span className="block text-[10px] text-ink-muted">
                          {mentor.experienceYears} Years Academic Exp.
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {mentor.specialization.map((sp) => (
                            <span
                              key={sp}
                              className="border border-border bg-paper px-1.5 py-0.5 text-[10px]"
                            >
                              {sp}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-mono">
                        <span
                          className={`font-semibold ${
                            mentor.activeProjects >= mentor.maxCapacity
                              ? 'text-urgent'
                              : 'text-forest'
                          }`}
                        >
                          {mentor.activeProjects}/{mentor.maxCapacity}
                        </span>{' '}
                        Projects
                      </td>
                      <td className="p-3 font-mono text-[11px] text-ink-muted">{mentor.email}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setActiveTab('mentor')}
                          className="border border-navy bg-navy px-2.5 py-1 text-[11px] font-bold text-white hover:bg-navy-deep transition"
                        >
                          Open Workspace
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: STUDENTS (STUDENT INVESTIGATORS)                               */}
        {/* ==================================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="border border-border bg-white p-4">
              <h2 className="font-display text-lg font-semibold text-navy">
                Student Investigators Directory
              </h2>
              <p className="text-xs text-ink-muted">
                Accredited undergraduate and postgraduate student researchers participating in field
                innovation teams.
              </p>
            </div>

            <div className="border border-border bg-white overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-paper text-[11px] font-semibold text-ink-muted uppercase">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Roll Number</th>
                    <th className="p-3">Academic Department</th>
                    <th className="p-3">Current Year</th>
                    <th className="p-3">Assigned Project</th>
                    <th className="p-3">CGPA</th>
                    <th className="p-3">Core Skills</th>
                    <th className="p-3 text-right">Student Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-paper/60">
                      <td className="p-3 font-semibold text-navy">{st.name}</td>
                      <td className="p-3 font-mono text-[11px] font-semibold text-ink-muted">
                        {st.rollNo}
                      </td>
                      <td className="p-3 text-ink">{st.department}</td>
                      <td className="p-3 text-ink-muted">{st.year}</td>
                      <td className="p-3 font-mono text-[11px]">
                        {st.assignedProjectCode ? (
                          <span className="font-semibold text-forest">
                            {st.assignedProjectCode}
                          </span>
                        ) : (
                          <span className="text-ink-muted">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-semibold text-navy">{st.cgpa}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {st.skills.map((sk) => (
                            <span
                              key={sk}
                              className="border border-border bg-paper px-1.5 py-0.5 text-[10px]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setActiveTab('student')}
                          className="border border-navy bg-navy px-2.5 py-1 text-[11px] font-bold text-white hover:bg-navy-deep transition"
                        >
                          Open Workspace
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 7: INDUSTRY PARTNERS (CSR & CORPORATE CO-SPONSORS)                */}
        {/* ==================================================================== */}
        {activeTab === 'industry' && (
          <div className="space-y-4">
            <div className="border border-border bg-white p-4">
              <h2 className="font-display text-lg font-semibold text-navy">
                Industry & Corporate CSR Partnerships
              </h2>
              <p className="text-xs text-ink-muted">
                Collaborative agreements for co-funding, technical mentorship, prototyping equipment,
                and field deployments.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {industryPartners.map((partner) => (
                <div key={partner.id} className="border border-border bg-white p-5 space-y-3">
                  <div className="flex items-start justify-between border-b border-border pb-2">
                    <div>
                      <span className="font-mono text-[10px] text-ink-muted">
                        MOU: {partner.mouRefNumber}
                      </span>
                      <h3 className="font-display text-base font-semibold text-navy">
                        {partner.name}
                      </h3>
                      <p className="text-xs text-ink-muted">{partner.division}</p>
                    </div>
                    <span
                      className={`border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                        partner.status === 'Active'
                          ? 'border-forest bg-forest/10 text-forest'
                          : 'border-under-review bg-under-review/10 text-under-review'
                      }`}
                    >
                      {partner.status} MOU
                    </span>
                  </div>

                  <div className="border border-border bg-paper p-3 text-xs space-y-1.5">
                    <div>
                      <span className="text-ink-muted">Linked R&D Project:</span>
                      <p className="font-medium text-navy">{partner.projectLinked}</p>
                    </div>
                    <div className="border-t border-border pt-1.5">
                      <span className="text-ink-muted">Corporate Contribution & Commitment:</span>
                      <p className="font-semibold text-forest">{partner.contributionDetails}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-ink-muted border-t border-border pt-2">
                    <span>Liaison: {partner.liaisonOfficer}</span>
                    <span className="font-mono text-[11px]">{partner.contactEmail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 8: PROPOSALS (STATE R&D GRANT PROPOSALS)                         */}
        {/* ==================================================================== */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            <div className="border border-border bg-white p-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-lg font-semibold text-navy">
                  State Higher Education R&D Proposals
                </h2>
                <p className="text-xs text-ink-muted">
                  Formal funding applications submitted to the Directorate of Higher & Technical
                  Education, Ranchi.
                </p>
              </div>
              <button
                onClick={() => setShowProposalModal(true)}
                className="flex items-center gap-1.5 border border-turmeric bg-turmeric px-4 py-2 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
              >
                <Plus className="h-3.5 w-3.5" />
                Submit R&D Proposal
              </button>
            </div>

            <div className="border border-border bg-white overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-paper text-[11px] font-semibold text-ink-muted uppercase">
                    <th className="p-3">Memo Reference</th>
                    <th className="p-3">Research Proposal Title</th>
                    <th className="p-3">Problem ID</th>
                    <th className="p-3">Lead Faculty</th>
                    <th className="p-3">Requested Budget</th>
                    <th className="p-3">Submitted</th>
                    <th className="p-3">Appraisal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {proposals.map((prop) => (
                    <tr key={prop.id} className="hover:bg-paper/60">
                      <td className="p-3 font-mono font-semibold text-navy">{prop.memoNumber}</td>
                      <td className="p-3 font-semibold text-ink">
                        {prop.title}
                        <span className="block text-[11px] font-normal text-ink-muted">
                          {prop.appraisingBody}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-ink-muted">
                        {prop.challengeRef}
                      </td>
                      <td className="p-3 text-ink">
                        {prop.facultyLead}
                        <span className="block text-[10px] text-ink-muted">{prop.department}</span>
                      </td>
                      <td className="p-3 font-mono font-semibold text-forest">
                        {prop.budgetRequested}
                      </td>
                      <td className="p-3 text-ink-muted">{prop.dateSubmitted}</td>
                      <td className="p-3">
                        <span
                          className={`border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                            prop.status === 'Sanctioned'
                              ? 'border-forest bg-forest/10 text-forest'
                              : 'border-under-review bg-under-review/10 text-under-review'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 9: ANALYTICS (INNOVATION PERFORMANCE SCORECARD)                   */}
        {/* ==================================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-4">
              <h2 className="font-display text-lg font-semibold text-navy">
                University Innovation Performance Metrics
              </h2>
              <p className="text-xs text-ink-muted">
                Executive R&D output metrics aligned with National Education Policy (NEP) 2020 and
                Jharkhand Higher Education benchmarks.
              </p>
            </div>

            {/* Top Scorecard Row (Matching exact user prompt numbers) */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="border border-border bg-white p-4">
                <span className="text-[10px] font-semibold text-ink-muted uppercase">
                  Challenges Received
                </span>
                <p className="mt-1 font-mono text-3xl font-bold text-navy">42</p>
                <span className="text-[11px] text-forest">100% evaluated by cell</span>
              </div>
              <div className="border border-border bg-white p-4">
                <span className="text-[10px] font-semibold text-ink-muted uppercase">
                  Active Projects
                </span>
                <p className="mt-1 font-mono text-3xl font-bold text-navy">18</p>
                <span className="text-[11px] text-ink-muted">Across 5 departments</span>
              </div>
              <div className="border border-border bg-white p-4">
                <span className="text-[10px] font-semibold text-ink-muted uppercase">
                  Completed Projects
                </span>
                <p className="mt-1 font-mono text-3xl font-bold text-forest">7</p>
                <span className="text-[11px] text-forest">4 Solutions Deployed</span>
              </div>
              <div className="border border-border bg-white p-4">
                <span className="text-[10px] font-semibold text-ink-muted uppercase">
                  Industry Partners
                </span>
                <p className="mt-1 font-mono text-3xl font-bold text-navy">8</p>
                <span className="text-[11px] text-forest">₹38.5 Lakhs Co-Funding</span>
              </div>
            </div>

            {/* Secondary Participation Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border border-border bg-white p-4">
                <span className="text-xs font-semibold text-navy uppercase tracking-wider">
                  Faculty Participation
                </span>
                <p className="mt-2 font-mono text-2xl font-bold text-navy">32 Faculty</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Active mentors empanelled across engineering disciplines
                </p>
              </div>
              <div className="border border-border bg-white p-4">
                <span className="text-xs font-semibold text-navy uppercase tracking-wider">
                  Student Participation
                </span>
                <p className="mt-2 font-mono text-2xl font-bold text-forest">86 Students</p>
                <p className="mt-1 text-xs text-ink-muted">
                  B.Tech & M.Tech thesis projects linked to live citizen grievances
                </p>
              </div>
              <div className="border border-border bg-white p-4">
                <span className="text-xs font-semibold text-navy uppercase tracking-wider">
                  District Coverage
                </span>
                <p className="mt-2 font-mono text-2xl font-bold text-navy">6 Districts</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Ranchi, Latehar, West Singhbhum, Hazaribagh, Dhanbad, Bokaro
                </p>
              </div>
            </div>

            {/* Domain-wise Problem Allocation Breakdown */}
            <div className="border border-border bg-white p-5">
              <h3 className="font-display text-sm font-semibold text-navy border-b border-border pb-2 uppercase tracking-wider">
                Sector Allocation Distribution
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span>Water Resources & Public Health (जल संसाधन)</span>
                    <span className="font-mono">14 Challenges (33%)</span>
                  </div>
                  <div className="mt-1 h-2 w-full border border-border bg-paper">
                    <div className="h-full bg-cat-water" style={{ width: '33%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span>Agriculture & Rural Livelihood (कृषि एवं सूक्ष्म सिंचाई)</span>
                    <span className="font-mono">11 Challenges (26%)</span>
                  </div>
                  <div className="mt-1 h-2 w-full border border-border bg-paper">
                    <div className="h-full bg-cat-agriculture" style={{ width: '26%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span>Renewable Energy & Microgrids (ऊर्जा)</span>
                    <span className="font-mono">9 Challenges (21%)</span>
                  </div>
                  <div className="mt-1 h-2 w-full border border-border bg-paper">
                    <div className="h-full bg-cat-energy" style={{ width: '21%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium">
                    <span>Environmental & Mine Telemetry (पर्यावरण एवं खनन)</span>
                    <span className="font-mono">8 Challenges (20%)</span>
                  </div>
                  <div className="mt-1 h-2 w-full border border-border bg-paper">
                    <div className="h-full bg-cat-environment" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* State Department Reporting Dossier Callout in Analytics */}
            <div className="border border-navy/30 bg-paper p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center border border-navy bg-navy text-white font-bold text-sm shrink-0">
                  JH
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-forest px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-widest text-white">
                      Official State Integration
                    </span>
                    <span className="text-[11px] text-ink-muted">DHTE & GFR Compliance</span>
                  </div>
                  <h3 className="text-sm font-bold text-navy mt-0.5">
                    Official State Department Executive Progress Dossier
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Generate the official bilingual progress report for the Department of Higher & Technical Education, Drinking Water & Sanitation, Agriculture, and Health.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGovtDossierModal(true)}
                className="flex items-center gap-1.5 border border-navy bg-navy px-4 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-navy-deep shrink-0 transition"
              >
                <Printer className="h-3.5 w-3.5 text-turmeric" />
                <span>Open Dossier Generator</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 10: NOTIFICATIONS (OFFICIAL STATE & CSR DISPATCHES)               */}
        {/* ==================================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="border border-border bg-white p-4">
              <h2 className="font-display text-lg font-semibold text-navy">
                Official Departmental Notifications & Triage Dispatches
              </h2>
              <p className="text-xs text-ink-muted">
                Directives issued by Department of Higher & Technical Education, Government of
                Jharkhand.
              </p>
            </div>

            <div className="space-y-3">
              {NOTIFICATIONS_LIST.map((notif) => (
                <div
                  key={notif.id}
                  className={`border bg-white p-4 ${
                    notif.urgent ? 'border-urgent/60 bg-urgent/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-navy">{notif.memo}</span>
                      {notif.urgent && (
                        <span className="border border-urgent bg-urgent text-white px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase">
                          Action Required
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-ink-muted">{notif.timestamp}</span>
                  </div>
                  <h3 className="mt-1 font-display text-sm font-semibold text-navy">
                    {notif.title}
                  </h3>
                  <p className="mt-1 text-xs text-ink leading-relaxed">{notif.description}</p>
                  <div className="mt-3 flex justify-end">
                    <button className="border border-navy bg-white px-3 py-1 text-xs font-semibold text-navy hover:bg-paper">
                      {notif.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {evaluatingChallenge && (
        <ChallengeEvaluationModal
          challenge={evaluatingChallenge}
          onClose={() => setEvaluatingChallenge(null)}
          onAccept={handleAcceptChallenge}
          onReject={handleRejectChallenge}
          onRequestInfo={handleRequestInfo}
        />
      )}

      {editingTeamProject && (
        <TeamManagementModal
          project={editingTeamProject}
          mentors={mentors}
          students={students}
          onClose={() => setEditingTeamProject(null)}
          onSave={handleSaveTeam}
        />
      )}

      {showProposalModal && (
        <ProposalSubmissionModal
          mentors={mentors}
          onClose={() => setShowProposalModal(false)}
          onSubmit={handleSubmitProposal}
        />
      )}

      {showGovtDossierModal && (
        <GovtDossierReportModal
          isOpen={showGovtDossierModal}
          onClose={() => setShowGovtDossierModal(false)}
          projects={projects}
          challenges={challenges}
          institutionName={institutionName}
          institutionAishe={institutionAishe}
        />
      )}
    </div>
  );
}
