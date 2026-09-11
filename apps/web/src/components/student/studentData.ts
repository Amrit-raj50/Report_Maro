export interface StudentProfile {
  id: string;
  name: string;
  degree: string;
  dept: string;
  rollNo: string;
  institution: string;
  year: string;
  cgpa: string;
  email: string;
  avatarIcon: string;
  stats: {
    myProjects: number;
    tasks: number;
    skills: number;
  };
}

export interface StudentProject {
  id: string;
  code: string;
  title: string;
  icon: string;
  role: string;
  mentor: string;
  mentorDept: string;
  teamSize: number;
  progress: number;
  nextTask: string;
  deadline: string;
  category: string;
  problemStatement: string;
  industryPartner?: string;
  currentMilestone: string;
}

export interface StudentTaskItem {
  id: string;
  title: string;
  project: string;
  bucket: 'overdue' | 'in_progress' | 'completed' | 'upcoming';
  dueDate: string;
  priority: 'Critical' | 'High' | 'Medium';
  description: string;
  assignee: string;
}

export interface ExploreChallenge {
  id: string;
  code: string;
  title: string;
  category: 'AI' | 'IoT' | 'Agriculture' | 'Healthcare';
  skills: string[];
  university: string;
  description: string;
  status: 'Open' | 'Request Sent' | 'Joined';
  urgency: 'Critical' | 'High' | 'Medium';
  estimatedDuration: string;
}

export interface ProofOfWork {
  liveDemoUrl?: string;
  githubRepoUrl?: string;
  videoWalkthroughUrl?: string;
  fieldPhotoName?: string;
  fieldPhotoNames?: string[];
  fieldPhotoUrl?: string;
  gpsCoordinates?: string;
  photoCaption?: string;
}

export interface StudentDeliverable {
  id: string;
  project: string;
  type: 'Prototype' | 'Technical Report' | 'Code Repository' | 'Dataset';
  title: string;
  fileName: string;
  fileSize: string;
  description: string;
  submittedAt: string;
  status: 'Pending Review' | 'Approved' | 'Changes Requested';
  mentorFeedback?: string;
  proofOfWork?: ProofOfWork;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  avatar: string;
  isMentor?: boolean;
}

export interface TeamComment {
  id: string;
  author: string;
  role: string;
  avatar: string;
  message: string;
  timestamp: string;
}

export interface StudentAchievement {
  projectsCompleted: number;
  problemsSolved: number;
  industryCollaborations: number;
  prototypesBuilt: number;
  skills: { name: string; level: number; label: string }[];
  trophies: {
    id: string;
    title: string;
    desc: string;
    icon: string;
    date: string;
  }[];
}

// Student Profile for Himmat
export const HIMMAT_PROFILE: StudentProfile = {
  id: 'st-himmat',
  name: 'Himmat',
  degree: 'B.E. Computer Engineering',
  dept: 'Dept. of Computer Science & Engineering',
  rollNo: '23CS031',
  institution: 'National Institute of Technology (NIT) Jamshedpur',
  year: '3rd Year (Semester VI)',
  cgpa: '8.84',
  email: 'himmat.singh@nitjsr.ac.in',
  avatarIcon: '👨‍🎓',
  stats: {
    myProjects: 2,
    tasks: 5,
    skills: 8,
  },
};

