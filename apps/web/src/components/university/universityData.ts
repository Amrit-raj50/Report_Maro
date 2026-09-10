export interface ChallengeItem {
  id: string;
  code: string;
  title: string;
  subTitle: string;
  category: 'water' | 'agriculture' | 'energy' | 'health' | 'urban' | 'environment' | 'education';
  categoryLabel: string;
  district: string;
  block: string;
  locationDetails: string;
  priority: 'critical' | 'high' | 'medium';
  priorityLabel: string;
  aiMatchScore: number;
  status: 'recommended' | 'under_evaluation' | 'accepted' | 'rejected';
  dateReported: string;
  reportedBy: string;
  requiredExpertise: string[];
  matchReasons: string[];
  description: string;
  citizenEvidence: string;
  potentialImpact: string;
  estimatedBudget: string;
  suggestedTimeline: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  challengeRef: string;
  sector: string;
  mentorName: string;
  mentorTitle: string;
  mentorDept: string;
  teamSize: number;
  students: { name: string; rollNo: string; role: string; dept: string }[];
  progress: number;
  status: 'Prototype' | 'Development' | 'Field Validation' | 'Completed';
  statusColor: string;
  industryPartner?: {
    name: string;
    contribution: string;
    status: 'Active' | 'Pending' | 'Committed';
  };
  startDate: string;
  targetDate: string;
  budgetAllocated: string;
  currentMilestone: string;
  milestones: { title: string; dueDate: string; done: boolean }[];
}

export interface FacultyMentor {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualifications: string;
  experienceYears: number;
  specialization: string[];
  activeProjects: number;
  maxCapacity: number;
  email: string;
  phone: string;
}

export interface StudentInvestigator {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  year: string;
  assignedProjectCode?: string;
  skills: string[];
  cgpa: string;
}

export interface IndustryPartnerItem {
  id: string;
  name: string;
  division: string;
  projectLinked: string;
  projectCode: string;
  contributionType: 'Financial + Hardware' | 'Technical Mentorship' | 'Equipment Grant' | 'Pilot Deployment';
  contributionDetails: string;
  mouRefNumber: string;
  mouDate: string;
  status: 'Active' | 'Pending' | 'Review';
  liaisonOfficer: string;
  contactEmail: string;
}

export interface UniversityProposal {
  id: string;
  memoNumber: string;
  title: string;
  challengeRef: string;
  facultyLead: string;
  department: string;
  budgetRequested: string;
  dateSubmitted: string;
  status: 'Under Review' | 'Sanctioned' | 'Referred Back' | 'Completed';
  appraisingBody: string;
}

