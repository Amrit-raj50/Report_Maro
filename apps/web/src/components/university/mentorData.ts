export interface MentorStudent {
  id: string;
  name: string;
  role: string;
  dept: string;
  rollNo: string;
  projectTitle: string;
  tasksAssigned: number;
  tasksCompleted: number;
  avatarIcon: string;
  status: 'Active' | 'On Leave' | 'Reviewing';
  email: string;
}

export interface MentorTask {
  id: string;
  title: string;
  projectTitle: string;
  projectCode: string;
  assigneeName: string;
  assigneeRole: string;
  status: 'Completed' | 'In Progress' | 'Due' | 'Overdue';
  priority: 'High' | 'Medium' | 'Critical';
  dueDate: string;
  description: string;
}

export interface EvaluationRubric {
  technicalFeasibility: number; // 1-5
  civicImpact: number; // 1-5
  codePrototypeQuality: number; // 1-5
  fieldTestingData: number; // 1-5
  totalScore: number; // 4 - 20
  scorePercentage: number; // 20% - 100%
  gradeBand: string; // 'Grade A+ (Exemplary)', etc.
  evaluatedAt?: string;
  evaluatorName?: string;
  receiptNumber?: string;
}

export interface EvaluationReceipt {
  receiptId: string;
  submissionId: string;
  submissionNumber: number;
  studentName: string;
  studentRole: string;
  projectTitle: string;
  deliverableTitle: string;
  evaluatedAt: string;
  evaluatorName: string;
  evaluatorTitle: string;
  evaluatorDept: string;
  institutionName: string;
  rubric: EvaluationRubric;
  decision: 'approved' | 'changes_requested';
  feedbackText: string;
  verificationHash: string;
}

export function calculateGradeBand(totalScore: number): {
  gradeBand: string;
  color: string;
} {
  if (totalScore >= 18) {
    return { gradeBand: 'Grade A+ (Exemplary / State Honors)', color: 'text-forest' };
  } else if (totalScore >= 15) {
    return { gradeBand: 'Grade A (Commended / Pilot Ready)', color: 'text-forest' };
  } else if (totalScore >= 12) {
    return { gradeBand: 'Grade B+ (Satisfactory / Minor Revisions)', color: 'text-turmeric-deep' };
  } else if (totalScore >= 9) {
    return { gradeBand: 'Grade B (Marginal / Revisions Mandated)', color: 'text-urgent' };
  } else {
    return { gradeBand: 'Grade C (Unsatisfactory / Rework Required)', color: 'text-urgent' };
  }
}

export interface MentorSubmission {
  id: string;
  submissionNumber: number;
  studentName: string;
  studentRole: string;
  projectTitle: string;
  deliverableTitle: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'changes_requested';
  documentSummary: string;
  technicalSpecs: {
    datasetSize?: string;
    modelAccuracy?: string;
    testCasesPassed?: string;
    latency?: string;
  };
  professorFeedback?: string;
  grade?: string;
  rubric?: EvaluationRubric;
  evaluationReceipt?: EvaluationReceipt;
}

export interface MentorMilestone {
  id: string;
  stageNumber: number;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  symbol: string; // '✓' | '◉' | '○'
  dueDate: string;
  completionDate?: string;
  deliverable: string;
  description: string;
}

export interface IndustryMessage {
  id: string;
  sender: 'mentor' | 'industry';
  senderName: string;
  role: string;
  company: string;
  message: string;
  timestamp: string;
  attachment?: string;
}

export interface MentorProject {
  id: string;
  code: string;
  title: string;
  icon: string;
  problem: string;
  teamSize: number;
  progress: number;
  currentStage: string;
  nextMilestone: string;
  deadline: string;
  pendingTasks: number;
  pendingReviews: number;
  category: string;
  budget: string;
  industryPartnerName: string;
  industryMentor: string;
}

