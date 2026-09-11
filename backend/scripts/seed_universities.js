require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dns = require('dns');
const bcrypt = require('bcryptjs');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Continue
}

const University = require('../src/models/university.model');
const User = require('../src/models/user.model');

const uploadDir = 'C:/Users/JONTY PATEL/.gemini/antigravity-ide/brain/e00f5092-2dcf-4d9f-aa1e-6fd0082ca88a/.user_uploaded/';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const townToDistrict = {
  jamshedpur: 'East Singhbhum',
  ghatsila: 'East Singhbhum',
  chakulia: 'East Singhbhum',
  baharagora: 'East Singhbhum',
  behragora: 'East Singhbhum',
  patamda: 'East Singhbhum',
  asanboni: 'East Singhbhum',
  potka: 'East Singhbhum',

  chaibasa: 'West Singhbhum',
  chakradharpur: 'West Singhbhum',
  manoharpur: 'West Singhbhum',
  jagannathpur: 'West Singhbhum',
  majhgaon: 'West Singhbhum',
  noamundi: 'West Singhbhum',
  sonua: 'West Singhbhum',

  saraikela: 'Seraikela Kharsawan',
  seraikela: 'Seraikela Kharsawan',
  seraikella: 'Seraikela Kharsawan',
  kharsawan: 'Seraikela Kharsawan',
  kharswan: 'Seraikela Kharsawan',
  gamharia: 'Seraikela Kharsawan',
  gamhariya: 'Seraikela Kharsawan',
  chandil: 'Seraikela Kharsawan',

  dhanbad: 'Dhanbad',
  sindri: 'Dhanbad',
  katras: 'Dhanbad',
  katrasgarh: 'Dhanbad',
  jharia: 'Dhanbad',
  govindpur: 'Dhanbad',
  maithan: 'Dhanbad',
  nirsa: 'Dhanbad',
  baliapur: 'Dhanbad',
  rajganj: 'Dhanbad',
  baghmara: 'Dhanbad',
  gomo: 'Dhanbad',
  mahuda: 'Dhanbad',
  tundi: 'Dhanbad',

  bokaro: 'Bokaro',
  chas: 'Bokaro',
  bermo: 'Bokaro',
  phusro: 'Bokaro',
  tenughat: 'Bokaro',
  chandrapura: 'Bokaro',
  chandankiyari: 'Bokaro',
  balidih: 'Bokaro',
  pichhri: 'Bokaro',
  kodia: 'Bokaro',

  ranchi: 'Ranchi',
  kanke: 'Ranchi',
  brambe: 'Ranchi',
  namkum: 'Ranchi',
  dhurwa: 'Ranchi',
  doranda: 'Ranchi',
  bero: 'Ranchi',
  mandar: 'Ranchi',
  bundu: 'Ranchi',
  silli: 'Ranchi',
  dakra: 'Ranchi',
  pandra: 'Ranchi',
  ratu: 'Ranchi',

  khunti: 'Khunti',
  torpa: 'Khunti',

  gumla: 'Gumla',
  gulma: 'Gumla',
  ghaghra: 'Gumla',
  gaghra: 'Gumla',
  chainpur: 'Gumla',
  dumri: 'Gumla',
  basia: 'Gumla',
  sisai: 'Gumla',
  bishunpur: 'Gumla',

  simdega: 'Simdega',
  kolebira: 'Simdega',
  bano: 'Simdega',

  lohardaga: 'Lohardaga',

  medininagar: 'Palamu',
  daltonganj: 'Palamu',
  panki: 'Palamu',
  japla: 'Palamu',
  tarhassi: 'Palamu',
  chhatarpur: 'Palamu',
  chatarapur: 'Palamu',
  sadam: 'Palamu',

  garhwa: 'Garhwa',
  bhawnathpur: 'Garhwa',
  nagaruntari: 'Garhwa',
  'nagar untari': 'Garhwa',
  rahla: 'Garhwa',
  dhurki: 'Garhwa',

  latehar: 'Latehar',
  mahuadanr: 'Latehar',
  manika: 'Latehar',

  hazaribagh: 'Hazaribagh',
  hazaribag: 'Hazaribagh',
  barhi: 'Hazaribagh',
  barkagaon: 'Hazaribagh',
  ichak: 'Hazaribagh',
  barkatha: 'Hazaribagh',
  vishnugarh: 'Hazaribagh',
  masipirhi: 'Hazaribagh',

  koderma: 'Koderma',
  jhumriteliya: 'Koderma',
  jhumritelaiya: 'Koderma',
  'jhumri telaiya': 'Koderma',
  domchanch: 'Koderma',
  karma: 'Koderma',

  chatra: 'Chatra',
  hunterganj: 'Chatra',
  itkhori: 'Chatra',
  tandwa: 'Chatra',
  simaria: 'Chatra',

  giridih: 'Giridih',
  mirjaganj: 'Giridih',
  isribazar: 'Giridih',
  'isri bazar': 'Giridih',
  sariya: 'Giridih',
  bagodar: 'Giridih',
  birni: 'Giridih',
  nawadih: 'Giridih',
  bergi: 'Giridih',
  rajdhanwar: 'Giridih',
  jharkhanddham: 'Giridih',

  ramgarh: 'Ramgarh',
  bhurkunda: 'Ramgarh',
  patratu: 'Ramgarh',
  chitarpur: 'Ramgarh',
  mandu: 'Ramgarh',

  deoghar: 'Deoghar',
  jasidih: 'Deoghar',
  madhupur: 'Deoghar',
  palajori: 'Deoghar',
  navadih: 'Deoghar',

  dumka: 'Dumka',
  raneshwar: 'Dumka',
  shikaripara: 'Dumka',
  shikararipara: 'Dumka',
  vijaypur: 'Dumka',

  godda: 'Godda',
  pathargama: 'Godda',
  basantrai: 'Godda',
  kundahit: 'Jamtara',
  poraiyahat: 'Godda',
  dhamri: 'Godda',

  jamtara: 'Jamtara',
  mihijam: 'Jamtara',
  nala: 'Jamtara',

  pakur: 'Pakur',

  sahibganj: 'Sahibganj',
  barharwa: 'Sahibganj',
  barhawa: 'Sahibganj',
  pathna: 'Sahibganj',
  borio: 'Sahibganj',
  rajmahal: 'Sahibganj',
};