export const INITIAL_CHALLENGES: ChallengeItem[] = [
  {
    id: 'c-1023',
    code: 'JH-WTR-2026-01023',
    title: 'Water Quality Monitoring',
    subTitle: 'Fluoride & Heavy Metal Contamination in Plateau Sub-Surface Borewells',
    category: 'water',
    categoryLabel: 'Water Resources / जल संसाधन',
    district: 'Ranchi',
    block: 'Namkum Block',
    locationDetails: 'Birsa Chowk Habitation, Ward 12 (Lat: 23.3441° N, Long: 85.3096° E)',
    priority: 'critical',
    priorityLabel: 'CRITICAL',
    aiMatchScore: 94,
    status: 'recommended',
    dateReported: '02 Sept 2026',
    reportedBy: 'Asha Devi (Panchayat Samiti Member)',
    requiredExpertise: ['Environmental Engineering', 'IoT Sensor Telemetry', 'Water Treatment Chemistry'],
    matchReasons: [
      'Water Research Lab (CPCB Grade-A Accredited)',
      'Department of Environmental Science & Engineering',
      'Active IoT & Embedded Telemetry Research Group',
    ],
    description:
      'Sub-surface water drawn from 4 community deep-borewells has turned brackish with documented TDS exceeding 820 ppm and fluoride concentrations at 3.2 mg/L (safety limit 1.0 mg/L). 200 rural households lack alternate potable supply.',
    citizenEvidence:
      '4 laboratory assay sheets submitted via district block office + 6 geo-tagged field photos of tube-well discharge exhibiting sediment precipitate.',
    potentialImpact:
      'Provides safe drinking water to 14,200 villagers across 18 habitations; directly prevents fluorosis in 3 primary school catchments.',
    estimatedBudget: '₹6,50,000 (State R&D Seed + Industry Co-Sponsor)',
    suggestedTimeline: '16 Weeks to Pilot Water ATM',
  },
  {
    id: 'c-1024',
    code: 'JH-AGR-2026-00845',
    title: 'Crop Disease Detection',
    subTitle: 'Early Foliar Blight in Tribal Lac Host Trees & Kharif Paddy Cultivation',
    category: 'agriculture',
    categoryLabel: 'Agriculture / कृषि एवं सूक्ष्म सिंचाई तंत्र',
    district: 'Ranchi',
    block: 'Ormanjhi & Mandar Blocks',
    locationDetails: 'Kisan Kendra Catchment, Mandar (Lat: 23.4682° N, Long: 85.0934° E)',
    priority: 'high',
    priorityLabel: 'HIGH',
    aiMatchScore: 91,
    status: 'recommended',
    dateReported: '04 Sept 2026',
    reportedBy: 'Gram Pradhan, Mandar Farmer Producer Organisation',
    requiredExpertise: ['Agricultural Engineering', 'Computer Vision', 'Edge AI Diagnostics'],
    matchReasons: [
      'ICAR-Empaneled Agro-Tech Validation Centre',
      'Department of Computer Science Vision Cell',
      'Multispectral Drone Imagery Testbed in Ormanjhi',
    ],
    description:
      'Rapidly spreading foliar necrotic spots on Ber and Kusumi lac host trees causing premature resin detachment. Farmers lack access to regional plant pathologists.',
    citizenEvidence:
      '42 high-resolution citizen smartphone leaf captures with visible brown necrotic lesions and fungal spores.',
    potentialImpact:
      'Protects annual ₹4.8 Crore tribal lac economy across Ormanjhi, Mandar, and Bero blocks.',
    estimatedBudget: '₹3,20,000',
    suggestedTimeline: '12 Weeks to Offline Mobile App',
  },
  {
    id: 'c-1025',
    code: 'JH-ENG-2026-00312',
    title: 'Solar Microgrid Telemetry & Battery Health',
    subTitle: 'Decentralized Microgrid Inverter Optimization in Off-Grid Forest Habitations',
    category: 'energy',
    categoryLabel: 'Energy / ऊर्जा एवं नवीकरणीय ऊर्जा',
    district: 'Latehar',
    block: 'Mahuadanr & Netarhat',
    locationDetails: 'Netarhat Plateau Tribal Hamlets (Lat: 23.4831° N, Long: 84.2694° E)',
    priority: 'medium',
    priorityLabel: 'MEDIUM',
    aiMatchScore: 88,
    status: 'recommended',
    dateReported: '06 Sept 2026',
    reportedBy: 'District Rural Electrification Cell',
    requiredExpertise: ['Renewable Energy Systems', 'Power Electronics', 'Battery Management Systems (BMS)'],
    matchReasons: [
      'Advanced High-Voltage & Microgrid Research Lab',
      'JREDA Empaneled Solar Audit Testing Infrastructure',
    ],
    description:
      'Lead-acid and LFP battery banks at 3 remote village microgrids experiencing premature cell sulfation due to lack of real-time state-of-charge remote telemetry.',
    citizenEvidence:
      'Inverter log sheets + photo logs of power cuts affecting 120 tribal households.',
    potentialImpact:
      'Restores continuous 24x7 rural electrification across 3 hill panchayats without diesel generator dependency.',
    estimatedBudget: '₹4,80,000',
    suggestedTimeline: '14 Weeks to Telemetry Deployment',
  },
  {
    id: 'c-1026',
    code: 'JH-HLT-2026-00540',
    title: 'Vernacular Telemedicine Speech Interface',
    subTitle: 'Speech-to-Text Clinical Intake in Santhali and Ho Languages for Rural PHCs',
    category: 'health',
    categoryLabel: 'Healthcare / स्वास्थ्य सेवाएं',
    district: 'West Singhbhum',
    block: 'Chaibasa Sadar',
    locationDetails: 'Tanto Community Health Centre (Lat: 22.5612° N, Long: 85.8124° E)',
    priority: 'high',
    priorityLabel: 'HIGH',
    aiMatchScore: 86,
    status: 'under_evaluation',
    dateReported: '07 Sept 2026',
    reportedBy: 'Medical Officer In-Charge, Tanto CHC',
    requiredExpertise: ['Natural Language Processing', 'Acoustic Modeling', 'Vernacular Speech Systems'],
    matchReasons: [
      'Centre for Indigenous Languages & AI Speech Processing Group',
      'MoU with Tribal Research Institute Ranchi',
    ],
    description:
      'Doctors posted at sub-divisional hospital unable to converse fluently in local Ho and Santhali dialects, leading to misdiagnoses in maternal and infant clinical intake.',
    citizenEvidence:
      'Official letter from Sub-Divisional Health Officer requesting digital translation assistance.',
    potentialImpact:
      'Eliminates linguistic triage barriers for 45,000 tribal patients visiting regional primary health centres.',
    estimatedBudget: '₹5,10,000',
    suggestedTimeline: '18 Weeks to Tablet Deployment',
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'prj-041',
    code: 'JH-PRJ-2026-041',
    title: 'Smart Water Monitoring (IoT Telemetry & Electro-Coagulation)',
    challengeRef: 'JH-WTR-2026-01023',
    sector: 'Water Resources & Public Health',
    mentorName: 'Dr. Rajesh Sharma',
    mentorTitle: 'Professor & Dean (R&D)',
    mentorDept: 'Dept. of Environmental Science & Engineering',
    teamSize: 5,
    students: [
      { name: 'Rahul Kumar', rollNo: '22ENV014', role: 'Lead Student Investigator', dept: 'Environmental Engg' },
      { name: 'Priya Soren', rollNo: '22ECE042', role: 'IoT Firmware & Microcontrollers', dept: 'ECE' },
      { name: 'Amit Roy', rollNo: '22ME009', role: 'Filtration Skid Fabrication', dept: 'Mechanical Engg' },
      { name: 'Himmat Singh', rollNo: '23CIV031', role: 'Field Hydrology & Sampling', dept: 'Civil Engg' },
      { name: 'Sneha Murmu', rollNo: '24CHE005', role: 'Chemical Assays & Spectrophotometry', dept: 'Chemical Engg' },
    ],
    progress: 72,
    status: 'Prototype',
    statusColor: 'var(--turmeric)',
    industryPartner: {
      name: 'ABC Technologies (Tata Steel CSR)',
      contribution: '₹5,00,000 Grant + 20 Telemetry Sensors',
      status: 'Active',
    },
    startDate: '12 July 2026',
    targetDate: '30 October 2026',
    budgetAllocated: '₹6,50,000',
    currentMilestone: 'Field Prototype Testing at Namkum PHC',
    milestones: [
      { title: 'Sub-surface water chemical assay & ion profiling', dueDate: '15 Aug 2026', done: true },
      { title: 'Electro-coagulation bench-scale prototype build', dueDate: '05 Sept 2026', done: true },
      { title: 'IoT cloud telemetry board & GSM alert calibration', dueDate: '25 Sept 2026', done: false },
      { title: 'Field trial at Namkum tube-well cluster', dueDate: '20 Oct 2026', done: false },
    ],
  },
  {
    id: 'prj-028',
    code: 'JH-PRJ-2026-028',
    title: 'Smart Agriculture (Foliar Disease AI Mobile Classifier)',
    challengeRef: 'JH-AGR-2026-00845',
    sector: 'Agriculture & Edge AI',
    mentorName: 'Dr. Anita Patel',
    mentorTitle: 'Associate Professor',
    mentorDept: 'Dept. of Information Technology',
    teamSize: 4,
    students: [
      { name: 'Ankit Verma', rollNo: '22CS011', role: 'Lead ML Engineer', dept: 'Computer Science' },
      { name: 'Pooja Munda', rollNo: '23IT029', role: 'Edge AI Quantization', dept: 'Information Tech' },
      { name: 'Vikash Mahato', rollNo: '22IT045', role: 'Offline Mobile App Developer', dept: 'Information Tech' },
      { name: 'Ritu Kumari', rollNo: '23AGR008', role: 'Agronomic Field Data Curator', dept: 'Agro-Tech' },
    ],
    progress: 45,
    status: 'Development',
    statusColor: 'var(--routed)',
    industryPartner: {
      name: 'XYZ Labs (MECON Agro-Tech Cell)',
      contribution: 'Technical Mentorship + Cloud GPU Cluster',
      status: 'Pending',
    },
    startDate: '01 August 2026',
    targetDate: '15 November 2026',
    budgetAllocated: '₹3,20,000',
    currentMilestone: 'Offline Mobile Model Training & Compression',
    milestones: [
      { title: 'Dataset curation: 1,800 annotated foliar blight images', dueDate: '20 Aug 2026', done: true },
      { title: 'MobileNetV3 transfer learning & validation (F1 > 0.92)', dueDate: '18 Sept 2026', done: false },
      { title: 'Offline APK build with Hindi & Nagpuri voice output', dueDate: '10 Oct 2026', done: false },
      { title: 'Field test across 50 Ormanjhi tribal farms', dueDate: '05 Nov 2026', done: false },
    ],
  },
  {
    id: 'prj-017',
    code: 'JH-PRJ-2026-017',
    title: 'Mine Dust Suppression Automated Telemetry Cannon',
    challengeRef: 'JH-ENV-2026-00219',
    sector: 'Environmental & Mining Tech',
    mentorName: 'Dr. S. K. Mahato',
    mentorTitle: 'Professor',
    mentorDept: 'Dept. of Mining Engineering',
    teamSize: 4,
    students: [
      { name: 'Sunil Hembrom', rollNo: '22MIN003', role: 'Lead Investigator', dept: 'Mining Engg' },
      { name: 'Deepak Kumar', rollNo: '22ECE018', role: 'PM10/PM2.5 Sensor Array', dept: 'ECE' },
      { name: 'Nisha Tirkey', rollNo: '23ENV007', role: 'Dispersal Analytics', dept: 'Environmental Engg' },
      { name: 'Rohan Singh', rollNo: '22ME034', role: 'Nozzle Hydraulics Skid', dept: 'Mechanical Engg' },
    ],
    progress: 88,
    status: 'Field Validation',
    statusColor: 'var(--in-progress)',
    industryPartner: {
      name: 'Central Coalfields Limited (CCL)',
      contribution: '₹8,50,000 Equipment Grant & North Karanpura Field Access',
      status: 'Active',
    },
    startDate: '10 May 2026',
    targetDate: '28 September 2026',
    budgetAllocated: '₹8,50,000',
    currentMilestone: 'Field Validation at North Karanpura Open Cast Mine',
    milestones: [
      { title: 'High-pressure mist nozzle manifold CAD design', dueDate: '15 June 2026', done: true },
      { title: 'IoT particulate telemetry integration with SCADA', dueDate: '10 July 2026', done: true },
      { title: 'Fabrication of mobile trailer skid', dueDate: '15 Aug 2026', done: true },
      { title: 'Continuous 72-hr quarry face trial and report', dueDate: '25 Sept 2026', done: false },
    ],
  },
  {
    id: 'prj-009',
    code: 'JH-PRJ-2026-009',
    title: 'Solar Microgrid Remote Battery Telemetry Unit',
    challengeRef: 'JH-ENG-2026-00312',
    sector: 'Energy & Power Systems',
    mentorName: 'Dr. B. K. Soren',
    mentorTitle: 'Associate Professor',
    mentorDept: 'Dept. of Electrical & Electronics Engineering',
    teamSize: 3,
    students: [
      { name: 'Manish Toppo', rollNo: '22EEE005', role: 'Lead Investigator', dept: 'EEE' },
      { name: 'Kavita Das', rollNo: '23ECE012', role: 'LoRaWAN Long-Range Telemetry', dept: 'ECE' },
      { name: 'Sanjay Murmu', rollNo: '22EEE027', role: 'Inverter Interface Board', dept: 'EEE' },
    ],
    progress: 30,
    status: 'Development',
    statusColor: 'var(--routed)',
    industryPartner: {
      name: 'JREDA Renewable Research Consortium',
      contribution: '₹4,80,000 Prototyping Support',
      status: 'Active',
    },
    startDate: '15 August 2026',
    targetDate: '20 December 2026',
    budgetAllocated: '₹4,80,000',
    currentMilestone: 'LoRaWAN Inverter Telemetry Board Fabrication',
    milestones: [
      { title: 'Netarhat microgrid site survey & inverter electrical audit', dueDate: '01 Sept 2026', done: true },
      { title: 'BMS monitoring firmware development', dueDate: '30 Sept 2026', done: false },
      { title: 'Low-power LoRa gateway field test across 12 km hill terrain', dueDate: '30 Oct 2026', done: false },
    ],
  },
];

