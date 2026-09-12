import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/Badge.js';
import { Button } from '../../components/Button.js';
import { partnershipsApi } from '../../api/partnerships.api.js';
import type { IndustryPartnership, PartnershipStatus } from './types.js';

interface PartnershipsProps {
  onSelectPartnership?: (partnership: IndustryPartnership) => void;
}

export default function Partnerships({ onSelectPartnership }: PartnershipsProps) {
  const navigate = useNavigate();
  const [partnerships, setPartnerships] = useState<IndustryPartnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | PartnershipStatus>('All');

  useEffect(() => {
    partnershipsApi
      .getPartnerships()
      .then((data) => setPartnerships(data))
      .finally(() => setLoading(false));
  }, []);

  const handleRowClick = (p: IndustryPartnership) => {
    if (onSelectPartnership) {
      onSelectPartnership(p);
    } else {
      navigate(`/industry/contributions/${p.projectId}`);
    }
  };

  const filtered = partnerships.filter((p) => {
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: PartnershipStatus) => {
    switch (status) {
      case 'Active':
        return <Badge tone="green">Active</Badge>;
      case 'Pending':
        return <Badge tone="amber">Pending Approval</Badge>;
      case 'Completed':
        return <Badge tone="blue">Completed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider block">
          Corporate Sponsorship Roster
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-0.5">
          <h1 className="font-display text-xl font-bold text-navy">
            My Partnerships
          </h1>
          <span className="text-xs font-mono text-ink-muted">
            {partnerships.length} recorded partnership commitments
          </span>
        </div>
        <p className="text-xs text-ink-muted mt-0.5">
          Overview of active MoUs, pending partnership applications, and completed state civic projects.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-2">
        {(['All', 'Active', 'Pending', 'Completed'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition border ${
              statusFilter === st
                ? 'border-navy bg-navy text-white font-bold'
                : 'border-border bg-white text-ink-muted hover:border-navy hover:text-navy'
            }`}
          >
            <span>{st}</span>
            <span className="ml-1.5 text-[10px] font-mono opacity-80">
              (
              {st === 'All'
                ? partnerships.length
                : partnerships.filter((p) => p.status === st).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Partnerships Table */}
      {loading ? (
        <div className="h-64 animate-pulse rounded border border-border bg-white" />
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border bg-white p-8 text-center">
          <Handshake className="mx-auto h-8 w-8 text-ink-muted/50" />
          <p className="mt-2 text-sm font-semibold text-navy">No partnerships in this category</p>
          <p className="text-xs text-ink-muted mt-1">
            Discover available university projects to initiate a new corporate partnership.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/industry/projects')}
            className="mt-3"
          >
            Explore Projects
          </Button>
        </div>
      ) : (
        <div className="border border-border bg-white overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-paper text-[11px] font-semibold text-ink-muted uppercase">
                <th className="p-3.5">Project</th>
                <th className="p-3.5">Support</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Progress / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className="hover:bg-paper/70 cursor-pointer transition"
                >
                  {/* Project Info */}
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-navy">
                          {item.projectCode}
                        </span>
                        <span className="text-border">|</span>
                        <span className="text-[10px] font-mono text-ink-muted uppercase">
                          MoU: {item.mouRefNumber}
                        </span>
                      </div>
                      <h4 className="font-display text-xs font-bold text-navy line-clamp-1">
                        {item.projectTitle}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                        <span>🏛️ {item.universityName}</span>
                        <span>•</span>
                        <span>Mentor: {item.mentorName}</span>
                      </div>
                    </div>
                  </td>

                  {/* Support Types */}
                  <td className="p-3.5 align-top">
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {item.supportTypes.map((sup) => (
                          <span
                            key={sup}
                            className="inline-flex items-center rounded-[2px] border border-border bg-paper px-2 py-0.5 text-[10px] font-semibold text-ink"
                          >
                            {sup}
                          </span>
                        ))}
                      </div>
                      {item.fundingCommitted > 0 && (
                        <span className="block font-mono text-[11px] font-semibold text-forest">
                          ₹{item.fundingCommitted.toLocaleString('en-IN')} committed
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5 align-top">
                    <div className="space-y-1">
                      {getStatusBadge(item.status)}
                      <span className="block text-[10px] text-ink-muted">
                        Stage: <strong>{item.stage}</strong>
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="p-3.5 text-right align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden sm:block text-right">
                        <span className="font-mono text-xs font-bold text-navy">
                          {item.progressPct}%
                        </span>
                        <div className="w-16 h-1.5 bg-paper-dark rounded-full overflow-hidden border border-border mt-0.5">
                          <div
                            className="h-full bg-turmeric"
                            style={{ width: `${item.progressPct}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item);
                        }}
                        className="px-2.5 py-1 text-xs gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
