import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute.js';
import { useAuthStore } from '../../store/authStore.js';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
  });

  it('redirects unauthenticated users to /login', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<ProtectedRoute allow={['admin']} />}>
            <Route path="/admin" element={<div>Admin Only Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('allows access when user has matching role', () => {
    useAuthStore.getState().setSession(
      {
        id: 'adm-1',
        full_name: 'Gov Admin',
        email: 'admin@sihportal.dev',
        role: 'admin',
      },
      'mock-jwt',
    );

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<ProtectedRoute allow={['admin']} />}>
            <Route path="/admin" element={<div>Admin Only Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin Only Content')).toBeInTheDocument();
  });

  it('displays in-portal Access Restricted UI and DOES NOT route to login when authenticated user has wrong role', () => {
    useAuthStore.getState().setSession(
      {
        id: 'cit-1',
        full_name: 'Asha Devi',
        email: 'asha.devi@example.com',
        role: 'citizen',
      },
      'mock-jwt',
    );

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<ProtectedRoute allow={['admin']} />}>
            <Route path="/admin" element={<div>Admin Only Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page (Should Not Be Reached)</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Must NOT reach login page
    expect(screen.queryByText(/Login Page/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument();

    // Must show Access Restricted view
    expect(screen.getByText(/Access Restricted \/ अनाधिकृत पहुंच/i)).toBeInTheDocument();
    expect(screen.getByText('Asha Devi')).toBeInTheDocument();
    expect(screen.getByText(/Return to My Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout & Switch Account/i)).toBeInTheDocument();
  });
});
