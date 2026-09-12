import { useEffect, useState } from 'react';
import { StatTile } from '../../components/StatTile.js';
import { partnershipsApi } from '../../api/partnerships.api.js';
import type { IndustryStats } from './types.js';

export default function Dashboard() {
  const [stats, setStats] = useState<IndustryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partnershipsApi
      .getStats()
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const formatFunding = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3">
        <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider block">
          Industry &amp; CSR Directorate · Overview
        </span>
        <h1 className="font-display text-xl font-bold text-navy">
          Industry Dashboard
        </h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Real-time summary of civic challenges, research partnerships, and corporate sponsorship metrics.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white p-4" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Available Projects"
            value={stats.availableProjects}
          />
          <StatTile
            label="Active Partnerships"
            value={stats.activePartnerships}
          />
          <StatTile
            label="Projects Supported"
            value={stats.projectsSupported}
          />
          <StatTile
            label="Funding Provided"
            value={formatFunding(stats.fundingProvided)}
          />
        </div>
      ) : null}
    </div>
  );
}