export const FACULTY_MENTORS: FacultyMentor[] = [
  {
    id: 'fac-01',
    name: 'Dr. Rajesh Sharma',
    designation: 'Professor & Dean (R&D)',
    department: 'Dept. of Environmental Science & Engineering',
    qualifications: 'Ph.D. (IIT Roorkee), PostDoc (NUS Singapore)',
    experienceYears: 14,
    specialization: ['Water Quality Modeling', 'Electro-Coagulation', 'IoT Environmental Sensors'],
    activeProjects: 2,
    maxCapacity: 3,
    email: 'rsharma@bitmesra.ac.in',
    phone: '+91 651 227 5444',
  },
  {
    id: 'fac-02',
    name: 'Dr. Anita Patel',
    designation: 'Associate Professor',
    department: 'Dept. of Information Technology',
    qualifications: 'Ph.D. (NIT Jamshedpur)',
    experienceYears: 11,
    specialization: ['Computer Vision', 'Edge AI Diagnostics', 'Vernacular Mobile Interfaces'],
    activeProjects: 1,
    maxCapacity: 3,
    email: 'apatel@bitmesra.ac.in',
    phone: '+91 651 227 5445',
  },
  {
    id: 'fac-03',
    name: 'Dr. B. K. Soren',
    designation: 'Associate Professor',
    department: 'Dept. of Electrical & Electronics Engineering',
    qualifications: 'Ph.D. (BIT Mesra)',
    experienceYears: 9,
    specialization: ['Renewable Microgrids', 'Battery Management Systems', 'Power Electronics'],
    activeProjects: 1,
    maxCapacity: 2,
    email: 'bksoren@bitmesra.ac.in',
    phone: '+91 651 227 5446',
  },
  {
    id: 'fac-04',
    name: 'Dr. S. K. Mahato',
    designation: 'Professor',
    department: 'Dept. of Mining Engineering',
    qualifications: 'Ph.D. (IIT ISM Dhanbad)',
    experienceYears: 16,
    specialization: ['Mine Dust Telemetry', 'Quarry Safety Automation', 'Sensor Networks'],
    activeProjects: 1,
    maxCapacity: 2,
    email: 'skmahato@bitmesra.ac.in',
    phone: '+91 651 227 5447',
  },
  {
    id: 'fac-05',
    name: 'Dr. Meenakshi Sundaram',
    designation: 'Associate Professor',
    department: 'Dept. of Chemical Engineering',
    qualifications: 'Ph.D. (IISc Bangalore)',
    experienceYears: 12,
    specialization: ['Membrane Separation', 'Arsenic & Fluoride Sorbents', 'Effluent Chemistry'],
    activeProjects: 0,
    maxCapacity: 2,
    email: 'msundaram@bitmesra.ac.in',
    phone: '+91 651 227 5448',
  },
];

