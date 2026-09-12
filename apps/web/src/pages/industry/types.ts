export type ContributionType =
  | 'Mentoring'
  | 'Co-development'
  | 'Funding'
  | 'Prototyping'
  | 'Pilot implementation'
  | 'Technology transfer';

export const ALL_CONTRIBUTION_TYPES: ContributionType[] = [
  'Mentoring',
  'Co-development',
  'Funding',
  'Prototyping',
  'Pilot implementation',
  'Technology transfer',
];

export type ProjectStage = 'Research' | 'Prototype' | 'Testing' | 'Pilot' | 'Deployment';

export const ALL_PROJECT_STAGES: ProjectStage[] = [
  'Research',
  'Prototype',
  'Testing',
  'Pilot',
  'Deployment',
];

export type PartnershipStatus = 'Active' | 'Pending' | 'Completed';

export interface MilestoneItem {
  title: string;
  dueDate: string;
  done: boolean;
}

export interface IndustryProject {
  id: string;
  code: string;
  title: string;
  domain: string;
  universityName: string;
  mentorName: string;
  status: 'Prototype' | 'Development' | 'Testing' | 'Pilot' | 'Completed';
  requiredSupport: ContributionType[];
  budget: number;
  description: string;
  district: string;
  expectedSolution?: string;
}

export interface IndustryPartnership {
  id: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  domain: string;
  universityName: string;
  mentorName: string;
  supportTypes: ContributionType[];
  status: PartnershipStatus;
  stage: ProjectStage;
  progressPct: number;
  fundingCommitted: number;
  mouRefNumber: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  milestones: MilestoneItem[];
}

export type IndustryNotificationType =
  | 'partnership request received'
  | 'university submitted proposal'
  | 'milestone completed'
  | 'pilot ready'
  | 'action required';

export interface IndustryNotification {
  id: string;
  type: IndustryNotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  projectId?: string;
  actionRequired?: boolean;
}

export interface IndustryStats {
  availableProjects: number;
  activePartnerships: number;
  projectsSupported: number;
  fundingProvided: number;
}

export interface IndustryCompanyProfile {
  companyName: string;
  division: string;
  cinNumber: string;
  sector: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  website: string;
  focusDomains: string[];
}

export const DEFAULT_COMPANY_PROFILE: IndustryCompanyProfile = {
  companyName: 'Tata Steel CSR Foundation',
  division: 'Sustainable Livelihoods & Civic Infrastructure Wing',
  cinNumber: 'L27100MH1907PLC000260',
  sector: 'Metals & Mining / CSR Foundation',
  contactPerson: 'Shri Sanjeev K. Roy',
  designation: 'Head of Civic Partnerships & CSR',
  email: 'csr@tatasteel.com',
  phone: '+91 657 242 4111',
  address: 'General Office Complex, Bistupur, Jamshedpur',
  district: 'East Singhbhum',
  website: 'https://www.tatasteel.com/sustainability/csr/',
  focusDomains: ['Water & Sanitation', 'Rural Infrastructure', 'Healthcare', 'Renewable Energy'],
};

