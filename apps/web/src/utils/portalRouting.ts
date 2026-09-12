import type { User } from '@sih/shared-types';

export type UniversitySubRole = 'student' | 'mentor' | 'dean';

/**
 * Derives the active university subrole ('student' | 'mentor' | 'dean')
 * from either localStorage (samadhansetu_university_profile), user.organization, or user.email.
 */
export function getUniversitySubRole(user?: User | null): UniversitySubRole {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('samadhansetu_university_profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.subRole === 'student') return 'student';
        if (parsed?.subRole === 'mentor') return 'mentor';
        if (parsed?.subRole === 'dean' || parsed?.subRole === 'institution') return 'dean';
      }
    } catch {
      // Ignore localStorage parse failure
    }
  }

  if (!user) return 'student';

  const org = (user.organization || '').toLowerCase();
  const email = (user.email || '').toLowerCase();

  if (org.includes('student') || email.includes('himmat') || email.startsWith('student@')) {
    return 'student';
  }
  if (org.includes('mentor') || email.includes('rsharma') || email.startsWith('mentor@')) {
    return 'mentor';
  }
  return 'dean';
}

/**
 * Returns the appropriate dashboard/portal URL for an authenticated user.
 * - Admin -> /admin
 * - Industry -> /industry
 * - University:
 *     - Student -> /student
 *     - Mentor -> /university/mentor
 *     - Dean -> /university
 * - Citizen -> /dashboard
 */
export function getDefaultPortalForUser(user?: User | null): string {
  if (!user) return '/login';

  switch (user.role) {
    case 'admin':
      return '/admin';
    case 'industry':
      return '/industry';
    case 'university': {
      const sub = getUniversitySubRole(user);
      if (sub === 'student') return '/student';
      if (sub === 'mentor') return '/university/mentor';
      return '/university';
    }
    case 'citizen':
    default:
      return '/dashboard';
  }
}