// 4 Active Projects assigned to Dr. Sharma
export const INITIAL_MENTOR_PROJECTS: MentorProject[] = [
  {
    id: 'm-prj-01',
    code: 'JH-PRJ-2026-042',
    title: 'Smart Water Monitoring',
    icon: '💧',
    problem: 'Water contamination in village (Fluoride & Heavy Metal Contamination in Namkum Sub-Surface Borewells)',
    teamSize: 5,
    progress: 72,
    currentStage: 'Prototype',
    nextMilestone: 'Field Testing',
    deadline: '15 Sept',
    pendingTasks: 2,
    pendingReviews: 1,
    category: 'Water Resources & IoT',
    budget: '₹6,50,000',
    industryPartnerName: 'ABC Technologies (Tata Steel CSR)',
    industryMentor: 'Rahul Mehta',
  },
  {
    id: 'm-prj-02',
    code: 'JH-PRJ-2026-028',
    title: 'Crop Disease AI',
    icon: '🌾',
    problem: 'Early foliar blight in tribal lac host trees & Kharif paddy cultivation across Ormanjhi & Mandar blocks',
    teamSize: 4,
    progress: 45,
    currentStage: 'Development',
    nextMilestone: 'Offline Model Training & Edge Quantization',
    deadline: '18 Sept',
    pendingTasks: 3,
    pendingReviews: 1,
    category: 'Agriculture & Edge AI',
    budget: '₹3,20,000',
    industryPartnerName: 'XYZ Labs (MECON Agro-Tech Cell)',
    industryMentor: 'Dr. Vivek Swaminathan',
  },
  {
    id: 'm-prj-03',
    code: 'JH-PRJ-2026-017',
    title: 'Mine Dust Suppression Automated Cannon',
    icon: '🏭',
    problem: 'Continuous PM10/PM2.5 particulate emission control at North Karanpura Open Cast Coal Quarry face',
    teamSize: 4,
    progress: 88,
    currentStage: 'Field Validation',
    nextMilestone: 'Continuous 72-hr Quarry Face Trial',
    deadline: '25 Sept',
    pendingTasks: 1,
    pendingReviews: 2,
    category: 'Environmental Engineering',
    budget: '₹8,50,000',
    industryPartnerName: 'Central Coalfields Limited (CCL)',
    industryMentor: 'Er. Sandeep Bagchi',
  },
  {
    id: 'm-prj-04',
    code: 'JH-PRJ-2026-009',
    title: 'Solar Microgrid Remote Battery Telemetry Unit',
    icon: '☀️',
    problem: 'Decentralized off-grid inverter & battery degradation diagnostics across Netarhat Plateau tribal habitations',
    teamSize: 3,
    progress: 30,
    currentStage: 'Development',
    nextMilestone: 'LoRaWAN Telemetry Board Calibration',
    deadline: '30 Sept',
    pendingTasks: 2,
    pendingReviews: 2,
    category: 'Renewable Energy & IoT',
    budget: '₹4,80,000',
    industryPartnerName: 'JREDA Renewable Research Consortium',
    industryMentor: 'Er. Pankaj Tigga',
  },
];