export const STUDENT_INVESTIGATORS: StudentInvestigator[] = [
  { id: 'st-01', name: 'Rahul Kumar', rollNo: '22ENV014', department: 'Environmental Engg', year: 'Final Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-041', skills: ['Water Chemistry', 'Data Analysis', 'Project Management'], cgpa: '8.82' },
  { id: 'st-02', name: 'Priya Soren', rollNo: '22ECE042', department: 'Electronics & Comm', year: '3rd Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-041', skills: ['ESP32 Firmware', 'Sensor Interfacing', 'PCB CAD'], cgpa: '9.14' },
  { id: 'st-03', name: 'Amit Roy', rollNo: '22ME009', department: 'Mechanical Engg', year: 'Final Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-041', skills: ['SolidWorks', 'Hydraulic Piping', 'Fabrication'], cgpa: '8.40' },
  { id: 'st-04', name: 'Himmat Singh', rollNo: '23CIV031', department: 'Civil Engg', year: '3rd Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-041', skills: ['Field Surveying', 'Hydrological Mapping', 'GIS'], cgpa: '8.12' },
  { id: 'st-05', name: 'Sneha Murmu', rollNo: '24CHE005', department: 'Chemical Engg', year: '1st Year M.Tech', assignedProjectCode: 'JH-PRJ-2026-041', skills: ['Spectrophotometry', 'Ion Chromatography', 'Lab Auditing'], cgpa: '9.30' },
  { id: 'st-06', name: 'Ankit Verma', rollNo: '22CS011', department: 'Computer Science', year: 'Final Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-028', skills: ['PyTorch', 'TensorFlow Lite', 'Edge AI'], cgpa: '9.45' },
  { id: 'st-07', name: 'Pooja Munda', rollNo: '23IT029', department: 'Information Tech', year: '3rd Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-028', skills: ['Dataset Annotation', 'OpenCV', 'Model Compression'], cgpa: '8.76' },
  { id: 'st-08', name: 'Vikash Mahato', rollNo: '22IT045', department: 'Information Tech', year: 'Final Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-028', skills: ['Android (Kotlin)', 'Offline SQLite', 'UI/UX'], cgpa: '8.65' },
  { id: 'st-09', name: 'Sunil Hembrom', rollNo: '22MIN003', department: 'Mining Engg', year: 'Final Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-017', skills: ['Mine Ventilation', 'SCADA Integration', 'Field Ops'], cgpa: '8.55' },
  { id: 'st-10', name: 'Manish Toppo', rollNo: '22EEE005', department: 'Electrical Engg', year: 'Final Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-009', skills: ['Microgrid Synchronization', 'BMS', 'LoRaWAN'], cgpa: '8.90' },
  { id: 'st-11', name: 'Ritu Kumari', rollNo: '23AGR008', department: 'Agro-Tech (B.Sc)', year: '3rd Year', assignedProjectCode: 'JH-PRJ-2026-028', skills: ['Crop Pathology', 'Field Sampling', 'Farmer Outreach'], cgpa: '8.95' },
  { id: 'st-12', name: 'Deepak Kumar', rollNo: '22ECE018', department: 'Electronics & Comm', year: 'Final Year B.Tech', assignedProjectCode: 'JH-PRJ-2026-017', skills: ['PM2.5 Sensor Optics', 'Modbus RS485', 'C/C++'], cgpa: '8.30' },
];