const jharkhandDistricts = [
  'Bokaro',
  'Chatra',
  'Deoghar',
  'Dhanbad',
  'Dumka',
  'East Singhbhum',
  'Garhwa',
  'Giridih',
  'Godda',
  'Gumla',
  'Hazaribagh',
  'Jamtara',
  'Khunti',
  'Koderma',
  'Latehar',
  'Lohardaga',
  'Pakur',
  'Palamu',
  'Ramgarh',
  'Ranchi',
  'Sahibganj',
  'Seraikela Kharsawan',
  'Simdega',
  'West Singhbhum',
];

function inferDistrict(collegeName, univName) {
  if (collegeName) {
    const cText = collegeName.toLowerCase();
    for (const [town, dist] of Object.entries(townToDistrict)) {
      if (cText.includes(town)) return dist;
    }
    for (const dist of jharkhandDistricts) {
      if (cText.includes(dist.toLowerCase())) return dist;
    }
  }

  if (univName) {
    const uText = univName.toLowerCase();
    for (const [town, dist] of Object.entries(townToDistrict)) {
      if (uText.includes(town)) return dist;
    }
    for (const dist of jharkhandDistricts) {
      if (uText.includes(dist.toLowerCase())) return dist;
    }
    if (uText.includes('binod bihari mahto koyalanchal')) return 'Dhanbad';
    if (uText.includes('kolhan')) return 'West Singhbhum';
    if (uText.includes('nilamber')) return 'Palamu';
    if (uText.includes('ranchi')) return 'Ranchi';
    if (uText.includes('sido kanhu')) return 'Dumka';
    if (uText.includes('vinoba bhave')) return 'Hazaribagh';
    if (uText.includes('jharkhand technical')) return 'Ranchi';
  }

  return 'Ranchi';
}

