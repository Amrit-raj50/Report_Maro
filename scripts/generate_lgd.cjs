const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../packages/shared-types/src/jharkhandLgdData.json'), 'utf8'));

const tsContent = `// Official Local Government Directory (LGD) Master Data - State Code: 20 (Jharkhand)
// Sourced directly from Ministry of Panchayati Raj, Govt of India (lgdirectory.gov.in)

export interface LgdDistrict {
  code: number;
  name: string;
  nameLocal: string;
}

export interface LgdBlock {
  code: number;
  districtCode: number;
  districtName: string;
  name: string;
}

export interface LgdUlb {
  code: number;
  type: string;
  name: string;
  nameLocal: string;
}

export const JHARKHAND_STATE_CODE = 20;
export const JHARKHAND_STATE_NAME = 'Jharkhand';

export const JHARKHAND_DISTRICTS: LgdDistrict[] = ${JSON.stringify(data.districts, null, 2)};

export const JHARKHAND_BLOCKS: LgdBlock[] = ${JSON.stringify(data.blocks, null, 2)};

export const JHARKHAND_ULBS: LgdUlb[] = ${JSON.stringify(data.ulbs, null, 2)};

export function getBlocksForDistrict(districtNameOrCode: string | number): LgdBlock[] {
  if (typeof districtNameOrCode === 'number') {
    return JHARKHAND_BLOCKS.filter(b => b.districtCode === districtNameOrCode);
  }
  const cleanName = String(districtNameOrCode).trim().toLowerCase();
  const matchedDistrict = JHARKHAND_DISTRICTS.find(
    d => d.name.toLowerCase() === cleanName || d.nameLocal.toLowerCase() === cleanName
  );
  if (matchedDistrict) {
    return JHARKHAND_BLOCKS.filter(b => b.districtCode === matchedDistrict.code);
  }
  return JHARKHAND_BLOCKS.filter(
    b => b.districtName.toLowerCase() === cleanName
  );
}

export function getDistrictByName(name: string): LgdDistrict | undefined {
  const clean = name.trim().toLowerCase();
  return JHARKHAND_DISTRICTS.find(
    d => d.name.toLowerCase() === clean || d.nameLocal.toLowerCase() === clean
  );
}

export function getDistrictByCode(code: number): LgdDistrict | undefined {
  return JHARKHAND_DISTRICTS.find(d => d.code === code);
}
`;

fs.mkdirSync(path.join(__dirname, '../apps/web/src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../packages/shared-types/src/lgd.ts'), tsContent);
fs.writeFileSync(path.join(__dirname, '../apps/web/src/data/jharkhandLgd.ts'), tsContent);
console.log('Successfully written lgd.ts to packages/shared-types and apps/web');
