// apps/web/src/data/jharkhandUniversities.ts
// Accredited Jharkhand Universities, Institutes of National Importance & Colleges
// Formatted for Samadhan Setu University Ecosystem (Dean, Faculty Mentor, Student Innovator)

export interface JharkhandUniversity {
  id: string;
  name: string;
  shortName: string;
  hindiName: string;
  aisheCode: string;
  domain: string;
  type: 'INI' | 'Deemed' | 'State' | 'Central' | 'Private' | 'Affiliated';
  city: string;
  district: string;
  pincode: string;
  departments: string[];
}

export const JHARKHAND_DEPARTMENTS: string[] = [
  'Computer Science & Engineering',
  'Information Technology & AI',
  'Electronics & Communication Engineering',
  'Electrical & Renewable Energy Engineering',
  'Mechanical & Mechatronics Engineering',
  'Civil & Environmental Engineering',
  'Metallurgical & Materials Engineering',
  'Mining & Mineral Engineering',
  'Production & Industrial Engineering',
  'Biotechnology & Agricultural Tech',
  'Chemical & Polymer Engineering',
  'Physics & Applied Sciences',
  'Chemistry & Material Sciences',
  'Mathematics & Computing',
  'Management Studies & Rural Entrepreneurship',
];

export const JHARKHAND_UNIVERSITIES: JharkhandUniversity[] = [
  {
    id: 'nitjsr',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    shortName: 'NIT Jamshedpur',
    hindiName: 'राष्ट्रीय प्रौद्योगिकी संस्थान जमशेदपुर',
    aisheCode: 'U-0205',
    domain: 'nitjsr.ac.in',
    type: 'INI',
    city: 'Jamshedpur',
    district: 'East Singhbhum',
    pincode: '831014',
    departments: [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Civil & Environmental Engineering',
      'Mechanical & Mechatronics Engineering',
      'Electrical & Renewable Energy Engineering',
      'Metallurgical & Materials Engineering',
      'Production & Industrial Engineering',
    ],
  },
  {
    id: 'bitmesra',
    name: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
    shortName: 'BIT Mesra',
    hindiName: 'बिरला प्रौद्योगिकी संस्थान मेसरा',
    aisheCode: 'U-0202',
    domain: 'bitmesra.ac.in',
    type: 'Deemed',
    city: 'Ranchi',
    district: 'Ranchi',
    pincode: '835215',
    departments: [
      'Computer Science & Engineering',
      'Information Technology & AI',
      'Electronics & Communication Engineering',
      'Electrical & Renewable Energy Engineering',
      'Mechanical & Mechatronics Engineering',
      'Civil & Environmental Engineering',
      'Biotechnology & Agricultural Tech',
      'Chemical & Polymer Engineering',
    ],
  },
  {
    id: 'iitism',
    name: 'Indian Institute of Technology (IIT ISM) Dhanbad',
    shortName: 'IIT (ISM) Dhanbad',
    hindiName: 'भारतीय प्रौद्योगिकी संस्थान (भारतीय खनि विद्यापीठ) धनबाद',
    aisheCode: 'U-0204',
    domain: 'iitism.ac.in',
    type: 'INI',
    city: 'Dhanbad',
    district: 'Dhanbad',
    pincode: '826004',
    departments: [
      'Mining & Mineral Engineering',
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Civil & Environmental Engineering',
      'Mechanical & Mechatronics Engineering',
      'Chemical & Polymer Engineering',
    ],
  },
  {
    id: 'ranchiuniv',
    name: 'Ranchi University, Ranchi',
    shortName: 'Ranchi University',
    hindiName: 'राँची विश्वविद्यालय',
    aisheCode: 'U-0207',
    domain: 'ranchiuniversity.ac.in',
    type: 'State',
    city: 'Ranchi',
    district: 'Ranchi',
    pincode: '834001',
    departments: [
      'Information Technology & AI',
      'Biotechnology & Agricultural Tech',
      'Physics & Applied Sciences',
      'Chemistry & Material Sciences',
      'Management Studies & Rural Entrepreneurship',
    ],
  },
  {
    id: 'bau',
    name: 'Birsa Agricultural University (BAU), Kanke',
    shortName: 'BAU Ranchi',
    hindiName: 'बिरसा कृषि विश्वविद्यालय कांके',
    aisheCode: 'U-0203',
    domain: 'bauranchi.org',
    type: 'State',
    city: 'Kanke, Ranchi',
    district: 'Ranchi',
    pincode: '834006',
    departments: [
      'Biotechnology & Agricultural Tech',
      'Civil & Environmental Engineering',
      'Agricultural Engineering & Rural Tech',
      'Rural Entrepreneurship',
    ],
  },
  {
    id: 'kolhan',
    name: 'Kolhan University, Chaibasa',
    shortName: 'Kolhan University',
    hindiName: 'कोल्हान विश्वविद्यालय चाईबासा',
    aisheCode: 'U-0206',
    domain: 'kolhanuniversity.ac.in',
    type: 'State',
    city: 'Chaibasa',
    district: 'West Singhbhum',
    pincode: '833202',
    departments: [
      'Computer Science & Engineering',
      'Information Technology & AI',
      'Physics & Applied Sciences',
      'Management Studies & Rural Entrepreneurship',
    ],
  },
  {
    id: 'cuj',
    name: 'Central University of Jharkhand (CUJ), Brambe',
    shortName: 'CUJ Brambe',
    hindiName: 'झारखंड केन्द्रीय विश्वविद्यालय',
    aisheCode: 'U-0201',
    domain: 'cuj.ac.in',
    type: 'Central',
    city: 'Brambe, Ranchi',
    district: 'Ranchi',
    pincode: '835205',
    departments: [
      'Computer Science & Engineering',
      'Civil & Environmental Engineering',
      'Electrical & Renewable Energy Engineering',
      'Biotechnology & Agricultural Tech',
    ],
  },
  {
    id: 'bbmku',
    name: 'Binod Bihari Mahto Koyalanchal University (BBMKU), Dhanbad',
    shortName: 'BBMKU Dhanbad',
    hindiName: 'बिनोद बिहारी महतो कोयलांचल विश्वविद्यालय',
    aisheCode: 'U-0964',
    domain: 'bbmku.ac.in',
    type: 'State',
    city: 'Dhanbad',
    district: 'Dhanbad',
    pincode: '826001',
    departments: [
      'Computer Science & Engineering',
      'Information Technology & AI',
      'Physics & Applied Sciences',
      'Chemistry & Material Sciences',
    ],
  },
  {
    id: 'dspmu',
    name: 'Dr. Shyama Prasad Mukherjee University (DSPMU), Ranchi',
    shortName: 'DSPMU Ranchi',
    hindiName: 'डॉ. श्यामा प्रसाद मुखर्जी विश्वविद्यालय',
    aisheCode: 'U-0965',
    domain: 'dspmuranchi.ac.in',
    type: 'State',
    city: 'Ranchi',
    district: 'Ranchi',
    pincode: '834008',
    departments: [
      'Computer Science & Engineering',
      'Information Technology & AI',
      'Electronics & Communication Engineering',
      'Management Studies & Rural Entrepreneurship',
    ],
  },
  {
    id: 'iiitranchi',
    name: 'Indian Institute of Information Technology (IIIT) Ranchi',
    shortName: 'IIIT Ranchi',
    hindiName: 'भारतीय सूचना प्रौद्योगिकी संस्थान राँची',
    aisheCode: 'U-0887',
    domain: 'iiitranchi.ac.in',
    type: 'INI',
    city: 'Namkum, Ranchi',
    district: 'Ranchi',
    pincode: '834010',
    departments: [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Information Technology & AI',
      'Data Science & Artificial Intelligence',
    ],
  },
];

export function getUniversityById(id: string): JharkhandUniversity | undefined {
  return JHARKHAND_UNIVERSITIES.find((u) => u.id === id);
}

export function getUniversityByName(name: string): JharkhandUniversity | undefined {
  const norm = name.toLowerCase().trim();
  return JHARKHAND_UNIVERSITIES.find(
    (u) =>
      u.name.toLowerCase().includes(norm) ||
      u.shortName.toLowerCase().includes(norm) ||
      norm.includes(u.shortName.toLowerCase()),
  );
}
