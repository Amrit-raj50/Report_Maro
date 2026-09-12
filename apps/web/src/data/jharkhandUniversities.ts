// apps/web/src/data/jharkhandUniversities.ts
// Lightweight frontend client module for Jharkhand Universities & Colleges
// Official data is seeded and stored in MongoDB Atlas and served via /api/universities
import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient.js';

export interface JharkhandUniversity {
  id: string;
  name: string;
  shortName: string;
  hindiName?: string;
  aisheCode?: string;
  domain?: string;
  type: 'INI' | 'Deemed' | 'State' | 'Central' | 'Private' | 'Affiliated' | 'Constituent' | 'Govt Engineering';
  category: string;
  parentUniversity?: string;
  collegeName?: string;
  city: string;
  district: string;
  pincode?: string;
  officialSource?: string;
  departments: string[];
}


// Core fallback universities for instant initial render before MongoDB query returns
export const JHARKHAND_UNIVERSITIES: JharkhandUniversity[] = [
  {
    id: 'nitjsr',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    shortName: 'NIT Jamshedpur',
    hindiName: 'राष्ट्रीय प्रौद्योगिकी संस्थान जमशेदपुर',
    aisheCode: 'U-0205',
    domain: 'nitjsr.ac.in',
    type: 'INI',
    category: 'Institute of National Importance',
    parentUniversity: 'National Institute of Technology Jamshedpur',
    city: 'Jamshedpur',
    district: 'East Singhbhum',
    pincode: '831014',
    departments: [],
  },
  {
    id: 'bitmesra',
    name: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
    shortName: 'BIT Mesra',
    hindiName: 'बिरला प्रौद्योगिकी संस्थान मेसरा',
    aisheCode: 'U-0202',
    domain: 'bitmesra.ac.in',
    type: 'Deemed',
    category: 'Deemed University-Private',
    parentUniversity: 'Birla Institute of Technology, Ranchi',
    city: 'Ranchi',
    district: 'Ranchi',
    pincode: '835215',
    departments: [],
  },
  {
    id: 'iitism',
    name: 'Indian Institute of Technology (IIT ISM) Dhanbad',
    shortName: 'IIT (ISM) Dhanbad',
    hindiName: 'भारतीय प्रौद्योगिकी संस्थान धनबाद',
    aisheCode: 'U-0204',
    domain: 'iitism.ac.in',
    type: 'INI',
    category: 'Institute of National Importance',
    parentUniversity: 'IIT ISM Dhanbad',
    city: 'Dhanbad',
    district: 'Dhanbad',
    pincode: '826004',
    departments: [],
  },
  {
    id: 'cuj',
    name: 'Central University of Jharkhand (CUJ), Ranchi',
    shortName: 'CUJ Ranchi',
    hindiName: 'झारखंड केन्द्रीय विश्वविद्यालय',
    aisheCode: 'U-0201',
    domain: 'cuj.ac.in',
    type: 'Central',
    category: 'Central University',
    parentUniversity: 'Central University of Jharkhand, Ranchi',
    city: 'Ranchi',
    district: 'Ranchi',
    pincode: '835205',
    departments: [],
  },
  {
    id: 'bbmku',
    name: 'Binod Bihari Mahto Koyalanchal University (BBMKU), Dhanbad',
    shortName: 'BBMKU Dhanbad',
    hindiName: 'बिनोद बिहारी महतो कोयलांचल विश्वविद्यालय',
    aisheCode: 'U-0964',
    domain: 'bbmku.ac.in',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Binod Bihari Mahto Koyalanchal University',
    city: 'Dhanbad',
    district: 'Dhanbad',
    pincode: '826001',
    departments: [],
  },
  {
    id: 'kolhan',
    name: 'Kolhan University, Chaibasa',
    shortName: 'Kolhan University',
    hindiName: 'कोल्हान विश्वविद्यालय चाईबासा',
    aisheCode: 'U-0206',
    domain: 'kolhanuniversity.ac.in',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Kolhan University',
    city: 'Chaibasa',
    district: 'West Singhbhum',
    pincode: '833202',
    departments: [],
  },
  {
    id: 'ranchiuniv',
    name: 'Ranchi University, Ranchi',
    shortName: 'Ranchi University',
    hindiName: 'राँची विश्वविद्यालय',
    aisheCode: 'U-0207',
    domain: 'ranchiuniversity.ac.in',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Ranchi University',
    city: 'Ranchi',
    district: 'Ranchi',
    pincode: '834001',
    departments: [],
  },
  {
    id: 'npu',
    name: 'Nilamber-Pitamber University (NPU), Medininagar',
    shortName: 'NPU Medininagar',
    hindiName: 'नीलांबर-पीतांबर विश्वविद्यालय',
    aisheCode: 'U-0208',
    domain: 'npu.ac.in',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Nilamber-Pitamber University',
    city: 'Medininagar',
    district: 'Palamu',
    pincode: '822101',
    departments: [],
  },
  {
    id: 'skmu',
    name: 'Sido Kanhu Murmu University (SKMU), Dumka',
    shortName: 'SKMU Dumka',
    hindiName: 'सिदो कान्हू मुर्मू विश्वविद्यालय',
    aisheCode: 'U-0209',
    domain: 'skmu.ac.in',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Sido Kanhu Murmu University',
    city: 'Dumka',
    district: 'Dumka',
    pincode: '814101',
    departments: [],
  },
  {
    id: 'vbu',
    name: 'Vinoba Bhave University (VBU), Hazaribagh',
    shortName: 'VBU Hazaribagh',
    hindiName: 'विनोबा भावे विश्वविद्यालय',
    aisheCode: 'U-0210',
    domain: 'vbu.ac.in',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Vinoba Bhave University',
    city: 'Hazaribagh',
    district: 'Hazaribagh',
    pincode: '825301',
    departments: [],
  },
  {
    id: 'jtu',
    name: 'Jharkhand Technical University (JTU), Ranchi',
    shortName: 'JTU Ranchi',
    hindiName: 'झारखंड प्रौद्योगिकी विश्वविद्यालय',
    aisheCode: 'U-0966',
    domain: 'jutranchi.ac.in',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Jharkhand Technical University, Ranchi',
    city: 'Ranchi',
    district: 'Ranchi',
    pincode: '834010',
    departments: [],
  },
  {
    id: 'bau',
    name: 'Birsa Agricultural University (BAU), Kanke',
    shortName: 'BAU Ranchi',
    hindiName: 'बिरसा कृषि विश्वविद्यालय कांके',
    aisheCode: 'U-0203',
    domain: 'bauranchi.org',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Birsa Agricultural University',
    city: 'Kanke, Ranchi',
    district: 'Ranchi',
    pincode: '834006',
    departments: [],
  },
  {
    id: 'dspmu',
    name: 'Dr. Shyama Prasad Mukherjee University (DSPMU), Ranchi',
    shortName: 'DSPMU Ranchi',
    hindiName: 'डॉ. श्यामा प्रसाद मुखर्जी विश्वविद्यालय',
    aisheCode: 'U-0965',
    domain: 'dspmuranchi.ac.in',
    type: 'State',
    category: 'State University',
    parentUniversity: 'Dr. Shyama Prasad Mukherjee University',
    city: 'Ranchi',
    district: 'Ranchi',
    pincode: '834008',
    departments: [],
  },
  {
    id: 'iiitranchi',
    name: 'Indian Institute of Information Technology (IIIT) Ranchi',
    shortName: 'IIIT Ranchi',
    hindiName: 'भारतीय सूचना प्रौद्योगिकी संस्थान राँची',
    aisheCode: 'U-0887',
    domain: 'iiitranchi.ac.in',
    type: 'INI',
    category: 'Institute of National Importance',
    parentUniversity: 'IIIT Ranchi',
    city: 'Namkum, Ranchi',
    district: 'Ranchi',
    pincode: '834010',
    departments: [],
  },
];

