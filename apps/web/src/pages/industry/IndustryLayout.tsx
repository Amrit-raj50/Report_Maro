import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Handshake,
  Milestone,
  Bell,
  Building2,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { partnershipsApi } from '../../api/partnerships.api.js';
import Dashboard from './Dashboard.js';
import Projects from './Projects.js';
import Partnerships from './Partnerships.js';
import MyContributions from './MyContributions.js';
import Notifications from './Notifications.js';
import Profile from './Profile.js';
import type { IndustryPartnership } from './types.js';

export type IndustryNavTab =
  | 'dashboard'
  | 'projects'
  | 'partnerships'
  | 'contributions'
  | 'notifications'
  | 'profile';

export default function IndustryLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);

  // Sync tab with pathname if using subroutes
  const getTabFromPath = (pathname: string): IndustryNavTab => {
    if (pathname.includes('/projects')) return 'projects';
    if (pathname.includes('/partnerships')) return 'partnerships';
    if (pathname.includes('/contributions')) return 'contributions';
    if (pathname.includes('/notifications')) return 'notifications';
    if (pathname.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<IndustryNavTab>(() =>
    getTabFromPath(location.pathname),
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedPartnershipForDetail, setSelectedPartnershipForDetail] =
    useState<IndustryPartnership | null>(null);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Load live unread count
  useEffect(() => {
    partnershipsApi
      .getNotifications()
      .then((notifs) => setUnreadNotifCount(notifs.filter((n) => !n.read).length))
      .catch(() => undefined);
  }, [activeTab]);

  const handleTabChange = (tab: IndustryNavTab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    if (tab === 'dashboard') navigate('/industry');
    else navigate(`/industry/${tab}`);
  };

  const handleSelectPartnership = (item: IndustryPartnership) => {
    setSelectedPartnershipForDetail(item);
    setActiveTab('contributions');
    navigate(`/industry/contributions/${item.projectId}`);
  };

  const companyName = authUser?.organization || 'Tata Steel CSR Foundation';
  const liaisonName = authUser?.full_name || 'CSR Directorate';

  const NAV_ITEMS = [
    { key: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'projects' as const, label: 'Projects', icon: Layers },
    { key: 'partnerships' as const, label: 'Partnerships', icon: Handshake },
    { key: 'contributions' as const, label: 'My Contributions', icon: Milestone },
    {
      key: 'notifications' as const,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
    },
    { key: 'profile' as const, label: 'Profile', icon: Building2 },
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-paper text-ink font-sans">
      {/* Top Banner: Corporate Identity Strip */}
      <div className="border-b border-border bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 border border-border rounded text-navy hover:bg-paper"
              aria-label="Toggle Sidebar Menu"
            >
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex h-10 w-10 items-center justify-center border border-navy/20 bg-paper p-1 rounded-[2px]">
              <span className="text-xl">💼</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-navy">
                  {companyName}
                </span>
                <span className="border border-forest/30 bg-forest/10 px-2 py-0.2 text-[10px] font-bold text-forest uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>State CSR Partner</span>
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Liaison: <strong className="text-navy">{liaisonName}</strong> · Govt. of Jharkhand State Innovation Ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTabChange('projects')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-turmeric text-ink font-bold text-xs uppercase tracking-wider rounded-[2px] border border-turmeric-deep hover:bg-turmeric-deep transition shadow-xs"
            >
              <span>+ DISCOVER PROJECTS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Shell */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* ============================================================ */}
          {/* SIDEBAR NAVIGATION SHELL                                     */}
          {/* ============================================================ */}
          <aside
            className={`lg:col-span-1 border border-border bg-white p-3 rounded-[2px] shadow-xs space-y-4 ${
              mobileSidebarOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono text-ink-muted uppercase font-bold tracking-wider block px-2 mb-1.5">
                Industry Portal Nav
              </span>
              <nav className="space-y-1 text-xs font-semibold">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleTabChange(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[2px] text-left transition-colors ${
                        isActive
                          ? 'bg-navy text-white font-bold shadow-xs'
                          : 'hover:bg-paper text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-turmeric' : 'text-ink-muted'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 font-mono text-[10px] font-bold rounded-full ${
                            isActive ? 'bg-turmeric text-ink' : 'bg-urgent text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Links / Resources Box */}
            <div className="border-t border-border pt-3 px-2 space-y-2 text-[11px] text-ink-muted">
              <span className="font-mono text-[10px] uppercase font-bold text-navy block">
                Statutory Guidelines
              </span>
              <div className="space-y-1">
                <a
                  href="https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules/companies-corporate-social-responsibility-policy-rules-2014.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-navy hover:underline"
                >
                  <span>MCA CSR Schedule VII</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a
                  href="/#about-scheme"
                  className="flex items-center gap-1 hover:text-navy hover:underline"
                >
                  <span>Jharkhand Innovation Scheme</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          </aside>

          {/* ============================================================ */}
          {/* MAIN CONTENT WORKSPACE AREA                                  */}
          {/* ============================================================ */}
          <main className="lg:col-span-4 min-w-0">
            {activeTab === 'dashboard' && <Dashboard />}

            {activeTab === 'projects' && (
              <Projects onNavigateToPartnerships={() => handleTabChange('partnerships')} />
            )}

            {activeTab === 'partnerships' && (
              <Partnerships onSelectPartnership={handleSelectPartnership} />
            )}

            {activeTab === 'contributions' && (
              <MyContributions
                selectedProjectId={selectedPartnershipForDetail?.projectId}
                onBackToPartnerships={() => handleTabChange('partnerships')}
              />
            )}

            {activeTab === 'notifications' && <Notifications />}

            {activeTab === 'profile' && <Profile />}
          </main>
        </div>
      </div>
    </div>
  );
}
