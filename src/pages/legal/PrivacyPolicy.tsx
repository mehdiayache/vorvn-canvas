import LegalLayout from './LegalLayout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="20 April 2026"
      description="How VORVN LIMITED collects, uses, and protects personal data. GDPR, UK-GDPR, PDPO, CCPA/CPRA and UU PDP compliant."
      slug="privacy"
      sections={[
        { id: 'who-we-are', label: '1. Who we are' },
        { id: 'what-we-collect', label: '2. Data we collect' },
        { id: 'how-we-use', label: '3. How we use it' },
        { id: 'lawful-basis', label: '4. Lawful basis (GDPR)' },
        { id: 'cookies', label: '5. Cookies & tracking' },
        { id: 'sharing', label: '6. Sharing & processors' },
        { id: 'transfers', label: '7. International transfers' },
        { id: 'retention', label: '8. Retention' },
        { id: 'security', label: '9. Security' },
        { id: 'your-rights', label: '10. Your rights' },
        { id: 'jurisdictions', label: '11. Jurisdictional addenda' },
        { id: 'children', label: '12. Children' },
        { id: 'changes', label: '13. Changes' },
        { id: 'contact', label: '14. Contact us' },
      ]}
    >
      <h2 id="who-we-are">1. Who we are</h2>
      <p>
        VORVN LIMITED ("VORVN", "we", "us", "our") is a private holding company incorporated in
        Hong Kong SAR (Business Registration: VORVN LIMITED, RM4 16/F, Ho King Commercial Centre,
        2–16 Fa Yuen Street, Mongkok, Kowloon, Hong Kong). We operate the website
        <span className="font-mono"> vorvn.com</span> and own and operate the brands listed on
        our portfolio page through affiliated entities including PT. VORVN GROUP INDONESIA (Bali,
        Indonesia) and ADUH (LAGI) STUDIO. VORVN LIMITED is the data controller for personal data
        processed via this website.
      </p>

      <h2 id="what-we-collect">2. Data we collect</h2>
      <p>We collect the minimum data needed to operate this website and respond to enquiries.</p>
      <h3>2.1 Information you give us via the contact form</h3>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Company / project name (optional)</li>
        <li>Topic of enquiry</li>
        <li>The content of your message</li>
      </ul>
      <h3>2.2 Information collected automatically</h3>
      <ul>
        <li>IP address (used for rate-limiting our contact form, never stored long-term)</li>
        <li>Standard server log data: user-agent string, request timestamp, requested path, HTTP status code (handled by our hosting provider Netlify)</li>
        <li>Aggregated, anonymous indexing data via Google Search Console (no personal identifiers)</li>
      </ul>
      <h3>2.3 Information from cookies and similar technologies</h3>
      <p>
        See section 5. By default, this website sets <strong>no</strong> non-essential cookies.
        Essential cookies (e.g. for theme preference) are stored only in your browser's local
        storage and never transmitted to us.
      </p>

      <h2 id="how-we-use">3. How we use your data</h2>
      <ul>
        <li>To respond to enquiries you submit through the contact form</li>
        <li>To prevent abuse of the contact form (rate-limiting, anti-spam honeypot)</li>
        <li>To monitor site availability and security via standard server logs</li>
        <li>To measure aggregate site visibility in search engines (Google Search Console)</li>
        <li>To comply with our legal obligations</li>
      </ul>
      <p>
        We do <strong>not</strong> sell, rent, or trade your personal data. We do not use your
        data for automated decision-making or profiling. We do not send marketing emails.
      </p>

      <h2 id="lawful-basis">4. Lawful basis for processing (GDPR / UK-GDPR)</h2>
      <ul>
        <li><strong>Contact form submissions</strong>: legitimate interest — responding to a person who has voluntarily contacted us (Art. 6(1)(f) GDPR). You may withdraw at any time by asking us to delete your data.</li>
        <li><strong>Server logs and rate-limiting</strong>: legitimate interest — securing the service (Art. 6(1)(f) GDPR).</li>
        <li><strong>Any future analytics or advertising cookies</strong> (e.g. Meta Pixel): consent (Art. 6(1)(a) GDPR), collected via our cookie banner before any tracker loads.</li>
      </ul>

      <h2 id="cookies">5. Cookies & tracking technologies</h2>
      <p>
        This website is intentionally low-tracking. As of the date above, we use:
      </p>
      <ul>
        <li><strong>No analytics cookies</strong> by default.</li>
        <li><strong>Local storage only</strong> for UI preferences (selected language, theme). This data never leaves your browser.</li>
        <li><strong>Google Search Console</strong>: a one-time meta-tag verification only, no cookies, no JavaScript runtime.</li>
        <li>
          <strong>Meta Pixel (Facebook/Instagram)</strong>: if and when enabled, we will load it
          <em> only</em> after you grant explicit consent through the cookie banner. Until you
          consent, no Meta scripts run and no data is sent to Meta. You can withdraw consent at
          any time by clearing the consent cookie or via the "Cookie preferences" link in the
          footer.
        </li>
      </ul>
      <p>
        Most browsers let you refuse or delete cookies in their settings. Doing so will not
        affect access to this site.
      </p>

      <h2 id="sharing">6. Sharing & data processors</h2>
      <p>
        We share personal data only with the processors strictly required to operate the site:
      </p>
      <ul>
        <li><strong>Netlify, Inc.</strong> (USA) — website hosting, contact-form serverless function execution. <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">Privacy policy</a>.</li>
        <li><strong>Google LLC</strong> (USA) — Gmail (Google Workspace) is used to deliver contact-form submissions to our internal inbox. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy policy</a>.</li>
        <li><strong>Google Search Console</strong> — aggregated, anonymised search-performance data only.</li>
        <li><strong>Meta Platforms Ireland Ltd.</strong> — only if you consent to the Meta Pixel.</li>
      </ul>
      <p>
        We do not disclose personal data to any other third parties unless required by law,
        regulator, or court order.
      </p>

      <h2 id="transfers">7. International data transfers</h2>
      <p>
        VORVN operates from Hong Kong with infrastructure in the United States (Netlify, Google).
        For transfers of EU/UK personal data outside the EEA/UK, we rely on the European
        Commission's Standard Contractual Clauses entered into by our processors, and on the
        EU-US Data Privacy Framework where applicable. For Indonesian personal data, we rely on
        the consent of the data subject and on the explicit lawful bases under Law No. 27 of
        2022 (UU PDP).
      </p>

      <h2 id="retention">8. Retention</h2>
      <ul>
        <li><strong>Contact-form messages</strong>: retained in our Gmail inbox for up to 24 months from the date of last correspondence, then deleted.</li>
        <li><strong>Server logs</strong>: retained by Netlify for up to 30 days.</li>
        <li><strong>Rate-limit IP cache</strong>: held in volatile server memory for 15 minutes maximum.</li>
      </ul>

      <h2 id="security">9. Security</h2>
      <p>
        Personal data is encrypted in transit (HTTPS/TLS 1.2+) and at rest (provider-side
        encryption by Netlify and Google). The contact form uses an authenticated SMTP
        connection over TLS. We restrict access to received messages to the founder and
        operations lead only.
      </p>

      <h2 id="your-rights">10. Your rights</h2>
      <p>Depending on your jurisdiction, you have the right to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you</li>
        <li><strong>Rectify</strong> inaccurate or incomplete data</li>
        <li><strong>Erase</strong> your data ("right to be forgotten")</li>
        <li><strong>Restrict</strong> or <strong>object to</strong> processing</li>
        <li><strong>Data portability</strong> — receive your data in a machine-readable format</li>
        <li><strong>Withdraw consent</strong> at any time, where processing is based on consent</li>
        <li><strong>Lodge a complaint</strong> with a supervisory authority</li>
      </ul>
      <p>
        To exercise any of these rights, contact us via the form on our{' '}
        <a href="/en/contact">contact page</a>. We respond within 30 days (or sooner where
        required by law). We may need to verify your identity before fulfilling a request.
      </p>

      <h2 id="jurisdictions">11. Jurisdictional addenda</h2>
      <h3>11.1 European Economic Area & United Kingdom (GDPR / UK-GDPR)</h3>
      <p>
        The data controller is VORVN LIMITED (Hong Kong). We have not appointed an EU
        representative under Art. 27 GDPR because our processing of EU residents' data is
        occasional and does not include special categories of data on a large scale. EU/UK
        residents may lodge a complaint with their local supervisory authority — for example,
        the Irish Data Protection Commission (<a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">dataprotection.ie</a>)
        or the UK Information Commissioner's Office (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>).
      </p>
      <h3>11.2 Hong Kong (PDPO)</h3>
      <p>
        We process personal data in accordance with the six Data Protection Principles under
        the Personal Data (Privacy) Ordinance (Cap. 486). You may make a data access or
        correction request under sections 18 and 22 of the PDPO via our contact form.
      </p>
      <h3>11.3 California (CCPA / CPRA)</h3>
      <p>
        California residents have the right to know what personal information we collect, to
        request deletion, to correct inaccurate information, and to opt out of the "sale" or
        "sharing" of personal information. <strong>VORVN does not sell or share personal
        information</strong> as those terms are defined under the CCPA/CPRA. We do not offer
        financial incentives for personal information.
      </p>
      <h3>11.4 Indonesia (UU PDP — Law No. 27 of 2022)</h3>
      <p>
        Where Indonesian personal data is processed (e.g. operations of our Bali studio), we
        rely on the consent of the data subject or on legitimate operational necessity as
        permitted under Article 20. Indonesian data subjects have the rights set out in
        Articles 5–14 of the UU PDP, exercisable through the same contact channel.
      </p>

      <h2 id="children">12. Children</h2>
      <p>
        This website is not directed at children under 16. We do not knowingly collect personal
        data from children. If you believe a child has submitted personal data through our site,
        contact us and we will delete it.
      </p>

      <h2 id="changes">13. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date at the top of this
        page reflects the most recent revision. Material changes will be highlighted on this
        page for at least 30 days.
      </p>

      <h2 id="contact">14. Contact us</h2>
      <p>
        For privacy-related questions or to exercise your rights, please use our{' '}
        <a href="/en/contact">contact form</a> and select the topic <em>"Other"</em>. The
        registered office of the data controller is:
      </p>
      <address className="not-italic font-mono text-[12px] leading-[1.7] text-mid">
        VORVN LIMITED<br />
        RM4 16/F, Ho King Commercial Centre<br />
        2–16 Fa Yuen Street, Mongkok<br />
        Kowloon, Hong Kong SAR
      </address>
    </LegalLayout>
  );
}
