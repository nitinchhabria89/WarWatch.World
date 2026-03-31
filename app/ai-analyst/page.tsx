import type { Metadata } from 'next';
import AIChatInterface from '@/components/AIChatInterface';
import AdUnit from '@/components/AdUnit';

export const metadata: Metadata = {
  title: 'AI Geopolitical Analyst — Ask About Any War or Conflict',
  description:
    'Chat with an AI geopolitical analyst about any active war or conflict. Get instant, in-depth analysis on Russia-Ukraine, Gaza, Sudan and more. Powered by advanced AI with real-time conflict data.',
  keywords: [
    'AI geopolitical analyst', 'war analysis AI', 'conflict analysis',
    'geopolitics AI chat', 'ask about wars', 'AI military analyst',
    'geopolitical intelligence', 'war expert AI',
  ],
  openGraph: {
    title: 'AI Geopolitical Analyst | WarWatch.World',
    description: 'Get instant AI-powered analysis on any active war or global conflict. Ask anything about geopolitics.',
    url: 'https://warwatch.world/ai-analyst',
  },
  alternates: { canonical: 'https://warwatch.world/ai-analyst' },
};

export default function AIAnalystPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Billboard */}
      <div className="flex justify-center mb-6">
        <AdUnit slot="ai-billboard" style={{ width: 728, height: 90 }} className="hidden md:block" />
        <AdUnit slot="ai-billboard-mobile" style={{ width: 320, height: 50 }} className="md:hidden" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat — spans 2 cols */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white mb-1">AI Analyst</h1>
            <p className="text-gray-400 text-sm">
              Powered by Claude · Real-time conflict context · Ask anything about global crises
            </p>
          </div>

          <div
            className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden"
            style={{ height: '70vh', minHeight: '500px' }}
          >
            <AIChatInterface />
          </div>

          <p className="text-xs text-gray-600 mt-3 text-center">
            Analysis is AI-generated and for informational purposes only. Verify with authoritative sources.
          </p>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <AdUnit slot="ai-sidebar" style={{ width: 300, height: 600 }} />

          <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">About This Tool</p>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex gap-2">
                <span>🤖</span>
                <span>Powered by Anthropic Claude (claude-sonnet-4-6)</span>
              </li>
              <li className="flex gap-2">
                <span>📡</span>
                <span>Context includes all 10 tracked active conflicts</span>
              </li>
              <li className="flex gap-2">
                <span>⚡</span>
                <span>Streaming responses for real-time output</span>
              </li>
              <li className="flex gap-2">
                <span>🔒</span>
                <span>No conversation data is stored or logged</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
