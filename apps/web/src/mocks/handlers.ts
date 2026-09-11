import { http, HttpResponse } from 'msw';
import { mockProblems, mockProjects, mockUsers } from './fixtures.js';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

/** Fixture handlers matching backend/'s actual response shapes exactly — see docs/API_CONTRACT.md. */
export const handlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    if (!user || user.password !== body.password) {
      return HttpResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }
    const { password: _password, ...publicUser } = user;
    return HttpResponse.json({
      success: true,
      message: 'Login successful!',
      token: 'mock-jwt',
      user: publicUser,
    });
  }),

  http.post(`${BASE}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      full_name: string;
      role: string;
      organization?: string;
      phone?: string;
      district?: string;
      taluka?: string;
      village_or_city?: string;
      pincode?: string;
      lgd_district_code?: number;
      lgd_block_code?: number;
    };
    return HttpResponse.json(
      {
        success: true,
        message: 'User registered successfully!',
        token: 'mock-jwt',
        user: {
          id: `user_${Date.now()}`,
          full_name: body.full_name,
          email: body.email,
          role: body.role,
          organization: body.organization ?? null,
          phone: body.phone ?? null,
          district: body.district ?? null,
          taluka: body.taluka ?? null,
          village_or_city: body.village_or_city ?? null,
          pincode: body.pincode ?? null,
          lgd_district_code: body.lgd_district_code ?? null,
          lgd_block_code: body.lgd_block_code ?? null,
        },
      },
      { status: 201 },
    );
  }),

  http.get(`${BASE}/problems`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const district = url.searchParams.get('district');
    const status = url.searchParams.get('status');

    let filtered = [...mockProblems];
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (district)
      filtered = filtered.filter(
        (p) => p.location.district.toLowerCase() === district.toLowerCase(),
      );
    if (status) filtered = filtered.filter((p) => p.status === status);

    return HttpResponse.json({
      success: true,
      data: filtered,
      pagination: {
        page: 1,
        limit: 10,
        total: filtered.length,
        pages: Math.max(1, Math.ceil(filtered.length / 10)),
      },
    });
  }),

  http.get(`${BASE}/problems/:id`, ({ params }) => {
    const problem = mockProblems.find((p) => p._id === params.id);
    if (!problem)
      return HttpResponse.json({ success: false, message: 'Problem not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: problem });
  }),

  http.post(`${BASE}/problems`, async ({ request }) => {
    const body = (await request.json()) as { title: string };
    return HttpResponse.json(
      {
        success: true,
        message: 'Problem submitted successfully. AI is processing it in the background.',
        data: {
          id: `prob_${Date.now()}`,
          title: body.title,
          status: 'submitted',
          created_at: new Date().toISOString(),
        },
      },
      { status: 202 },
    );
  }),

  http.get(`${BASE}/problems/stats/dashboard`, () => {
    const total = mockProblems.length;
    const catMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};
    const distMap: Record<string, number> = {};

    mockProblems.forEach((p) => {
      if (p.category) catMap[p.category] = (catMap[p.category] || 0) + 1;
      statusMap[p.status] = (statusMap[p.status] || 0) + 1;
      if (p.location.district)
        distMap[p.location.district] = (distMap[p.location.district] || 0) + 1;
    });

    return HttpResponse.json({
      success: true,
      source: 'database',
      data: {
        total,
        byCategory: Object.entries(catMap).map(([_id, count]) => ({ _id, count })),
        byStatus: Object.entries(statusMap).map(([_id, count]) => ({ _id, count })),
        byDistrict: Object.entries(distMap).map(([_id, count]) => ({ _id, count })),
        lastUpdated: new Date().toISOString(),
      },
    });
  }),

  http.get(`${BASE}/users`, ({ request }) => {
    const role = new URL(request.url).searchParams.get('role');
    const data = mockUsers
      .filter((u) => !role || u.role === role)
      .map(({ password: _p, ...u }) => u);
    return HttpResponse.json({ success: true, data });
  }),

  http.get(`${BASE}/projects`, () => HttpResponse.json({ success: true, data: mockProjects })),
  http.get(`${BASE}/projects/:id`, ({ params }) => {
    const project = mockProjects.find((p) => p._id === params.id);
    if (!project)
      return HttpResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: project });
  }),

  http.get(`${BASE}/notifications`, () =>
    HttpResponse.json({ success: true, data: [], unreadCount: 0 }),
  ),
];