// Project Team for Dr. Sharma (focusing on Smart Water Monitoring and cross-team researchers)
export const INITIAL_STUDENT_TEAM: MentorStudent[] = [
  {
    id: 'st-01',
    name: 'Rahul',
    role: 'Backend Developer',
    dept: 'Computer Science & Engg',
    rollNo: '22CS014',
    projectTitle: 'Smart Water Monitoring',
    tasksAssigned: 5,
    tasksCompleted: 4,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'rahul.22cs@nitjsr.ac.in',
  },
  {
    id: 'st-02',
    name: 'Priya',
    role: 'AI/ML',
    dept: 'Electronics & Communication',
    rollNo: '22ECE042',
    projectTitle: 'Smart Water Monitoring',
    tasksAssigned: 4,
    tasksCompleted: 3,
    avatarIcon: '👩‍🎓',
    status: 'Reviewing',
    email: 'priya.soren@nitjsr.ac.in',
  },
  {
    id: 'st-03',
    name: 'Amit',
    role: 'IoT',
    dept: 'Mechanical & Automation',
    rollNo: '22ME009',
    projectTitle: 'Smart Water Monitoring',
    tasksAssigned: 4,
    tasksCompleted: 2,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'amit.roy@nitjsr.ac.in',
  },
  {
    id: 'st-04',
    name: 'Himmat',
    role: 'Frontend',
    dept: 'Civil & Geo-Informatics',
    rollNo: '23CIV031',
    projectTitle: 'Smart Water Monitoring',
    tasksAssigned: 3,
    tasksCompleted: 1,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'himmat.singh@nitjsr.ac.in',
  },
  {
    id: 'st-05',
    name: 'Neha',
    role: 'Research',
    dept: 'Chemical & Materials',
    rollNo: '24CHE005',
    projectTitle: 'Smart Water Monitoring',
    tasksAssigned: 4,
    tasksCompleted: 3,
    avatarIcon: '👩‍🎓',
    status: 'Active',
    email: 'neha.murmu@nitjsr.ac.in',
  },
  // Additional students across Dr. Sharma's 16 student cohort
  {
    id: 'st-06',
    name: 'Ankit Verma',
    role: 'Lead ML Engineer',
    dept: 'Computer Science',
    rollNo: '22CS011',
    projectTitle: 'Crop Disease AI',
    tasksAssigned: 4,
    tasksCompleted: 3,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'ankit.v@nitjsr.ac.in',
  },
  {
    id: 'st-07',
    name: 'Pooja Munda',
    role: 'Edge Quantization',
    dept: 'Information Technology',
    rollNo: '23IT029',
    projectTitle: 'Crop Disease AI',
    tasksAssigned: 3,
    tasksCompleted: 2,
    avatarIcon: '👩‍🎓',
    status: 'Active',
    email: 'pooja.m@nitjsr.ac.in',
  },
  {
    id: 'st-08',
    name: 'Vikash Mahato',
    role: 'Mobile Developer',
    dept: 'Information Technology',
    rollNo: '22IT045',
    projectTitle: 'Crop Disease AI',
    tasksAssigned: 4,
    tasksCompleted: 2,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'vikash.m@nitjsr.ac.in',
  },
  {
    id: 'st-09',
    name: 'Ritu Kumari',
    role: 'Agronomy Data Curator',
    dept: 'Agro-Tech',
    rollNo: '23AGR008',
    projectTitle: 'Crop Disease AI',
    tasksAssigned: 3,
    tasksCompleted: 3,
    avatarIcon: '👩‍🎓',
    status: 'Active',
    email: 'ritu.k@nitjsr.ac.in',
  },
  {
    id: 'st-10',
    name: 'Sunil Hembrom',
    role: 'Lead Field Engineer',
    dept: 'Mining Engineering',
    rollNo: '22MIN003',
    projectTitle: 'Mine Dust Suppression',
    tasksAssigned: 4,
    tasksCompleted: 4,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'sunil.h@nitjsr.ac.in',
  },
  {
    id: 'st-11',
    name: 'Deepak Kumar',
    role: 'Sensor Array Telemetry',
    dept: 'Electronics & Comm',
    rollNo: '22ECE018',
    projectTitle: 'Mine Dust Suppression',
    tasksAssigned: 3,
    tasksCompleted: 3,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'deepak.k@nitjsr.ac.in',
  },
  {
    id: 'st-12',
    name: 'Nisha Tirkey',
    role: 'Dispersal Analytics',
    dept: 'Environmental Engg',
    rollNo: '23ENV007',
    projectTitle: 'Mine Dust Suppression',
    tasksAssigned: 4,
    tasksCompleted: 3,
    avatarIcon: '👩‍🎓',
    status: 'Active',
    email: 'nisha.t@nitjsr.ac.in',
  },
  {
    id: 'st-13',
    name: 'Rohan Singh',
    role: 'Nozzle Hydraulics Skid',
    dept: 'Mechanical Engg',
    rollNo: '22ME034',
    projectTitle: 'Mine Dust Suppression',
    tasksAssigned: 3,
    tasksCompleted: 2,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'rohan.s@nitjsr.ac.in',
  },
  {
    id: 'st-14',
    name: 'Manish Toppo',
    role: 'Power Inverter Firmware',
    dept: 'Electrical Engg',
    rollNo: '22EEE005',
    projectTitle: 'Solar Microgrid Remote Battery',
    tasksAssigned: 3,
    tasksCompleted: 1,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'manish.t@nitjsr.ac.in',
  },
  {
    id: 'st-15',
    name: 'Kavita Das',
    role: 'LoRaWAN Long-Range Telemetry',
    dept: 'Electronics & Comm',
    rollNo: '23ECE012',
    projectTitle: 'Solar Microgrid Remote Battery',
    tasksAssigned: 4,
    tasksCompleted: 1,
    avatarIcon: '👩‍🎓',
    status: 'Active',
    email: 'kavita.d@nitjsr.ac.in',
  },
  {
    id: 'st-16',
    name: 'Sanjay Murmu',
    role: 'Battery Health Chemistry',
    dept: 'Electrical Engg',
    rollNo: '22EEE027',
    projectTitle: 'Solar Microgrid Remote Battery',
    tasksAssigned: 3,
    tasksCompleted: 1,
    avatarIcon: '👨‍🎓',
    status: 'Active',
    email: 'sanjay.m@nitjsr.ac.in',
  },
];

