import Link from 'next/link';

export default function DisclaimerBanner() {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-400 mb-6">
      <svg
        className="w-4 h-4 text-gray-500 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>
        <span className="text-gray-300 font-medium">WarWatch aggregates publicly available news data.</span>{' '}
        We do not take political positions on any conflict. All summaries and event descriptions are
        factual status updates sourced from publicly available reporting.{' '}
        <Link href="/editorial-policy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
          Editorial Policy
        </Link>
      </p>
    </div>
  );
}
