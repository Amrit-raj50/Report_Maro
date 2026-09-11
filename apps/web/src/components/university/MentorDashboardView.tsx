import React, { useState } from 'react';
import {
  INITIAL_MENTOR_PROJECTS,
  INITIAL_STUDENT_TEAM,
  INITIAL_MENTOR_TASKS,
  INITIAL_MENTOR_SUBMISSIONS,
  INITIAL_PROJECT_TIMELINE,
  INITIAL_INDUSTRY_MESSAGES,
  MENTOR_DOCUMENTS,
  MentorProject,
  MentorStudent,
  MentorTask,
  MentorSubmission,
  MentorMilestone,
  IndustryMessage,
  EvaluationRubric,
  EvaluationReceipt,
  calculateGradeBand,
} from './mentorData.js';
import { MentorEvaluationReceiptModal } from './MentorEvaluationReceiptModal.js';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  FileText,
  Building2,
  Bell,
  ArrowLeft,
  Plus,
  Send,
  Download,
  Eye,
  Check,
  RotateCcw,
  UserPlus,
  Shield,
  ChevronRight,
  Award,
  MessageSquare,
} from 'lucide-react';
import { useProjectMessages } from '../../utils/projectMessaging.js';

export type MentorNavTab =
  | 'dashboard'
  | 'projects'
  | 'students'
  | 'tasks'
  | 'milestones'
  | 'reviews'
  | 'documents'
  | 'industry'
  | 'messages'
  | 'notifications'
  | 'profile';

interface MentorDashboardViewProps {
  onReturnToUniversity?: () => void;
  onSwitchToStudent?: () => void;
  initialTab?: MentorNavTab;
}

