import { apiClient } from '../lib/apiClient.js';
import type { IndustryProject } from '../pages/industry/types.js';
import { partnershipsApi } from './partnerships.api.js';

export const projectsApi = {
  async listProjects(): Promise<IndustryProject[]> {
    return partnershipsApi.getProjects();
  },

  async getProjectById(id: string): Promise<IndustryProject | undefined> {
    const all = await partnershipsApi.getProjects();
    return all.find((p) => p.id === id);
  },

  async fundProject(id: string, amount: number) {
    return apiClient.put(`/projects/${id}/fund`, { amount });
  },
};
