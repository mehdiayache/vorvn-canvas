import LegalLayout from './LegalLayout';

export default function LegalNotice() {
  return (
    <LegalLayout
      title="Legal Notice"
      lastUpdated="20 April 2026"
      description="Legal identification, terms of use, intellectual property and liability statements for vorvn.com and VORVN LIMITED."
      slug="notice"
      sections={[
        { id: 'publisher', label: '1. Publisher' },
        { id: 'group', label: '2. Group entities' },
        { id: 'hosting', label: '3. Hosting' },
        { id: 'purpose', label: '4. Purpose of the site' },
        { id: 'ip', label: '5. Intellectual property' },
        { id: 'use', label: '6. Acceptable use' },
        { id: 'liability', label: '7. Liability disclaimer' },
        { id: 'links', label: '8. Third-party links' },
        { id: 'governing-law', label: '9. Governing law' },
        { id: 'contact', label: '10. Contact' },
      ]}
    >
      <h2 id="publisher">1. Publisher of the site</h2>
      <p>
        This website (<span className="font-mono">vorvn.com</span> and any subdomains) is
        published by:
      </p>
      <address className="not-italic font-mono text-[12px] leading-[1.7] text-mid">
        VORVN LIMITED<br />
        Private company limited by shares — Hong Kong SAR<br />
        RM4 16/F, Ho King Commercial Centre<br />
        2–16 Fa Yuen Street, Mongkok<br />
        Kowloon, Hong Kong SAR<br />
        Director of publication: Mehdi Ayache Berberos, CEO &amp; Founder
      </address>
      <p>
        Contact for any legal matter related to this site: please use the{' '}
        <a href="/en/contact">contact form</a> and select <em>"Other"</em>.
      </p>

      <h2 id="group">2. Affiliated group entities</h2>
      <ul>
        <li>
          <strong>PT. Aduh (Lagi) Studio</strong> — incubator studio,
          No. 12, Jl. Ciung Wanara 1, Denpasar Timur, Bali 80235, Indonesia.
        </li>
      </ul>

      <h2 id="hosting">3. Hosting</h2>
      <p>
        This site is hosted by <strong>Netlify, Inc.</strong>, 44 Montgomery Street, Suite 300,
        San Francisco, California 94104, United States.{' '}
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">netlify.com</a>.
      </p>

      <h2 id="purpose">4. Purpose of the site</h2>
      <p>
        <span className="font-mono">vorvn.com</span> is the corporate website of VORVN LIMITED.
        It presents the holding company, its portfolio of owned brands and intellectual
        property, its operating principles, and provides a contact channel. It does not sell
        products or services directly to consumers. Brand storefronts (e.g. Cook Warriors,
        Hearts Notes) are operated under separate domains and are subject to their own legal
        notices and terms.
      </p>

      <h2 id="ip">5. Intellectual property</h2>
      <p>
        All content on this site — including but not limited to the VORVN wordmark and logo,
        the names "VE VOLD™", "Cook Warriors", "Eggscalibur", "Hearts Notes", "MAQTOB",
        "xVoyager", "Warung Marrakech", "Davi Properties", all visual identity elements,
        photography, illustrations, graphic design, copy, source code, and the overall layout —
        is the exclusive property of VORVN LIMITED or its licensors and is protected by Hong
        Kong, international copyright, trademark and database laws.
      </p>
      <p>
        No element of this site may be copied, reproduced, modified, republished, downloaded,
        posted, transmitted, distributed, sold, or commercially exploited, in whole or in part,
        without the prior written consent of VORVN LIMITED. Brief textual quotation for
        editorial, journalistic or academic purposes is permitted provided that the source
        ("VORVN") is clearly cited and a link to <span className="font-mono">vorvn.com</span> is
        included where the medium allows.
      </p>

      <h2 id="use">6. Acceptable use</h2>
      <p>By accessing this site you agree not to:</p>
      <ul>
        <li>Use automated means (bots, scrapers, crawlers) to extract content beyond what is permitted by our <span className="font-mono">/robots.txt</span> file</li>
        <li>Attempt to probe, scan, or test the vulnerability of the site or any related infrastructure</li>
        <li>Interfere with or disrupt the site's operation, including via flood requests or denial-of-service attempts</li>
        <li>Misrepresent your identity in submissions to the contact form</li>
        <li>Use the contact form to send spam, advertising, or any unlawful content</li>
      </ul>
      <p>
        We reserve the right to block IP addresses, refuse service, and pursue legal remedies
        against any breach of these terms.
      </p>

      <h2 id="liability">7. Liability disclaimer</h2>
      <p>
        The information on this site is provided "as is" for general informational purposes
        only. While we take reasonable care to ensure accuracy, VORVN LIMITED makes no warranty
        — express or implied — as to the completeness, accuracy, reliability, suitability or
        availability of the site or its content. To the fullest extent permitted by applicable
        law, VORVN LIMITED shall not be liable for any direct, indirect, incidental,
        consequential or special damages arising out of or in any way connected with the use of
        this site, including without limitation loss of data, loss of profits, or business
        interruption.
      </p>
      <p>
        Nothing on this site constitutes an offer to sell securities or solicitation of an
        investment. Any reference to "investors" or "partnerships" is informational; binding
        engagements arise only from a separately signed agreement with VORVN LIMITED.
      </p>

      <h2 id="links">8. Third-party links</h2>
      <p>
        This site may contain links to external websites operated by third parties (Instagram,
        LinkedIn, brand storefronts, processor privacy policies). VORVN LIMITED is not
        responsible for the content, privacy practices, or availability of those external
        sites. Inclusion of a link does not imply endorsement.
      </p>

      <h2 id="governing-law">9. Governing law &amp; jurisdiction</h2>
      <p>
        This Legal Notice and any dispute or claim arising out of or in connection with it or
        its subject matter (including non-contractual disputes) is governed by and construed in
        accordance with the laws of the <strong>Hong Kong Special Administrative Region</strong>.
        The courts of Hong Kong SAR have exclusive jurisdiction to settle any such dispute.
      </p>
      <p>
        Mandatory consumer-protection rights of EU, UK, US-state and Indonesian residents are
        not affected by this clause and remain enforceable in their respective jurisdictions.
      </p>

      <h2 id="contact">10. Contact</h2>
      <p>
        For any question related to this Legal Notice or to report a copyright concern, please
        use our <a href="/en/contact">contact form</a>.
      </p>
    </LegalLayout>
  );
}
