import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description:
    'WarWatch.World Editorial Policy — how we source, classify, and present conflict data as a neutral data aggregator.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span className="mx-1">/</span>
        <span>Editorial Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-2">Editorial Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: March 30, 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300 leading-relaxed">

        <section>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-5 py-4 mb-8">
            <p className="text-blue-300 font-medium text-sm">
              WarWatch.World is a neutral data aggregator, not an editorial publication. We do not take political positions on any conflict, party, government, or armed group.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Mission</h2>
          <p>
            WarWatch.World exists to provide a single, accessible, free resource for tracking active global conflicts and crises. Our goal is to present factual, sourced information — not to advocate, editorialize, or assign moral judgments to any party involved in any conflict.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Data Sources</h2>
          <p>All conflict data on WarWatch.World is derived from:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
            <li><strong className="text-gray-300">NewsAPI.org</strong> — aggregated news from international wire services and publications</li>
            <li><strong className="text-gray-300">Anthropic Claude AI</strong> — used to summarize and synthesize publicly available information, not to generate original reporting</li>
            <li><strong className="text-gray-300">Open-source contributor updates</strong> — community-submitted conflict data reviewed against the standards below</li>
          </ul>
          <p className="mt-3">
            WarWatch does not conduct original journalism. We do not have correspondents in conflict zones. All information is sourced from publicly available reports.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Neutrality Standards</h2>
          <p>All conflict summaries, status updates, and event descriptions must meet the following standards:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 text-gray-400">
            <li>Describe events factually — <em className="text-gray-300">"Military operations began on [date]"</em> not <em className="text-gray-300">"brutal attack"</em> or <em className="text-gray-300">"heroic defense"</em></li>
            <li>Attribute claims to their source — <em className="text-gray-300">"according to [party/agency]"</em> when reporting disputed facts</li>
            <li>Avoid politically loaded labels (e.g., whether a group is designated a terrorist organization varies by jurisdiction — we use the group's own name or internationally recognized designations)</li>
            <li>Use consistent terminology for all parties regardless of their political alignment</li>
            <li>Not characterize military actions as "justified," "illegal," "proportionate," or other evaluative terms without direct attribution to an authoritative source (e.g., a UN resolution)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Conflict Classification</h2>
          <p>
            Conflicts are classified by severity using four levels based on observable indicators, not political judgments:
          </p>
          <div className="mt-3 space-y-2">
            {[
              { level: 'Active War', color: 'text-red-400', desc: 'Ongoing large-scale armed hostilities between organized armed forces or groups' },
              { level: 'Escalating', color: 'text-orange-400', desc: 'Situation with documented increase in military incidents, troop movements, or diplomatic breakdown' },
              { level: 'Instability', color: 'text-yellow-400', desc: 'Active security incidents below the threshold of organized warfare; significant civilian impact' },
              { level: 'Stable', color: 'text-green-400', desc: 'No active hostilities; post-conflict or frozen conflict with no recent incidents' },
            ].map((item) => (
              <div key={item.level} className="flex gap-3 bg-white/5 rounded p-3">
                <span className={`font-semibold text-sm shrink-0 w-28 ${item.color}`}>{item.level}</span>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Severity classifications are reviewed when new events are reported. Classification changes are not a political statement about any party.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Event Tags</h2>
          <p>
            Event tags are strictly factual categories describing the nature of a reported event. Tags are:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Airstrike', 'Military', 'Diplomatic', 'Sanctions', 'Ceasefire', 'Casualties', 'Humanitarian', 'News'].map((tag) => (
              <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400">
                [{tag}]
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm">
            Tags describe what type of event occurred, not whether it was justified. We do not use tags that imply moral judgment (e.g., "atrocity," "war crime" — such classifications require formal legal determinations and are attributed to the body that made them when relevant).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. AI-Generated Content</h2>
          <p>
            WarWatch uses AI (Anthropic Claude) in two ways:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
            <li><strong className="text-gray-300">Daily briefings</strong> — AI synthesizes conflict data into regional summaries. These are labeled as AI-generated and are not substitutes for primary source journalism.</li>
            <li><strong className="text-gray-300">AI Analyst chat</strong> — An interactive tool that answers questions about conflicts using current conflict data as context. Responses are clearly labeled as AI-generated analysis.</li>
          </ul>
          <p className="mt-3">
            AI-generated content on this platform must meet the same neutrality standards as all other content. We do not use AI to generate politically biased analysis. AI responses should be verified against authoritative sources before being relied upon.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Corrections</h2>
          <p>
            We are committed to accuracy. If you identify factual errors in conflict data or event descriptions, please open an issue on our{' '}
            <a href="https://github.com/nitinchhabria89/WarWatch.World/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              GitHub repository
            </a>{' '}
            with a link to a primary source. We will review and correct errors promptly.
          </p>
          <p className="mt-2">
            Corrections are made to the affected data entry. We do not issue editorial corrections for content derived from AI synthesis of external sources.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. What We Are Not</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>We are not a news organization or journalism outlet</li>
            <li>We are not affiliated with any government, military, intelligence agency, or advocacy organization</li>
            <li>We do not accept sponsored content, paid placements, or editorial influence from any party with an interest in how a conflict is portrayed</li>
            <li>We do not provide legal, strategic, or humanitarian operational advice</li>
          </ul>
        </section>

        <div className="border-t border-white/10 pt-6 text-xs text-gray-600">
          <p>
            Questions about this policy?{' '}
            <a href="https://github.com/nitinchhabria89/WarWatch.World/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              Open a GitHub issue.
            </a>
          </p>
          <div className="flex gap-4 mt-3">
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms & Conditions</Link>
            <Link href="/monetization-policy" className="hover:text-gray-400 transition-colors">Monetization Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
