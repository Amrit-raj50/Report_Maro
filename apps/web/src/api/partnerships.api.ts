import { apiClient } from '../lib/apiClient.js';
import type {
  IndustryProject,
  IndustryPartnership,
  IndustryNotification,
  IndustryStats,
  ContributionType,
} from '../pages/industry/types.js';
import {
  INITIAL_INDUSTRY_PROJECTS,
  INITIAL_INDUSTRY_PARTNERSHIPS,
  INITIAL_INDUSTRY_NOTIFICATIONS,
} from '../pages/industry/types.js';

const STORAGE_KEYS = {
  PARTNERSHIPS: 'sih_industry_partnerships',
  PROJECTS: 'sih_industry_projects',
  NOTIFICATIONS: 'sih_industry_notifications',
  PROFILE: 'sih_industry_profile',
};

function getStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

export const partnershipsApi = {
  async getProjects(): Promise<IndustryProject[]> {
    try {
      const res = await apiClient.get('/projects');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        // Merge backend projects if present
        const backendProjects: IndustryProject[] = res.data.data.map((p: { _id: string; proposal_text?: string; status?: string; budget?: number }) => ({
          id: p._id,
          code: `JH-PRJ-2026-${p._id.slice(-3)}`,
          title: p.proposal_text?.slice(0, 60) || 'Civic Solution Initiative',
          domain: 'Water & Sanitation',
          universityName: 'Birla Institute of Technology (BIT) Mesra',
          mentorName: 'Dr. Rajesh Sharma',
          status: p.status === 'active' ? 'Development' : 'Prototype',
          requiredSupport: ['Funding', 'Technical Mentorship', 'Prototyping'],
          budget: p.budget || 350000,
          description: p.proposal_text || 'Civic infrastructure improvement prototype.',
          district: 'Ranchi',
        }));
        const local = getStoredData<IndustryProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_INDUSTRY_PROJECTS);
        return [...local, ...backendProjects.filter((b) => !local.some((l) => l.id === b.id))];
      }
    } catch {
      // Fallback
    }
    return getStoredData<IndustryProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_INDUSTRY_PROJECTS);
  },

  async getPartnerships(): Promise<IndustryPartnership[]> {
    return getStoredData<IndustryPartnership[]>(
      STORAGE_KEYS.PARTNERSHIPS,
      INITIAL_INDUSTRY_PARTNERSHIPS,
    );
  },

  async createPartnershipRequest(payload: {
    projectId: string;
    projectCode: string;
    projectTitle: string;
    domain: string;
    universityName: string;
    mentorName: string;
    supportTypes: ContributionType[];
    pledgedFunding?: number;
    notes?: string;
  }): Promise<IndustryPartnership> {
    const existing = await this.getPartnerships();
    const newPartnership: IndustryPartnership = {
      id: `part-${Date.now()}`,
      projectId: payload.projectId,
      projectCode: payload.projectCode,
      projectTitle: payload.projectTitle,
      domain: payload.domain,
      universityName: payload.universityName,
      mentorName: payload.mentorName,
      supportTypes: payload.supportTypes,
      status: 'Pending',
      stage: 'Prototype',
      progressPct: 35,
      fundingCommitted: payload.pledgedFunding || 0,
      notes: payload.notes || '',
      mouRefNumber: `MOU-IND-JH-2026-0${existing.length + 81}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: [
        { title: 'Partnership MoU Review & Compliance Cleared', done: false, dueDate: '25 Sept 2026' },
        { title: 'Engineering & Lab Resource Allocation', done: false, dueDate: '15 Oct 2026' },
        { title: 'Joint Benchmark & Field Validation Trial', done: false, dueDate: '30 Nov 2026' },
      ],
    };

    const updated = [newPartnership, ...existing];
    setStoredData(STORAGE_KEYS.PARTNERSHIPS, updated);

    // Also trigger backend fund/update if funding was specified
    if (payload.pledgedFunding && payload.pledgedFunding > 0) {
      apiClient.put(`/projects/${payload.projectId}/fund`, { amount: payload.pledgedFunding }).catch(() => {
        // Mock fallback accepts regardless
      });
    }

    // Add a notification about the partnership request
    const notifs = getStoredData<IndustryNotification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_INDUSTRY_NOTIFICATIONS,
    );
    const newNotif: IndustryNotification = {
      id: `notif-${Date.now()}`,
      type: 'partnership request received',
      title: 'Partnership Request Dispatched',
      message: `Your partnership request for "${payload.projectTitle}" (${payload.supportTypes.join(', ')}) was submitted to ${payload.universityName}.`,
      date: 'Just now',
      read: false,
      projectId: payload.projectId,
      actionRequired: false,
    };
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

    return newPartnership;
  },

  async getStats(): Promise<IndustryStats> {
    const projects = await this.getProjects();
    const partnerships = await this.getPartnerships();

    const activePartnerships = partnerships.filter((p) => p.status === 'Active');
    const completedPartnerships = partnerships.filter((p) => p.status === 'Completed');
    const totalFunding = partnerships.reduce((sum, p) => sum + (p.fundingCommitted || 0), 0);

    return {
      availableProjects: projects.length,
      activePartnerships: activePartnerships.length,
      projectsSupported: activePartnerships.length + completedPartnerships.length,
      fundingProvided: totalFunding,
    };
  },

  async getNotifications(): Promise<IndustryNotification[]> {
    return getStoredData<IndustryNotification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_INDUSTRY_NOTIFICATIONS,
    );
  },

  async markNotificationRead(id: string): Promise<void> {
    const notifs = await this.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  async markAllNotificationsRead(): Promise<void> {
    const notifs = await this.getNotifications();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated);
  },
};