export const INITIAL_INDUSTRY_PROJECTS: IndustryProject[] = [
  {
    id: 'prj-ind-01',
    code: 'JH-PRJ-2026-041',
    title: 'Community Activated-Alumina Water Defluoridation & Arsenic Scrubber',
    domain: 'Water & Sanitation',
    universityName: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
    mentorName: 'Dr. Rajesh Sharma',
    status: 'Prototype',
    requiredSupport: ['Funding', 'Prototyping', 'Pilot implementation'],
    budget: 500000,
    description:
      'Decentralized 500 LPH filtration column with automated telemetry alerts for fluoride-affected tribal borewells in Tamar block.',
    district: 'Ranchi',
    expectedSolution:
      'Low-cost adsorbent columns using locally regenerated activated alumina and solar telemetry dataloggers.',
  },
  {
    id: 'prj-ind-02',
    code: 'JH-PRJ-2026-028',
    title: 'Peltier-Thermodynamic Solar Micro-Cold Storage for Sub-Centres',
    domain: 'Healthcare',
    universityName: 'NIT Jamshedpur',
    mentorName: 'Prof. Ananya Sen',
    status: 'Development',
    requiredSupport: ['Co-development', 'Funding', 'Technology transfer'],
    budget: 380000,
    description:
      'Solid-state solar cold storage box maintaining 2-8°C vaccine stability during 48-hour continuous grid outages in Latehar.',
    district: 'Latehar',
    expectedSolution:
      'Peltier semiconductor cooling unit coupled with PCM (phase change material) thermal backup buffer.',
  },
  {
    id: 'prj-ind-03',
    code: 'JH-PRJ-2026-017',
    title: 'Open-Cast Quarry Dust Suppression & Real-time PM10 Telemetry',
    domain: 'Environment',
    universityName: 'IIT (ISM) Dhanbad',
    mentorName: 'Dr. S. K. Mahato',
    status: 'Testing',
    requiredSupport: ['Prototyping', 'Pilot implementation', 'Mentoring'],
    budget: 850000,
    description:
      'Surfactant-infused micro-mist canon with directional ultrasonic wind guidance for open-cast coal haulage corridors.',
    district: 'Dhanbad',
    expectedSolution:
      'High-pressure mist nozzles with LoRaWAN wireless air quality monitoring grid.',
  },
  {
    id: 'prj-ind-04',
    code: 'JH-PRJ-2026-009',
    title: 'Off-Grid Agricultural Biomass Biogas Digester & Micro-Grid',
    domain: 'Energy',
    universityName: 'Birsa Agricultural University, Ranchi',
    mentorName: 'Dr. B. K. Soren',
    status: 'Prototype',
    requiredSupport: ['Funding', 'Co-development', 'Pilot implementation'],
    budget: 420000,
    description:
      'Portable anaerobic digester converting invasive water hyacinth and paddy straw into compressed biomethane for irrigation pumps.',
    district: 'Bokaro',
    expectedSolution:
      'Prefabricated geomembrane balloon digesters with IoT pressure relief sensors.',
  },
  {
    id: 'prj-ind-05',
    code: 'JH-PRJ-2026-052',
    title: 'Automated Culvert Subsidence & Structural Health Telemetry',
    domain: 'Infrastructure',
    universityName: 'NIT Jamshedpur',
    mentorName: 'Dr. Anita Patel',
    status: 'Prototype',
    requiredSupport: ['Funding', 'Technology transfer', 'Mentoring'],
    budget: 320000,
    description:
      'Strain-gauge and tilt sensor nodes deployed under stone arch culverts on mineral heavy haulage routes to predict collapse.',
    district: 'West Singhbhum',
    expectedSolution:
      'Piezoelectric vibration harvester powering ultra-low-power BLE mesh telemetry.',
  },
  {
    id: 'prj-ind-06',
    code: 'JH-PRJ-2026-063',
    title: 'Vernacular Audio-Visual Disease Advisory for Santhali & Ho Farmers',
    domain: 'Agriculture',
    universityName: 'Ranchi University / BAU',
    mentorName: 'Dr. Rajesh Sharma',
    status: 'Development',
    requiredSupport: ['Mentoring', 'Co-development', 'Pilot implementation'],
    budget: 250000,
    description:
      'Edge AI image classification model running offline on basic Android smartphones with tribal voice synthesis in Santhali and Ho.',
    district: 'Dumka',
    expectedSolution:
      'Quantized MobileNetV3 model fine-tuned on local crop blights with offline speech generation.',
  },
];