interface RawUniversityDoc {
  code?: string;
  _id?: string;
  name: string;
  short_name?: string;
  aishe_code?: string;
  category?: string;
  parent_university?: string;
  college_name?: string;
  city?: string;
  district: string;
  pincode?: string;
  official_source?: string;
  departments?: string[];
}

/**
 * Hook to dynamically load all 229+ official Jharkhand Universities & Colleges
 * from the MongoDB Atlas database via the backend /api/universities API.
 */
export function useJharkhandUniversities() {
  const [universities, setUniversities] = useState<JharkhandUniversity[]>(JHARKHAND_UNIVERSITIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    apiClient
      .get('/universities')
      .then((res) => {
        if (!active) return;
        const raw = res.data?.data;
        if (Array.isArray(raw) && raw.length > 0) {
          const mapped: JharkhandUniversity[] = raw.map((u: RawUniversityDoc) => ({
            id: u.code || u._id || 'univ',
            name: u.name,
            shortName: u.short_name || u.name,
            aisheCode: u.aishe_code || '',
            domain: `${(u.code || 'univ').replace(/[^a-z0-9]/g, '')}.edu.in`,
            type:
              u.category === 'Institute of National Importance'
                ? 'INI'
                : u.category === 'Deemed University-Private'
                  ? 'Deemed'
                  : u.category === 'Central University'
                    ? 'Central'
                    : u.category === 'Govt Engineering'
                      ? 'Govt Engineering'
                      : u.category === 'Constituent Colleges'
                        ? 'Constituent'
                        : u.category === 'Affiliated Colleges'
                          ? 'Affiliated'
                          : 'State',
            category: u.category || 'State University',
            parentUniversity: u.parent_university || u.name,
            collegeName: u.college_name || undefined,
            city: u.city || u.district,
            district: u.district,
            pincode: u.pincode || '',
            officialSource: u.official_source,
            departments: u.departments || [],
          }));
          setUniversities(mapped);
        }
      })
      .catch(() => {
        // Fallback smoothly to pre-configured universities if backend is offline
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { universities, loading };
}

export function getUniversityById(id: string): JharkhandUniversity | undefined {
  return JHARKHAND_UNIVERSITIES.find((u) => u.id === id);
}

export function getUniversityByName(name: string): JharkhandUniversity | undefined {
  const norm = name.toLowerCase().trim();
  return JHARKHAND_UNIVERSITIES.find(
    (u) =>
      u.name.toLowerCase().includes(norm) ||
      u.shortName.toLowerCase().includes(norm) ||
      norm.includes(u.shortName.toLowerCase())
  );
}

/**
 * Persists newly added departments directly to MongoDB Atlas for the selected university
 */
export async function saveUniversityDepartmentsToDb(
  identifier: string,
  departments: string[],
  action: 'replace' | 'add' = 'add',
  meta?: { name?: string; district?: string; aishe_code?: string }
): Promise<JharkhandUniversity | null> {
  try {
    const res = await apiClient.put(`/universities/${encodeURIComponent(identifier)}/departments`, {
      departments,
      action,
      ...meta,
    });
    return res.data?.data || null;
  } catch (err) {
    console.error('Failed to save departments to MongoDB:', err);
    throw err;
  }
}