// Current Project & Enrolled Projects
export const STUDENT_PROJECTS: StudentProject[] = [
  {
    id: 'sprj-01',
    code: 'JH-PRJ-2026-042',
    title: 'Smart Water Monitoring',
    icon: '💧',
    role: 'Frontend Developer',
    mentor: 'Dr. Sharma',
    mentorDept: 'Environmental Science & Engineering',
    teamSize: 5,
    progress: 72,
    nextTask: 'Complete mobile dashboard',
    deadline: '15 Sept 2026',
    category: 'Water Resources & IoT',
    problemStatement:
      'Community borewells in Namkum village exhibit fluoride and heavy metal toxicity. Building an automated telemetry kiosk for rural Panchayat monitoring.',
    industryPartner: 'ABC Technologies (Tata Steel CSR)',
    currentMilestone: 'Prototype Phase: Bench Telemetry Integration',
  },
  {
    id: 'sprj-02',
    code: 'JH-PRJ-2026-028',
    title: 'Crop Disease AI Mobile App',
    icon: '🌾',
    role: 'Mobile UI Engineer',
    mentor: 'Dr. Anita Patel',
    mentorDept: 'Information Technology',
    teamSize: 4,
    progress: 45,
    nextTask: 'Build offline foliar lesion camera viewfinder',
    deadline: '18 Sept 2026',
    category: 'Agriculture & Edge AI',
    problemStatement:
      'Early foliar blight detection in tribal paddy and lac host trees. Offline edge diagnostics for farmers in Mandar and Ormanjhi blocks.',
    industryPartner: 'XYZ Labs (MECON Agro-Tech Cell)',
    currentMilestone: 'Development Phase: Offline Mobile Model Integration',
  },
];

// Today's Checklist Tasks for Himmat
export const INITIAL_TODAYS_TASKS = [
  { id: 'today-1', title: 'Complete dashboard', done: false },
  { id: 'today-2', title: 'Fix API integration', done: false },
  { id: 'today-3', title: 'Submit documentation', done: true },
];

// 4-Bucket Task List strictly matching the prompt:
// 🔴 Overdue: Fix API error
// 🟠 In Progress: Build dashboard
// 🟢 Completed: Create UI wireframe
// ⚪ Upcoming: Prepare documentation
export const STUDENT_TASKS: StudentTaskItem[] = [
  {
    id: 'stsk-01',
    title: 'Fix API error',
    project: 'Smart Water Monitoring',
    bucket: 'overdue',
    dueDate: '09 Sept 2026',
    priority: 'Critical',
    description:
      'Resolve HTTP 422 JSON validation schema mismatch when sending borewell telemetry packets to FastAPI backend endpoint.',
    assignee: 'Himmat',
  },
  {
    id: 'stsk-02',
    title: 'Build dashboard',
    project: 'Smart Water Monitoring',
    bucket: 'in_progress',
    dueDate: '13 Sept 2026',
    priority: 'High',
    description:
      'Implement real-time sensor gauge widgets, battery voltage monitor, and Hindi-translated contamination warning badges.',
    assignee: 'Himmat',
  },
  {
    id: 'stsk-03',
    title: 'Create UI wireframe',
    project: 'Smart Water Monitoring',
    bucket: 'completed',
    dueDate: '04 Sept 2026',
    priority: 'Medium',
    description:
      'Draft responsive Figma prototype for tablet kiosk and low-resolution Android smartphones used by Gram Panchayat field staff.',
    assignee: 'Himmat',
  },
  {
    id: 'stsk-04',
    title: 'Prepare documentation',
    project: 'Smart Water Monitoring',
    bucket: 'upcoming',
    dueDate: '16 Sept 2026',
    priority: 'High',
    description:
      'Author user manual and offline operational handbook for Panchayat kiosk operators and village water committee members.',
    assignee: 'Himmat',
  },
  {
    id: 'stsk-05',
    title: 'Offline camera viewfinder interface',
    project: 'Crop Disease AI Mobile App',
    bucket: 'in_progress',
    dueDate: '15 Sept 2026',
    priority: 'Medium',
    description:
      'Implement bounding box overlay for real-time leaf anomaly detection on camera stream using MediaPipe/TFLite canvas.',
    assignee: 'Himmat',
  },
];

