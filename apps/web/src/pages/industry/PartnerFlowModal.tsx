import { useState } from 'react';
import { X, CheckCircle2, Handshake, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button.js';
import { Badge } from '../../components/Badge.js';
import { partnershipsApi } from '../../api/partnerships.api.js';
import type { IndustryProject, ContributionType, IndustryPartnership } from './types.js';
import { ALL_CONTRIBUTION_TYPES } from './types.js';

interface PartnerFlowModalProps {
  project: IndustryProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (partnership: IndustryPartnership) => void;
}

export function PartnerFlowModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: PartnerFlowModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<ContributionType[]>([]);
  const [fundingAmount, setFundingAmount] = useState<number>(project?.budget || 250000);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const toggleContributionType = (type: ContributionType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedTypes.length === 0) {
      setError('Please select at least one contribution type to partner with this project.');
      return;
    }

    setLoading(true);
    try {
      const partnership = await partnershipsApi.createPartnershipRequest({
        projectId: project.id,
        projectCode: project.code,
        projectTitle: project.title,
        domain: project.domain,
        universityName: project.universityName,
        mentorName: project.mentorName,
        supportTypes: selectedTypes,
        pledgedFunding: selectedTypes.includes('Funding') ? fundingAmount : 0,
        notes: notes.trim(),
      });

      onSuccess(partnership);
      onClose();
    } catch (err) {
      setError('Could not submit partnership request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl border-2 border-navy bg-white shadow-2xl rounded-[2px] font-sans overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-navy px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-turmeric" />
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 block">
                Official Partnership Endorsement
              </span>
              <h3 className="font-display text-base font-bold text-white">
                Partner with Project
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Project Summary Card */}
          <div className="border border-border bg-paper p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-navy">{project.code}</span>
              <Badge tone="blue">{project.domain}</Badge>
            </div>
            <h4 className="font-display text-sm font-bold text-navy leading-snug">
              {project.title}
            </h4>
            <div className="text-[11px] text-ink-muted flex flex-wrap gap-x-4 gap-y-1">
              <span>🏛️ {project.universityName}</span>
              <span>👨‍🏫 Mentor: {project.mentorName}</span>
              <span>📍 {project.district}</span>
            </div>
            {project.expectedSolution && (
              <p className="text-xs text-slate-600 bg-white border border-border/70 p-2 italic">
                "{project.expectedSolution}"
              </p>
            )}
          </div>

          {/* Contribution Types Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
              Select Contribution Type(s) *
            </label>
            <p className="text-[11px] text-ink-muted mb-2">
              Choose how your organization will support this university innovation:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_CONTRIBUTION_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                const isRequired = project.requiredSupport.includes(type);

                return (
                  <label
                    key={type}
                    onClick={() => toggleContributionType(type)}
                    className={`flex items-start gap-2.5 p-2.5 border rounded-[2px] cursor-pointer transition select-none ${
                      isSelected
                        ? 'border-navy bg-navy/5 text-navy font-semibold ring-1 ring-navy'
                        : 'border-border bg-white text-ink hover:bg-paper'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by container
                      className="mt-0.5 accent-navy"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span>{type}</span>
                        {isRequired && (
                          <span className="text-[9px] font-mono font-bold bg-turmeric/30 text-ink px-1 py-0.2 rounded-[2px]">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Funding Amount if Funding selected */}
          {selectedTypes.includes('Funding') && (
            <div className="border border-border bg-paper p-3 space-y-1.5">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                CSR Co-Funding Pledge (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm font-bold text-navy">₹</span>
                <input
                  type="number"
                  min="10000"
                  step="10000"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(Number(e.target.value))}
                  className="w-full border border-border bg-white py-1.5 pl-8 pr-3 text-sm font-mono font-bold text-navy focus:border-navy focus:outline-none"
                  placeholder="e.g. 500000"
                />
              </div>
              <p className="text-[10px] text-ink-muted">
                Sanctioned under CSR Schedule VII (Promotion of scientific research &amp; incubators).
              </p>
            </div>
          )}

          {/* Notes / Special Terms */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
              Resource / Mentorship Details (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Willing to provide 20 sensor probes, assign 2 senior IoT engineers for bi-weekly mentorship, or provide testing trench facilities..."
              className="w-full border border-border bg-white p-2.5 text-xs text-ink placeholder:text-slate-400 focus:border-navy focus:outline-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 border border-urgent/40 bg-urgent/10 p-2.5 text-xs text-urgent">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submission Notice */}
          <div className="border-t border-border pt-3 text-[11px] text-ink-muted">
            Submitting initiates a formal partnership request and logs it under <strong>My Partnerships</strong> as <em>Pending</em> until endorsed by DHTE State Administration and the University PI.
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || selectedTypes.length === 0}
              className="gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{loading ? 'Submitting...' : 'Submit Partnership Request'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
