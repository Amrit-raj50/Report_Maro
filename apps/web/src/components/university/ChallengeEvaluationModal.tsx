import { useState } from 'react';
import type { ChallengeItem } from './universityData.js';
import {
  X,
  FileText,
  MapPin,
  Cpu,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  Building,
  Layers,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface Props {
  challenge: ChallengeItem;
  onClose: () => void;
  onAccept: (challenge: ChallengeItem) => void;
  onReject: (challengeId: string, reason: string) => void;
  onRequestInfo: (challengeId: string, query: string) => void;
}

export function ChallengeEvaluationModal({
  challenge,
  onClose,
  onAccept,
  onReject,
  onRequestInfo,
}: Props) {
  const [activeTab, setActiveTab] = useState<'dossier' | 'ai_rationale' | 'action_panel'>('dossier');
  const [rejectReason, setRejectReason] = useState('');
  const [infoQuery, setInfoQuery] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showInfoInput, setShowInfoInput] = useState(false);

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    onReject(challenge.id, rejectReason);
  };

  const handleInfoSubmit = () => {
    if (!infoQuery.trim()) return;
    onRequestInfo(challenge.id, infoQuery);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col border border-border bg-paper shadow-sm">
        {/* Official Header Band */}
        <div className="flex items-center justify-between border-b border-border bg-navy px-6 py-3 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center border border-white/30 bg-navy-deep text-xs font-bold text-turmeric">
              JH
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-turmeric uppercase">
                झारखंड सरकार · उच्च एवं तकनीकी शिक्षा विभाग | STATE R&D ALLOCATION DOSSIER
              </p>
              <h2 className="font-display text-base font-semibold tracking-wide">
                Challenge Evaluation & Allocation Protocol
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border border-white/20 p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Memo Reference Banner */}
        <div className="flex flex-wrap items-center justify-between border-b border-border bg-white px-6 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-ink-muted uppercase">Memo ID:</span>
            <span className="font-mono font-semibold text-navy">{challenge.code}</span>
            <span className="text-border">|</span>
            <span className="text-ink-muted">Reported: {challenge.dateReported}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ink-muted">AI Match Affinity:</span>
            <span className="border border-forest bg-forest/10 px-2 py-0.5 font-mono text-xs font-semibold text-forest">
              {challenge.aiMatchScore}% CONFIDENCE
            </span>
            <span
              className={`border px-2 py-0.5 font-mono text-xs font-semibold uppercase ${
                challenge.priority === 'critical'
                  ? 'border-urgent bg-urgent/10 text-urgent'
                  : 'border-under-review bg-under-review/10 text-under-review'
              }`}
            >
              {challenge.priorityLabel} PRIORITY
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-border bg-paper px-6">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition ${
              activeTab === 'dossier'
                ? 'border-navy bg-white font-semibold text-navy'
                : 'border-transparent text-ink-muted hover:text-navy'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Problem Dossier & Field Evidence
          </button>
          <button
            onClick={() => setActiveTab('ai_rationale')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition ${
              activeTab === 'ai_rationale'
                ? 'border-navy bg-white font-semibold text-navy'
                : 'border-transparent text-ink-muted hover:text-navy'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            AI Routing Rationale & Lab Match
          </button>
          <button
            onClick={() => setActiveTab('action_panel')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition ${
              activeTab === 'action_panel'
                ? 'border-navy bg-white font-semibold text-navy'
                : 'border-transparent text-ink-muted hover:text-navy'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Institutional Decision Matrix
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dossier' && (
            <div className="space-y-5">
              {/* Title & Category Banner */}
              <div className="border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
                    {challenge.categoryLabel}
                  </span>
                  <span className="font-mono text-xs text-ink-muted">
                    Reported by: {challenge.reportedBy}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold text-navy">
                  {challenge.title}
                </h3>
                <p className="mt-0.5 text-xs text-ink-muted">{challenge.subTitle}</p>
              </div>

              {/* Grid: Description & Geo-Location */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border border-border bg-white p-4">
                  <h4 className="flex items-center gap-1.5 border-b border-border pb-1.5 text-xs font-semibold text-navy uppercase tracking-wider">
                    <FileText className="h-3.5 w-3.5 text-navy" />
                    Problem Description (Grassroots Report)
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{challenge.description}</p>
                  <div className="mt-4 border-t border-border pt-3">
                    <span className="text-[11px] font-semibold text-ink-muted uppercase">
                      Citizen Uploaded Evidence & Lab Parameters:
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {challenge.citizenEvidence}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-border bg-white p-4">
                    <h4 className="flex items-center gap-1.5 border-b border-border pb-1.5 text-xs font-semibold text-navy uppercase tracking-wider">
                      <MapPin className="h-3.5 w-3.5 text-navy" />
                      Location & Topography
                    </h4>
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex justify-between border-b border-border/50 py-1">
                        <span className="text-ink-muted">District:</span>
                        <span className="font-medium text-ink">{challenge.district}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 py-1">
                        <span className="text-ink-muted">Administrative Block:</span>
                        <span className="font-medium text-ink">{challenge.block}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-ink-muted">Coordinates / Habitation:</span>
                        <span className="font-mono text-xs font-medium text-navy">
                          {challenge.locationDetails}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border bg-white p-4">
                    <h4 className="flex items-center gap-1.5 border-b border-border pb-1.5 text-xs font-semibold text-navy uppercase tracking-wider">
                      <Layers className="h-3.5 w-3.5 text-navy" />
                      Potential Societal Impact
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-ink font-medium">
                      {challenge.potentialImpact}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[11px]">
                      <span className="text-ink-muted">Est. Budget:</span>
                      <span className="font-mono font-semibold text-forest">
                        {challenge.estimatedBudget}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills Strip */}
              <div className="border border-border bg-white p-4">
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                  Mandatory Academic Disciplines & Engineering Competencies:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {challenge.requiredExpertise.map((skill) => (
                    <span
                      key={skill}
                      className="border border-border bg-paper px-2.5 py-1 text-xs font-medium text-navy"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai_rationale' && (
            <div className="space-y-5">
              <div className="border border-border bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-forest uppercase tracking-wider">
                  <Cpu className="h-4 w-4" />
                  State Natural Language Triage Rationale
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink">
                  Under the DHTE Automated Taxonomy Pipeline, this citizen report was clustered using
                  domain NLP vectors. The problem parameters indicate high correlation with your
                  institutional research profile.
                </p>
              </div>

              <div className="border border-border bg-white p-4">
                <h4 className="border-b border-border pb-2 text-xs font-semibold text-navy uppercase tracking-wider">
                  Why Birla Institute of Technology / Your University Was Chosen:
                </h4>
                <ul className="mt-3 space-y-2.5 text-xs">
                  {challenge.matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-ink">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-forest bg-forest/10 font-mono text-[10px] font-bold text-forest">
                        ✓
                      </span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="border border-border bg-white p-3 text-center">
                  <span className="text-[10px] font-semibold text-ink-muted uppercase">
                    AI Match Affinity
                  </span>
                  <p className="mt-1 font-mono text-2xl font-bold text-navy">
                    {challenge.aiMatchScore}%
                  </p>
                  <span className="text-[10px] text-forest">High Relevance</span>
                </div>
                <div className="border border-border bg-white p-3 text-center">
                  <span className="text-[10px] font-semibold text-ink-muted uppercase">
                    Lab Infrastructure Ready
                  </span>
                  <p className="mt-1 font-mono text-2xl font-bold text-forest">100%</p>
                  <span className="text-[10px] text-ink-muted">CPCB Accredited</span>
                </div>
                <div className="border border-border bg-white p-3 text-center">
                  <span className="text-[10px] font-semibold text-ink-muted uppercase">
                    Eligible Faculty Mentors
                  </span>
                  <p className="mt-1 font-mono text-2xl font-bold text-navy">3</p>
                  <span className="text-[10px] text-ink-muted">Available Capacity</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'action_panel' && (
            <div className="space-y-5">
              <div className="border border-border bg-white p-4">
                <h4 className="text-xs font-semibold text-navy uppercase tracking-wider">
                  Institutional Governance Workflow
                </h4>
                <p className="mt-1 text-xs text-ink-muted">
                  Accepting this challenge initiates the state institutional research pipeline:
                </p>
                <div className="mt-3 flex items-center justify-between border border-border bg-paper p-3 text-xs font-medium">
                  <span className="flex items-center gap-1 font-semibold text-navy">
                    <FileText className="h-3.5 w-3.5" /> Challenge Accepted
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-border" />
                  <span className="flex items-center gap-1 font-semibold text-forest">
                    <Layers className="h-3.5 w-3.5" /> Project Initiated
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-border" />
                  <span className="flex items-center gap-1 font-semibold text-turmeric-deep">
                    <UserCheck className="h-3.5 w-3.5" /> Faculty Mentor Assigned
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-border" />
                  <span className="flex items-center gap-1 font-semibold text-navy">
                    <Building className="h-3.5 w-3.5" /> Team Formed
                  </span>
                </div>
              </div>

              {/* Conditional Action Boxes */}
              {showRejectInput && (
                <div className="border border-urgent bg-urgent/5 p-4">
                  <h5 className="text-xs font-semibold text-urgent uppercase tracking-wider">
                    Administrative Reason for Rejection:
                  </h5>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    This reason will be logged in the State AI Triage ledger for re-routing to another
                    institution.
                  </p>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="E.g., Departmental capacity reached for 2026-27 or specialized pilot assay equipment unavailable..."
                    className="mt-2 w-full border border-border bg-white p-2 text-xs text-ink focus:border-navy focus:outline-none"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setShowRejectInput(false)}
                      className="border border-border bg-white px-3 py-1.5 text-xs text-ink hover:bg-paper"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectSubmit}
                      className="border border-urgent bg-urgent px-4 py-1.5 text-xs font-semibold text-white hover:bg-urgent/90"
                    >
                      Confirm Official Rejection
                    </button>
                  </div>
                </div>
              )}

              {showInfoInput && (
                <div className="border border-under-review bg-under-review/5 p-4">
                  <h5 className="text-xs font-semibold text-under-review uppercase tracking-wider">
                    Request Additional Technical Information:
                  </h5>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Dispatch an official query to the District Grievance Cell / Citizen Submitter.
                  </p>
                  <textarea
                    rows={3}
                    value={infoQuery}
                    onChange={(e) => setInfoQuery(e.target.value)}
                    placeholder="Specify required test parameters, geological drill depth logs, or local electrical supply stability..."
                    className="mt-2 w-full border border-border bg-white p-2 text-xs text-ink focus:border-navy focus:outline-none"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setShowInfoInput(false)}
                      className="border border-border bg-white px-3 py-1.5 text-xs text-ink hover:bg-paper"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInfoSubmit}
                      className="border border-under-review bg-under-review px-4 py-1.5 text-xs font-semibold text-white hover:bg-under-review/90"
                    >
                      Dispatch Official Query
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="flex flex-wrap items-center justify-between border-t border-border bg-paper px-6 py-3">
          <div className="text-xs text-ink-muted">
            <span className="font-semibold text-navy">Authority:</span> Dean of R&D / Innovation Cell,
            Govt. of Jharkhand
          </div>
          <div className="flex items-center gap-2">
            {!showRejectInput && !showInfoInput && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('action_panel');
                    setShowInfoInput(true);
                  }}
                  className="flex items-center gap-1.5 border border-border bg-white px-3 py-2 text-xs font-medium text-ink hover:bg-paper"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-under-review" />
                  Request More Information
                </button>
                <button
                  onClick={() => {
                    setActiveTab('action_panel');
                    setShowRejectInput(true);
                  }}
                  className="flex items-center gap-1.5 border border-border bg-white px-3 py-2 text-xs font-medium text-urgent hover:bg-urgent/5"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject Challenge
                </button>
                <button
                  onClick={() => onAccept(challenge)}
                  className="flex items-center gap-1.5 border border-turmeric-deep bg-turmeric px-5 py-2 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-ink" />
                  Accept Challenge & Initiate Project
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