// Explore Challenges Marketplace
export const EXPLORE_CHALLENGES: ExploreChallenge[] = [
  {
    id: 'exp-01',
    code: 'JH-AGR-2026-00845',
    title: 'AI Crop Disease Detection',
    category: 'AI',
    skills: ['Python', 'Computer Vision', 'ML', 'Mobile UI'],
    university: 'NIT Jamshedpur / ICAR Regional Centre',
    description:
      'Develop edge-deployable computer vision models to detect early necrotic lesions on Kusumi lac host trees across tribal farms.',
    status: 'Joined',
    urgency: 'High',
    estimatedDuration: '12 Weeks',
  },
  {
    id: 'exp-02',
    code: 'JH-WTR-2026-01023',
    title: 'IoT Ground Water Sensor Telemetry',
    category: 'IoT',
    skills: ['C++', 'Embedded C', 'ESP32', 'LoRaWAN'],
    university: 'Birla Institute of Technology (BIT) Mesra',
    description:
      'Fabricate low-power telemetry boards to transmit sub-surface fluoride ion concentration readings from Namkum deep borewells.',
    status: 'Joined',
    urgency: 'Critical',
    estimatedDuration: '16 Weeks',
  },
  {
    id: 'exp-03',
    code: 'JH-HLT-2026-00412',
    title: 'Community Telemedicine Mobile Diagnostic Kiosk',
    category: 'Healthcare',
    skills: ['React', 'WebRTC', 'FastAPI', 'Bluetooth Health Sensors'],
    university: 'Rajendra Institute of Medical Sciences (RIMS) Ranchi',
    description:
      'Build an offline-first rural health kiosk connecting ASHA workers with district specialist doctors for pediatric vitals triage.',
    status: 'Open',
    urgency: 'High',
    estimatedDuration: '14 Weeks',
  },
  {
    id: 'exp-04',
    code: 'JH-AGR-2026-00331',
    title: 'Smart Drip Irrigation Solar Automated Valve Controller',
    category: 'Agriculture',
    skills: ['IoT', 'Microcontrollers', 'Soil Moisture Telemetry'],
    university: 'Birsa Agricultural University (BAU) Kanke',
    description:
      'Design decentralized solar-actuated water valves that trigger automated furrow irrigation based on soil tension curves.',
    status: 'Open',
    urgency: 'Medium',
    estimatedDuration: '10 Weeks',
  },
  {
    id: 'exp-05',
    code: 'JH-ENG-2026-00109',
    title: 'Solar Microgrid Battery State-of-Health Diagnostic Web UI',
    category: 'IoT',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'ChartJS'],
    university: 'IIT (ISM) Dhanbad',
    description:
      'Develop real-time battery degradation analytics dashboard for off-grid Netarhat plateau tribal microgrid inverter arrays.',
    status: 'Open',
    urgency: 'Medium',
    estimatedDuration: '8 Weeks',
  },
];

// Team Members for Smart Water Monitoring
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-mentor',
    name: 'Dr. Sharma',
    role: 'Faculty Mentor & PI',
    dept: 'Environmental Science & Engineering',
    avatar: '👨‍🏫',
    isMentor: true,
  },
  {
    id: 'tm-rahul',
    name: 'Rahul',
    role: 'Backend Developer',
    dept: 'Computer Science & Engineering',
    avatar: '👨‍🎓',
  },
  {
    id: 'tm-priya',
    name: 'Priya',
    role: 'AI / ML Specialist',
    dept: 'Electronics & Communication',
    avatar: '👩‍🎓',
  },
  {
    id: 'tm-amit',
    name: 'Amit',
    role: 'IoT Hardware Engineer',
    dept: 'Mechanical & Automation',
    avatar: '👨‍🎓',
  },
  {
    id: 'tm-himmat',
    name: 'Himmat',
    role: 'Frontend Developer',
    dept: 'Computer Science & Engineering',
    avatar: '👨‍🎓',
  },
];

// Project Updates / Discussion Stream
export const INITIAL_TEAM_COMMENTS: TeamComment[] = [
  {
    id: 'com-01',
    author: 'Dr. Sharma',
    role: 'Faculty Mentor',
    avatar: '👨‍🏫',
    message:
      'Team: ABC Technologies has confirmed delivery of 20 fluoride probes for our 15 Sept Namkum pilot. Amit & Himmat, ensure the telemetry kiosk UI and mounting brackets are finalized by tomorrow.',
    timestamp: 'Yesterday at 5:30 PM',
  },
  {
    id: 'com-02',
    author: 'Rahul',
    role: 'Backend',
    avatar: '👨‍🎓',
    message:
      'FastAPI endpoint v2.1 is now deployed on the university GPU cluster. Telemetry payload schema has been updated in repo. Himmat, you can pull the latest branch.',
    timestamp: 'Today at 10:15 AM',
  },
  {
    id: 'com-03',
    author: 'Himmat',
    role: 'Frontend',
    avatar: '👨‍🎓',
    message:
      'Thanks Rahul! Testing the new borewell telemetry card widgets now. Submitting Dashboard v1 package for Dr. Sharma’s review this afternoon.',
    timestamp: 'Today at 11:40 AM',
  },
];

