import React, { useState, useRef } from 'react';
import {
  HIMMAT_PROFILE,
  STUDENT_PROJECTS,
  INITIAL_TODAYS_TASKS,
  STUDENT_TASKS,
  EXPLORE_CHALLENGES,
  TEAM_MEMBERS,
  INITIAL_STUDENT_DELIVERABLES,
  STUDENT_ACHIEVEMENTS,
  StudentProject,
  StudentTaskItem,
  ExploreChallenge,
  StudentDeliverable,
  ProofOfWork,
} from './studentData.js';
import { useProjectMessages } from '../../utils/projectMessaging.js';
import {
  Briefcase,
  CheckSquare,
  Sparkles,
  Compass,
  Users,
  Send,
  MessageSquare,
  Award,
  User,
  ArrowLeft,
  Search,
  Upload,
  CheckCircle2,
  ChevronRight,
  Layers,
  Paperclip,
  Globe,
  Code2,
  Video,
  MapPin,
  Camera,
  ExternalLink,
  Eye,
  ShieldCheck,
  X,
} from 'lucide-react';

export type StudentNavTab =
  | 'dashboard'
  | 'explore'
  | 'projects'
  | 'tasks'
  | 'team'
  | 'submit'
  | 'messages'
  | 'achievements'
  | 'profile';

interface StudentDashboardViewProps {
  onReturnToUniversity?: () => void;
  onSwitchToMentor?: () => void;
  initialTab?: StudentNavTab;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  onReturnToUniversity,
  onSwitchToMentor,
  initialTab = 'dashboard',
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<StudentNavTab>(initialTab);

  // States
  const [profile] = useState(HIMMAT_PROFILE);
  const [projects] = useState<StudentProject[]>(STUDENT_PROJECTS);
  const [todaysTasks, setTodaysTasks] = useState(INITIAL_TODAYS_TASKS);
  const [tasks, setTasks] = useState<StudentTaskItem[]>(STUDENT_TASKS);
  const [challenges, setChallenges] = useState<ExploreChallenge[]>(EXPLORE_CHALLENGES);
  const { messages: comments, sendMessage, resetMessages } = useProjectMessages();
  const [deliverables, setDeliverables] = useState<StudentDeliverable[]>(INITIAL_STUDENT_DELIVERABLES);
  const [achievements] = useState(STUDENT_ACHIEVEMENTS);

  // Filter for Explore Challenges
  const [challengeFilter, setChallengeFilter] = useState<'All' | 'AI' | 'IoT' | 'Agriculture' | 'Healthcare'>('All');
  const [challengeSearch, setChallengeSearch] = useState('');

  // Submit Work Form State
  const [submitProject, setSubmitProject] = useState('Smart Water Monitoring');
  const [submitType, setSubmitType] = useState<'Prototype' | 'Technical Report' | 'Code Repository' | 'Dataset'>('Prototype');
  const [submitTitle, setSubmitTitle] = useState('Water Dashboard v1');
  const [submitFileName, setSubmitFileName] = useState('dashboard.zip');
  const [submitDesc, setSubmitDesc] = useState('Implemented monitoring dashboard.');

