import type { Severity } from '@/lib/types';
import { SEVERITY_LABELS } from '@/lib/types';
import clsx from 'clsx';

interface Props {
  severity: Severity;
  size?: 'sm' | 'md';
}

const colorMap: Record<Severity, string> = {
  war: 'bg-red-500/20 text-red-400 border-red-500/30',
  escalating: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  instability: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  stable: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const dotMap: Record<Severity, string> = {
  war: 'bg-red-500',
  escalating: 'bg-orange-500',
  instability: 'bg-yellow-500',
  stable: 'bg-green-500',
};

export default function SeverityBadge({ severity, size = 'md' }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 border rounded-full font-medium',
        colorMap[severity],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      )}
    >
      <span
        className={clsx(
          'rounded-full animate-pulse-slow',
          dotMap[severity],
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
        )}
      />
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
