import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Handshake, CheckCircle2, Building, User, MapPin } from 'lucide-react';
import { Card } from '../../components/Card.js';
import { Badge } from '../../components/Badge.js';
import { Button } from '../../components/Button.js';
import { projectsApi } from '../../api/projects.api.js';
import { PartnerFlowModal } from './PartnerFlowModal.js';
import type { IndustryProject, IndustryPartnership } from './types.js';

interface ProjectsProps {
  onNavigateToPartnerships?: () => void;
}

export default function Projects({ onNavigateToPartnerships }: ProjectsProps) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IndustryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [partneringProject, setPartneringProject] = useState<IndustryProject | null>(null);
  const [viewingProject, setViewingProject] = useState<IndustryProject | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    projectsApi
      .listProjects()
      .then((data) => setProjects(data))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handlePartnerSuccess = (partnership: IndustryPartnership) => {
    showToast(`Partnership request submitted for ${partnership.projectCode}. Status: Pending.`);
    if (onNavigateToPartnerships) {
      setTimeout(() => onNavigateToPartnerships(), 1200);
    } else {
      setTimeout(() => navigate('/industry/partnerships'), 1200);
    }
  };

  const domains = ['All', 'Water & Sanitation', 'Healthcare', 'Environment', 'Energy', 'Infrastructure', 'Agriculture'];
  const statuses = ['All', 'Prototype', 'Development', 'Testing', 'Pilot'];

  const filteredProjects = projects.filter((p) => {
    const matchesDomain = domainFilter === 'All' || p.domain === domainFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDomain && matchesStatus && matchesSearch;
  });

  const getStatusTone = (status: string): 'neutral' | 'blue' | 'green' | 'amber' | 'purple' => {
    switch (status) {
      case 'Prototype':
        return 'blue';
      case 'Development':
        return 'purple';
      case 'Testing':
        return 'amber';
      case 'Pilot':
        return 'green';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 border border-navy bg-navy px-4 py-3 text-xs font-medium text-white shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-turmeric shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border pb-3">
        <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider block">
          Innovation Pipeline
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-0.5">
          <h1 className="font-display text-xl font-bold text-navy">
            Find Projects &amp; Challenges
          </h1>
          <span className="text-xs font-mono text-ink-muted">
            Showing {filteredProjects.length} of {projects.length} available projects
          </span>
        </div>
        <p className="text-xs text-ink-muted mt-0.5">
          Discover verified civic solutions developed by Jharkhand state universities seeking corporate CSR sponsorship and technical co-development.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="border border-border bg-white p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by project code, keyword, university, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-border bg-paper py-2 pl-9 pr-3 text-xs text-ink placeholder:text-slate-400 focus:border-navy focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Chips Strip */}
        <div className="space-y-2 border-t border-border/60 pt-3">
          {/* Domain Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-navy uppercase tracking-wider mr-1">
              Domain:
            </span>
            {domains.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setDomainFilter(dom)}
                className={`px-2.5 py-1 text-[11px] font-medium transition rounded-[2px] border ${
                  domainFilter === dom
                    ? 'border-navy bg-navy text-white font-bold'
                    : 'border-border bg-paper text-ink-muted hover:border-navy hover:text-navy'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-navy uppercase tracking-wider mr-1">
              Status:
            </span>
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-[11px] font-medium transition rounded-[2px] border ${
                  statusFilter === st
                    ? 'border-navy bg-navy text-white font-bold'
                    : 'border-border bg-paper text-ink-muted hover:border-navy hover:text-navy'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white p-4" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="border border-dashed border-border bg-paper p-8 text-center">
          <p className="text-sm font-semibold text-navy">No matching projects found</p>
          <p className="text-xs text-ink-muted mt-1">
            Try resetting your domain or status filters to discover all available projects.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setDomainFilter('All');
              setStatusFilter('All');
              setSearchQuery('');
            }}
            className="mt-3"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between border border-border bg-white p-4 transition-all hover:border-navy hover:shadow-sm"
            >
              <div className="space-y-3">
                {/* Header: Code, Domain, Status */}
                <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-navy">{project.code}</span>
                    <span className="block text-[10px] text-ink-muted">{project.domain}</span>
                  </div>
                  <Badge tone={getStatusTone(project.status)}>{project.status}</Badge>
                </div>

                {/* Title */}
                <h3 className="font-display text-sm font-bold text-navy leading-snug line-clamp-2">
                  {project.title}
                </h3>

                {/* Institution & Mentor */}
                <div className="space-y-1 text-xs text-ink-muted">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="h-3.5 w-3.5 shrink-0 text-navy/70" />
                    <span className="truncate">{project.universityName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 shrink-0 text-navy/70" />
                    <span className="truncate">Lead: {project.mentorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-navy/70" />
                    <span>{project.district} District</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2">
                  {project.description}
                </p>

                {/* Required Support Chips */}
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block mb-1">
                    Required Support:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.requiredSupport.map((req) => (
                      <span
                        key={req}
                        className="inline-flex items-center rounded-[2px] border border-turmeric-deep/40 bg-turmeric/10 px-2 py-0.5 text-[10px] font-semibold text-ink"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setViewingProject(project)}
                  className="px-2.5 py-1.5 text-xs gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Project</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setPartneringProject(project)}
                  className="px-3 py-1.5 text-xs gap-1 font-bold"
                >
                  <Handshake className="h-3.5 w-3.5" />
                  <span>Partner</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Partner Flow Modal */}
      <PartnerFlowModal
        project={partneringProject}
        isOpen={Boolean(partneringProject)}
        onClose={() => setPartneringProject(null)}
        onSuccess={handlePartnerSuccess}
      />

      {/* Quick Project Detail View Modal */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg border-2 border-navy bg-white shadow-2xl rounded-[2px] p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-navy">{viewingProject.code}</span>
                <h3 className="font-display text-base font-bold text-navy mt-0.5">
                  {viewingProject.title}
                </h3>
              </div>
              <Badge tone={getStatusTone(viewingProject.status)}>{viewingProject.status}</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 border border-border bg-paper p-2.5">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">University:</span>
                  <strong className="text-navy">{viewingProject.universityName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Faculty Lead:</span>
                  <strong className="text-navy">{viewingProject.mentorName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">District:</span>
                  <strong className="text-navy">{viewingProject.district}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Estimated Budget:</span>
                  <strong className="text-forest font-mono">₹{viewingProject.budget.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-navy uppercase text-[11px] block mb-1">
                  Civic Problem Description:
                </span>
                <p className="text-slate-700 bg-slate-50 p-2.5 border border-slate-200">
                  {viewingProject.description}
                </p>
              </div>

              {viewingProject.expectedSolution && (
                <div>
                  <span className="font-bold text-navy uppercase text-[11px] block mb-1">
                    Expected Technical Solution:
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 border border-slate-200">
                    {viewingProject.expectedSolution}
                  </p>
                </div>
              )}

              <div>
                <span className="font-bold text-navy uppercase text-[11px] block mb-1">
                  Requested Industry Support:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingProject.requiredSupport.map((sup) => (
                    <span
                      key={sup}
                      className="border border-turmeric-deep/40 bg-turmeric/10 px-2.5 py-1 text-xs font-semibold text-ink"
                    >
                      {sup}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button variant="secondary" onClick={() => setViewingProject(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const p = viewingProject;
                  setViewingProject(null);
                  setPartneringProject(p);
                }}
              >
                Partner with Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
