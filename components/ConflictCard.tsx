import type { Conflict } from '@/lib/types';
import SeverityBadge from './SeverityBadge';
import { formatDate } from '@/lib/utils';

interface Props {
  conflict: Conflict;
}

export default function ConflictCard({ conflict }: Props) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-white text-sm">{conflict.name}</h3>
        <SeverityBadge severity={conflict.severity} size="sm" />
      </div>
      <p className="text-xs text-gray-400 mb-3 leading-relaxed">{conflict.status}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {conflict.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-gray-600">
        <span>Since {formatDate(conflict.startDate)}</span>
        <span>Updated {formatDate(conflict.lastUpdated)}</span>
      </div>
    </div>
  );
}
