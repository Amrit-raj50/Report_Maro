import { clsx } from 'clsx';
import type { Priority, ProblemStatus } from '@sih/shared-types';

const TONE_CLASSES = {
  neutral: 'bg-border/50 text-ink-muted border border-border',
  blue: 'bg-routed/10 text-routed border border-routed/30',
  green: 'bg-resolved/10 text-resolved border border-resolved/30',
  amber: 'bg-under-review/10 text-under-review border border-under-review/30',
  red: 'bg-urgent/10 text-urgent border border-urgent/30',
  purple: 'bg-in-progress/10 text-in-progress border border-in-progress/30',
} as const;

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_CLASSES;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-[3px] px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}

const PRIORITY_TONE: Record<Priority, keyof typeof TONE_CLASSES> = {
  low: 'neutral',
  medium: 'blue',
  high: 'red',
};
export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{priority.toUpperCase()}</Badge>;
}

const STATUS_TONE: Record<ProblemStatus, keyof typeof TONE_CLASSES> = {
  submitted: 'neutral',
  verified: 'blue',
  assigned: 'amber',
  in_progress: 'purple',
  resolved: 'green',
};
export function StatusBadge({ status }: { status: ProblemStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{status.replace(/_/g, ' ')}</Badge>;
}