// Tasks strictly including the prompt-specified items:
// ☑ Research water-quality sensors - Rahul - Completed
// ◉ Build AI classification API - Priya - In Progress
// ◯ Prepare field-testing report - Amit - Due: 15 Sept
// 🔴 Fix mobile UI - Himmat - Overdue
export const INITIAL_MENTOR_TASKS: MentorTask[] = [
  {
    id: 'tsk-01',
    title: 'Research water-quality sensors',
    projectTitle: 'Smart Water Monitoring',
    projectCode: 'JH-PRJ-2026-042',
    assigneeName: 'Rahul',
    assigneeRole: 'Backend Developer',
    status: 'Completed',
    priority: 'High',
    dueDate: '08 Sept 2026',
    description: 'Procure datasheets and pinout diagrams for CPCB Grade-A Fluoride and Heavy Metal ion-selective electrodes.',
  },
  {
    id: 'tsk-02',
    title: 'Build AI classification API',
    projectTitle: 'Smart Water Monitoring',
    projectCode: 'JH-PRJ-2026-042',
    assigneeName: 'Priya',
    assigneeRole: 'AI/ML',
    status: 'In Progress',
    priority: 'Critical',
    dueDate: '12 Sept 2026',
    description: 'Deploy FastAPI microservice wrapping the contamination anomaly detection model with JSON schema validation.',
  },
  {
    id: 'tsk-03',
    title: 'Prepare field-testing report',
    projectTitle: 'Smart Water Monitoring',
    projectCode: 'JH-PRJ-2026-042',
    assigneeName: 'Amit',
    assigneeRole: 'IoT',
    status: 'Due',
    priority: 'High',
    dueDate: '15 Sept 2026',
    description: 'Compile bench calibration test results and Namkum PHC deep-borewell field trial deployment methodology.',
  },
  {
    id: 'tsk-04',
    title: 'Fix mobile UI',
    projectTitle: 'Smart Water Monitoring',
    projectCode: 'JH-PRJ-2026-042',
    assigneeName: 'Himmat',
    assigneeRole: 'Frontend',
    status: 'Overdue',
    priority: 'Critical',
    dueDate: '09 Sept 2026',
    description: 'Resolve offline cached telemetry rendering glitch on low-resolution Android tablet devices used by Panchayat field workers.',
  },
  {
    id: 'tsk-05',
    title: 'Spectrophotometric baseline assays',
    projectTitle: 'Smart Water Monitoring',
    projectCode: 'JH-PRJ-2026-042',
    assigneeName: 'Neha',
    assigneeRole: 'Research',
    status: 'Completed',
    priority: 'Medium',
    dueDate: '05 Sept 2026',
    description: 'Complete laboratory SPADNS photometric assay on 18 Namkum water samples to establish baseline fluoride calibration curves.',
  },
  {
    id: 'tsk-06',
    title: 'Foliar blight image segmentation pipeline',
    projectTitle: 'Crop Disease AI',
    projectCode: 'JH-PRJ-2026-028',
    assigneeName: 'Ankit Verma',
    assigneeRole: 'Lead ML Engineer',
    status: 'In Progress',
    priority: 'High',
    dueDate: '16 Sept 2026',
    description: 'Train YOLOv8-seg model on 1,800 Mandar farm leaf captures with synthetic augmentation.',
  },
  {
    id: 'tsk-07',
    title: 'Deploy TFLite model on low-cost smartphone',
    projectTitle: 'Crop Disease AI',
    projectCode: 'JH-PRJ-2026-028',
    assigneeName: 'Vikash Mahato',
    assigneeRole: 'Mobile Developer',
    status: 'Overdue',
    priority: 'Critical',
    dueDate: '07 Sept 2026',
    description: 'Resolve native JNI camera thread lockup during live leaf edge inference on MediaTek chipsets.',
  },
  {
    id: 'tsk-08',
    title: '72-hr continuous quarry mist cannon validation',
    projectTitle: 'Mine Dust Suppression',
    projectCode: 'JH-PRJ-2026-017',
    assigneeName: 'Sunil Hembrom',
    assigneeRole: 'Lead Field Engineer',
    status: 'Due',
    priority: 'High',
    dueDate: '15 Sept 2026',
    description: 'Monitor diesel generator load and high-pressure nozzle wear during continuous shift operation at Karanpura quarry face.',
  },
  {
    id: 'tsk-09',
    title: 'BMS cell balance telemetry bugfix',
    projectTitle: 'Solar Microgrid Remote Battery',
    projectCode: 'JH-PRJ-2026-009',
    assigneeName: 'Manish Toppo',
    assigneeRole: 'Power Inverter Firmware',
    status: 'Overdue',
    priority: 'High',
    dueDate: '08 Sept 2026',
    description: 'Fix RS485 packet drop when inverter transitions from bulk charge to float absorption mode.',
  },
];