export const MentorDashboardView: React.FC<MentorDashboardViewProps> = ({
  onReturnToUniversity,
  onSwitchToStudent,
  initialTab = 'dashboard',
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<MentorNavTab>(initialTab);

  // Core Data States
  const [projects] = useState<MentorProject[]>(INITIAL_MENTOR_PROJECTS);
  const [students, setStudents] = useState<MentorStudent[]>(INITIAL_STUDENT_TEAM);
  const [tasks, setTasks] = useState<MentorTask[]>(INITIAL_MENTOR_TASKS);
  const [submissions, setSubmissions] = useState<MentorSubmission[]>(INITIAL_MENTOR_SUBMISSIONS);
  const [milestones, setMilestones] = useState<MentorMilestone[]>(INITIAL_PROJECT_TIMELINE);
  const [messages, setMessages] = useState<IndustryMessage[]>(INITIAL_INDUSTRY_MESSAGES);
  const [documents] = useState(MENTOR_DOCUMENTS);

  // Filter States
  const [taskFilter, setTaskFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Due' | 'Overdue'>('All');
  const [projectFilter, setProjectFilter] = useState<string>('All');

  // Modals & Drawers
  const [selectedSubmission, setSelectedSubmission] = useState<MentorSubmission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rubricFeasibility, setRubricFeasibility] = useState<number>(4);
  const [rubricCivicImpact, setRubricCivicImpact] = useState<number>(5);
  const [rubricCodeQuality, setRubricCodeQuality] = useState<number>(4);
  const [rubricFieldData, setRubricFieldData] = useState<number>(4);
  const [viewingReceipt, setViewingReceipt] = useState<EvaluationReceipt | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudentRole, setEditingStudentRole] = useState<MentorStudent | null>(null);
  const [newRoleText, setNewRoleText] = useState('');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(students[0]?.name || 'Rahul');
  const [newTaskDueDate, setNewTaskDueDate] = useState('18 Sept 2026');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Critical'>('High');
  const [newTaskProject, setNewTaskProject] = useState('Smart Water Monitoring');

  // New Student Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRole, setNewStudentRole] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('Computer Science & Engg');
  const [newStudentRoll, setNewStudentRoll] = useState('24CS099');

  // New Industry Message Form
  const [newChatMessage, setNewChatMessage] = useState('');

  // Shared Project Messages (with Student Portal)
  const {
    messages: projectMessages,
    sendMessage: sendProjectMessage,
    resetMessages: resetProjectMessages,
  } = useProjectMessages();
  const [mentorStudentReply, setMentorStudentReply] = useState('');
  const [messageProjectFilter, setMessageProjectFilter] = useState<string>('All');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendStudentReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorStudentReply.trim()) return;

    sendProjectMessage({
      author: 'Dr. Rajesh Sharma',
      role: 'Faculty Mentor / PI',
      avatar: '👨‍🏫',
      message: mentorStudentReply.trim(),
      isMentor: true,
      projectId: messageProjectFilter === 'All' ? 'Smart Water Monitoring' : messageProjectFilter,
      projectName: messageProjectFilter === 'All' ? 'Smart Water Monitoring (Namkum Block)' : messageProjectFilter,
    });

    setMentorStudentReply('');
    showToast('Reply dispatched to student research team!');
  };

  // Derived Counts
  const pendingReviewsCount = submissions.filter((s) => s.status === 'pending').length;
  const overdueTasksCount = tasks.filter((t) => t.status === 'Overdue').length;
  const totalStudentsCount = students.length;
  const totalProjectsCount = projects.length;

  // Handlers for Tasks
  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus =
            t.status === 'Completed'
              ? 'In Progress'
              : t.status === 'In Progress'
              ? 'Completed'
              : t.status === 'Due'
              ? 'In Progress'
              : 'In Progress';
          showToast(`Task "${t.title}" status updated to: ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const matchedStudent = students.find((s) => s.name === newTaskAssignee);
    const newTask: MentorTask = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle,
      projectTitle: newTaskProject,
      projectCode:
        projects.find((p) => p.title === newTaskProject)?.code || 'JH-PRJ-2026-042',
      assigneeName: newTaskAssignee,
      assigneeRole: matchedStudent ? matchedStudent.role : 'Student Investigator',
      status: 'Due',
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      description: 'Assigned via Faculty Mentor Dashboard Workspace.',
    };

    setTasks([newTask, ...tasks]);
    if (matchedStudent) {
      setStudents((prev) =>
        prev.map((s) => (s.id === matchedStudent.id ? { ...s, tasksAssigned: s.tasksAssigned + 1 } : s))
      );
    }
    setShowAddTaskModal(false);
    setNewTaskTitle('');
    showToast(`New task assigned to ${newTaskAssignee}: "${newTask.title}"`);
  };

  // Handlers for Review & Approvals
  const handleOpenGradingModal = (sub: MentorSubmission) => {
    setSelectedSubmission(sub);
    if (sub.rubric) {
      setRubricFeasibility(sub.rubric.technicalFeasibility);
      setRubricCivicImpact(sub.rubric.civicImpact);
      setRubricCodeQuality(sub.rubric.codePrototypeQuality);
      setRubricFieldData(sub.rubric.fieldTestingData);
    } else {
      setRubricFeasibility(4);
      setRubricCivicImpact(5);
      setRubricCodeQuality(4);
      setRubricFieldData(4);
    }
    setFeedbackText(sub.professorFeedback || '');
  };

  const handleApproveSubmission = (submissionId: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const totalScore = rubricFeasibility + rubricCivicImpact + rubricCodeQuality + rubricFieldData;
    const scorePercentage = Math.round((totalScore / 20) * 100);
    const { gradeBand: finalGrade } = calculateGradeBand(totalScore);

    const nowStr =
      new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const rubricData: EvaluationRubric = {
      technicalFeasibility: rubricFeasibility,
      civicImpact: rubricCivicImpact,
      codePrototypeQuality: rubricCodeQuality,
      fieldTestingData: rubricFieldData,
      totalScore,
      scorePercentage,
      gradeBand: finalGrade,
      evaluatedAt: nowStr,
      evaluatorName: 'Dr. Rajesh Sharma',
      receiptNumber: `JH-MTR-EV-2026-0${sub.submissionNumber}`,
    };

    const receiptData: EvaluationReceipt = {
      receiptId: `JH-MTR-EV-2026-0${sub.submissionNumber}`,
      submissionId: sub.id,
      submissionNumber: sub.submissionNumber,
      studentName: sub.studentName,
      studentRole: sub.studentRole,
      projectTitle: sub.projectTitle,
      deliverableTitle: sub.deliverableTitle,
      evaluatedAt: nowStr,
      evaluatorName: 'Dr. Rajesh Sharma',
      evaluatorTitle: 'Professor & Dean (R&D)',
      evaluatorDept: 'Dept. of Environmental Science & Engg',
      institutionName: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
      rubric: rubricData,
      decision: 'approved',
      feedbackText:
        feedbackText ||
        'Approved with commendation. Demonstrates rigorous field testing and alignment with state civic priorities.',
      verificationHash: 'SHA-256: 7f8a91c2e45b08d2' + sub.submissionNumber + 'a9e4c107',
    };

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'approved',
              professorFeedback: receiptData.feedbackText,
              grade: finalGrade,
              rubric: rubricData,
              evaluationReceipt: receiptData,
            }
          : s
      )
    );

    showToast(`Submission #${sub.submissionNumber} approved! Official Receipt #${receiptData.receiptId} generated.`);
    setSelectedSubmission(null);
    setViewingReceipt(receiptData);
  };

  const handleRequestChanges = (submissionId: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const totalScore = rubricFeasibility + rubricCivicImpact + rubricCodeQuality + rubricFieldData;
    const scorePercentage = Math.round((totalScore / 20) * 100);
    const { gradeBand: finalGrade } = calculateGradeBand(totalScore);

    const nowStr =
      new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const rubricData: EvaluationRubric = {
      technicalFeasibility: rubricFeasibility,
      civicImpact: rubricCivicImpact,
      codePrototypeQuality: rubricCodeQuality,
      fieldTestingData: rubricFieldData,
      totalScore,
      scorePercentage,
      gradeBand: finalGrade,
      evaluatedAt: nowStr,
      evaluatorName: 'Dr. Rajesh Sharma',
      receiptNumber: `JH-MTR-EV-2026-0${sub.submissionNumber}`,
    };

    const receiptData: EvaluationReceipt = {
      receiptId: `JH-MTR-EV-2026-0${sub.submissionNumber}`,
      submissionId: sub.id,
      submissionNumber: sub.submissionNumber,
      studentName: sub.studentName,
      studentRole: sub.studentRole,
      projectTitle: sub.projectTitle,
      deliverableTitle: sub.deliverableTitle,
      evaluatedAt: nowStr,
      evaluatorName: 'Dr. Rajesh Sharma',
      evaluatorTitle: 'Professor & Dean (R&D)',
      evaluatorDept: 'Dept. of Environmental Science & Engg',
      institutionName: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
      rubric: rubricData,
      decision: 'changes_requested',
      feedbackText:
        feedbackText ||
        'Revisions requested: Please append cross-calibration sensor data curves and re-submit by tomorrow.',
      verificationHash: 'SHA-256: 3c1b82e9f014a5d7' + sub.submissionNumber + 'f6a2b801',
    };

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'changes_requested',
              professorFeedback: receiptData.feedbackText,
              grade: 'Needs Revision (' + finalGrade + ')',
              rubric: rubricData,
              evaluationReceipt: receiptData,
            }
          : s
      )
    );

    showToast(`Changes requested for submission #${sub.submissionNumber}. Official Rubric logged.`);
    setSelectedSubmission(null);
    setViewingReceipt(receiptData);
  };

  // Handlers for Student Team
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentRole.trim()) return;

    const newSt: MentorStudent = {
      id: `st-${Date.now()}`,
      name: newStudentName,
      role: newStudentRole,
      dept: newStudentDept,
      rollNo: newStudentRoll,
      projectTitle: 'Smart Water Monitoring',
      tasksAssigned: 1,
      tasksCompleted: 0,
      avatarIcon: '👨‍🎓',
      status: 'Active',
      email: `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@nitjsr.ac.in`,
    };

    setStudents([...students, newSt]);
    setShowAddStudentModal(false);
    setNewStudentName('');
    setNewStudentRole('');
    showToast(`Student ${newSt.name} added to Smart Water Monitoring team as ${newSt.role}!`);
  };

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName} from the project team?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      showToast(`Removed ${studentName} from the project team.`);
    }
  };

  const handleUpdateStudentRole = (studentId: string) => {
    if (!newRoleText.trim()) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, role: newRoleText.trim() } : s))
    );
    setEditingStudentRole(null);
    setNewRoleText('');
    showToast('Student role updated successfully.');
  };

  // Handlers for Milestones
  const handleToggleMilestone = (milestoneId: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          const nextStatus = m.status === 'completed' ? 'current' : m.status === 'current' ? 'completed' : 'current';
          const nextSymbol = nextStatus === 'completed' ? '✓' : nextStatus === 'current' ? '◉' : '○';
          showToast(`Milestone stage "${m.name}" updated to: ${nextStatus.toUpperCase()}`);
          return { ...m, status: nextStatus, symbol: nextSymbol };
        }
        return m;
      })
    );
  };

  // Handlers for Industry Messaging
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const newMsg: IndustryMessage = {
      id: `msg-${Date.now()}`,
      sender: 'mentor',
      senderName: 'Dr. Rajesh Sharma',
      role: 'Faculty Mentor / Dean R&D',
      company: 'NIT Jamshedpur',
      message: newChatMessage.trim(),
      timestamp: 'Just now',
    };

    setMessages([...messages, newMsg]);
    setNewChatMessage('');
    showToast('Message sent to ABC Technologies / Rahul Mehta.');
  };

  // Filtered Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesFilter = taskFilter === 'All' ? true : t.status === taskFilter;
    const matchesProject = projectFilter === 'All' ? true : t.projectTitle === projectFilter;
    return matchesFilter && matchesProject;
  });

  return (
    <div className="min-h-screen bg-paper text-ink pb-16">
      {/* ==================================================================== */}
      {/* TOAST NOTIFICATION                                                   */}
      {/* ==================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 border-2 border-navy bg-navy px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-turmeric" />
          {toastMessage}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOP INSTITUTIONAL BAR: Switch to Central Admin & Mentor Identity     */}
      {/* ==================================================================== */}
      <header className="border-b border-border bg-white sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {onReturnToUniversity && (
              <button
                onClick={onReturnToUniversity}
                className="flex items-center gap-1.5 border border-border bg-paper px-3 py-1.5 text-xs font-bold text-navy hover:border-navy transition"
                title="Return to University Central Administration"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Central Admin</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Mentor">👨‍🏫</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-base font-bold text-navy">
                    Dr. Sharma
                  </h1>
                  <span className="border border-forest/30 bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest uppercase tracking-wider">
                    Faculty Mentor
                  </span>
                  <span className="hidden md:inline-block font-mono text-[11px] text-ink-muted">
                    NIT Jamshedpur · Environmental & IoT Research Lab
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted">
                  Guide students → assign tasks → review work → manage milestones → communicate with industry
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onSwitchToStudent && (
              <button
                onClick={onSwitchToStudent}
                className="hidden md:flex items-center gap-1.5 border border-navy bg-white px-2.5 py-1.5 text-xs font-bold text-navy hover:bg-paper transition"
                title="Switch to Himmat's Student Workspace"
              >
                <span>👨‍🎓 Student View</span>
              </button>
            )}

            {/* Quick Action Button: New Task */}
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="hidden sm:flex items-center gap-1.5 border border-turmeric bg-turmeric px-3 py-1.5 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
            >
              <Plus className="h-3.5 w-3.5" />
              Assign Task
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="relative flex items-center justify-center border border-border bg-paper p-2 text-navy hover:border-navy"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {pendingReviewsCount + overdueTasksCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-urgent text-[10px] font-bold text-white">
                    {pendingReviewsCount + overdueTasksCount}
                  </span>
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-2 w-80 border-2 border-navy bg-white p-3 shadow-xl z-50 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-2 font-bold text-navy">
                    <span>Mentor Alerts & Notifications</span>
                    <span className="text-[10px] text-forest font-mono">Live Sync</span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto divide-y divide-border">
                    <div
                      onClick={() => {
                        setActiveTab('reviews');
                        setShowNotificationsDropdown(false);
                      }}
                      className="cursor-pointer pt-1.5 hover:bg-paper p-1"
                    >
                      <div className="font-semibold text-navy">Submission #23 by Priya</div>
                      <div className="text-[11px] text-ink-muted">Deliverable: AI Classification Report (Pending Review)</div>
                    </div>
                    <div
                      onClick={() => {
                        setActiveTab('industry');
                        setShowNotificationsDropdown(false);
                      }}
                      className="cursor-pointer pt-1.5 hover:bg-paper p-1"
                    >
                      <div className="font-semibold text-turmeric-deep">Message from ABC Technologies</div>
                      <div className="text-[11px] text-ink-muted">"We can provide the water quality sensors for field testing."</div>
                    </div>
                    <div
                      onClick={() => {
                        setActiveTab('tasks');
                        setShowNotificationsDropdown(false);
                      }}
                      className="cursor-pointer pt-1.5 hover:bg-paper p-1"
                    >
                      <div className="font-semibold text-urgent">3 Overdue Tasks Flagged</div>
                      <div className="text-[11px] text-ink-muted">Mobile UI fix (Himmat), TFLite camera lockup, BMS bugfix</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* SUB-NAVIGATION BAR (Prompt-specified Mentor Navigation)               */}
      {/* ==================================================================== */}
      <nav className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-1 py-1.5">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Briefcase },
              { key: 'projects', label: 'My Projects', icon: Briefcase, count: totalProjectsCount },
              { key: 'students', label: 'My Students', icon: Users, count: totalStudentsCount },
              { key: 'tasks', label: 'Tasks', icon: CheckCircle2, badge: overdueTasksCount > 0 ? `${overdueTasksCount} Overdue` : undefined, badgeColor: 'bg-urgent text-white' },
              { key: 'milestones', label: 'Milestones', icon: Clock },
              { key: 'reviews', label: 'Reviews', icon: FileCheck2, badge: `${pendingReviewsCount} Pending`, badgeColor: 'bg-turmeric text-ink' },
              { key: 'messages', label: 'Student Messages', icon: MessageSquare, count: projectMessages.length },
              { key: 'documents', label: 'Documents', icon: FileText },
              { key: 'industry', label: 'Industry Communication', icon: Building2 },
              { key: 'notifications', label: 'Notifications', icon: Bell },
              { key: 'profile', label: 'Profile', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as MentorNavTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? 'border-b-2 border-navy text-navy bg-paper'
                      : 'text-ink-muted hover:text-navy hover:bg-paper/50'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-navy' : 'text-ink-muted'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="font-mono text-[10px] text-ink-muted">({tab.count})</span>
                  )}
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ==================================================================== */}
      {/* MAIN CONTAINER CONTENT                                               */}
      {/* ==================================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">

        {/* ==================================================================== */}
        {/* TAB 1: MENTOR HOME / DASHBOARD OVERVIEW                              */}
        {/* ==================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Prompt-Specified Metric Box: 4 Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div
                onClick={() => setActiveTab('projects')}
                className="cursor-pointer border border-border bg-white p-5 transition hover:border-navy"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span>My Projects</span>
                  <Briefcase className="h-4 w-4 text-navy" />
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">{totalProjectsCount}</p>
                <span className="mt-1 block text-[11px] text-forest">
                  4 Active R&D Initiatives
                </span>
              </div>

              <div
                onClick={() => setActiveTab('students')}
                className="cursor-pointer border border-border bg-white p-5 transition hover:border-navy"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span>Students</span>
                  <Users className="h-4 w-4 text-navy" />
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-navy">{totalStudentsCount}</p>
                <span className="mt-1 block text-[11px] text-ink-muted">
                  Multidisciplinary researchers
                </span>
              </div>

              <div
                onClick={() => setActiveTab('reviews')}
                className="cursor-pointer border border-border bg-white p-5 transition hover:border-navy"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span>Pending Reviews</span>
                  <FileCheck2 className="h-4 w-4 text-turmeric-deep" />
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-turmeric-deep">
                  {pendingReviewsCount}
                </p>
                <span className="mt-1 block text-[11px] text-turmeric-deep font-semibold">
                  Awaiting your approval
                </span>
              </div>

              <div
                onClick={() => setActiveTab('tasks')}
                className="cursor-pointer border border-border bg-white p-5 transition hover:border-navy"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <span>Overdue Tasks</span>
                  <AlertCircle className="h-4 w-4 text-urgent" />
                </div>
                <p className="mt-2 font-mono text-3xl font-bold text-urgent">{overdueTasksCount}</p>
                <span className="mt-1 block text-[11px] text-urgent font-medium">
                  Requires mentor intervention
                </span>
              </div>
            </div>

            {/* Prompt Requirement: Active Projects with Progress Bars */}
            <div className="border border-border bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy">
                    Active Projects
                  </h2>
                  <p className="text-xs text-ink-muted">
                    Real-time research milestone and student execution telemetry
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs font-bold text-navy hover:underline flex items-center gap-1"
                >
                  View All Projects <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-4 pt-1">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="border border-border p-4 hover:border-navy transition bg-paper/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{proj.icon}</span>
                        <div>
                          <h3 className="font-display text-sm font-bold text-navy">
                            {proj.title}
                          </h3>
                          <p className="text-[11px] text-ink-muted line-clamp-1">{proj.problem}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-navy">{proj.progress}%</span>
                        <span className="border border-border bg-white px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                          {proj.currentStage}
                        </span>
                      </div>
                    </div>

                    {/* Styled ASCII / Tailwind Progress Bar */}
                    <div className="mt-3">
                      <div className="h-2.5 w-full bg-border/60 overflow-hidden">
                        <div
                          className="h-full bg-navy transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-ink-muted">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink">{proj.teamSize} Students</span>
                        <span>|</span>
                        <span className={proj.pendingTasks > 0 ? 'text-turmeric-deep font-semibold' : 'text-forest'}>
                          {proj.pendingTasks} Pending Tasks
                        </span>
                        <span>|</span>
                        <span className="text-ink-muted">
                          Next Milestone: <strong className="text-navy">{proj.nextMilestone}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 sm:mt-0">
                        <span className="font-mono text-[11px] text-urgent">
                          Deadline: {proj.deadline}
                        </span>
                        <button
                          onClick={() => {
                            setProjectFilter(proj.title);
                            setActiveTab('tasks');
                          }}
                          className="text-[11px] font-bold text-navy underline ml-2"
                        >
                          View Tasks
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Two-Column Action Grid: Pending Submissions & Immediate Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submission Queue Quick Action */}
              <div className="border border-border bg-white p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-turmeric-deep" />
                    <h3 className="font-display text-sm font-bold text-navy">
                      Pending Reviews ({pendingReviewsCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs font-bold text-navy hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {submissions.slice(0, 3).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between border border-border p-3 hover:bg-paper transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-navy">
                            Submission #{sub.submissionNumber}
                          </span>
                          <span className="text-border">·</span>
                          <span className="font-semibold text-ink text-xs">{sub.studentName}</span>
                          <span className="text-[10px] text-ink-muted">({sub.studentRole})</span>
                        </div>
                        <p className="text-xs text-ink-muted mt-0.5">{sub.deliverableTitle}</p>
                        <span className="text-[10px] text-ink-muted font-mono">{sub.submittedAt}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="border border-navy bg-navy px-2.5 py-1 text-[11px] font-bold text-white hover:bg-navy-deep"
                        >
                          View Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overdue / Urgent Tasks Quick Action */}
              <div className="border border-border bg-white p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-urgent" />
                    <h3 className="font-display text-sm font-bold text-navy">
                      Urgent / Overdue Tasks ({overdueTasksCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setTaskFilter('Overdue');
                      setActiveTab('tasks');
                    }}
                    className="text-xs font-bold text-navy hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {tasks
                    .filter((t) => t.status === 'Overdue' || t.status === 'Due')
                    .slice(0, 3)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between border border-border p-3 hover:bg-paper transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={t.status === 'Overdue' ? 'text-urgent font-bold' : 'text-turmeric-deep font-bold'}>
                              {t.status === 'Overdue' ? '🔴' : '◯'}
                            </span>
                            <span className="font-semibold text-xs text-navy">{t.title}</span>
                          </div>
                          <p className="text-[11px] text-ink-muted mt-0.5">
                            {t.assigneeName} ({t.assigneeRole}) · {t.projectTitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[10px] font-bold text-urgent block">
                            Due: {t.dueDate}
                          </span>
                          <button
                            onClick={() => toggleTaskStatus(t.id)}
                            className="mt-1 text-[10px] text-navy underline font-semibold"
                          >
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Industry Partner Pulse Box */}
            <div className="border border-border bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-forest" />
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy">
                      Industry Collaboration: ABC Technologies (Tata Steel CSR)
                    </h3>
                    <p className="text-xs text-ink-muted">
                      Industry Mentor: <strong>Rahul Mehta</strong> · Senior Engineering Director
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('industry')}
                  className="border border-navy bg-white px-3 py-1.5 text-xs font-bold text-navy hover:bg-paper transition"
                >
                  Open Industry Messages
                </button>
              </div>
              <div className="mt-3 border-l-4 border-turmeric bg-paper p-3 text-xs italic text-ink">
                "We can provide the water quality sensors for field testing."
                <span className="block mt-1 font-mono text-[10px] not-italic text-ink-muted">
                  Latest transmission · 09 Sept, 3:45 PM
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: MY PROJECTS (Filtered to Professor Sharma)                     */}
        {/* ==================================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy">
                    Assigned Research Projects
                  </h2>
                  <p className="text-xs text-ink-muted">
                    Professor Sharma's active grant-sanctioned problem-solving initiatives
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-3 py-1 border border-forest/30 self-start">
                  4 Active Mandates
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="border-2 border-border bg-white p-5 flex flex-col justify-between hover:border-navy transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{proj.icon}</span>
                        <div>
                          <h3 className="font-display text-base font-bold text-navy">
                            {proj.title}
                          </h3>
                          <span className="font-mono text-[11px] text-ink-muted">{proj.code}</span>
                        </div>
                      </div>
                      <span className="border border-border bg-paper px-2 py-0.5 text-[10px] font-bold text-forest">
                        {proj.category}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="font-semibold text-navy">Problem:</span>
                        <p className="text-ink text-xs mt-0.5 bg-paper p-2 border border-border">
                          {proj.problem}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                        <div>
                          <span className="text-ink-muted block text-[11px]">Team Size</span>
                          <strong className="text-navy">{proj.teamSize} Students</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted block text-[11px]">Current Stage</span>
                          <span className="inline-block border border-turmeric bg-turmeric/10 px-2 py-0.5 text-[11px] font-bold text-turmeric-deep">
                            {proj.currentStage}
                          </span>
                        </div>
                        <div>
                          <span className="text-ink-muted block text-[11px]">Next Milestone</span>
                          <strong className="text-ink">{proj.nextMilestone}</strong>
                        </div>
                        <div>
                          <span className="text-ink-muted block text-[11px]">Deadline</span>
                          <strong className="text-urgent font-mono">{proj.deadline}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-ink-muted">Project Progress</span>
                        <span className="font-mono text-navy">{proj.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-border overflow-hidden">
                        <div
                          className="h-full bg-navy transition-all"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Industry Partner */}
                    <div className="text-[11px] text-ink-muted pt-1 border-t border-border">
                      Industry Partner: <strong className="text-navy">{proj.industryPartnerName}</strong> (Mentor: {proj.industryMentor})
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setProjectFilter(proj.title);
                        setActiveTab('students');
                      }}
                      className="border border-border bg-paper px-3 py-1.5 text-xs font-bold text-navy hover:border-navy"
                    >
                      View Team ({proj.teamSize})
                    </button>
                    <button
                      onClick={() => {
                        setProjectFilter(proj.title);
                        setActiveTab('tasks');
                      }}
                      className="border border-navy bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-deep"
                    >
                      Manage Tasks
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: STUDENT TEAM (Prompt-Specified Feature 2)                     */}
        {/* ==================================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Team Banner */}
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">
                  Project Team & Student Roster
                </h2>
                <p className="text-xs text-ink-muted">
                  Faculty Mentor: <strong>Dr. Sharma</strong> · Student Investigators & Engineers
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-1.5 border border-navy bg-navy px-3 py-2 text-xs font-bold text-white hover:bg-navy-deep transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Add Student
                </button>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="flex items-center gap-1.5 border border-turmeric bg-turmeric px-3 py-2 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Assign Task
                </button>
              </div>
            </div>

            {/* Smart Water Monitoring Dedicated Project Team Card (as prompt specified) */}
            <div className="border-2 border-navy bg-white p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💧</span>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy">
                      Project Team: Smart Water Monitoring
                    </h3>
                    <span className="font-mono text-xs text-ink-muted">JH-PRJ-2026-042 · 5 Core Investigators</span>
                  </div>
                </div>
                <span className="border border-forest/30 bg-forest/10 px-2.5 py-1 text-xs font-bold text-forest">
                  Active Sprint
                </span>
              </div>

              {/* Mentor Lead Card */}
              <div className="border border-navy/40 bg-paper p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👨‍🏫</span>
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy">Dr. Sharma</h4>
                    <span className="text-xs font-semibold text-turmeric-deep">Faculty Mentor</span>
                    <p className="text-[11px] text-ink-muted">Professor & Dean (R&D) · Environmental & IoT Research Lab</p>
                  </div>
                </div>
                <span className="border border-border bg-white px-2.5 py-1 text-xs font-mono text-navy font-semibold">
                  Principal Investigator
                </span>
              </div>

              {/* Student Members Grid matching prompt exactly:
                  Rahul (Backend Developer), Priya (AI/ML), Amit (IoT), Himmat (Frontend), Neha (Research) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {[
                  { name: 'Rahul', role: 'Backend Developer', icon: '👨‍🎓', dept: 'CS & Engg', tasks: '4/5' },
                  { name: 'Priya', role: 'AI/ML', icon: '👩‍🎓', dept: 'ECE', tasks: '3/4' },
                  { name: 'Amit', role: 'IoT', icon: '👨‍🎓', dept: 'Mechanical', tasks: '2/4' },
                  { name: 'Himmat', role: 'Frontend', icon: '👨‍🎓', dept: 'Civil/GIS', tasks: '1/3' },
                  { name: 'Neha', role: 'Research', icon: '👩‍🎓', dept: 'Chemical', tasks: '3/4' },
                ].map((member) => (
                  <div
                    key={member.name}
                    className="border border-border bg-white p-3.5 flex flex-col justify-between hover:border-navy transition"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{member.icon}</span>
                        <span className="font-mono text-[10px] text-forest font-semibold">
                          Tasks: {member.tasks}
                        </span>
                      </div>
                      <h5 className="mt-2 font-display text-sm font-bold text-navy">
                        {member.name}
                      </h5>
                      <span className="inline-block mt-0.5 text-xs font-semibold text-turmeric-deep">
                        {member.role}
                      </span>
                      <p className="text-[10px] text-ink-muted mt-1">{member.dept}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border flex items-center justify-between gap-1">
                      <button
                        onClick={() => {
                          const matched = students.find((s) => s.name.toLowerCase().includes(member.name.toLowerCase()));
                          if (matched) {
                            setEditingStudentRole(matched);
                            setNewRoleText(matched.role);
                          }
                        }}
                        className="text-[10px] font-bold text-navy hover:underline"
                      >
                        Edit Role
                      </button>
                      <button
                        onClick={() => {
                          setMessageProjectFilter('Smart Water Monitoring');
                          setActiveTab('messages');
                        }}
                        className="text-[10px] font-bold text-forest hover:underline flex items-center gap-0.5"
                        title="Chat with student team"
                      >
                        <MessageSquare className="h-2.5 w-2.5" />
                        <span>Chat</span>
                      </button>
                      <button
                        onClick={() => {
                          setNewTaskAssignee(member.name);
                          setShowAddTaskModal(true);
                        }}
                        className="text-[10px] font-bold text-turmeric-deep hover:underline"
                      >
                        + Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Student Cohort (16 Students) Table */}
            <div className="border border-border bg-white space-y-3 p-5">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div>
                  <h3 className="font-display text-sm font-bold text-navy">
                    Complete Student Cohort Directory (16 Students)
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Full student roster across all 4 research initiatives
                  </p>
                </div>
                <span className="font-mono text-xs text-ink-muted">Total: {students.length} Investigators</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-paper text-[11px] font-semibold text-ink-muted uppercase">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Assigned Project</th>
                      <th className="p-3">Team Role</th>
                      <th className="p-3">Academic Dept</th>
                      <th className="p-3">Tasks Completed</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map((st) => (
                      <tr key={st.id} className="hover:bg-paper/60">
                        <td className="p-3 font-semibold text-navy">
                          <div className="flex items-center gap-2">
                            <span>{st.avatarIcon}</span>
                            <div>
                              <span>{st.name}</span>
                              <span className="block text-[10px] font-mono text-ink-muted">{st.rollNo}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-ink">{st.projectTitle}</td>
                        <td className="p-3">
                          <span className="font-semibold text-turmeric-deep">{st.role}</span>
                        </td>
                        <td className="p-3 text-ink-muted">{st.dept}</td>
                        <td className="p-3 font-mono">
                          <span className="font-bold text-forest">{st.tasksCompleted}</span> / {st.tasksAssigned}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold ${
                              st.status === 'Active'
                                ? 'bg-forest/10 text-forest'
                                : 'bg-turmeric/10 text-turmeric-deep'
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingStudentRole(st);
                              setNewRoleText(st.role);
                            }}
                            className="text-[11px] text-navy font-bold hover:underline"
                          >
                            Edit Role
                          </button>
                          <button
                            onClick={() => {
                              setNewTaskAssignee(st.name);
                              setShowAddTaskModal(true);
                            }}
                            className="text-[11px] text-turmeric-deep font-bold hover:underline"
                          >
                            Assign Task
                          </button>
                          <button
                            onClick={() => handleRemoveStudent(st.id, st.name)}
                            className="text-[11px] text-urgent font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: TASK MANAGEMENT (Prompt-Specified Feature 3)                  */}
        {/* ==================================================================== */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">
                  Task Management & Assignment
                </h2>
                <p className="text-xs text-ink-muted">
                  Track student deliverables, toggle execution progress, and assign new action items
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="flex items-center gap-1.5 border border-navy bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-deep"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Task
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 border border-border bg-white p-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-ink-muted mr-2">Filter:</span>
                {(['All', 'Completed', 'In Progress', 'Due', 'Overdue'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setTaskFilter(status)}
                    className={`px-2.5 py-1 text-xs font-semibold transition ${
                      taskFilter === status
                        ? 'border border-navy bg-navy text-white'
                        : 'border border-border bg-paper text-ink hover:border-navy'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-ink-muted text-xs">Project:</span>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="border border-border bg-paper px-2 py-1 text-xs font-semibold text-navy"
                >
                  <option value="All">All 4 Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prompt TASKS Representation:
                ☑ Research water-quality sensors - Rahul - Completed
                ◉ Build AI classification API - Priya - In Progress
                ◯ Prepare field-testing report - Amit - Due: 15 Sept
                🔴 Fix mobile UI - Himmat - Overdue */}
            <div className="border border-border bg-white divide-y divide-border">
              {filteredTasks.map((t) => {
                const isCompleted = t.status === 'Completed';
                const isInProgress = t.status === 'In Progress';
                const isDue = t.status === 'Due';
                const isOverdue = t.status === 'Overdue';

                const statusIcon = isCompleted ? '☑' : isInProgress ? '◉' : isDue ? '◯' : '🔴';
                const statusColor = isCompleted
                  ? 'text-forest'
                  : isInProgress
                  ? 'text-navy'
                  : isDue
                  ? 'text-turmeric-deep'
                  : 'text-urgent';

                return (
                  <div
                    key={t.id}
                    className="p-4 hover:bg-paper/60 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskStatus(t.id)}
                        className={`text-xl font-bold transition transform hover:scale-125 ${statusColor}`}
                        title="Click to toggle status"
                      >
                        {statusIcon}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-display text-sm font-bold ${
                              isCompleted ? 'line-through text-ink-muted' : 'text-navy'
                            }`}
                          >
                            {t.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold ${
                              isCompleted
                                ? 'bg-forest/10 text-forest'
                                : isInProgress
                                ? 'bg-navy/10 text-navy'
                                : isDue
                                ? 'bg-turmeric/10 text-turmeric-deep'
                                : 'bg-urgent/10 text-urgent'
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="text-[10px] font-mono text-ink-muted">
                            [{t.priority} Priority]
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                          <span className="font-semibold text-navy">{t.assigneeName}</span>
                          <span>·</span>
                          <span className="text-forest font-medium">{t.assigneeRole}</span>
                          <span>·</span>
                          <span className="font-mono text-[11px]">{t.projectTitle}</span>
                        </div>

                        <p className="mt-1 text-xs text-ink-muted line-clamp-1">{t.description}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isOverdue ? 'text-urgent font-black' : 'text-ink-muted'
                        }`}
                      >
                        {isOverdue ? `Overdue (${t.dueDate})` : `Due: ${t.dueDate}`}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTaskStatus(t.id)}
                          className="border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-navy hover:border-navy"
                        >
                          {isCompleted ? 'Reopen' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="p-8 text-center text-xs text-ink-muted">
                  No tasks found matching the selected filter criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: MILESTONE MANAGEMENT (Prompt-Specified Feature 5)             */}
        {/* ==================================================================== */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5">
              <h2 className="font-display text-lg font-bold text-navy">
                Project Lifecycle & Milestone Management
              </h2>
              <p className="text-xs text-ink-muted">
                Official R&D stage gate progression: Research → Requirements → Architecture → Prototype → Testing → Pilot → Deployment
              </p>
            </div>

            {/* Prompt PROJECT TIMELINE Representation */}
            <div className="border-2 border-border bg-white p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💧</span>
                  <h3 className="font-display text-base font-bold text-navy">
                    PROJECT TIMELINE: Smart Water Monitoring
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-turmeric-deep bg-turmeric/10 px-2.5 py-1 border border-turmeric/30">
                  Current Stage: Prototype ◉
                </span>
              </div>

              {/* 7-Stage Stepper / Timeline List */}
              <div className="relative border-l-2 border-navy/30 ml-4 pl-6 space-y-6">
                {milestones.map((milestone) => {
                  const isDone = milestone.status === 'completed';
                  const isCurrent = milestone.status === 'current';

                  return (
                    <div key={milestone.id} className="relative group">
                      {/* Node circle / symbol */}
                      <button
                        onClick={() => handleToggleMilestone(milestone.id)}
                        className={`absolute -left-[35px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                          isDone
                            ? 'bg-forest text-white border-2 border-forest'
                            : isCurrent
                            ? 'bg-turmeric text-navy border-2 border-navy animate-pulse'
                            : 'bg-white text-ink-muted border-2 border-border'
                        }`}
                        title="Click to toggle milestone stage"
                      >
                        {milestone.symbol}
                      </button>

                      <div className="border border-border p-4 bg-paper/40 hover:bg-white transition hover:border-navy">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-ink-muted">
                              Phase 0{milestone.stageNumber}:
                            </span>
                            <h4 className="font-display text-base font-bold text-navy">
                              {milestone.name}
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                isDone
                                  ? 'bg-forest/10 text-forest'
                                  : isCurrent
                                  ? 'bg-turmeric/20 text-turmeric-deep font-black'
                                  : 'bg-border/40 text-ink-muted'
                              }`}
                            >
                              {milestone.status}
                            </span>
                          </div>

                          <span className="font-mono text-xs text-ink-muted">
                            {isDone ? `Completed: ${milestone.completionDate}` : `Due: ${milestone.dueDate}`}
                          </span>
                        </div>

                        <div className="mt-2 text-xs">
                          <strong className="text-navy">Deliverable: </strong>
                          <span className="text-ink">{milestone.deliverable}</span>
                        </div>

                        <p className="mt-1 text-xs text-ink-muted">{milestone.description}</p>

                        <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-xs">
                          <span className="text-[11px] text-forest font-semibold">
                            {isDone ? '✓ Deliverables verified and approved by Dr. Sharma' : isCurrent ? '◉ Active development and laboratory test phase' : '○ Pending prerequisite phase clearance'}
                          </span>

                          <button
                            onClick={() => handleToggleMilestone(milestone.id)}
                            className="text-xs font-bold text-navy hover:underline"
                          >
                            {isDone ? 'Mark In-Progress' : 'Approve & Advance Phase'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: REVIEW & APPROVAL (Prompt-Specified Feature 4)                */}
        {/* ==================================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">
                  Student Deliverables Review & Approval Queue
                </h2>
                <p className="text-xs text-ink-muted">
                  Inspect student project submissions, review test data, issue revisions or sign off approvals
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-turmeric-deep bg-turmeric/10 px-3 py-1 border border-turmeric/30 self-start">
                {pendingReviewsCount} Submissions Pending
              </span>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {submissions.map((sub) => {
                const isPending = sub.status === 'pending';
                const isApproved = sub.status === 'approved';

                return (
                  <div
                    key={sub.id}
                    className={`border-2 p-5 bg-white transition ${
                      isPending ? 'border-turmeric' : isApproved ? 'border-forest/40' : 'border-urgent/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-navy">
                            Submission #{sub.submissionNumber}
                          </span>
                          <span className="text-border">·</span>
                          <span className="font-semibold text-sm text-ink">{sub.studentName}</span>
                          <span className="text-xs text-ink-muted">({sub.studentRole})</span>
                        </div>
                        <p className="text-xs font-mono text-ink-muted mt-0.5">
                          Project: <strong>{sub.projectTitle}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-ink-muted">
                          Submitted: <strong>{sub.submittedAt}</strong>
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                            isPending
                              ? 'bg-turmeric text-ink'
                              : isApproved
                              ? 'bg-forest text-white'
                              : 'bg-urgent text-white'
                          }`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-navy">Deliverable:</span>
                        <h4 className="font-display text-sm font-bold text-navy mt-0.5">
                          {sub.deliverableTitle}
                        </h4>
                      </div>

                      <p className="text-ink-muted leading-relaxed bg-paper p-3 border border-border">
                        {sub.documentSummary}
                      </p>

                      {/* Technical Specs Metric Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                        {Object.entries(sub.technicalSpecs).map(([key, val]) => (
                          <div key={key} className="border border-border bg-white p-2">
                            <span className="text-[10px] uppercase text-ink-muted block">{key}</span>
                            <strong className="text-navy">{val}</strong>
                          </div>
                        ))}
                      </div>

                      {/* Feedback Display if already graded */}
                      {sub.professorFeedback && (
                        <div className="mt-2 border-l-4 border-navy bg-paper p-3 text-xs">
                          <strong className="text-navy">Mentor Feedback: </strong>
                          <span className="text-ink">{sub.professorFeedback}</span>
                          {sub.grade && (
                            <span className="block mt-1 font-bold text-forest">
                              Assessment Grade: {sub.grade}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rubric Breakdown Scorecards if evaluated */}
                      {sub.rubric && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs border border-border bg-paper/40 p-2.5">
                          <span className="font-bold text-navy flex items-center gap-1">
                            <Award className="h-3.5 w-3.5 text-forest" />
                            <span>Rubric Breakdown:</span>
                          </span>
                          <span className="bg-white px-2 py-0.5 border border-border text-[11px]">
                            Technical: <strong>{sub.rubric.technicalFeasibility}/5</strong>
                          </span>
                          <span className="bg-white px-2 py-0.5 border border-border text-[11px]">
                            Civic Impact: <strong>{sub.rubric.civicImpact}/5</strong>
                          </span>
                          <span className="bg-white px-2 py-0.5 border border-border text-[11px]">
                            Code Quality: <strong>{sub.rubric.codePrototypeQuality}/5</strong>
                          </span>
                          <span className="bg-white px-2 py-0.5 border border-border text-[11px]">
                            Field Data: <strong>{sub.rubric.fieldTestingData}/5</strong>
                          </span>
                          <span className="font-mono font-bold text-forest bg-forest/10 border border-forest/30 px-2 py-0.5 text-[11px]">
                            Total: {sub.rubric.totalScore}/20 ({sub.rubric.scorePercentage}%)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions: View Document, Grade with Rubric, View Official Receipt */}
                    <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenGradingModal(sub)}
                          className="flex items-center gap-1.5 border border-navy bg-navy text-white px-3.5 py-1.5 text-xs font-bold hover:bg-navy-deep transition"
                        >
                          <Award className="h-3.5 w-3.5 text-turmeric" />
                          <span>{sub.status === 'pending' ? 'Grade with Rubric' : 'Re-Evaluate Rubric'}</span>
                        </button>
                        {sub.evaluationReceipt && (
                          <button
                            onClick={() => setViewingReceipt(sub.evaluationReceipt || null)}
                            className="flex items-center gap-1.5 border border-forest bg-white text-forest px-3 py-1.5 text-xs font-bold hover:bg-forest/10 transition"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>View Official Receipt</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenGradingModal(sub)}
                          className="flex items-center gap-1.5 border border-border bg-paper px-3 py-1.5 text-xs font-bold text-ink hover:border-navy transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect Document</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 7: DOCUMENTS REPOSITORY                                          */}
        {/* ==================================================================== */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-navy">
                  Project Documents & Technical Artifacts
                </h2>
                <p className="text-xs text-ink-muted">
                  Official laboratory logs, CAD drawings, trained edge AI models, and CPCB assay sheets
                </p>
              </div>
              <button
                onClick={() => showToast('New document upload dialog opened.')}
                className="flex items-center gap-1.5 border border-navy bg-navy px-3 py-2 text-xs font-bold text-white hover:bg-navy-deep"
              >
                <Plus className="h-3.5 w-3.5" />
                Upload Document
              </button>
            </div>

            <div className="border border-border bg-white divide-y divide-border">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-paper transition">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-navy" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-navy">{doc.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
                        <span className="font-mono">{doc.type}</span>
                        <span>·</span>
                        <span className="font-mono">{doc.size}</span>
                        <span>·</span>
                        <span>Author: {doc.author}</span>
                        <span>·</span>
                        <span>Uploaded: {doc.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Downloading ${doc.title}...`)}
                      className="flex items-center gap-1 border border-border bg-white px-3 py-1.5 text-xs font-bold text-navy hover:border-navy"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 8: INDUSTRY COMMUNICATION (Prompt-Specified Feature 6)           */}
        {/* ==================================================================== */}
        {activeTab === 'industry' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏢</span>
                  <div>
                    <h2 className="font-display text-lg font-bold text-navy">
                      Industry Communication Portal
                    </h2>
                    <p className="text-xs text-ink-muted">
                      Direct bilateral technical dialogue with corporate co-sponsors & CSR mentors
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-forest bg-forest/10 px-3 py-1 border border-forest/30 self-start">
                  Channel Secured · DHTE/MoE Encrypted
                </span>
              </div>
            </div>

            {/* Active Industry Partner Card */}
            <div className="border-2 border-border bg-white p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-navy">
                    ABC Technologies (Tata Steel CSR)
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Industry Mentor: <strong>Rahul Mehta</strong> · Senior Engineering Director
                  </p>
                </div>
                <div className="text-xs font-mono text-right">
                  <span className="block text-forest font-bold">Grant: ₹5,00,000 + 20 Sensors</span>
                  <span className="text-ink-muted">MoU Ref: TSL/CSR/2026/WTR-09</span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="border border-border bg-paper p-4 space-y-4 max-h-[420px] overflow-y-auto">
                {messages.map((m) => {
                  const isMe = m.sender === 'mentor';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mb-1">
                        <strong className="text-navy">{m.senderName}</strong>
                        <span>({m.role})</span>
                        <span>·</span>
                        <span className="font-mono">{m.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-xl p-3.5 text-xs ${
                          isMe
                            ? 'bg-navy text-white border border-navy rounded-sm'
                            : 'bg-white text-ink border border-border rounded-sm shadow-sm'
                        }`}
                      >
                        <p className="leading-relaxed">{m.message}</p>
                        {m.attachment && (
                          <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-1.5 text-[11px] text-turmeric font-mono">
                            <Download className="h-3 w-3" />
                            <span>Attachment: {m.attachment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer Form */}
              <form onSubmit={handleSendMessage} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Type an official message to Rahul Mehta (ABC Technologies)..."
                  className="flex-1 border border-border bg-paper px-3 py-2 text-xs font-medium text-ink focus:border-navy focus:bg-white"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 border border-navy bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-deep"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 8B: STUDENT PROJECT COMMUNICATIONS & MENTOR Q&A                 */}
        {/* ==================================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💬</span>
                <div>
                  <h2 className="font-display text-lg font-bold text-navy">
                    Student Project Communications & Mentor Q&A
                  </h2>
                  <p className="text-xs text-ink-muted">
                    Direct technical discussions with Himmat Patel, Rahul, and student teams across all mentored projects
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-xs text-forest bg-forest/10 px-3 py-1 border border-forest/30">
                  <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
                  Synced with Student Portal
                </span>
                <button
                  type="button"
                  onClick={() => {
                    resetProjectMessages();
                    showToast('Project discussion thread reset to defaults.');
                  }}
                  className="text-xs font-bold text-ink-muted hover:text-urgent hover:underline"
                  title="Reset discussion thread"
                >
                  Reset Thread
                </button>
              </div>
            </div>

            {/* Active Thread & Controls */}
            <div className="border-2 border-border bg-white p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-navy flex items-center gap-2">
                    <span>BIT Mesra & NIT Jamshedpur Student Cohort</span>
                    <span className="text-xs font-mono font-normal text-forest bg-forest/10 px-2 py-0.5 border border-forest/20">
                      {projectMessages.length} Messages
                    </span>
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Primary Investigators: <strong>Dr. Rajesh Sharma</strong> · Student Leads: <strong>Himmat Patel, Rahul</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-ink-muted">Filter by Project:</label>
                  <select
                    value={messageProjectFilter}
                    onChange={(e) => setMessageProjectFilter(e.target.value)}
                    className="border border-border bg-paper px-2.5 py-1 text-xs font-medium text-navy"
                  >
                    <option value="All">All Mentored Projects</option>
                    <option value="Smart Water Monitoring">Smart Water Monitoring (Namkum Block)</option>
                    <option value="Solar Microgrid & BMS">Solar Microgrid & BMS (Khunti Village)</option>
                    <option value="AI Crop Blight Detection">AI Crop Blight Detection (Mandar)</option>
                  </select>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="border border-border bg-paper p-4 space-y-3 max-h-[460px] overflow-y-auto">
                {projectMessages
                  .filter((m) =>
                    messageProjectFilter === 'All' ? true : m.projectId === messageProjectFilter || !m.projectId
                  )
                  .map((m) => {
                    const isMentorMsg =
                      m.isMentor ||
                      m.author.toLowerCase().includes('sharma') ||
                      m.role.toLowerCase().includes('mentor');
                    const isHimmat = m.author.toLowerCase().includes('himmat');

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMentorMsg ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mb-1">
                          <span className="text-sm">{m.avatar}</span>
                          <strong className="text-navy">{m.author}</strong>
                          <span className="font-mono">({m.role})</span>
                          {isMentorMsg && (
                            <span className="text-[9px] bg-turmeric/20 text-ink border border-turmeric/40 px-1.5 py-0.2 rounded-[2px] font-bold">
                              You / Faculty Guide
                            </span>
                          )}
                          {isHimmat && (
                            <span className="text-[9px] bg-forest/10 text-forest border border-forest/30 px-1.5 py-0.2 rounded-[2px] font-bold">
                              Student Lead
                            </span>
                          )}
                          <span>·</span>
                          <span className="font-mono">{m.timestamp}</span>
                        </div>
                        <div
                          className={`max-w-xl p-3 text-xs leading-relaxed ${
                            isMentorMsg
                              ? 'bg-navy text-white border border-navy shadow-sm'
                              : 'bg-white text-ink border border-border shadow-xs'
                          }`}
                        >
                          <p>{m.message}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Response Composer Form */}
              <form onSubmit={handleSendStudentReply} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={mentorStudentReply}
                  onChange={(e) => setMentorStudentReply(e.target.value)}
                  placeholder="Reply to Himmat Patel and student team as Dr. Rajesh Sharma..."
                  className="flex-1 border border-border bg-paper px-3 py-2 text-xs font-medium text-ink focus:border-navy focus:bg-white"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 border border-navy bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy-deep transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Response</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 9: NOTIFICATIONS FEED                                            */}
        {/* ==================================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-5">
              <h2 className="font-display text-lg font-bold text-navy">
                Faculty Mentor Audit & Notification Trail
              </h2>
              <p className="text-xs text-ink-muted">
                System events, student task updates, submission milestones, and industry updates
              </p>
            </div>

            <div className="border border-border bg-white divide-y divide-border">
              {[
                { time: '10 Sept, 4:20 PM', title: 'New Deliverable Submitted', desc: 'Priya submitted Submission #23: AI Classification Report for Smart Water Monitoring.', icon: '👩‍🎓', type: 'review' },
                { time: '10 Sept, 11:15 AM', title: 'Hardware PCB Gerber Uploaded', desc: 'Amit uploaded Rev 2.1 telemetry PCB schematics ready for DRC verification.', icon: '👨‍🎓', type: 'review' },
                { time: '09 Sept, 3:45 PM', title: 'Industry Partner Message Received', desc: 'Rahul Mehta (ABC Technologies): "We can provide the water quality sensors for field testing."', icon: '🏢', type: 'industry' },
                { time: '08 Sept, 6:00 PM', title: 'Task Completed: Sensor Research', desc: 'Rahul marked "Research water-quality sensors" as Completed with CPCB data sheets.', icon: '☑', type: 'task' },
                { time: '07 Sept, 9:00 AM', title: 'Task Overdue Alert', desc: 'Task "Fix mobile UI" assigned to Himmat is now flagged as Overdue.', icon: '🔴', type: 'urgent' },
              ].map((notif, idx) => (
                <div key={idx} className="p-4 flex items-start gap-3 hover:bg-paper transition">
                  <span className="text-xl">{notif.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-xs font-bold text-navy">{notif.title}</h4>
                      <span className="font-mono text-[10px] text-ink-muted">{notif.time}</span>
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">{notif.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 10: PROFESSOR PROFILE                                            */}
        {/* ==================================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border border-border bg-white p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-5xl">👨‍🏫</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">
                    Dr. Rajesh Sharma
                  </h2>
                  <p className="text-xs font-semibold text-turmeric-deep">
                    Professor & Dean (Research & Development)
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Dept. of Environmental Science & Engineering, National Institute of Technology (NIT) Jamshedpur
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border text-xs">
                <div className="border border-border bg-paper p-3">
                  <span className="text-ink-muted block text-[11px]">Academic Credentials</span>
                  <strong className="text-navy">Ph.D. (IIT Roorkee), PostDoc (NUS)</strong>
                  <span className="block mt-1 text-[11px] text-ink">14 Years Academic & R&D Experience</span>
                </div>
                <div className="border border-border bg-paper p-3">
                  <span className="text-ink-muted block text-[11px]">Active R&D Projects</span>
                  <strong className="text-forest font-mono text-base">4 Live Projects</strong>
                  <span className="block mt-1 text-[11px] text-ink">16 Student Researchers Mentored</span>
                </div>
                <div className="border border-border bg-paper p-3">
                  <span className="text-ink-muted block text-[11px]">Official Email & Lab</span>
                  <strong className="text-navy font-mono">rsharma.env@nitjsr.ac.in</strong>
                  <span className="block mt-1 text-[11px] text-ink">Environmental Telemetry Lab, Room 204</span>
                </div>
              </div>

              <div className="pt-2 text-xs space-y-2">
                <h4 className="font-display text-sm font-bold text-navy">Research Specializations</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Water Quality Modeling',
                    'Electro-Coagulation',
                    'IoT Environmental Sensors',
                    'Edge AI Diagnostics',
                    'Rural Drinking Water Systems',
                  ].map((s) => (
                    <span key={s} className="border border-navy/30 bg-navy/5 px-2 py-1 text-navy font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODAL: VIEW DOCUMENT PREVIEW (Submission #23 Drawer)                 */}
      {/* ==================================================================== */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl border-2 border-navy bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-navy">
                    Submission #{selectedSubmission.submissionNumber}
                  </span>
                  <span className="text-border">·</span>
                  <span className="font-semibold text-ink">{selectedSubmission.studentName}</span>
                  <span className="text-xs text-ink-muted">({selectedSubmission.studentRole})</span>
                </div>
                <h3 className="font-display text-lg font-bold text-navy mt-1">
                  {selectedSubmission.deliverableTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-ink-muted hover:text-navy font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Document Content View */}
            <div className="border border-border bg-paper p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between text-ink-muted text-[11px]">
                <span>Project: <strong>{selectedSubmission.projectTitle}</strong></span>
                <span className="font-mono">Submitted: {selectedSubmission.submittedAt}</span>
              </div>

              <div className="bg-white p-4 border border-border space-y-2">
                <h4 className="font-display text-sm font-bold text-navy">
                  1. Executive Summary & Anomaly Classification Report
                </h4>
                <p className="text-ink leading-relaxed">
                  {selectedSubmission.documentSummary}
                </p>
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  {Object.entries(selectedSubmission.technicalSpecs).map(([k, v]) => (
                    <div key={k} className="border border-border bg-paper p-2">
                      <span className="text-[10px] text-ink-muted block uppercase">{k}</span>
                      <strong className="text-navy">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 border border-border space-y-2">
                <h4 className="font-display text-sm font-bold text-navy">
                  2. Student Verification Notes & Telemetry Graph
                </h4>
                <p className="text-ink-muted text-[11px]">
                  "All test validation runs conducted using CPCB Grade-A standard reagents. Model accurately identifies hazardous fluoride spikes (&gt; 1.5 ppm) within 42ms with zero false negatives across Namkum borewell sample series."
                </p>
              </div>
            </div>

            {/* STRUCTURED 4-CRITERIA RUBRIC EVALUATION FORM */}
            <div className="border-2 border-navy/20 bg-paper/30 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div>
                  <h4 className="font-display text-sm font-bold text-navy flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-forest" />
                    <span>Structured 5-Point Peer Evaluation Rubric</span>
                  </h4>
                  <p className="text-[11px] text-ink-muted">
                    Score student deliverable across 4 official academic dimensions (1–5 points each).
                  </p>
                </div>
                {/* Live Cumulative Score Badge */}
                <div className="text-right border border-navy bg-white px-3 py-1.5">
                  <span className="text-[9px] font-bold uppercase text-ink-muted block">Score</span>
                  <div className="font-mono text-base font-bold text-forest">
                    {rubricFeasibility + rubricCivicImpact + rubricCodeQuality + rubricFieldData} / 20
                  </div>
                  <span className="text-[10px] font-bold text-navy">
                    {calculateGradeBand(rubricFeasibility + rubricCivicImpact + rubricCodeQuality + rubricFieldData).gradeBand.split('(')[0]}
                  </span>
                </div>
              </div>

              {/* Criterion 1: Technical Feasibility */}
              <div className="bg-white border border-border p-3 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-xs font-bold text-navy">1. Technical Feasibility</span>
                    <span className="text-[11px] text-ink-muted block">
                      Architecture soundness, sensor telemetry, edge latency & error handling
                    </span>
                  </div>
                  <div className="flex items-center gap-1 self-start sm:self-auto">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRubricFeasibility(val)}
                        className={`h-7 w-7 text-xs font-bold transition border ${
                          rubricFeasibility === val
                            ? 'bg-navy text-white border-navy shadow-xs'
                            : 'bg-paper text-ink hover:border-navy border-border'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criterion 2: Civic Impact / State Problem Solved */}
              <div className="bg-white border border-border p-3 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-xs font-bold text-navy">2. Civic Impact / State Problem Solved</span>
                    <span className="text-[11px] text-ink-muted block">
                      Direct remediation efficacy for Jharkhand fluorosis/blight/civic grievances
                    </span>
                  </div>
                  <div className="flex items-center gap-1 self-start sm:self-auto">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRubricCivicImpact(val)}
                        className={`h-7 w-7 text-xs font-bold transition border ${
                          rubricCivicImpact === val
                            ? 'bg-navy text-white border-navy shadow-xs'
                            : 'bg-paper text-ink hover:border-navy border-border'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criterion 3: Code & Prototype Quality */}
              <div className="bg-white border border-border p-3 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-xs font-bold text-navy">3. Code & Prototype Quality</span>
                    <span className="text-[11px] text-ink-muted block">
                      Modularity, unit tests, model quantization & repository documentation
                    </span>
                  </div>
                  <div className="flex items-center gap-1 self-start sm:self-auto">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRubricCodeQuality(val)}
                        className={`h-7 w-7 text-xs font-bold transition border ${
                          rubricCodeQuality === val
                            ? 'bg-navy text-white border-navy shadow-xs'
                            : 'bg-paper text-ink hover:border-navy border-border'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criterion 4: Field Testing Data */}
              <div className="bg-white border border-border p-3 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-xs font-bold text-navy">4. Field Testing Data</span>
                    <span className="text-[11px] text-ink-muted block">
                      Ground-truth assay rigor, CPCB standard calibration & sample verification
                    </span>
                  </div>
                  <div className="flex items-center gap-1 self-start sm:self-auto">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRubricFieldData(val)}
                        className={`h-7 w-7 text-xs font-bold transition border ${
                          rubricFieldData === val
                            ? 'bg-navy text-white border-navy shadow-xs'
                            : 'bg-paper text-ink hover:border-navy border-border'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Written Remarks */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-navy">
                  Faculty Mentor Technical Appraisal & Directives:
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter specific commendations, test verification remarks, or mandated revisions..."
                  rows={3}
                  className="w-full border border-border bg-white p-2.5 text-xs text-ink focus:border-navy"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="border border-border bg-paper px-4 py-2 text-xs font-bold text-ink hover:border-navy"
              >
                Close Without Grading
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRequestChanges(selectedSubmission.id)}
                  className="flex items-center gap-1.5 border border-urgent bg-white px-4 py-2 text-xs font-bold text-urgent hover:bg-urgent/10 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>[↻ Request Changes with Rubric]</span>
                </button>
                <button
                  onClick={() => handleApproveSubmission(selectedSubmission.id)}
                  className="flex items-center gap-1.5 border border-forest bg-forest px-4 py-2 text-xs font-bold text-white hover:bg-forest/90 transition shadow-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>[✓ Approve & Generate Receipt]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ASSIGN NEW TASK                                               */}
      {/* ==================================================================== */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg border-2 border-navy bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-display text-base font-bold text-navy">
                Assign New Student Task
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-ink-muted hover:text-navy font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-navy mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Calibrate electrochemical sensor telemetry"
                  className="w-full border border-border bg-paper p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy mb-1">Assign to Student *</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full border border-border bg-paper p-2 text-xs"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name} ({st.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-navy mb-1">Project *</label>
                  <select
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    className="w-full border border-border bg-paper p-2 text-xs"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy mb-1">Due Date *</label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full border border-border bg-paper p-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full border border-border bg-paper p-2 text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="border border-border bg-paper px-4 py-2 text-xs font-bold text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-navy bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-deep"
                >
                  Confirm & Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADD STUDENT TO TEAM                                           */}
      {/* ==================================================================== */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md border-2 border-navy bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-display text-base font-bold text-navy">
                Add Student Investigator to Team
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-ink-muted hover:text-navy font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-navy mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Suman Oraon"
                  className="w-full border border-border bg-paper p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy mb-1">Project Role *</label>
                <input
                  type="text"
                  required
                  value={newStudentRole}
                  onChange={(e) => setNewStudentRole(e.target.value)}
                  placeholder="e.g. Firmware Engineer / Field Hydrologist"
                  className="w-full border border-border bg-paper p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy mb-1">Department</label>
                  <input
                    type="text"
                    value={newStudentDept}
                    onChange={(e) => setNewStudentDept(e.target.value)}
                    className="w-full border border-border bg-paper p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(e.target.value)}
                    className="w-full border border-border bg-paper p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="border border-border bg-paper px-4 py-2 text-xs font-bold text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-navy bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-deep"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: EDIT STUDENT ROLE                                             */}
      {/* ==================================================================== */}
      {editingStudentRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm border-2 border-navy bg-white p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-display text-sm font-bold text-navy">
                Assign Role: {editingStudentRole.name}
              </h3>
              <button
                onClick={() => setEditingStudentRole(null)}
                className="text-ink-muted hover:text-navy font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-muted mb-1">Current Role:</label>
                <strong className="text-navy">{editingStudentRole.role}</strong>
              </div>

              <div>
                <label className="block font-semibold text-navy mb-1">New Role Title *</label>
                <input
                  type="text"
                  value={newRoleText}
                  onChange={(e) => setNewRoleText(e.target.value)}
                  placeholder="e.g. Lead Edge AI / IoT Architect"
                  className="w-full border border-border bg-paper p-2 text-xs font-medium"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  onClick={() => setEditingStudentRole(null)}
                  className="border border-border bg-paper px-3 py-1.5 text-xs font-bold text-ink"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStudentRole(editingStudentRole.id)}
                  className="border border-navy bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-deep"
                >
                  Save Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMAL MENTOR EVALUATION RECEIPT MODAL */}
      {viewingReceipt && (
        <MentorEvaluationReceiptModal
          isOpen={Boolean(viewingReceipt)}
          onClose={() => setViewingReceipt(null)}
          receipt={viewingReceipt}
        />
      )}
    </div>
  );
};
