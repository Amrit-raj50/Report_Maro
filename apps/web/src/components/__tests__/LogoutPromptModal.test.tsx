import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogoutPromptModal } from '../LogoutPromptModal.js';
import type { User } from '@sih/shared-types';

describe('LogoutPromptModal', () => {
  const mockStudentUser: User = {
    id: 'stu-1',
    full_name: 'Himmat',
    email: 'himmat@nitjsr.ac.in',
    role: 'university',
    organization: 'NIT Jamshedpur | Dept: CSE | Role: Student',
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <LogoutPromptModal
        isOpen={false}
        user={mockStudentUser}
        onStay={vi.fn()}
        onLogout={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders logout prompt modal with user and portal details when isOpen is true', () => {
    render(
      <LogoutPromptModal
        isOpen={true}
        user={mockStudentUser}
        onStay={vi.fn()}
        onLogout={vi.fn()}
      />,
    );

    expect(screen.getByText(/Logout Required \/ लॉग आउट आवश्यक/i)).toBeInTheDocument();
    expect(screen.getByText('Himmat')).toBeInTheDocument();
    expect(screen.getByText(/Student Innovator Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Back button navigation is disabled to protect your active portal session/i)).toBeInTheDocument();
    expect(screen.getByText(/Stay on Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout Now/i)).toBeInTheDocument();
  });

  it('calls onStay callback when Stay on Dashboard is clicked', () => {
    const onStay = vi.fn();
    render(
      <LogoutPromptModal
        isOpen={true}
        user={mockStudentUser}
        onStay={onStay}
        onLogout={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText(/Stay on Dashboard/i));
    expect(onStay).toHaveBeenCalledTimes(1);
  });

  it('calls onLogout callback when Logout Now is clicked', () => {
    const onLogout = vi.fn();
    render(
      <LogoutPromptModal
        isOpen={true}
        user={mockStudentUser}
        onStay={vi.fn()}
        onLogout={onLogout}
      />,
    );

    fireEvent.click(screen.getByText(/Logout Now/i));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
