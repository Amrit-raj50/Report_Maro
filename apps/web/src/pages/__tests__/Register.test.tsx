import { describe, it, expect } from 'vitest';
import {
  JHARKHAND_DISTRICTS,
  JHARKHAND_BLOCKS,
  JHARKHAND_ULBS,
  getBlocksForDistrict,
  getDistrictByName,
  getDistrictByCode,
} from '../../data/jharkhandLgd.js';

describe('Jharkhand Official LGD Master Data', () => {
  it('contains exactly 24 official districts with LGD codes and 264 blocks', () => {
    expect(JHARKHAND_DISTRICTS).toHaveLength(24);
    expect(JHARKHAND_BLOCKS).toHaveLength(264);
    JHARKHAND_DISTRICTS.forEach((d) => {
      expect(d.code).toBeGreaterThan(0);
      expect(d.name).toBeTruthy();
      expect(d.nameLocal).toBeTruthy();
    });
  });

  it('contains Ranchi with official LGD code 339 and 18 blocks', () => {
    const ranchi = getDistrictByName('Ranchi');
    expect(ranchi).toBeDefined();
    expect(ranchi?.code).toBe(339);

    const ranchiBlocks = getBlocksForDistrict('Ranchi');
    expect(ranchiBlocks.length).toBe(18);
    const blockNames = ranchiBlocks.map((b) => b.name);
    expect(blockNames).toContain('Kanke');
    expect(blockNames).toContain('Namkum');
    expect(blockNames).toContain('Ormanjhi');
    expect(blockNames).toContain('Ratu');
  });

  it('contains Dhanbad with official LGD code 325 and its official blocks', () => {
    const dhanbad = getDistrictByCode(325);
    expect(dhanbad).toBeDefined();
    expect(dhanbad?.name).toBe('Dhanbad');

    const dhanbadBlocks = getBlocksForDistrict(325);
    expect(dhanbadBlocks.length).toBe(10);
    const blockNames = dhanbadBlocks.map((b) => b.name);
    expect(blockNames).toContain('Baghmara');
    expect(blockNames).toContain('Govindpur');
    expect(blockNames).toContain('Nirsa');
  });

  it('contains 50 Urban Local Bodies (Municipal Corporations & Councils)', () => {
    expect(JHARKHAND_ULBS.length).toBe(50);
    const ulbNames = JHARKHAND_ULBS.map((u) => u.name);
    expect(ulbNames).toContain('Adityapur');
    expect(ulbNames).toContain('Chas');
    expect(ulbNames).toContain('Dhanbad');
    expect(ulbNames).toContain('Deoghar');
  });
});