// Student Submissions Queue (including Submission #23 by Priya)
export const INITIAL_MENTOR_SUBMISSIONS: MentorSubmission[] = [
  {
    id: 'sub-23',
    submissionNumber: 23,
    studentName: 'Priya',
    studentRole: 'AI/ML Researcher',
    projectTitle: 'Smart Water Monitoring',
    deliverableTitle: 'AI Classification Report',
    submittedAt: '10 Sept, 4:20 PM',
    status: 'pending',
    documentSummary:
      'This comprehensive deliverable details the machine learning architecture for multi-spectral borewell water quality classification. Evaluated on 1,200 lab assay records with 94.2% accuracy in distinguishing safe potable limits from fluoride-toxic contamination.',
    technicalSpecs: {
      datasetSize: '1,200 Water Samples',
      modelAccuracy: '94.2% F1-Score',
      testCasesPassed: '48 / 50 Bench Tests',
      latency: '42ms Edge Inference',
    },
    professorFeedback: '',
    grade: '',
  },
  {
    id: 'sub-22',
    submissionNumber: 22,
    studentName: 'Amit',
    studentRole: 'IoT Engineer',
    projectTitle: 'Smart Water Monitoring',
    deliverableTitle: 'Telemetry Circuit Schematic & PCB Gerber Files',
    submittedAt: '10 Sept, 11:15 AM',
    status: 'pending',
    documentSummary:
      'Schematic and 4-layer PCB design for solar-powered telemetry board integrating CPCB fluoride probe, STM32 low-power microcontroller, and 4G NB-IoT modem.',
    technicalSpecs: {
      datasetSize: 'Gerber RS-274X',
      modelAccuracy: 'PCB Rev 2.1',
      testCasesPassed: '100% DRC Clean',
      latency: '3.2W Peak Draw',
    },
    professorFeedback: '',
    grade: '',
  },
  {
    id: 'sub-21',
    submissionNumber: 21,
    studentName: 'Ankit Verma',
    studentRole: 'Lead ML Engineer',
    projectTitle: 'Crop Disease AI',
    deliverableTitle: 'Foliar Blight Dataset Validation & Confusion Matrix',
    submittedAt: '09 Sept, 6:45 PM',
    status: 'pending',
    documentSummary:
      'Annotated dataset of 1,800 images covering early leaf blight in Ber and Kusumi trees with bounding box segmentations validated by Mandar agricultural extension officers.',
    technicalSpecs: {
      datasetSize: '1,800 Geo-tagged Images',
      modelAccuracy: '91.8% Mean IoU',
      testCasesPassed: '34 / 35 Class Splits',
      latency: '18 FPS on MobileNet',
    },
    professorFeedback: '',
    grade: '',
  },
  {
    id: 'sub-20',
    submissionNumber: 20,
    studentName: 'Sunil Hembrom',
    studentRole: 'Lead Field Engineer',
    projectTitle: 'Mine Dust Suppression',
    deliverableTitle: 'Nozzle Hydraulic Pressure Drop Curves',
    submittedAt: '09 Sept, 2:30 PM',
    status: 'pending',
    documentSummary:
      'Laboratory pressure loss graphs across 16 atomizing brass mist nozzles operated from 20 to 60 bar with droplet sizing measurements via Malvern laser diffraction.',
    technicalSpecs: {
      datasetSize: '16 Nozzle Geometries',
      modelAccuracy: 'Dv50: 38 Microns',
      testCasesPassed: '12 / 12 Pressure Steps',
      latency: '45 L/min Flow Rate',
    },
    professorFeedback: '',
    grade: '',
  },
  {
    id: 'sub-19',
    submissionNumber: 19,
    studentName: 'Kavita Das',
    studentRole: 'LoRaWAN Telemetry',
    projectTitle: 'Solar Microgrid Remote Battery',
    deliverableTitle: 'Hill Range LoRa RSSI Propagation Study',
    submittedAt: '08 Sept, 5:10 PM',
    status: 'pending',
    documentSummary:
      'Signal strength and packet error rate mapping from Netarhat plateau crest down to valley tribal hamlets over 868 MHz LoRa channels.',
    technicalSpecs: {
      datasetSize: '450 Field GPS Points',
      modelAccuracy: 'Max Range: 11.4 km',
      testCasesPassed: '98.4% Packet Delivery',
      latency: '1.2s Transmit Interval',
    },
    professorFeedback: '',
    grade: '',
  },
  {
    id: 'sub-18',
    submissionNumber: 18,
    studentName: 'Neha',
    studentRole: 'Chemical Research',
    projectTitle: 'Smart Water Monitoring',
    deliverableTitle: 'SPADNS Reagent Photometric Precision Report',
    submittedAt: '08 Sept, 12:00 PM',
    status: 'pending',
    documentSummary:
      'Linear calibration standard curve validation using UV-Vis spectrophotometer for automated spectrophotometric fluoride determination in Namkum high-alkalinity wells.',
    technicalSpecs: {
      datasetSize: '24 Dilution Replicates',
      modelAccuracy: 'R² = 0.9984',
      testCasesPassed: 'Pass (0.1 - 4.0 ppm)',
      latency: '5 Min Reaction Time',
    },
    professorFeedback: '',
    grade: '',
  },
];