function inferCity(collegeName, district) {
  if (!collegeName) return district;
  const parts = collegeName.split(',').map((s) => s.trim());
  if (parts.length > 1) {
    const candidate = parts[parts.length - 1].replace(/\(.*?\)/g, '').trim();
    if (candidate.length > 2 && candidate.length < 30) {
      return candidate;
    }
  }
  return district;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

const DEFAULT_TECH_DEPTS = [
  'Computer Science & Engineering',
  'Information Technology & AI',
  'Electronics & Communication Engineering',
  'Electrical & Renewable Energy Engineering',
  'Mechanical & Mechatronics Engineering',
  'Civil & Environmental Engineering',
  'Mining & Mineral Engineering',
  'Metallurgical & Materials Engineering',
];

const DEFAULT_GEN_DEPTS = [
  'Physics & Physical Sciences',
  'Chemistry & Chemical Sciences',
  'Mathematics & Computing',
  'Botany & Agricultural Biology',
  'Zoology & Environmental Life Sciences',
  'Commerce & Financial Economics',
  'Political Science & Public Administration',
  'Economics & Rural Development',
];

// Core Top-Level Universities & Premier National Institutes in Jharkhand
const CORE_PARENT_UNIVERSITIES = [
  {
    code: 'nitjsr',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    short_name: 'NIT Jamshedpur',
    category: 'Institute of National Importance',
    parent_university: 'National Institute of Technology Jamshedpur',
    district: 'East Singhbhum',
    city: 'Jamshedpur',
    pincode: '831014',
    aishe_code: 'U-0205',
    website: 'https://www.nitjsr.ac.in',
    official_source: 'https://www.education.gov.in',
    departments: DEFAULT_TECH_DEPTS,
  },
  {
    code: 'bitmesra',
    name: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
    short_name: 'BIT Mesra',
    category: 'Deemed University-Private',
    parent_university: 'Birla Institute of Technology, Ranchi',
    district: 'Ranchi',
    city: 'Ranchi',
    pincode: '835215',
    aishe_code: 'U-0202',
    website: 'https://www.bitmesra.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList?uv=89aa2bca1f427b3bba6335129f479f77',
    departments: DEFAULT_TECH_DEPTS,
  },
  {
    code: 'iitism',
    name: 'Indian Institute of Technology (IIT ISM) Dhanbad',
    short_name: 'IIT (ISM) Dhanbad',
    category: 'Institute of National Importance',
    parent_university: 'IIT ISM Dhanbad',
    district: 'Dhanbad',
    city: 'Dhanbad',
    pincode: '826004',
    aishe_code: 'U-0204',
    website: 'https://www.iitism.ac.in',
    official_source: 'https://www.education.gov.in',
    departments: DEFAULT_TECH_DEPTS,
  },
  {
    code: 'cuj',
    name: 'Central University of Jharkhand (CUJ), Ranchi',
    short_name: 'CUJ Ranchi',
    category: 'Central University',
    parent_university: 'Central University of Jharkhand, Ranchi',
    district: 'Ranchi',
    city: 'Ranchi',
    pincode: '835205',
    aishe_code: 'U-0201',
    website: 'https://www.cuj.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/SchemeList?directorate=cb9cedf50ee60f59d168ebfff812a261',
    departments: DEFAULT_TECH_DEPTS,
  },
  {
    code: 'bbmku',
    name: 'Binod Bihari Mahto Koyalanchal University (BBMKU), Dhanbad',
    short_name: 'BBMKU Dhanbad',
    category: 'State University',
    parent_university: 'Binod Bihari Mahto Koyalanchal University',
    district: 'Dhanbad',
    city: 'Dhanbad',
    pincode: '826001',
    aishe_code: 'U-0964',
    website: 'https://www.bbmku.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    departments: DEFAULT_GEN_DEPTS,
  },
  {
    code: 'kolhan',
    name: 'Kolhan University, Chaibasa',
    short_name: 'Kolhan University',
    category: 'State University',
    parent_university: 'Kolhan University',
    district: 'West Singhbhum',
    city: 'Chaibasa',
    pincode: '833202',
    aishe_code: 'U-0206',
    website: 'https://www.kolhanuniversity.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    departments: DEFAULT_GEN_DEPTS,
  },
  {
    code: 'npu',
    name: 'Nilamber-Pitamber University (NPU), Medininagar',
    short_name: 'NPU Medininagar',
    category: 'State University',
    parent_university: 'Nilamber-Pitamber University',
    district: 'Palamu',
    city: 'Medininagar',
    pincode: '822101',
    aishe_code: 'U-0208',
    website: 'https://www.npu.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    departments: DEFAULT_GEN_DEPTS,
  },
  {
    code: 'ranchiuniv',
    name: 'Ranchi University, Ranchi',
    short_name: 'Ranchi University',
    category: 'State University',
    parent_university: 'Ranchi University',
    district: 'Ranchi',
    city: 'Ranchi',
    pincode: '834001',
    aishe_code: 'U-0207',
    website: 'https://www.ranchiuniversity.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    departments: DEFAULT_GEN_DEPTS,
  },
  {
    code: 'skmu',
    name: 'Sido Kanhu Murmu University (SKMU), Dumka',
    short_name: 'SKMU Dumka',
    category: 'State University',
    parent_university: 'Sido Kanhu Murmu University',
    district: 'Dumka',
    city: 'Dumka',
    pincode: '814101',
    aishe_code: 'U-0209',
    website: 'https://www.skmu.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    departments: DEFAULT_GEN_DEPTS,
  },
  {
    code: 'vbu',
    name: 'Vinoba Bhave University (VBU), Hazaribagh',
    short_name: 'VBU Hazaribagh',
    category: 'State University',
    parent_university: 'Vinoba Bhave University',
    district: 'Hazaribagh',
    city: 'Hazaribagh',
    pincode: '825301',
    aishe_code: 'U-0210',
    website: 'https://www.vbu.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    departments: DEFAULT_GEN_DEPTS,
  },
  {
    code: 'jtu',
    name: 'Jharkhand Technical University (JTU), Ranchi',
    short_name: 'JTU Ranchi',
    category: 'State University',
    parent_university: 'Jharkhand Technical University, Ranchi',
    district: 'Ranchi',
    city: 'Ranchi',
    pincode: '834010',
    aishe_code: 'U-0966',
    website: 'https://www.jutranchi.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList?uv=f803729628adf4199f224c2a225038e9',
    departments: DEFAULT_TECH_DEPTS,
  },
  {
    code: 'bau',
    name: 'Birsa Agricultural University (BAU), Kanke',
    short_name: 'BAU Ranchi',
    category: 'State University',
    parent_university: 'Birsa Agricultural University',
    district: 'Ranchi',
    city: 'Kanke, Ranchi',
    pincode: '834006',
    aishe_code: 'U-0203',
    website: 'https://www.bauranchi.org',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    departments: [
      'Agricultural Engineering & Rural Tech',
      'Biotechnology & Agricultural Tech',
      'Veterinary Science & Animal Husbandry',
      'Forestry & Natural Resource Management',
    ],
  },
  {
    code: 'dspmu',
    name: 'Dr. Shyama Prasad Mukherjee University (DSPMU), Ranchi',
    short_name: 'DSPMU Ranchi',
    category: 'State University',
    parent_university: 'Dr. Shyama Prasad Mukherjee University',
    district: 'Ranchi',
    city: 'Ranchi',
    pincode: '834008',
    aishe_code: 'U-0965',
    website: 'https://www.dspmuranchi.ac.in',
    official_source: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    departments: DEFAULT_GEN_DEPTS,
  },
  {
    code: 'iiitranchi',
    name: 'Indian Institute of Information Technology (IIIT) Ranchi',
    short_name: 'IIIT Ranchi',
    category: 'Institute of National Importance',
    parent_university: 'IIIT Ranchi',
    district: 'Ranchi',
    city: 'Namkum, Ranchi',
    pincode: '834010',
    aishe_code: 'U-0887',
    website: 'https://www.iiitranchi.ac.in',
    official_source: 'https://www.education.gov.in',
    departments: [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Information Technology & AI',
      'Data Science & Artificial Intelligence',
    ],
  },
];

async function seedUniversities() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connection established successfully.');

    // Parse all CSV files
    const csvFiles = [
      'media_1789149142322.csv',
      'media_1789149142324.csv',
      'media_1789149142331.csv',
      'media_1789149142336.csv',
      'media_1789149142373.csv',
    ];

    const records = [];
    const seenCodes = new Set();

    // 1. Seed Core Parent Universities first
    for (const core of CORE_PARENT_UNIVERSITIES) {
      records.push(core);
      seenCodes.add(core.code);
    }

    // 2. Parse uploaded government CSVs
    for (const f of csvFiles) {
      const fullPath = path.join(uploadDir, f);
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        const category = cols[0];
        const parentUniv = cols[1];
        const college = cols.length === 4 ? cols[2] : null;
        const source = cols.length === 4 ? cols[3] : cols[2];

        // Skip standalone parent universities already added
        if (!college) {
          if (
            parentUniv.includes('Central University of Jharkhand') ||
            parentUniv.includes('Birla Institute of Technology')
          ) {
            continue;
          }
        }

        const fullName = college ? college : parentUniv;
        const district = inferDistrict(college, parentUniv);
        const city = inferCity(college, district);

        let baseSlug = slugify(fullName);
        let code = baseSlug;
        let counter = 1;
        while (seenCodes.has(code)) {
          code = `${baseSlug}-${counter++}`;
        }
        seenCodes.add(code);

        const isTech =
          category === 'Govt Engineering' ||
          fullName.toLowerCase().includes('engineering') ||
          fullName.toLowerCase().includes('technology') ||
          fullName.toLowerCase().includes('polytechnic');

        records.push({
          code,
          name: fullName,
          short_name: fullName.length > 30 ? fullName.slice(0, 30) + '...' : fullName,
          college_name: college || null,
          parent_university: parentUniv,
          category,
          district,
          city,
          official_source: source,
          departments: [],
        });
      }
    }

    console.log(`Total institutions prepared for seeding: ${records.length}`);

    // Upsert into MongoDB
    let inserted = 0;
    let updated = 0;
    for (const item of records) {
      const res = await University.updateOne(
        { code: item.code },
        { $set: item },
        { upsert: true }
      );
      if (res.upsertedCount > 0) inserted++;
      else if (res.modifiedCount > 0) updated++;
    }

    console.log(`Universities seeded into MongoDB: ${inserted} created, ${updated} updated.`);
    const totalInDb = await University.countDocuments();
    console.log(`Verified total University documents in DB: ${totalInDb}`);

    // Ensure corresponding User accounts for top universities exist so Admin can assign problems
    console.log('Ensuring University User accounts for problem assignment...');
    const demoPasswordHash = await bcrypt.hash('Secret@123', 10);

    const univUsersToEnsure = [
      {
        name: 'National Institute of Technology Jamshedpur',
        email: 'dean@nitjsr.ac.in',
        role: 'university',
      },
      {
        name: 'Birla Institute of Technology Mesra',
        email: 'dean@bitmesra.ac.in',
        role: 'university',
      },
      {
        name: 'Central University of Jharkhand, Ranchi',
        email: 'dean@cuj.ac.in',
        role: 'university',
      },
      {
        name: 'Binod Bihari Mahto Koyalanchal University, Dhanbad',
        email: 'dean@bbmku.ac.in',
        role: 'university',
      },
      {
        name: 'Kolhan University, Chaibasa',
        email: 'dean@kolhan.ac.in',
        role: 'university',
      },
      {
        name: 'Ranchi University, Ranchi',
        email: 'dean@ranchiuniv.ac.in',
        role: 'university',
      },
      {
        name: 'Nilamber-Pitamber University, Medininagar',
        email: 'dean@npu.ac.in',
        role: 'university',
      },
      {
        name: 'Sido Kanhu Murmu University, Dumka',
        email: 'dean@skmu.ac.in',
        role: 'university',
      },
      {
        name: 'Vinoba Bhave University, Hazaribagh',
        email: 'dean@vbu.ac.in',
        role: 'university',
      },
      {
        name: 'Jharkhand Technical University, Ranchi',
        email: 'dean@jtu.ac.in',
        role: 'university',
      },
      {
        name: 'BIT Sindri, Dhanbad',
        email: 'dean@bitsindri.ac.in',
        role: 'university',
      },
    ];

    for (const u of univUsersToEnsure) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create({
          full_name: u.name,
          email: u.email,
          password_hash: demoPasswordHash,
          role: 'university',
          organization: u.name,
          is_verified: true,
        });
        console.log(`Created University User: ${u.email} (${u.name})`);
      } else {
        await User.updateOne(
          { email: u.email },
          { $set: { full_name: u.name, organization: u.name, role: 'university', is_verified: true } }
        );
      }
    }

    console.log('Seed process completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedUniversities();