// Deliverables Submitted by Himmat
export const INITIAL_STUDENT_DELIVERABLES: StudentDeliverable[] = [
  {
    id: 'del-01',
    project: 'Smart Water Monitoring',
    type: 'Prototype',
    title: 'Water Dashboard v1',
    fileName: 'water-dashboard-v1.zip',
    fileSize: '14.2 MB',
    description:
      'Implemented rural monitoring dashboard with live sensor telemetry gauges, fluoride hazard indicator, and offline SQLite cache.',
    submittedAt: '10 Sept, 4:45 PM',
    status: 'Pending Review',
    proofOfWork: {
      liveDemoUrl: 'https://samadhansetu-water-telemetry.vercel.app',
      githubRepoUrl: 'https://github.com/himmat07/water-telemetry-firmware',
      videoWalkthroughUrl: 'https://loom.com/share/water-monitoring-prototype-demo',
      fieldPhotoName: 'namkum_borewell_fluoride_test.jpg',
      gpsCoordinates: '23.3441° N, 85.3096° E (Birla Chowk, Namkum)',
      photoCaption: 'Sample extraction from tube-well cluster exhibiting 3.2 mg/L fluoride precipitation.',
    },
  },
  {
    id: 'del-02',
    project: 'Smart Water Monitoring',
    type: 'Technical Report',
    title: 'UI Wireframe & User Experience Specification',
    fileName: 'Panchayat_Kiosk_UX_Spec_v1.pdf',
    fileSize: '3.8 MB',
    description:
      'Detailed screen flows and accessibility contrast audit for rural Panchayat workers operating on low-cost Android tablets.',
    submittedAt: '04 Sept, 2:15 PM',
    status: 'Approved',
    mentorFeedback: 'Approved by Dr. Sharma. Great attention to multi-lingual labeling for village operators.',
    proofOfWork: {
      githubRepoUrl: 'https://github.com/himmat07/panchayat-kiosk-specs',
      gpsCoordinates: '23.4682° N, 85.0934° E (Mandar Kisan Kendra)',
      photoCaption: 'Tablet interface usability testing with panchayat committee representatives.',
    },
  },
];

// Achievements & Innovation Profile
export const STUDENT_ACHIEVEMENTS: StudentAchievement = {
  projectsCompleted: 3,
  problemsSolved: 2,
  industryCollaborations: 2,
  prototypesBuilt: 3,
  skills: [
    { name: 'React', level: 85, label: 'Advanced' },
    { name: 'AI', level: 60, label: 'Intermediate' },
    { name: 'IoT', level: 50, label: 'Working Knowledge' },
    { name: 'Research', level: 70, label: 'Proficient' },
    { name: 'TypeScript', level: 80, label: 'Advanced' },
    { name: 'UI/UX Design', level: 75, label: 'Proficient' },
    { name: 'REST APIs', level: 85, label: 'Advanced' },
    { name: 'Git & DevOps', level: 80, label: 'Advanced' },
  ],
  trophies: [
    {
      id: 'trp-01',
      title: 'Community Impact Contributor',
      desc: 'Awarded for deploying drinking water quality kiosks benefiting 14,000+ Namkum villagers.',
      icon: '🏆',
      date: 'Aug 2026',
    },
    {
      id: 'trp-02',
      title: 'Innovation Project Completed',
      desc: 'Successfully delivered an ICAR-empaneled foliar disease AI classifier on mobile edge devices.',
      icon: '🎖️',
      date: 'July 2026',
    },
    {
      id: 'trp-03',
      title: 'Industry Collaboration',
      desc: 'Formally recognized by Tata Steel CSR & ABC Technologies for engineering co-development.',
      icon: '🤝',
      date: 'Sept 2026',
    },
  ],
};