export const INITIAL_INDUSTRY_PARTNERSHIPS: IndustryPartnership[] = [
  {
    id: 'part-01',
    projectId: 'prj-ind-01',
    projectCode: 'JH-PRJ-2026-041',
    projectTitle: 'Community Activated-Alumina Water Defluoridation & Arsenic Scrubber',
    domain: 'Water & Sanitation',
    universityName: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
    mentorName: 'Dr. Rajesh Sharma',
    supportTypes: ['Funding', 'Prototyping'],
    status: 'Active',
    stage: 'Testing',
    progressPct: 65,
    fundingCommitted: 500000,
    mouRefNumber: 'MOU-TS-BIT-2026-WTR-09',
    createdAt: '2026-06-15T10:00:00.000Z',
    updatedAt: '2026-09-10T14:30:00.000Z',
    milestones: [
      { title: 'Bench-scale adsorbent column fabrication at BIT Mesra', dueDate: '15 July 2026', done: true },
      { title: 'Water sample fluoride profiling & sensor calibration', dueDate: '10 August 2026', done: true },
      { title: 'Field trial at Salgadih tribal well & Panchayat handover', dueDate: '25 October 2026', done: false },
    ],
  },
  {
    id: 'part-02',
    projectId: 'prj-ind-03',
    projectCode: 'JH-PRJ-2026-017',
    projectTitle: 'Open-Cast Quarry Dust Suppression & Real-time PM10 Telemetry',
    domain: 'Environment',
    universityName: 'IIT (ISM) Dhanbad',
    mentorName: 'Dr. S. K. Mahato',
    supportTypes: ['Prototyping', 'Pilot implementation'],
    status: 'Active',
    stage: 'Pilot',
    progressPct: 80,
    fundingCommitted: 850000,
    mouRefNumber: 'MOU-TS-ISM-2026-ENV-04',
    createdAt: '2026-05-10T09:00:00.000Z',
    updatedAt: '2026-09-08T11:20:00.000Z',
    milestones: [
      { title: 'Ultrasonic sensor array design and bench test', dueDate: '20 June 2026', done: true },
      { title: 'Dedicated testing trench validation in quarry haulage road', dueDate: '15 August 2026', done: true },
      { title: 'Commercial pilot signoff with State Pollution Control Board', dueDate: '30 September 2026', done: false },
    ],
  },
  {
    id: 'part-03',
    projectId: 'prj-ind-02',
    projectCode: 'JH-PRJ-2026-028',
    projectTitle: 'Peltier-Thermodynamic Solar Micro-Cold Storage for Sub-Centres',
    domain: 'Healthcare',
    universityName: 'NIT Jamshedpur',
    mentorName: 'Prof. Ananya Sen',
    supportTypes: ['Co-development', 'Funding'],
    status: 'Pending',
    stage: 'Prototype',
    progressPct: 35,
    fundingCommitted: 380000,
    mouRefNumber: 'MOU-TS-NIT-2026-HLT-02',
    createdAt: '2026-09-02T16:00:00.000Z',
    updatedAt: '2026-09-02T16:00:00.000Z',
    milestones: [
      { title: 'Partnership MoU Review & Compliance Cleared', dueDate: '25 Sept 2026', done: false },
      { title: 'Thermal simulation and PCM box optimization', dueDate: '20 Oct 2026', done: false },
      { title: 'Latehar primary health center field validation', dueDate: '15 Dec 2026', done: false },
    ],
  },
  {
    id: 'part-04',
    projectId: 'prj-ind-04',
    projectCode: 'JH-PRJ-2026-009',
    projectTitle: 'Off-Grid Agricultural Biomass Biogas Digester & Micro-Grid',
    domain: 'Energy',
    universityName: 'Birsa Agricultural University, Ranchi',
    mentorName: 'Dr. B. K. Soren',
    supportTypes: ['Funding', 'Technology transfer'],
    status: 'Completed',
    stage: 'Deployment',
    progressPct: 100,
    fundingCommitted: 420000,
    mouRefNumber: 'MOU-TS-BAU-2025-ENG-01',
    createdAt: '2025-11-12T10:00:00.000Z',
    updatedAt: '2026-07-20T17:00:00.000Z',
    milestones: [
      { title: 'Balloon digester pilot fabrication', dueDate: '10 Jan 2026', done: true },
      { title: 'Village installation in Chas block', dueDate: '15 April 2026', done: true },
      { title: 'Final deployment and citizen validation audit', dueDate: '10 July 2026', done: true },
    ],
  },
];

export const INITIAL_INDUSTRY_NOTIFICATIONS: IndustryNotification[] = [
  {
    id: 'notif-ind-01',
    type: 'milestone completed',
    title: 'Milestone Completed',
    message:
      'BIT Mesra completed "Water sample fluoride profiling & sensor calibration" for Water Defluoridation Project (JH-PRJ-2026-041).',
    date: '2 hours ago',
    read: false,
    projectId: 'prj-ind-01',
    actionRequired: false,
  },
  {
    id: 'notif-ind-02',
    type: 'pilot ready',
    title: 'Pilot Ready for Inspection',
    message:
      'IIT (ISM) Dhanbad flagged the Quarry Dust Suppression canon (JH-PRJ-2026-017) as ready for live industry field inspection.',
    date: 'Yesterday',
    read: false,
    projectId: 'prj-ind-03',
    actionRequired: true,
  },
  {
    id: 'notif-ind-03',
    type: 'university submitted proposal',
    title: 'University Proposal Submitted',
    message:
      'NIT Jamshedpur submitted detailed R&D proposal & component bill for Solar Micro-Cold Storage (JH-PRJ-2026-028).',
    date: '3 days ago',
    read: true,
    projectId: 'prj-ind-02',
    actionRequired: false,
  },
  {
    id: 'notif-ind-04',
    type: 'partnership request received',
    title: 'Partnership Request Acknowledged',
    message:
      'DHTE State Portal recorded your partnership endorsement for Peltier-Thermodynamic Solar Micro-Cold Storage.',
    date: '5 days ago',
    read: true,
    projectId: 'prj-ind-02',
    actionRequired: false,
  },
  {
    id: 'notif-ind-05',
    type: 'action required',
    title: 'Action Required: Co-funding Grant Disbursement',
    message:
      'Final milestone invoice submitted for Quarry Dust Suppression Telemetry. Please review and countersign disbursement receipt.',
    date: '1 week ago',
    read: true,
    projectId: 'prj-ind-03',
    actionRequired: true,
  },
];
