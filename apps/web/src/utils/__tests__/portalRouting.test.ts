import { describe, it, expect, beforeEach } from 'vitest';
import type { User } from '@sih/shared-types';
import { getDefaultPortalForUser, getUniversitySubRole } from '../portalRouting.js';

describe('portalRouting', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns /login if user is null or undefined', () => {
    expect(getDefaultPortalForUser(null)).toBe('/login');
    expect(getDefaultPortalForUser(undefined)).toBe('/login');
  });

  it('returns /admin for admin users', () => {
    const adminUser: User = {
      id: 'admin-1',
      full_name: 'Admin User',
      email: 'admin@sihportal.dev',
      role: 'admin',
    };
    expect(getDefaultPortalForUser(adminUser)).toBe('/admin');
  });

  it('returns /industry for industry users', () => {
    const industryUser: User = {
      id: 'ind-1',
      full_name: 'CSR Lead',
      email: 'tata.csr@tatasteel.com',
      role: 'industry',
    };
    expect(getDefaultPortalForUser(industryUser)).toBe('/industry');
  });

  it('returns /dashboard for citizen users', () => {
    const citizenUser: User = {
      id: 'cit-1',
      full_name: 'Asha Devi',
      email: 'asha.devi@example.com',
      role: 'citizen',
    };
    expect(getDefaultPortalForUser(citizenUser)).toBe('/dashboard');
  });

  describe('university portal routing', () => {
    it('detects student from organization string and routes to /student', () => {
      const studentUser: User = {
        id: 'univ-stu-1',
        full_name: 'Himmat',
        email: 'himmat@nitjsr.ac.in',
        role: 'university',
        organization: 'NIT Jamshedpur | Dept: Computer Science | Role: Student',
      };
      expect(getUniversitySubRole(studentUser)).toBe('student');
      expect(getDefaultPortalForUser(studentUser)).toBe('/student');
    });

    it('detects mentor from organization string and routes to /university/mentor', () => {
      const mentorUser: User = {
        id: 'univ-men-1',
        full_name: 'Dr. Rajesh Sharma',
        email: 'rsharma.env@nitjsr.ac.in',
        role: 'university',
        organization: 'NIT Jamshedpur | Role: Faculty Mentor',
      };
      expect(getUniversitySubRole(mentorUser)).toBe('mentor');
      expect(getDefaultPortalForUser(mentorUser)).toBe('/university/mentor');
    });

    it('detects dean/admin from organization and routes to /university', () => {
      const deanUser: User = {
        id: 'univ-dean-1',
        full_name: 'Dr. S. Mahato',
        email: 'dean@nitjsr.ac.in',
        role: 'university',
        organization: 'NIT Jamshedpur | Dean R&D',
      };
      expect(getUniversitySubRole(deanUser)).toBe('dean');
      expect(getDefaultPortalForUser(deanUser)).toBe('/university');
    });

    it('prioritizes localStorage university profile subrole', () => {
      localStorage.setItem(
        'samadhansetu_university_profile',
        JSON.stringify({ subRole: 'student' }),
      );

      const univUser: User = {
        id: 'univ-1',
        full_name: 'Generic University User',
        email: 'univ@example.com',
        role: 'university',
      };

      expect(getUniversitySubRole(univUser)).toBe('student');
      expect(getDefaultPortalForUser(univUser)).toBe('/student');

      localStorage.setItem(
        'samadhansetu_university_profile',
        JSON.stringify({ subRole: 'mentor' }),
      );
      expect(getUniversitySubRole(univUser)).toBe('mentor');
      expect(getDefaultPortalForUser(univUser)).toBe('/university/mentor');
    });
  });
});
