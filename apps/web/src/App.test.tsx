import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.js';
import { useAuthStore } from './store/authStore.js';

describe('App Route Guard Navigation', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
  });

  it('renders landing page for guest users navigating to /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText(/समाधान सेतु/i)).toBeInTheDocument();
  });

  it('automatically routes authenticated student away from / to /student', () => {
    useAuthStore.getState().setSession(
      {
        id: 'stu-1',
        full_name: 'Himmat',
        email: 'himmat@nitjsr.ac.in',
        role: 'university',
        organization: 'NIT Jamshedpur | Dept: CSE | Role: Student',
      },
      'mock-jwt',
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    // Should not stay on landing page; should render student desk
    expect(screen.getByText(/Student Investigator/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello, Himmat/i)).toBeInTheDocument();
  });

  it('automatically routes authenticated student away from /login to /student', () => {
    useAuthStore.getState().setSession(
      {
        id: 'stu-1',
        full_name: 'Himmat',
        email: 'himmat@nitjsr.ac.in',
        role: 'university',
        organization: 'NIT Jamshedpur | Dept: CSE | Role: Student',
      },
      'mock-jwt',
    );

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );

    // Should not render login form; should redirect to student desk
    expect(screen.queryByText(/NIC Authentication Gateway/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Student Investigator/i)).toBeInTheDocument();
  });
});