export const INDUSTRY_PARTNERS: IndustryPartnerItem[] = [
  {
    id: 'ind-01',
    name: 'ABC Technologies (Tata Steel CSR Foundation)',
    division: 'Urban & Rural Water Sustainability Division',
    projectLinked: 'Smart Water Monitoring (JH-WTR-2026-01023)',
    projectCode: 'JH-PRJ-2026-041',
    contributionType: 'Financial + Hardware',
    contributionDetails: '₹5,00,000 Seed Grant + 20 Telemetry Water Quality Sensor Probes',
    mouRefNumber: 'MOU-TS-BIT-2026-WTR-09',
    mouDate: '15 June 2026',
    status: 'Active',
    liaisonOfficer: 'Shri S. K. Roy, Head of CSR Partnerships',
    contactEmail: 'csr.projects@tatasteel.com',
  },
  {
    id: 'ind-02',
    name: 'XYZ Labs (MECON Innovation Hub)',
    division: 'Applied Artificial Intelligence & Agriculture Cell',
    projectLinked: 'Crop Disease Detection (JH-AGR-2026-00845)',
    projectCode: 'JH-PRJ-2026-028',
    contributionType: 'Technical Mentorship',
    contributionDetails: 'Direct ML Engineering Mentorship + 500 Hours Cloud GPU Cluster Allocation',
    mouRefNumber: 'MOU-MECON-RNC-2026-AG-04',
    mouDate: '22 July 2026',
    status: 'Pending',
    liaisonOfficer: 'Dr. V. Sen, Lead AI Architect',
    contactEmail: 'rnd.innovation@meconlimited.co.in',
  },
  {
    id: 'ind-03',
    name: 'Central Coalfields Limited (CCL) R&D Division',
    division: 'Safety & Environmental Telemetry Wing',
    projectLinked: 'Mine Dust Suppression Telemetry (JH-ENV-2026-00219)',
    projectCode: 'JH-PRJ-2026-017',
    contributionType: 'Equipment Grant',
    contributionDetails: '₹8,50,000 Heavy Equipment & Dedicated Testing Trench at North Karanpura Quarry',
    mouRefNumber: 'MOU-CCL-ENV-2026-08',
    mouDate: '10 May 2026',
    status: 'Active',
    liaisonOfficer: 'Shri R. K. Mishra, General Manager (Safety & Environment)',
    contactEmail: 'ccl.rd@coalindia.in',
  },
  {
    id: 'ind-04',
    name: 'Jindal Steel & Power Ltd (JSPL) CSR',
    division: 'Renewable Biomass & Energy Initiative',
    projectLinked: 'Solar Microgrid Stabilization (JH-ENG-2026-00312)',
    projectCode: 'JH-PRJ-2026-009',
    contributionType: 'Pilot Deployment',
    contributionDetails: '₹4,00,000 Prototyping Workshop Sanction + Village Field Trial Logistics',
    mouRefNumber: 'MOU-JSPL-ENG-2026-03',
    mouDate: '02 August 2026',
    status: 'Active',
    liaisonOfficer: 'Ms. Sunita Agarwal, CSR Lead',
    contactEmail: 'sustainability@jindalsteel.com',
  },
];

