import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../../mocks/server.js';
import IndustryLayout from '../industry/IndustryLayout.js';
import Dashboard from '../industry/Dashboard.js';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Industry Role', () => {
  it('renders the 4 required StatCards on Dashboard', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Available Projects')).toBeInTheDocument();
      expect(screen.getByText('Active Partnerships')).toBeInTheDocument();
      expect(screen.getByText('Projects Supported')).toBeInTheDocument();
      expect(screen.getByText('Funding Provided')).toBeInTheDocument();
    });
  });

  it('renders the 6 sidebar navigation links on IndustryLayout', async () => {
    render(
      <MemoryRouter initialEntries={['/industry']}>
        <IndustryLayout />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Projects').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Partnerships').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('My Contributions').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Notifications').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Profile').length).toBeGreaterThanOrEqual(1);
    });
  });
});
