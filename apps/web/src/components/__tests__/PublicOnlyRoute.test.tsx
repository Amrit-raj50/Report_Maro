import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PublicOnlyRoute } from '../PublicOnlyRoute.js';
import { useAuthStore } from '../../store/authStore.js';

describe('PublicOnlyRoute', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
  });

  it('renders public content (outlet) when no user is logged in', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<div>Login Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page Content')).toBeInTheDocument();
  });

  it('redirects authenticated citizen to /dashboard instead of showing login page', () => {
    useAuthStore.getState().setSession(
      {
        id: 'cit-1',
        full_name: 'Asha Devi',
        email: 'asha.devi@example.com',
        role: 'citizen',
      },
      'mock-jwt-token',
    );

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<div>Login Page Content</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Citizen Dashboard Content</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Login Page Content')).not.toBeInTheDocument();
    expect(screen.getByText('Citizen Dashboard Content')).toBeInTheDocument();
  });

  it('redirects authenticated student to /student instead of showing login page', () => {
    useAuthStore.getState().setSession(
      {
        id: 'stu-1',
        full_name: 'Himmat',
        email: 'himmat@nitjsr.ac.in',
        role: 'university',
        organization: 'NIT Jamshedpur | Dept: CSE | Role: Student',
      },
      'mock-jwt-token',
    );

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<div>Login Page Content</div>} />
          </Route>
          <Route path="/student" element={<div>Student Innovator Desk Content</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Login Page Content')).not.toBeInTheDocument();
    expect(screen.getByText('Student Innovator Desk Content')).toBeInTheDocument();
  });

  it('redirects authenticated admin to /admin instead of showing register page', () => {
    useAuthStore.getState().setSession(
      {
        id: 'adm-1',
        full_name: 'Admin',
        email: 'admin@sihportal.dev',
        role: 'admin',
      },
      'mock-jwt-token',
    );

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/register" element={<div>Register Page Content</div>} />
          </Route>
          <Route path="/admin" element={<div>Admin Dashboard Content</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Register Page Content')).not.toBeInTheDocument();
    expect(screen.getByText('Admin Dashboard Content')).toBeInTheDocument();
  });
});
