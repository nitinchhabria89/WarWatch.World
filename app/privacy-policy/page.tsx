import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'WarWatch.World Privacy Policy — how we collect, use, and protect your data, including our use of Google AdSense and analytics cookies.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span className="mx-1">/</span>
        <span>Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: March 30, 2026</p>

      <div className="space-y-8 text-gray-300 leading-relaxed text-sm">

        <section>
          <p>
            WarWatch.World (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains what information is collected when you visit warwatch.world, how it is used, and your rights regarding that information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <h3 className="text-base font-medium text-gray-200 mb-2">1.1 Automatically Collected Information</h3>
          <p>When you visit this website, our hosting infrastructure and third-party services may automatically collect:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
            <li>IP address (truncated/anonymized where possible)</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring URL</li>
            <li>Pages visited and time spent on pages</li>
            <li>Date and time of visit</li>
          </ul>
          <p className="mt-3 text-gray-400">This information is used to understand aggregate site usage and improve the service. It is not used to identify individual users.</p>

          <h3 className="text-base font-medium text-gray-200 mt-4 mb-2">1.2 Information You Provide</h3>
          <p className="text-gray-400">
            WarWatch.World does not require account creation or registration. We do not collect names, email addresses, or other personal information unless you voluntarily contact us (e.g., via GitHub issues).
          </p>

          <h3 className="text-base font-medium text-gray-200 mt-4 mb-2">1.3 AI Analyst Chat</h3>
          <p className="text-gray-400">
            Messages sent through the AI Analyst chat feature are transmitted to Anthropic&apos;s Claude API to generate responses. Chat messages are <strong className="text-gray-300">not stored</strong> on our servers. Please review{' '}
            <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Anthropic&apos;s Privacy Policy</a>{' '}
            for information on how they handle API inputs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Cookies</h2>
          <p>We use cookies and similar tracking technologies for the following purposes:</p>

          <div className="mt-4 space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="font-medium text-gray-200 text-sm mb-1">Essential Cookies</h3>
              <p className="text-gray-400 text-xs">Required for the website to function. These cannot be disabled. No personal data is stored.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="font-medium text-gray-200 text-sm mb-1">Advertising Cookies (Google AdSense)</h3>
              <p className="text-gray-400 text-xs">
                This site uses Google AdSense to display advertisements. Google may use cookies, including the DoubleClick cookie, to serve ads based on your prior visits to this website or other websites.
                You may opt out of personalized advertising by visiting{' '}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Google Ads Settings</a>{' '}
                or{' '}
                <a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">aboutads.info</a>.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the internet. For more information, see{' '}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  Google&apos;s Advertising Policies
                </a>.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Third-Party Services</h2>
          <p>WarWatch.World integrates the following third-party services, each with their own privacy practices:</p>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-gray-500 uppercase tracking-wide border-b border-white/10">
                  <th className="text-left py-2 pr-4">Service</th>
                  <th className="text-left py-2 pr-4">Purpose</th>
                  <th className="text-left py-2">Privacy Policy</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  { service: 'Google AdSense', purpose: 'Advertising', url: 'https://policies.google.com/privacy', label: 'Google Privacy' },
                  { service: 'Anthropic Claude API', purpose: 'AI chat responses', url: 'https://www.anthropic.com/privacy', label: 'Anthropic Privacy' },
                  { service: 'NewsAPI.org', purpose: 'Conflict news data', url: 'https://newsapi.org/privacy', label: 'NewsAPI Privacy' },
                  { service: 'CartoDB / CARTO', purpose: 'Map tile hosting', url: 'https://carto.com/privacy', label: 'CARTO Privacy' },
                  { service: 'Vercel', purpose: 'Hosting & infrastructure', url: 'https://vercel.com/legal/privacy-policy', label: 'Vercel Privacy' },
                ].map((row) => (
                  <tr key={row.service} className="border-b border-white/5">
                    <td className="py-2 pr-4 font-medium text-gray-300">{row.service}</td>
                    <td className="py-2 pr-4">{row.purpose}</td>
                    <td className="py-2">
                      <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        {row.label}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Data Retention</h2>
          <p className="text-gray-400">
            We do not store personal data on our servers. Server access logs maintained by our hosting provider (Vercel) are retained in accordance with{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              Vercel&apos;s data retention policies
            </a>. AI Analyst chat sessions are not logged or retained by WarWatch.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
          <p className="text-gray-400">
            Depending on your jurisdiction, you may have rights including access to, correction of, or deletion of personal data we hold. Since WarWatch does not collect personal data beyond what is noted above, most such requests will relate to data held by our third-party service providers. Please contact them directly using the links in Section 3.
          </p>
          <p className="mt-2 text-gray-400">
            For EU/EEA users: you may also contact your local Data Protection Authority.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Children&apos;s Privacy</h2>
          <p className="text-gray-400">
            WarWatch.World is not directed at children under 13. We do not knowingly collect personal information from children. This site covers conflict and security topics that may not be suitable for young audiences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Changes to This Policy</h2>
          <p className="text-gray-400">
            We may update this Privacy Policy periodically. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
          <p className="text-gray-400">
            For privacy-related questions, please{' '}
            <a href="https://github.com/nitinchhabria89/WarWatch.World/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              open a GitHub issue
            </a>{' '}
            with the label &quot;privacy&quot;.
          </p>
        </section>

        <div className="border-t border-white/10 pt-6 text-xs text-gray-600">
          <div className="flex flex-wrap gap-4">
            <Link href="/editorial-policy" className="hover:text-gray-400 transition-colors">Editorial Policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms & Conditions</Link>
            <Link href="/monetization-policy" className="hover:text-gray-400 transition-colors">Monetization Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
