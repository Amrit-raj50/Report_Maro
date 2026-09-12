import { useState } from 'react';
import type { FacultyMentor } from './universityData.js';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';

interface Props {
  defaultTitle?: string;
  defaultChallengeCode?: string;
  mentors: FacultyMentor[];
  onClose: () => void;
  onSubmit: (proposal: {
    title: string;
    challengeRef: string;
    facultyLead: string;
    department: string;
    budget: string;
    milestones: { title: string; dueDate: string }[];
  }) => void;
}

export function ProposalSubmissionModal({
  defaultTitle = '',
  defaultChallengeCode = '',
  mentors,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(defaultTitle);
  const [challengeRef, setChallengeRef] = useState(defaultChallengeCode);
  const [mentorId, setMentorId] = useState(mentors[0]?.id || '');
  const [budgetAmount, setBudgetAmount] = useState('500000');
  const [milestones, setMilestones] = useState<{ title: string; dueDate: string }[]>([
    { title: 'Baseline Field Assay & Lab Profiling', dueDate: '2026-10-15' },
    { title: 'Bench-scale Prototype Assembly & Testing', dueDate: '2026-11-30' },
    { title: 'Field Pilot Deployment & Citizen Validation Report', dueDate: '2027-01-15' },
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  const selectedMentor = mentors.find((m) => m.id === mentorId) || mentors[0];

  const handleAddMilestone = () => {
    if (!newMilestoneTitle || !newMilestoneDate) return;
    setMilestones([...milestones, { title: newMilestoneTitle, dueDate: newMilestoneDate }]);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !challengeRef.trim()) return;
    onSubmit({
      title,
      challengeRef,
      facultyLead: selectedMentor?.name || 'Dr. Rajesh Sharma',
      department: selectedMentor?.department || 'Environmental Science & Engineering',
      budget: `₹${Number(budgetAmount).toLocaleString('en-IN')}`,
      milestones,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col border border-border bg-paper shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-navy px-6 py-3 text-white">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="h-5 w-5 text-turmeric" />
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-turmeric uppercase">
                राज्य अनुसंधान एवं विकास अनुदान प्रस्ताव | STATE INNOVATION SEED GRANT FORM
              </p>
              <h2 className="font-display text-base font-semibold">
                Submit Institutional R&D Proposal
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border border-white/20 p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="border border-border bg-white p-4 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-navy uppercase tracking-wider">
                Research Project Title:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Smart IoT Telemetry Water Filtration Unit"
                className="mt-1 w-full border border-border bg-paper p-2 text-xs text-ink focus:border-navy focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-navy uppercase tracking-wider">
                  Associated Problem Memo ID:
                </label>
                <input
                  type="text"
                  required
                  value={challengeRef}
                  onChange={(e) => setChallengeRef(e.target.value)}
                  placeholder="JH-WTR-2026-01023"
                  className="mt-1 w-full border border-border bg-paper p-2 font-mono text-xs text-ink focus:border-navy focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-navy uppercase tracking-wider">
                  Requested State Grant Budget (INR):
                </label>
                <input
                  type="number"
                  required
                  min={50000}
                  step={10000}
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="mt-1 w-full border border-border bg-paper p-2 font-mono text-xs text-ink focus:border-navy focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border border-border bg-white p-4">
            <label className="text-[11px] font-semibold text-navy uppercase tracking-wider">
              Lead Principal Investigator (Faculty Mentor):
            </label>
            <select
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
              className="mt-1 w-full border border-border bg-paper p-2 text-xs text-ink focus:border-navy focus:outline-none"
            >
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.department}
                </option>
              ))}
            </select>
          </div>

          {/* Milestones */}
          <div className="border border-border bg-white p-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-[11px] font-semibold text-navy uppercase tracking-wider">
                Milestone Timeline & Delivery Deliverables ({milestones.length})
              </span>
              <span className="text-[11px] text-ink-muted">Quarterly Review Cycle</span>
            </div>

            <div className="mt-3 space-y-2">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-border bg-paper px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold text-ink-muted">
                      M{idx + 1}:
                    </span>
                    <span className="font-medium text-navy">{m.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-ink-muted">Due: {m.dueDate}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="border border-border p-1 text-ink-muted hover:text-urgent"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Milestone row */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Milestone Deliverable"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="border border-border bg-paper p-1.5 text-xs text-ink sm:col-span-2"
              />
              <input
                type="date"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="border border-border bg-paper p-1.5 text-xs text-ink font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              disabled={!newMilestoneTitle || !newMilestoneDate}
              className="mt-2 flex items-center gap-1 border border-navy bg-white px-2.5 py-1 text-xs font-medium text-navy hover:bg-paper disabled:opacity-40"
            >
              <Plus className="h-3 w-3" /> Add Milestone
            </button>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-border bg-white px-4 py-2 text-xs text-ink hover:bg-paper"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 border border-turmeric-deep bg-turmeric px-5 py-2 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-ink" />
              Submit Proposal to State Directorate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
