import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Monetization Policy',
  description:
    'WarWatch.World Monetization Policy — how and why this free open-source platform uses Google AdSense advertising to cover operational costs.',
};

export default function MonetizationPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span className="mx-1">/</span>
        <span>Monetization Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-2">Monetization Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: March 30, 2026</p>

      <div className="space-y-8 text-gray-300 leading-relaxed text-sm">

        <section>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-5 py-4 mb-6">
            <p className="text-green-300 font-medium text-sm">
              WarWatch.World is free to access, has no paywalls, and never charges users. Advertising revenue is used solely to cover server, API, and maintenance costs.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Why We Show Ads</h2>
          <p className="text-gray-400">
            WarWatch.World is an open-source project with no subscription fees. Operating the platform incurs ongoing costs including:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
            <li>Cloud hosting (Vercel)</li>
            <li>Anthropic Claude API usage (AI Analyst and report generation)</li>
            <li>NewsAPI.org subscription</li>
            <li>Domain registration</li>
          </ul>
          <p className="mt-3 text-gray-400">
            Advertising through Google AdSense is the sole revenue mechanism used to cover these costs. We believe this is preferable to charging users or seeking grants from organizations with political interests in conflict reporting.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Advertising Provider</h2>
          <p className="text-gray-400">
            We use <strong className="text-gray-300">Google AdSense</strong> exclusively. Google serves advertisements automatically based on site content and, if cookies are enabled, user interest data. WarWatch.World does not control which specific ads are shown.
          </p>
          <p className="mt-2 text-gray-400">
            Google&apos;s advertising is subject to its own policies including the{' '}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              Google Advertising Policy
            </a>{' '}
            and{' '}
            <a href="https://support.google.com/adsense/answer/48182" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              AdSense Program Policies
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Ad Placement</h2>
          <p className="text-gray-400">Ad units are placed in the following locations:</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-gray-500 uppercase tracking-wide border-b border-white/10">
                  <th className="text-left py-2 pr-4">Placement</th>
                  <th className="text-left py-2 pr-4">Format</th>
                  <th className="text-left py-2">Pages</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  { placement: 'Below header', format: '970×90 leaderboard', pages: 'All pages' },
                  { placement: 'Left sidebar', format: '160×600 vertical', pages: 'Desktop, homepage' },
                  { placement: 'Right sidebar', format: '160×600 vertical', pages: 'Desktop, homepage' },
                  { placement: 'Right column', format: '300×600 half-page', pages: 'Content pages' },
                  { placement: 'In-content', format: '300×250 rectangle', pages: 'Reports, Markets' },
                  { placement: 'Mobile sticky', format: '320×50 anchor', pages: 'Mobile only' },
                  { placement: 'Footer', format: '728×90 / 300×250', pages: 'All pages' },
                ].map((row) => (
                  <tr key={row.placement} className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-gray-300">{row.placement}</td>
                    <td className="py-2 pr-4">{row.format}</td>
                    <td className="py-2">{row.pages}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-gray-400">
            All ad units are lazy-loaded to minimize impact on page performance. Ads do not autoplay audio or use interstitial overlays that block content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Editorial Independence</h2>
          <p className="text-gray-400">
            Advertising revenue does not influence our editorial decisions. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
            <li>We do not accept sponsored content, native advertising, or paid conflict coverage</li>
            <li>Advertisers have no influence over conflict severity classifications, event descriptions, or AI analysis</li>
            <li>We do not suppress or amplify coverage of any conflict based on advertiser interests</li>
            <li>Ad serving is fully automated by Google — we do not manually select ads</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Sensitive Content &amp; Ad Policy Compliance</h2>
          <p className="text-gray-400">
            As a conflict-tracking platform, WarWatch.World operates in a category that requires careful attention to Google AdSense content policies. We comply with these policies by:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
            <li>Presenting all conflict information as factual status updates, not sensationalized or gratuitous content</li>
            <li>Not displaying graphic imagery, graphic violence descriptions, or content designed to shock</li>
            <li>Maintaining strict political neutrality to avoid content that &quot;promotes hatred&quot; as defined in AdSense policies</li>
            <li>Clearly labeling AI-generated content</li>
            <li>Providing clear Editorial, Privacy, and Terms pages as required by Google</li>
          </ul>
          <p className="mt-3 text-gray-400">
            If you believe an advertisement displayed on this site violates Google&apos;s policies, you may{' '}
            <a href="https://support.google.com/adsense/troubleshooter/1631343" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              report it to Google directly
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Opting Out of Personalized Ads</h2>
          <p className="text-gray-400">
            You can opt out of personalized advertising through:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
            <li>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Google Ads Settings</a>
            </li>
            <li>
              <a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Digital Advertising Alliance opt-out</a>
            </li>
            <li>
              <a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Network Advertising Initiative opt-out</a>
            </li>
            <li>Your browser&apos;s built-in cookie management settings</li>
          </ul>
          <p className="mt-2 text-gray-400">
            Non-personalized ads may still be shown based on page content rather than user interests.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Future Monetization</h2>
          <p className="text-gray-400">
            Should WarWatch.World ever introduce additional monetization mechanisms (e.g., donations, API access tiers), this policy will be updated and announced via the GitHub repository. Any future monetization will continue to maintain full editorial independence.
          </p>
        </section>

        <div className="border-t border-white/10 pt-6 text-xs text-gray-600">
          <div className="flex flex-wrap gap-4">
            <Link href="/editorial-policy" className="hover:text-gray-400 transition-colors">Editorial Policy</Link>
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