// Project Timeline Milestones (as explicitly requested):
// Research ✓
// Requirements ✓
// Architecture ✓
// Prototype ◉
// Testing ○
// Pilot ○
// Deployment ○
export const INITIAL_PROJECT_TIMELINE: MentorMilestone[] = [
  {
    id: 'mil-1',
    stageNumber: 1,
    name: 'Research',
    status: 'completed',
    symbol: '✓',
    dueDate: '20 July 2026',
    completionDate: '18 July 2026',
    deliverable: 'Comprehensive Literature Review & Field Hydro-Geological Survey',
    description: 'Assessed historical fluoride aquifer maps, heavy metal toxicity limits, and published electro-coagulation patents.',
  },
  {
    id: 'mil-2',
    stageNumber: 2,
    name: 'Requirements',
    status: 'completed',
    symbol: '✓',
    dueDate: '05 August 2026',
    completionDate: '03 August 2026',
    deliverable: 'Technical Specification Document & CPCB Sensor Compliance Norms',
    description: 'Finalized telemetry sampling frequencies, power budget (solar 12V 40Ah), and rural Panchayat ruggedness criteria.',
  },
  {
    id: 'mil-3',
    stageNumber: 3,
    name: 'Architecture',
    status: 'completed',
    symbol: '✓',
    dueDate: '20 August 2026',
    completionDate: '19 August 2026',
    deliverable: 'System Hardware Architecture & Edge AI Pipeline Design',
    description: 'Dual-sensor chamber design, analog front-end isolation, LoRa/GSM fallback protocol, and FastAPI backend architecture.',
  },
  {
    id: 'mil-4',
    stageNumber: 4,
    name: 'Prototype',
    status: 'current',
    symbol: '◉',
    dueDate: '15 September 2026',
    deliverable: 'Functional Benchtop Skid & Calibrated Edge AI Telemetry Board',
    description: 'Current Stage: Laboratory bench testing with Namkum water samples, electrode lifetime verification, and cloud API integration.',
  },
  {
    id: 'mil-5',
    stageNumber: 5,
    name: 'Testing',
    status: 'upcoming',
    symbol: '○',
    dueDate: '05 October 2026',
    deliverable: 'PHC Clinic Field Pilot & 14-Day Continuous Stress Test',
    description: 'Installation of 500 LPH pilot skid at Namkum Primary Health Centre tube-well with daily automated assays.',
  },
  {
    id: 'mil-6',
    stageNumber: 6,
    name: 'Pilot',
    status: 'upcoming',
    symbol: '○',
    dueDate: '25 October 2026',
    deliverable: 'Community Water Dispensing Pilot & Panchayat Operator Handover',
    description: 'Deployment across 3 deep-borewells serving 450 households; training village water committee in daily operation.',
  },
  {
    id: 'mil-7',
    stageNumber: 7,
    name: 'Deployment',
    status: 'upcoming',
    symbol: '○',
    dueDate: '15 November 2026',
    deliverable: 'District-Wide Rollout Charter & Open Source Firmware Release',
    description: 'Final state handover to Jharkhand Drinking Water & Sanitation Department (DWSD).',
  },
];