  // Optional Rich Proof of Work Form States
  const [submitDemoUrl, setSubmitDemoUrl] = useState('');
  const [submitGithubUrl, setSubmitGithubUrl] = useState('');
  const [submitVideoUrl, setSubmitVideoUrl] = useState('');
  const [submitPhotoNames, setSubmitPhotoNames] = useState<string[]>([]);
  const [submitPhotoGps, setSubmitPhotoGps] = useState('');
  const [submitPhotoCaption, setSubmitPhotoCaption] = useState('');
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [selectedProofOfWork, setSelectedProofOfWork] = useState<{ title: string; pow: ProofOfWork } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files).map((f) => f.name);
      setSubmitPhotoNames((prev) => {
        const next = [...prev];
        selected.forEach((name) => {
          if (!next.includes(name)) next.push(name);
        });
        return next;
      });
      if (!submitPhotoGps) {
        handleDetectGps();
      }
    }
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleCancelPhoto = (indexToRemove?: number) => {
    if (typeof indexToRemove === 'number') {
      setSubmitPhotoNames((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    } else {
      setSubmitPhotoNames([]);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  const handleDetectGps = () => {
    setGpsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setSubmitPhotoGps(`${lat}° N, ${lng}° E (Field Node)`);
          setGpsDetecting(false);
          showToast(`GPS captured: ${lat}° N, ${lng}° E`);
        },
        () => {
          // Fallback to regional Jharkhand research coordinates
          setSubmitPhotoGps('23.3441° N, 85.3096° E (Birla Chowk, Namkum)');
          setGpsDetecting(false);
          showToast('GPS tagged: Namkum Research Node, Ranchi');
        },
        { timeout: 5000 }
      );
    } else {
      setSubmitPhotoGps('23.3441° N, 85.3096° E (Birla Chowk, Namkum)');
      setGpsDetecting(false);
      showToast('GPS tagged: Namkum Research Node, Ranchi');
    }
  };

  // Team Comment Form
  const [newCommentText, setNewCommentText] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers: Today's Tasks
  const toggleTodayTask = (id: string) => {
    setTodaysTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextDone = !t.done;
          showToast(nextDone ? `Completed: "${t.title}"` : `Reopened: "${t.title}"`);
          return { ...t, done: nextDone };
        }
        return t;
      })
    );
  };

  // Handlers: Move Task status
  const moveTask = (taskId: string, targetBucket: 'overdue' | 'in_progress' | 'completed' | 'upcoming') => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          showToast(`Task "${t.title}" moved to ${targetBucket.replace('_', ' ').toUpperCase()}`);
          return { ...t, bucket: targetBucket };
        }
        return t;
      })
    );
  };

  // Handlers: Request to Join Challenge
  const handleRequestToJoin = (challengeId: string, challengeTitle: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'Request Sent' } : c))
    );
    showToast(`Request sent to join "${challengeTitle}"! Faculty mentor notified.`);
  };

  // Handlers: Submit Work
  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTitle.trim()) return;

    const hasPow = Boolean(
      submitDemoUrl.trim() ||
      submitGithubUrl.trim() ||
      submitVideoUrl.trim() ||
      submitPhotoNames.length > 0 ||
      submitPhotoGps.trim() ||
      submitPhotoCaption.trim()
    );

    const proofOfWork: ProofOfWork | undefined = hasPow
      ? {
          liveDemoUrl: submitDemoUrl.trim() || undefined,
          githubRepoUrl: submitGithubUrl.trim() || undefined,
          videoWalkthroughUrl: submitVideoUrl.trim() || undefined,
          fieldPhotoName: submitPhotoNames[0] || undefined,
          fieldPhotoNames: submitPhotoNames.length > 0 ? submitPhotoNames : undefined,
          gpsCoordinates: submitPhotoGps.trim() || undefined,
          photoCaption: submitPhotoCaption.trim() || undefined,
        }
      : undefined;

    const newDeliv: StudentDeliverable = {
      id: `del-${Date.now()}`,
      project: submitProject,
      type: submitType,
      title: submitTitle,
      fileName: submitFileName || 'deliverable_archive.zip',
      fileSize: '12.8 MB',
      description: submitDesc,
      submittedAt: 'Just now',
      status: 'Pending Review',
      proofOfWork,
    };

    setDeliverables([newDeliv, ...deliverables]);
    showToast(`"${newDeliv.title}" submitted to Dr. Sharma's Review Queue!`);
    
    // Reset optional fields
    setSubmitDemoUrl('');
    setSubmitGithubUrl('');
    setSubmitVideoUrl('');
    setSubmitPhotoNames([]);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
    setSubmitPhotoGps('');
    setSubmitPhotoCaption('');
    setActiveTab('submit');
  };

  // Handlers: Team Comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    sendMessage({
      author: profile.name,
      role: 'Frontend Developer',
      avatar: profile.avatarIcon,
      message: newCommentText.trim(),
      projectId: 'Smart Water Monitoring',
      projectName: 'Smart Water Monitoring (Namkum Block)',
    });

    setNewCommentText('');
    showToast('Message sent to project team and Dr. Sharma!');
  };

  // Filtered Challenges
  const filteredChallenges = challenges.filter((c) => {
    const matchesFilter = challengeFilter === 'All' ? true : c.category === challengeFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(challengeSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(challengeSearch.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(challengeSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const currentProject = projects[0];

  return (
    <div className="min-h-screen bg-paper text-ink pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 border-2 border-navy bg-navy px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-turmeric" />
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-border bg-white sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {onReturnToUniversity && (
              <button
                onClick={onReturnToUniversity}
                className="flex items-center gap-1.5 border border-border bg-paper px-3 py-1.5 text-xs font-bold text-navy hover:border-navy transition"
                title="Return to Central University Administration"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">University Admin</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Student">👨‍🎓</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-base font-bold text-navy">
                    👋 Hello, {profile.name}
                  </h1>
                  <span className="border border-forest/30 bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest uppercase tracking-wider">
                    Student Investigator
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted">
                  {profile.degree} · {profile.institution}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSwitchToMentor && (
              <button
                onClick={onSwitchToMentor}
                className="hidden sm:flex items-center gap-1.5 border border-forest bg-forest text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-forest/90 transition"
              >
                <span>👨‍🏫 Mentor Workspace</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('submit')}
              className="flex items-center gap-1.5 border border-turmeric bg-turmeric px-3 py-1.5 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Submit Work</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Bar */}
      <nav className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-1 py-1.5">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Briefcase },
              { key: 'explore', label: 'Explore Challenges', icon: Compass },
              { key: 'projects', label: 'My Projects', icon: Layers, count: profile.stats.myProjects },
              { key: 'tasks', label: 'My Tasks', icon: CheckSquare, count: profile.stats.tasks },
              { key: 'team', label: 'My Team', icon: Users },
              { key: 'submit', label: 'Submit Work', icon: Upload },
              { key: 'messages', label: 'Messages', icon: MessageSquare },
              { key: 'achievements', label: 'Achievements', icon: Award },
              { key: 'profile', label: 'Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as StudentNavTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? 'border-b-2 border-navy text-navy bg-paper font-black'
                      : 'text-ink-muted hover:text-navy hover:bg-paper/50'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-navy' : 'text-ink-muted'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="font-mono text-[10px] text-ink-muted">({tab.count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">

        {/* ==================================================================== */}
        {/* TAB 1: STUDENT DASHBOARD (HOME OVERVIEW)                             */}
        {/* ==================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 3 Metric Cards (Exact Prompt Requirements: My Projects 2, Tasks 5, Skills 8) */}
            <div className="grid grid-cols-3 gap-4">
              <div
                onClick={() => setActiveTab('projects')}
                className="cursor-pointer border border-border bg-white p-5 transition hover:border-navy text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <Layers className="h-4 w-4 text-navy" />
                  <span>My Projects</span>
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">{profile.stats.myProjects}</p>
                <span className="mt-1 block text-[11px] text-forest font-medium">
                  Active R&D Teams
                </span>
              </div>

              <div
                onClick={() => setActiveTab('tasks')}
                className="cursor-pointer border border-border bg-white p-5 transition hover:border-navy text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <CheckSquare className="h-4 w-4 text-navy" />
                  <span>Tasks</span>
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">{profile.stats.tasks}</p>
                <span className="mt-1 block text-[11px] text-turmeric-deep font-semibold">
                  1 Overdue · 2 In Progress
                </span>
              </div>

              <div
                onClick={() => setActiveTab('achievements')}
                className="cursor-pointer border border-border bg-white p-5 transition hover:border-navy text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <Sparkles className="h-4 w-4 text-navy" />
                  <span>Skills</span>
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">{profile.stats.skills}</p>
                <span className="mt-1 block text-[11px] text-forest font-medium">
                  Technical Competencies
                </span>
              </div>
            </div>

            {/* Current Project Card & Today's Tasks (Exact ASCII Match) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Project Card */}
              {currentProject && (
                <div className="border-2 border-navy bg-white p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentProject.icon}</span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
                          Current Primary Project
                        </span>
                        <h2 className="font-display text-lg font-bold text-navy">
                          {currentProject.title}
                        </h2>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2.5 py-1 border border-forest/30">
                      {currentProject.code}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Your Role:</span>
                      <strong className="text-navy">{currentProject.role}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Faculty Mentor:</span>
                      <strong className="text-navy">{currentProject.mentor}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Team Members:</span>
                      <strong className="text-ink">{currentProject.teamSize} Students & Investigators</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Next Task:</span>
                      <strong className="text-urgent">{currentProject.nextTask}</strong>
                    </div>
                  </div>

                  {/* Progress Bar (72%) */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-ink-muted">Overall Progress</span>
                      <span className="font-mono text-navy font-bold">{currentProject.progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-border overflow-hidden">
                      <div
                        className="h-full bg-navy transition-all duration-500"
                        style={{ width: `${currentProject.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('team')}
                      className="text-xs font-bold text-navy hover:underline flex items-center gap-1"
                    >
                      View Team <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="border border-navy bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-deep"
                    >
                      Submit Milestone Work
                    </button>
                  </div>
                </div>
              )}

              {/* Today's Tasks Checklist */}
              <div className="border border-border bg-white p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-turmeric-deep" />
                    <h3 className="font-display text-base font-bold text-navy">
                      Today's Tasks
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs font-bold text-navy hover:underline"
                  >
                    View All (5)
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {todaysTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTodayTask(task.id)}
                      className="cursor-pointer border border-border p-3.5 flex items-center gap-3 hover:bg-paper transition"
                    >
                      <span className="text-lg">
                        {task.done ? '☑' : '☐'}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          task.done ? 'line-through text-ink-muted' : 'text-navy'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border text-[11px] text-ink-muted flex items-center justify-between">
                  <span>Click checkbox to update execution status.</span>
                  <span className="font-mono text-forest font-semibold">
                    {todaysTasks.filter((t) => t.done).length} / {todaysTasks.length} Completed Today
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Quick Row: Explore & Innovation Profile Callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('explore')}
                className="cursor-pointer border border-border bg-white p-4 hover:border-navy transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Compass className="h-6 w-6 text-navy" />
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy">
                      Explore Open Societal Challenges
                    </h4>
                    <p className="text-xs text-ink-muted">
                      Discover government problems in AI, IoT & Agriculture needing student engineers
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-muted" />
              </div>

              <div
                onClick={() => setActiveTab('achievements')}
                className="cursor-pointer border border-border bg-white p-4 hover:border-navy transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-turmeric-deep" />
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy">
                      My Innovation Profile & Trophies
                    </h4>
                    <p className="text-xs text-ink-muted">
                      3 Projects Completed · 8 Skills Mastered · 3 Industry Recognitions
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-muted" />
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: EXPLORE CHALLENGES (Feature 1)                                */}
        {/* ==================================================================== */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy">
                    Explore Challenges & Societal Problems
                  </h2>
                  <p className="text-xs text-ink-muted">
                    Discover verified citizen challenges routed by state administration and apply to participate
                  </p>
                </div>
                <span className="font-mono text-xs text-forest bg-forest/10 px-2.5 py-1 border border-forest/30 self-start">
                  Open for Student Intake
                </span>
              </div>

              {/* Search & Domain Filters matching prompt: [AI] [IoT] [Agriculture] [Healthcare] */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
                  <input
                    type="text"
                    value={challengeSearch}
                    onChange={(e) => setChallengeSearch(e.target.value)}
                    placeholder="Search challenges by keyword, skills, or university..."
                    className="w-full border border-border bg-paper pl-9 pr-3 py-2 text-xs font-medium text-ink focus:border-navy focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['All', 'AI', 'IoT', 'Agriculture', 'Healthcare'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setChallengeFilter(filter)}
                      className={`px-3 py-1.5 text-xs font-bold transition ${
                        challengeFilter === filter
                          ? 'border border-navy bg-navy text-white'
                          : 'border border-border bg-paper text-ink hover:border-navy'
                      }`}
                    >
                      [{filter}]
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Challenge Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChallenges.map((ch) => {
                const isJoined = ch.status === 'Joined';
                const isRequested = ch.status === 'Request Sent';

                return (
                  <div
                    key={ch.id}
                    className="border-2 border-border bg-white p-5 flex flex-col justify-between hover:border-navy transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <div>
                          <span className="border border-navy/30 bg-navy/5 px-2 py-0.5 text-[10px] font-bold text-navy uppercase">
                            {ch.category}
                          </span>
                          <span className="font-mono text-[10px] text-ink-muted ml-2">{ch.code}</span>
                        </div>
                        <span className="font-mono text-[11px] text-ink-muted font-medium">
                          {ch.estimatedDuration}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-bold text-navy">
                        {ch.title}
                      </h3>

                      <p className="text-xs text-ink-muted leading-relaxed">
                        {ch.description}
                      </p>

                      <div className="space-y-1.5 text-xs pt-1">
                        <div>
                          <span className="font-semibold text-navy">Skills: </span>
                          <span className="font-mono text-[11px] text-ink">
                            {ch.skills.join(' • ')}
                          </span>
                        </div>

                        <div>
                          <span className="font-semibold text-navy">University: </span>
                          <span className="text-ink">{ch.university}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                      <button
                        onClick={() => showToast(`Opening problem specifications for ${ch.title}`)}
                        className="border border-border bg-paper px-3 py-1.5 text-xs font-bold text-navy hover:border-navy"
                      >
                        View
                      </button>

                      {isJoined ? (
                        <span className="border border-forest/40 bg-forest/10 px-3 py-1.5 text-xs font-bold text-forest">
                          ✓ Joined Team
                        </span>
                      ) : isRequested ? (
                        <span className="border border-turmeric bg-turmeric/20 px-3 py-1.5 text-xs font-bold text-turmeric-deep">
                          ⏳ Request Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRequestToJoin(ch.id, ch.title)}
                          className="border border-navy bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-deep transition"
                        >
                          Request to Join
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: MY PROJECTS (Feature 2)                                      */}
        {/* ==================================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">
                  My Assigned Projects
                </h2>
                <p className="text-xs text-ink-muted">
                  Engineering R&D initiatives where you are an active investigator
                </p>
              </div>
              <span className="font-mono text-xs text-navy bg-navy/5 px-2.5 py-1 border border-navy/20 self-start">
                {projects.length} Active Allocations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="border-2 border-navy bg-white p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{proj.icon}</span>
                        <div>
                          <h3 className="font-display text-base font-bold text-navy">
                            {proj.title}
                          </h3>
                          <span className="font-mono text-xs text-ink-muted">{proj.code}</span>
                        </div>
                      </div>
                      <span className="border border-border bg-paper px-2 py-0.5 text-[10px] font-bold text-forest">
                        {proj.category}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-paper p-3 border border-border">
                        <strong className="text-navy block mb-1">Problem Statement:</strong>
                        <p className="text-ink-muted leading-relaxed">{proj.problemStatement}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-ink-muted block text-[11px]">Role</span>
                          <strong className="text-navy">{proj.role}</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted block text-[11px]">Mentor</span>
                          <strong className="text-forest">{proj.mentor}</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted block text-[11px]">Team</span>
                          <strong className="text-ink">{proj.teamSize} Members</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted block text-[11px]">Target Deadline</span>
                          <strong className="text-urgent font-mono">{proj.deadline}</strong>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-ink-muted block text-[11px]">Next Task</span>
                        <strong className="text-turmeric-deep block mt-0.5 font-bold">
                          {proj.nextTask}
                        </strong>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-ink-muted">Progress</span>
                          <span className="font-mono text-navy font-bold">{proj.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-border overflow-hidden">
                          <div
                            className="h-full bg-navy transition-all duration-500"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveTab('team')}
                      className="border border-border bg-paper px-3 py-1.5 text-xs font-bold text-navy hover:border-navy"
                    >
                      Team & Updates
                    </button>
                    <button
                      onClick={() => {
                        setSubmitProject(proj.title);
                        setActiveTab('submit');
                      }}
                      className="border border-navy bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-deep"
                    >
                      Submit Work
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: MY TASKS (Feature 3 - 4 Clear Status Buckets)                 */}
        {/* ==================================================================== */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">
                  My Tasks & Deliverable Action Items
                </h2>
                <p className="text-xs text-ink-muted">
                  Straightforward sprint breakdown across Overdue, In Progress, Completed, and Upcoming
                </p>
              </div>
              <span className="font-mono text-xs text-ink-muted">
                Total: <strong>{tasks.length} Action Items</strong>
              </span>
            </div>

            {/* 4 Prompt Buckets Grid:
                🔴 Overdue: Fix API error
                🟠 In Progress: Build dashboard
                🟢 Completed: Create UI wireframe
                ⚪ Upcoming: Prepare documentation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* BUCKET 1: 🔴 Overdue */}
              <div className="border-2 border-urgent/40 bg-white p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-urgent uppercase tracking-wider">
                      <span>🔴</span>
                      <span>Overdue</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-urgent bg-urgent/10 px-2 py-0.5 rounded-xs">
                      {tasks.filter((t) => t.bucket === 'overdue').length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {tasks
                      .filter((t) => t.bucket === 'overdue')
                      .map((t) => (
                        <div key={t.id} className="border border-border bg-paper p-3 space-y-1.5">
                          <h4 className="font-display text-xs font-bold text-navy">{t.title}</h4>
                          <p className="text-[11px] text-ink-muted line-clamp-2">{t.description}</p>
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="font-mono font-bold text-urgent">Due: {t.dueDate}</span>
                            <button
                              onClick={() => moveTask(t.id, 'in_progress')}
                              className="text-navy font-bold hover:underline"
                            >
                              Start Working →
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* BUCKET 2: 🟠 In Progress */}
              <div className="border-2 border-turmeric bg-white p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-turmeric-deep uppercase tracking-wider">
                      <span>🟠</span>
                      <span>In Progress</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-turmeric-deep bg-turmeric/20 px-2 py-0.5 rounded-xs">
                      {tasks.filter((t) => t.bucket === 'in_progress').length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {tasks
                      .filter((t) => t.bucket === 'in_progress')
                      .map((t) => (
                        <div key={t.id} className="border border-border bg-paper p-3 space-y-1.5">
                          <h4 className="font-display text-xs font-bold text-navy">{t.title}</h4>
                          <p className="text-[11px] text-ink-muted line-clamp-2">{t.description}</p>
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="font-mono text-ink-muted">Due: {t.dueDate}</span>
                            <button
                              onClick={() => moveTask(t.id, 'completed')}
                              className="text-forest font-bold hover:underline"
                            >
                              ✓ Complete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* BUCKET 3: 🟢 Completed */}
              <div className="border-2 border-forest/40 bg-white p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-forest uppercase tracking-wider">
                      <span>🟢</span>
                      <span>Completed</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-xs">
                      {tasks.filter((t) => t.bucket === 'completed').length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {tasks
                      .filter((t) => t.bucket === 'completed')
                      .map((t) => (
                        <div key={t.id} className="border border-border bg-paper p-3 space-y-1.5">
                          <h4 className="font-display text-xs font-bold line-through text-ink-muted">
                            {t.title}
                          </h4>
                          <p className="text-[11px] text-ink-muted line-clamp-2">{t.description}</p>
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="font-mono text-forest">✓ Verified Done</span>
                            <button
                              onClick={() => moveTask(t.id, 'in_progress')}
                              className="text-ink-muted hover:underline"
                            >
                              Reopen
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* BUCKET 4: ⚪ Upcoming */}
              <div className="border-2 border-border bg-white p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-ink-muted uppercase tracking-wider">
                      <span>⚪</span>
                      <span>Upcoming</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-ink-muted bg-paper px-2 py-0.5 rounded-xs border border-border">
                      {tasks.filter((t) => t.bucket === 'upcoming').length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {tasks
                      .filter((t) => t.bucket === 'upcoming')
                      .map((t) => (
                        <div key={t.id} className="border border-border bg-paper p-3 space-y-1.5">
                          <h4 className="font-display text-xs font-bold text-navy">{t.title}</h4>
                          <p className="text-[11px] text-ink-muted line-clamp-2">{t.description}</p>
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="font-mono text-ink-muted">Starts: {t.dueDate}</span>
                            <button
                              onClick={() => moveTask(t.id, 'in_progress')}
                              className="text-navy font-bold hover:underline"
                            >
                              Move to Active →
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: MY TEAM (Feature 5)                                           */}
        {/* ==================================================================== */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">
                  MY TEAM: Smart Water Monitoring
                </h2>
                <p className="text-xs text-ink-muted">
                  Multidisciplinary research squad led by Dr. Sharma
                </p>
              </div>
              <span className="font-mono text-xs text-forest bg-forest/10 px-2.5 py-1 border border-forest/30 self-start">
                JH-PRJ-2026-042
              </span>
            </div>

            {/* Team Roster matching prompt:
                Dr. Sharma (Mentor), Rahul (Backend), Priya (AI), Amit (IoT), Himmat (Frontend) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className={`border-2 p-4 bg-white space-y-2 hover:border-navy transition ${
                    member.isMentor ? 'border-navy bg-paper/60' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{member.avatar}</span>
                    {member.isMentor && (
                      <span className="text-[9px] font-bold uppercase bg-navy text-white px-1.5 py-0.5 rounded-xs">
                        Lead
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy">{member.name}</h4>
                    <span className="text-xs font-semibold text-turmeric-deep block mt-0.5">
                      {member.role}
                    </span>
                    <span className="text-[10px] text-ink-muted block mt-1">{member.dept}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Project Comments / Update System */}
            <div className="border border-border bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-navy" />
                  <h3 className="font-display text-base font-bold text-navy">
                    Team Updates & Sprint Notes
                  </h3>
                </div>
                <span className="text-xs text-ink-muted font-mono">{comments.length} Messages</span>
              </div>

              {/* Discussion Stream */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {comments.map((com) => (
                  <div key={com.id} className="border border-border bg-paper p-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span>{com.avatar}</span>
                        <strong className="text-navy">{com.author}</strong>
                        <span className="text-ink-muted font-mono text-[10px]">({com.role})</span>
                      </div>
                      <span className="text-[10px] text-ink-muted font-mono">{com.timestamp}</span>
                    </div>
                    <p className="text-xs text-ink leading-relaxed pt-1">{com.message}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handlePostComment} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share a sprint update, commit hash, or query with your team..."
                  className="flex-1 border border-border bg-paper px-3 py-2 text-xs text-ink focus:border-navy focus:bg-white"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 border border-navy bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-deep"
                >
                  <Send className="h-3.5 w-3.5" />
                  Post
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: SUBMIT WORK (Feature 4)                                       */}
        {/* ==================================================================== */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5">
              <h2 className="font-display text-lg font-bold text-navy">
                Submit Deliverable
              </h2>
              <p className="text-xs text-ink-muted">
                Submit code archives, research reports, CAD models, or test data for Professor Sharma's review
              </p>
            </div>

            {/* Submit Deliverable Form (Exact Prompt Fields) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border-2 border-navy bg-white p-6 space-y-4 shadow-sm">
                <form onSubmit={handleSubmitDeliverable} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-navy mb-1">Project *</label>
                    <select
                      value={submitProject}
                      onChange={(e) => setSubmitProject(e.target.value)}
                      className="w-full border border-border bg-paper p-2.5 text-xs font-medium text-navy"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title} ({p.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-navy mb-1">Type *</label>
                      <select
                        value={submitType}
                        onChange={(e) => setSubmitType(e.target.value as any)}
                        className="w-full border border-border bg-paper p-2.5 text-xs font-medium"
                      >
                        <option value="Prototype">Prototype ▼</option>
                        <option value="Technical Report">Technical Report</option>
                        <option value="Code Repository">Code Repository</option>
                        <option value="Dataset">Dataset</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-navy mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={submitTitle}
                        onChange={(e) => setSubmitTitle(e.target.value)}
                        placeholder="e.g. Water Dashboard v1"
                        className="w-full border border-border bg-paper p-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-navy mb-1">Upload Archive / Document *</label>
                    <div className="border-2 border-dashed border-border bg-paper p-4 text-center space-y-2">
                      <Paperclip className="h-6 w-6 text-navy mx-auto" />
                      <p className="font-mono text-xs font-bold text-navy">
                        📎 {submitFileName}
                      </p>
                      <span className="text-[10px] text-ink-muted block">
                        Drag and drop or select deliverable archive (.zip, .pdf, .tar.gz, max 50MB)
                      </span>
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setSubmitFileName(e.target.files[0].name);
                          }
                        }}
                        className="text-[11px] text-ink-muted file:border file:border-border file:bg-white file:px-2.5 file:py-1 file:text-xs file:font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-navy mb-1">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={submitDesc}
                      onChange={(e) => setSubmitDesc(e.target.value)}
                      placeholder="e.g. Implemented monitoring dashboard."
                      className="w-full border border-border bg-paper p-2.5 text-xs font-medium"
                    />
                  </div>

                  {/* RICH PROOF OF WORK & FIELD EVIDENCE (OPTIONAL) */}
                  <div className="border border-navy/20 bg-paper/50 p-4 space-y-3.5 rounded-[2px]">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-forest" />
                          <span className="font-bold text-navy text-xs uppercase tracking-wider">
                            Verified Proof of Work & Field Evidence
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted mt-0.5">
                          Attach live links, code repositories, or GPS-tagged field photos to maximize evaluation scores.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-forest/10 text-forest px-2 py-0.5 border border-forest/20">
                        Optional / ऐच्छिक
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Live Demo URL */}
                      <div>
                        <label className="block text-ink-muted text-[11px] font-semibold mb-1 flex items-center gap-1">
                          <Globe className="h-3 w-3 text-navy" />
                          <span>Live Deployment / Demo URL (Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={submitDemoUrl}
                          onChange={(e) => setSubmitDemoUrl(e.target.value)}
                          placeholder="https://my-prototype.vercel.app"
                          className="w-full border border-border bg-white p-2 text-xs font-mono text-ink placeholder:text-ink-muted/50"
                        />
                      </div>

                      {/* GitHub Repo URL */}
                      <div>
                        <label className="block text-ink-muted text-[11px] font-semibold mb-1 flex items-center gap-1">
                          <Code2 className="h-3 w-3 text-navy" />
                          <span>GitHub / GitLab Repository (Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={submitGithubUrl}
                          onChange={(e) => setSubmitGithubUrl(e.target.value)}
                          placeholder="https://github.com/username/project-repo"
                          className="w-full border border-border bg-white p-2 text-xs font-mono text-ink placeholder:text-ink-muted/50"
                        />
                      </div>

                      {/* Video Walkthrough URL */}
                      <div>
                        <label className="block text-ink-muted text-[11px] font-semibold mb-1 flex items-center gap-1">
                          <Video className="h-3 w-3 text-navy" />
                          <span>Prototype Video Walkthrough (Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={submitVideoUrl}
                          onChange={(e) => setSubmitVideoUrl(e.target.value)}
                          placeholder="https://loom.com/share/... or YouTube link"
                          className="w-full border border-border bg-white p-2 text-xs font-mono text-ink placeholder:text-ink-muted/50"
                        />
                      </div>

                      {/* GPS Coordinates & Auto Detect */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-ink-muted text-[11px] font-semibold flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-navy" />
                            <span>GPS Coordinates (Optional)</span>
                          </label>
                          <div className="flex items-center gap-2">
                            {submitPhotoGps && (
                              <button
                                type="button"
                                onClick={() => setSubmitPhotoGps('')}
                                className="text-[10px] font-bold text-urgent hover:underline"
                                title="Clear GPS coordinates"
                              >
                                Clear
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={handleDetectGps}
                              disabled={gpsDetecting}
                              className="text-[10px] font-bold text-forest hover:underline flex items-center gap-1"
                            >
                              <span>{gpsDetecting ? 'Detecting...' : '📍 Auto-Detect GPS'}</span>
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={submitPhotoGps}
                          onChange={(e) => setSubmitPhotoGps(e.target.value)}
                          placeholder="e.g. 23.3441° N, 85.3096° E (Birla Chowk)"
                          className="w-full border border-border bg-white p-2 text-xs font-mono text-ink placeholder:text-ink-muted/50"
                        />
                      </div>
                    </div>

                    {/* Field Survey Photo & Caption */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/60">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-ink-muted text-[11px] font-semibold flex items-center gap-1">
                            <Camera className="h-3 w-3 text-navy" />
                            <span>Field Survey Photos (Optional)</span>
                          </label>
                          {submitPhotoNames.length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleCancelPhoto()}
                              className="text-[10px] font-bold text-urgent hover:underline flex items-center gap-0.5"
                              title="Clear all attached photos"
                            >
                              <X className="h-3 w-3" />
                              <span>Clear All ({submitPhotoNames.length})</span>
                            </button>
                          )}
                        </div>

                        <input
                          ref={photoInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoFilesSelected}
                          className="hidden"
                        />

                        {submitPhotoNames.length === 0 ? (
                          <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            className="w-full border border-dashed border-navy/30 bg-white hover:bg-forest/5 hover:border-forest p-3 text-center transition group flex flex-col items-center justify-center gap-1 cursor-pointer rounded-[2px]"
                          >
                            <div className="flex items-center gap-1.5 text-navy group-hover:text-forest transition">
                              <Camera className="h-4 w-4" />
                              <span className="text-xs font-semibold">Attach Survey Photos</span>
                            </div>
                            <span className="text-[10px] text-ink-muted">
                              Select one or multiple images (PNG, JPG, JPEG)
                            </span>
                          </button>
                        ) : (
                          <div className="space-y-1.5 bg-white border border-border p-2 rounded-[2px]">
                            <div className="flex items-center justify-between pb-1 border-b border-border/60">
                              <span className="text-[11px] font-bold text-forest flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>{submitPhotoNames.length} Photo{submitPhotoNames.length > 1 ? 's' : ''} Attached</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => photoInputRef.current?.click()}
                                className="text-[10px] font-bold text-navy hover:text-forest flex items-center gap-0.5 hover:underline"
                              >
                                <span>+ Add More</span>
                              </button>
                            </div>

                            <div className="max-h-28 overflow-y-auto space-y-1 pr-0.5">
                              {submitPhotoNames.map((name, idx) => (
                                <div
                                  key={`${name}-${idx}`}
                                  className="flex items-center justify-between bg-paper px-2 py-1 text-xs border border-border/70 hover:border-navy/40 transition rounded-[2px]"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                                    <Camera className="h-3 w-3 text-forest flex-shrink-0" />
                                    <span className="font-mono text-[11px] text-navy truncate" title={name}>
                                      {name}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCancelPhoto(idx)}
                                    className="text-ink-muted hover:text-urgent p-0.5 transition flex-shrink-0"
                                    title="Remove this photo"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-ink-muted text-[11px] font-semibold mb-1">
                          Field Observation Notes / Caption (Optional)
                        </label>
                        <input
                          type="text"
                          value={submitPhotoCaption}
                          onChange={(e) => setSubmitPhotoCaption(e.target.value)}
                          placeholder="e.g. Broken borewell pump discharge with fluoride sediment"
                          className="w-full border border-border bg-white p-2 text-xs text-ink placeholder:text-ink-muted/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-border">
                    <span className="text-[11px] text-forest font-semibold">
                      ✓ Professor Dr. Sharma will receive an instant review notification.
                    </span>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 border border-navy bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy-deep"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      [Submit Deliverable]
                    </button>
                  </div>
                </form>
              </div>

              {/* Past Deliverables Queue */}
              <div className="border border-border bg-white p-5 space-y-3">
                <h3 className="font-display text-sm font-bold text-navy border-b border-border pb-2">
                  My Submission History
                </h3>
                <div className="space-y-3">
                  {deliverables.map((del) => (
                    <div key={del.id} className="border border-border bg-paper p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-navy">{del.type}</span>
                        <span
                          className={`px-1.5 py-0.2 text-[10px] font-bold rounded-xs ${
                            del.status === 'Approved'
                              ? 'bg-forest/10 text-forest'
                              : 'bg-turmeric/20 text-turmeric-deep'
                          }`}
                        >
                          {del.status}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-navy">{del.title}</h4>
                      <p className="text-[11px] text-ink-muted">{del.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-ink-muted pt-1 border-t border-border">
                        <span className="font-mono">📎 {del.fileName}</span>
                        <span>{del.submittedAt}</span>
                      </div>

                      {/* Proof of Work Badges & Links */}
                      {del.proofOfWork && (
                        <div className="mt-2 pt-2 border-t border-border/80 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-navy flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-forest" />
                            <span>Proof of Work:</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {del.proofOfWork.liveDemoUrl && (
                              <a
                                href={del.proofOfWork.liveDemoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 bg-white border border-navy/30 px-2 py-0.5 text-[10px] font-bold text-navy hover:bg-navy hover:text-white transition rounded-[2px]"
                              >
                                <Globe className="h-3 w-3 text-forest" />
                                <span>Live Demo</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                              </a>
                            )}
                            {del.proofOfWork.githubRepoUrl && (
                              <a
                                href={del.proofOfWork.githubRepoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 bg-white border border-navy/30 px-2 py-0.5 text-[10px] font-bold text-navy hover:bg-navy hover:text-white transition rounded-[2px]"
                              >
                                <Code2 className="h-3 w-3" />
                                <span>GitHub</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                              </a>
                            )}
                            {del.proofOfWork.videoWalkthroughUrl && (
                              <a
                                href={del.proofOfWork.videoWalkthroughUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 bg-white border border-navy/30 px-2 py-0.5 text-[10px] font-bold text-navy hover:bg-navy hover:text-white transition rounded-[2px]"
                              >
                                <Video className="h-3 w-3 text-urgent" />
                                <span>Video Demo</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                              </a>
                            )}
                            {(del.proofOfWork.gpsCoordinates ||
                              del.proofOfWork.fieldPhotoName ||
                              (del.proofOfWork.fieldPhotoNames && del.proofOfWork.fieldPhotoNames.length > 0)) && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedProofOfWork({
                                    title: del.title,
                                    pow: del.proofOfWork!,
                                  })
                                }
                                className="inline-flex items-center gap-1 bg-forest/10 border border-forest/30 px-2 py-0.5 text-[10px] font-bold text-forest hover:bg-forest hover:text-white transition rounded-[2px]"
                              >
                                <MapPin className="h-3 w-3" />
                                <span>
                                  Field Evidence
                                  {del.proofOfWork.fieldPhotoNames && del.proofOfWork.fieldPhotoNames.length > 1
                                    ? ` (${del.proofOfWork.fieldPhotoNames.length})`
                                    : ''}
                                </span>
                                <Eye className="h-2.5 w-2.5 opacity-70" />
                              </button>
                            )}
                          </div>
                          {del.proofOfWork.gpsCoordinates && (
                            <div className="font-mono text-[10px] text-ink-muted flex items-center gap-1">
                              <span>📍 GPS:</span>
                              <strong className="text-navy">{del.proofOfWork.gpsCoordinates}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {del.mentorFeedback && (
                        <div className="mt-1 border-l-2 border-forest pl-2 text-[10px] text-forest font-medium">
                          {del.mentorFeedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 7: MESSAGES / TEAM CHAT                                          */}
        {/* ==================================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">
                  Project Communications & Mentor Q&A
                </h2>
                <p className="text-xs text-ink-muted">
                  Direct discussions with Dr. Rajesh Sharma and peer student developers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-forest bg-forest/10 px-2.5 py-1 border border-forest/30">
                  <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
                  Synced with Mentor Workspace
                </span>
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    showToast('Project discussion thread reset to defaults.');
                  }}
                  className="text-[11px] font-bold text-ink-muted hover:text-urgent hover:underline"
                  title="Reset discussion thread to default messages"
                >
                  Reset Thread
                </button>
              </div>
            </div>

            <div className="border border-border bg-white p-5 space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.map((c) => {
                  const isMentor = c.isMentor || c.author.toLowerCase().includes('sharma') || c.role.toLowerCase().includes('mentor');
                  const isHimmat = c.author.toLowerCase().includes('himmat');
                  return (
                    <div
                      key={c.id}
                      className={`border p-4 space-y-1 transition ${
                        isMentor
                          ? 'border-turmeric/50 bg-turmeric/5'
                          : isHimmat
                          ? 'border-navy/30 bg-white'
                          : 'border-border bg-paper'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>{c.avatar}</span>
                          <strong className="text-navy">{c.author}</strong>
                          <span className="text-[10px] text-ink-muted font-mono">({c.role})</span>
                          {isMentor && (
                            <span className="text-[9px] bg-turmeric/20 text-ink border border-turmeric/40 px-1.5 py-0.2 rounded-[2px] font-bold uppercase">
                              Faculty Guide
                            </span>
                          )}
                          {isHimmat && (
                            <span className="text-[9px] bg-navy/10 text-navy border border-navy/20 px-1.5 py-0.2 rounded-[2px] font-bold uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-ink-muted font-mono">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-ink mt-1 leading-relaxed">{c.message}</p>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2 pt-2 border-t border-border">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Message Dr. Sharma or project team..."
                  className="flex-1 border border-border bg-paper px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="border border-navy bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-deep"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 8: ACHIEVEMENTS & INNOVATION PROFILE (Feature 6)                 */}
        {/* ==================================================================== */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5">
              <h2 className="font-display text-lg font-bold text-navy">
                My Innovation Profile
              </h2>
              <p className="text-xs text-ink-muted">
                Verified university credentials, real-world community impact, and technical skill meters
              </p>
            </div>

            {/* Prompt Requirement Stats:
                Projects Completed: 3, Problems Solved: 2, Industry Collaborations: 2, Prototypes Built: 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-border bg-white p-4 text-center">
                <span className="text-xs uppercase text-ink-muted block font-semibold">Projects Completed</span>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">{achievements.projectsCompleted}</p>
                <span className="text-[10px] text-forest block mt-1">Verified Delivery</span>
              </div>

              <div className="border border-border bg-white p-4 text-center">
                <span className="text-xs uppercase text-ink-muted block font-semibold">Problems Solved</span>
                <p className="mt-2 font-mono text-3xl font-bold text-forest">{achievements.problemsSolved}</p>
                <span className="text-[10px] text-forest block mt-1">Ground Grievances</span>
              </div>

              <div className="border border-border bg-white p-4 text-center">
                <span className="text-xs uppercase text-ink-muted block font-semibold">Industry Collaborations</span>
                <p className="mt-2 font-mono text-3xl font-bold text-turmeric-deep">
                  {achievements.industryCollaborations}
                </p>
                <span className="text-[10px] text-turmeric-deep block mt-1">Tata Steel & MECON</span>
              </div>

              <div className="border border-border bg-white p-4 text-center">
                <span className="text-xs uppercase text-ink-muted block font-semibold">Prototypes Built</span>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">{achievements.prototypesBuilt}</p>
                <span className="text-[10px] text-ink-muted block mt-1">Hardware & Software</span>
              </div>
            </div>

            {/* Skills Progress Meters (Prompt specified: React, AI, IoT, Research) */}
            <div className="border border-border bg-white p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-navy border-b border-border pb-2">
                Technical Skills & Verified Proficiencies
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {achievements.skills.map((sk) => (
                  <div key={sk.name} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-navy">{sk.name}</span>
                      <span className="font-mono text-ink-muted">{sk.level}% ({sk.label})</span>
                    </div>
                    <div className="h-2 w-full bg-border overflow-hidden">
                      <div
                        className="h-full bg-navy transition-all duration-700"
                        style={{ width: `${sk.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trophies & Recognitions */}
            <div className="border border-border bg-white p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-navy border-b border-border pb-2">
                Innovation Badges & State Honors
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {achievements.trophies.map((trp) => (
                  <div key={trp.id} className="border border-border bg-paper p-4 space-y-2 text-center">
                    <span className="text-4xl block mx-auto">{trp.icon}</span>
                    <h4 className="font-display text-sm font-bold text-navy">{trp.title}</h4>
                    <p className="text-[11px] text-ink-muted">{trp.desc}</p>
                    <span className="font-mono text-[10px] text-forest font-semibold block pt-1">
                      Awarded: {trp.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 9: STUDENT PROFILE                                               */}
        {/* ==================================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-5xl">{profile.avatarIcon}</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">
                    {profile.name}
                  </h2>
                  <p className="text-xs font-semibold text-turmeric-deep">
                    {profile.degree} · Roll No: {profile.rollNo}
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {profile.dept}, {profile.institution}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border text-xs">
                <div className="border border-border bg-paper p-3">
                  <span className="text-ink-muted block text-[11px]">Academic Standing</span>
                  <strong className="text-navy">CGPA: {profile.cgpa} / 10.0</strong>
                  <span className="block mt-1 text-[11px] text-ink">{profile.year}</span>
                </div>
                <div className="border border-border bg-paper p-3">
                  <span className="text-ink-muted block text-[11px]">Institutional Email</span>
                  <strong className="text-navy font-mono">{profile.email}</strong>
                  <span className="block mt-1 text-[11px] text-forest font-medium">State SSO Verified</span>
                </div>
                <div className="border border-border bg-paper p-3">
                  <span className="text-ink-muted block text-[11px]">Active Engagements</span>
                  <strong className="text-navy">{profile.stats.myProjects} Live Research Projects</strong>
                  <span className="block mt-1 text-[11px] text-ink">Lead Frontend Investigator</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Evidence Lightbox Modal */}
      {selectedProofOfWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border-2 border-navy p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-forest" />
                <h3 className="font-display text-sm font-bold text-navy">
                  Field Evidence Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedProofOfWork(null)}
                className="text-xs font-bold text-ink-muted hover:text-navy"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-muted block">Deliverable</span>
                <strong className="text-navy">{selectedProofOfWork.title}</strong>
              </div>

              {/* Photo representation */}
              <div className="border border-border bg-paper p-3 text-center space-y-2">
                {selectedProofOfWork.pow.fieldPhotoNames && selectedProofOfWork.pow.fieldPhotoNames.length > 1 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-navy px-1">
                      <span>Attached Field Evidence ({selectedProofOfWork.pow.fieldPhotoNames.length} Photos)</span>
                      <span className="text-[10px] text-forest font-mono">Geo-Tagged Field Verification</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {selectedProofOfWork.pow.fieldPhotoNames.map((photoName, pIdx) => (
                        <div key={pIdx} className="h-24 bg-navy/10 border border-navy/20 flex flex-col items-center justify-center p-2 text-ink-muted rounded-[2px]">
                          <Camera className="h-5 w-5 text-forest mb-1" />
                          <span className="font-mono text-[10px] font-bold text-navy truncate max-w-full px-1" title={photoName}>
                            {photoName}
                          </span>
                          <span className="text-[9px] text-ink-muted">Evidence Frame #{pIdx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-navy/10 border border-navy/20 flex flex-col items-center justify-center text-ink-muted rounded-[2px]">
                    <Camera className="h-8 w-8 text-forest mb-1" />
                    <span className="font-mono text-xs font-bold text-navy truncate max-w-full px-3">
                      {selectedProofOfWork.pow.fieldPhotoName ||
                        (selectedProofOfWork.pow.fieldPhotoNames && selectedProofOfWork.pow.fieldPhotoNames[0]) ||
                        'ground_survey_evidence.jpg'}
                    </span>
                    <span className="text-[10px] text-ink-muted">Geo-Tagged Field Verification Capture</span>
                  </div>
                )}
                {selectedProofOfWork.pow.photoCaption && (
                  <p className="text-left text-xs italic text-ink bg-white p-2.5 border border-border">
                    "{selectedProofOfWork.pow.photoCaption}"
                  </p>
                )}
              </div>

              {selectedProofOfWork.pow.gpsCoordinates && (
                <div className="p-2.5 bg-forest/10 border border-forest/30 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-forest font-bold">📍 Coordinates:</span>
                  <strong className="text-navy">{selectedProofOfWork.pow.gpsCoordinates}</strong>
                </div>
              )}

              <div className="pt-2 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedProofOfWork(null)}
                  className="px-4 py-1.5 bg-navy text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