export const UNIVERSITY_PROPOSALS: UniversityProposal[] = [
  {
    id: 'prop-01',
    memoNumber: 'REF-DHTE-RNC-2026-092',
    title: 'Autonomous Plateau Micro-Watershed Desalination & Fluoride Scrubber',
    challengeRef: 'JH-WTR-2026-01023',
    facultyLead: 'Dr. Rajesh Sharma',
    department: 'Dept. of Environmental Science & Engineering',
    budgetRequested: '₹6,50,000',
    dateSubmitted: '18 July 2026',
    status: 'Sanctioned',
    appraisingBody: 'State Innovation & R&D Directorate, DHTE Ranchi',
  },
  {
    id: 'prop-02',
    memoNumber: 'REF-DHTE-RNC-2026-088',
    title: 'Mobile AI Agronomic Early-Warning Diagnostic Tool for Santhal Pargana',
    challengeRef: 'JH-AGR-2026-00845',
    facultyLead: 'Dr. Anita Patel',
    department: 'Dept. of Information Technology',
    budgetRequested: '₹3,20,000',
    dateSubmitted: '08 August 2026',
    status: 'Under Review',
    appraisingBody: 'Technical Evaluation Committee, Jharkhand Science & Tech Council',
  },
  {
    id: 'prop-03',
    memoNumber: 'REF-DHTE-RNC-2026-071',
    title: 'Decentralized Microgrid LoRaWAN Battery State-of-Charge Telemetry',
    challengeRef: 'JH-ENG-2026-00312',
    facultyLead: 'Dr. B. K. Soren',
    department: 'Dept. of Electrical & Electronics Engineering',
    budgetRequested: '₹4,80,000',
    dateSubmitted: '25 August 2026',
    status: 'Under Review',
    appraisingBody: 'Directorate of Higher & Technical Education',
  },
];

