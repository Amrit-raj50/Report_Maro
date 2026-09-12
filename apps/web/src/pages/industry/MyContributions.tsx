import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Building,
  User,
  Calendar,
  Layers,
  ArrowLeft,
  Handshake,
} from 'lucide-react';
import { Card } from '../../components/Card.js';
import { Badge } from '../../components/Badge.js';
import { Button } from '../../components/Button.js';
import { partnershipsApi } from '../../api/partnerships.api.js';
import type { IndustryPartnership, ProjectStage } from './types.js';
import { ALL_PROJECT_STAGES } from './types.js';

interface MyContributionsProps {
  selectedProjectId?: string;
  onBackToPartnerships?: () => void;
}

export default function MyContributions({
  selectedProjectId: propProjectId,
  onBackToPartnerships,
}: MyContributionsProps) {
  const { projectId: urlProjectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();

  const activeProjectId = propProjectId || urlProjectId;
  const [partnerships, setPartnerships] = useState<IndustryPartnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<IndustryPartnership | null>(null);

  useEffect(() => {
    partnershipsApi
      .getPartnerships()
      .then((data) => {
        setPartnerships(data);
        if (activeProjectId) {
          const matched = data.find((p) => p.projectId === activeProjectId || p.id === activeProjectId);
          if (matched) {
            setSelectedProject(matched);
            return;
          }
        }
        // Default to first active or available partnership
        if (data.length > 0 && data[0]) {
          setSelectedProject(data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [activeProjectId]);

  const handleSelect = (item: IndustryPartnership) => {
    setSelectedProject(item);
  };

  const getStageIndex = (stage: ProjectStage): number => {
    return ALL_PROJECT_STAGES.indexOf(stage);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 animate-pulse rounded border border-border bg-white" />
        <div className="h-64 animate-pulse rounded border border-border bg-white" />
      </div>
    );
  }

  if (!selectedProject || partnerships.length === 0) {
    return (
      <div className="border border-dashed border-border bg-white p-8 text-center space-y-3">
        <Handshake className="mx-auto h-10 w-10 text-ink-muted/50" />
        <h2 className="font-display text-base font-bold text-navy">No Partnered Projects Yet</h2>
        <p className="text-xs text-ink-muted max-w-md mx-auto">
          You haven't partnered with any university innovations yet. Browse available projects and submit a partnership request to track real-time stage progress.
        </p>
        <Button variant="primary" onClick={() => navigate('/industry/projects')}>
          Browse Projects
        </Button>
      </div>
    );
  }

  const currentStageIdx = getStageIndex(selectedProject.stage);

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <div className="border-b border-border pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {onBackToPartnerships ? (
              <Button
                variant="ghost"
                onClick={onBackToPartnerships}
                className="p-1 text-xs gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Partnerships</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate('/industry/partnerships')}
                className="p-1 text-xs gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>All Partnerships</span>
              </Button>
            )}
            <span className="text-border">|</span>
            <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider">
              Project Progress &amp; Milestone Telemetry
            </span>
          </div>

          <Badge tone={selectedProject.status === 'Active' ? 'green' : 'amber'}>
            {selectedProject.status}
          </Badge>
        </div>

        {/* Project Selector tabs if multiple partnerships exist */}
        {partnerships.length > 1 && (
          <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
            <span className="text-[11px] font-bold text-navy uppercase mr-1 shrink-0">
              Partnered Projects:
            </span>
            {partnerships.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-[2px] transition border whitespace-nowrap shrink-0 ${
                  selectedProject.id === p.id
                    ? 'border-navy bg-navy text-white font-bold'
                    : 'border-border bg-white text-ink-muted hover:border-navy'
                }`}
              >
                {p.projectCode}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Project Identity Banner */}
      <Card className="border border-border bg-white p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/70 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-navy bg-paper px-2 py-0.5 border border-border">
                {selectedProject.projectCode}
              </span>
              <span className="text-border">|</span>
              <span className="font-mono text-[11px] text-ink-muted">
                MoU: {selectedProject.mouRefNumber}
              </span>
              <Badge tone="blue">{selectedProject.domain}</Badge>
            </div>

            <h2 className="font-display text-lg sm:text-xl font-bold text-navy leading-snug">
              {selectedProject.projectTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted pt-0.5">
              <div className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-navy/70" />
                <strong className="text-navy">{selectedProject.universityName}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-navy/70" />
                <span>Faculty Mentor: <strong className="text-navy">{selectedProject.mentorName}</strong></span>
              </div>
            </div>
          </div>

          {/* Progress Percentage Badge */}
          <div className="flex flex-col sm:items-end shrink-0 border sm:border-0 border-border bg-paper sm:bg-transparent p-3 sm:p-0">
            <span className="text-[10px] font-mono text-ink-muted uppercase font-bold tracking-wider">
              Cumulative Progress
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-3xl font-bold text-navy">
                {selectedProject.progressPct}%
              </span>
              <span className="text-xs text-forest font-semibold">Completed</span>
            </div>
            {/* Progress Bar */}
            <div className="w-36 h-2 bg-paper-dark border border-border rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-turmeric transition-all duration-500"
                style={{ width: `${selectedProject.progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* STAGE TRACKER (Research → Prototype → Testing → Pilot → Deployment) */}
        {/* ==================================================================== */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-turmeric" />
              <span>Project Lifecycle Stage Tracker</span>
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              Current Stage: <strong className="text-navy">{selectedProject.stage}</strong>
            </span>
          </div>

          {/* Stepper container */}
          <div className="border border-border bg-paper p-4 rounded-[2px]">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2">
              {ALL_PROJECT_STAGES.map((st, idx) => {
                const isDone = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                const isUpcoming = idx > currentStageIdx;

                return (
                  <div
                    key={st}
                    className={`relative flex flex-col p-3 border rounded-[2px] transition ${
                      isCurrent
                        ? 'border-turmeric-deep bg-white shadow-xs ring-2 ring-turmeric/30'
                        : isDone
                        ? 'border-forest/40 bg-forest/5'
                        : 'border-border/60 bg-white/60 text-ink-muted'
                    }`}
                  >
                    {/* Top indicator: ✓ / ● / ○ */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-ink-muted">
                        STAGE 0{idx + 1}
                      </span>
                      {isDone && (
                        <span className="flex items-center gap-1 text-forest text-xs font-bold font-mono">
                          <CheckCircle2 className="h-4 w-4 text-forest" />
                          <span>✓ Done</span>
                        </span>
                      )}
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-turmeric-deep text-xs font-bold font-mono">
                          <span className="inline-block h-2.5 w-2.5 rounded-full bg-turmeric animate-pulse" />
                          <span>● In Progress</span>
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                          <Circle className="h-3.5 w-3.5 text-slate-300" />
                          <span>○ Not Started</span>
                        </span>
                      )}
                    </div>

                    {/* Stage Title */}
                    <span
                      className={`font-display text-sm font-bold leading-tight ${
                        isCurrent ? 'text-navy' : isDone ? 'text-forest-deep' : 'text-slate-500'
                      }`}
                    >
                      {st}
                    </span>

                    {/* Stage context note */}
                    <span className="text-[10px] text-ink-muted mt-1">
                      {st === 'Research' && 'Literature, LGD field surveys & baseline profile'}
                      {st === 'Prototype' && 'Lab-scale bench fabrication & telemetry breadboard'}
                      {st === 'Testing' && 'Sensor calibration, durability & stress trials'}
                      {st === 'Pilot' && 'Community field deployment & Panchayat trial run'}
                      {st === 'Deployment' && 'District-wide scaling & state handover'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two-Column Details: Milestones & Corporate Support Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
          {/* Milestones Checklist (2 cols) */}
          <div className="lg:col-span-2 border border-border bg-white p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-navy">
                Field Milestones &amp; Deliverables
              </h4>
              <span className="font-mono text-[10px] text-ink-muted">
                {selectedProject.milestones.filter((m) => m.done).length} of{' '}
                {selectedProject.milestones.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {selectedProject.milestones.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start justify-between gap-3 p-2.5 border rounded-[2px] text-xs ${
                    m.done
                      ? 'border-forest/30 bg-forest/5 text-navy'
                      : 'border-border bg-paper text-ink'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {m.done ? (
                      <CheckCircle2 className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={m.done ? 'font-semibold text-forest-deep line-through opacity-90' : 'font-medium'}>
                        {m.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-ink-muted shrink-0">
                    <Calendar className="h-3 w-3" />
                    <span>{m.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corporate Contribution Snapshot (1 col) */}
          <div className="border border-border bg-paper p-4 space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-navy border-b border-border pb-2">
              Sponsorship Commitment
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-muted block">
                  Contribution Modes:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedProject.supportTypes.map((st) => (
                    <span
                      key={st}
                      className="border border-navy/30 bg-white px-2 py-0.5 font-semibold text-navy text-[11px]"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {selectedProject.fundingCommitted > 0 && (
                <div className="border-t border-border/70 pt-2">
                  <span className="text-[10px] font-mono uppercase text-ink-muted block">
                    Financial Grant Sanctioned:
                  </span>
                  <span className="font-mono text-base font-bold text-forest">
                    ₹{selectedProject.fundingCommitted.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {selectedProject.notes && (
                <div className="border-t border-border/70 pt-2">
                  <span className="text-[10px] font-mono uppercase text-ink-muted block">
                    Resource Notes:
                  </span>
                  <p className="text-[11px] text-slate-700 bg-white p-2 border border-border/60 mt-0.5">
                    {selectedProject.notes}
                  </p>
                </div>
              )}

              <div className="border-t border-border/70 pt-2 text-[11px] text-ink-muted space-y-1">
                <div>
                  <strong>Institutional Contact:</strong>
                </div>
                <div>{selectedProject.mentorName}</div>
                <div>{selectedProject.universityName}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