// Industry Communication with ABC Technologies / Rahul Mehta
export const INITIAL_INDUSTRY_MESSAGES: IndustryMessage[] = [
  {
    id: 'msg-01',
    sender: 'industry',
    senderName: 'Rahul Mehta',
    role: 'Senior Engineering Director',
    company: 'ABC Technologies (Tata Steel CSR)',
    message: 'Hello Dr. Sharma, our CSR board has approved the technical co-sponsorship grant for the Smart Water Monitoring initiative.',
    timestamp: '06 Sept, 10:15 AM',
  },
  {
    id: 'msg-02',
    sender: 'mentor',
    senderName: 'Dr. Rajesh Sharma',
    role: 'Faculty Mentor / Dean R&D',
    company: 'NIT Jamshedpur',
    message: 'Thank you Mr. Mehta. Our student investigators (led by Rahul & Priya) have completed the benchtop electro-coagulation chamber and are finalizing the IoT telemetry board.',
    timestamp: '07 Sept, 11:30 AM',
  },
  {
    id: 'msg-03',
    sender: 'industry',
    senderName: 'Rahul Mehta',
    role: 'Senior Engineering Director',
    company: 'ABC Technologies (Tata Steel CSR)',
    message: 'That is outstanding progress. We can provide the water quality sensors for field testing.',
    timestamp: '09 Sept, 3:45 PM',
    attachment: 'ABC_Sensor_Telemetry_Shipment_Manifest_v2.pdf',
  },
  {
    id: 'msg-04',
    sender: 'mentor',
    senderName: 'Dr. Rajesh Sharma',
    role: 'Faculty Mentor / Dean R&D',
    company: 'NIT Jamshedpur',
    message: 'That will significantly accelerate our Namkum PHC pilot scheduled for 15th September. I have Amit and Himmat preparing the field test mounting bracket.',
    timestamp: '10 Sept, 9:20 AM',
  },
];

// Documents Repository
export const MENTOR_DOCUMENTS = [
  {
    id: 'doc-01',
    title: 'Namkum Aquifer Fluoride Geochemical Analysis.pdf',
    type: 'PDF Report',
    size: '4.8 MB',
    date: '02 Sept 2026',
    author: 'Neha (Research)',
    category: 'Water Quality',
  },
  {
    id: 'doc-02',
    title: 'Water_Telemetry_Board_Schematics_Rev2.dwg',
    type: 'CAD Drawing',
    size: '12.4 MB',
    date: '05 Sept 2026',
    author: 'Amit (IoT)',
    category: 'Hardware',
  },
  {
    id: 'doc-03',
    title: 'AI_Classification_Model_Weights_MobileNetV3.onnx',
    type: 'Model Binary',
    size: '8.2 MB',
    date: '09 Sept 2026',
    author: 'Priya (AI/ML)',
    category: 'Edge AI',
  },
  {
    id: 'doc-04',
    title: 'Industry_Sponsorship_Agreement_ABC_Tech.pdf',
    type: 'Legal Document',
    size: '1.9 MB',
    date: '01 Sept 2026',
    author: 'Dr. Rajesh Sharma',
    category: 'Industry',
  },
  {
    id: 'doc-05',
    title: 'CPCB_Grade_A_Water_Standard_Compliance_Sheet.xlsx',
    type: 'Excel Sheet',
    size: '640 KB',
    date: '08 Sept 2026',
    author: 'Rahul (Backend)',
    category: 'Standards',
  },
];