export const NOTIFICATIONS_LIST = [
  {
    id: 'notif-01',
    title: 'New High-Priority Challenge Assigned by State AI Triage',
    memo: 'DHTE/2026/AI-ROUTING/4821',
    description: 'Challenge JH-WTR-2026-01023 (Water Quality Monitoring, Ranchi) routed with 94% institutional match score.',
    timestamp: 'Today, 09:15 AM',
    urgent: true,
    action: 'Review Challenge',
  },
  {
    id: 'notif-02',
    title: 'Industry MOU Executed — Tata Steel CSR Division',
    memo: 'MOU-TS-BIT-2026-WTR-09',
    description: 'Co-sponsorship grant of ₹5,00,000 disbursed for Project JH-PRJ-2026-041.',
    timestamp: 'Yesterday, 04:30 PM',
    urgent: false,
    action: 'View MOU Record',
  },
  {
    id: 'notif-03',
    title: 'Milestone Review Deadline: North Karanpura Field Trial',
    memo: 'DHTE/MONITORING/2026/017',
    description: 'Project JH-PRJ-2026-017 (Mine Dust Suppression) final validation report due by 28 September 2026.',
    timestamp: '08 Sept 2026, 11:20 AM',
    urgent: true,
    action: 'Open Project Log',
  },
  {
    id: 'notif-04',
    title: 'Departmental Circular: Student Investigator Stipend Subvention',
    memo: 'JH-DHTE-CIRCULAR-2026-88',
    description: 'Revised monthly research allowance guidelines for accredited final-year students under PS 26043.',
    timestamp: '05 Sept 2026, 02:00 PM',
    urgent: false,
    action: 'Download Circular (PDF)',
  },
];
