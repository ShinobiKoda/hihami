"use client";
import { Newsletter } from "../components/Newsletter";

// Refactored privacy & disclaimer page: removes duplicated filler text and provides concise, relevant policy content.
export default function PolicyPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 md:px-8 lg:px-12 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Privacy Policy & User Disclaimer
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Last updated: {new Date().getFullYear()} • Please review before using
          the platform.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">1. Overview</h2>
        <p>
          This platform lets you discover, mint, list, and trade NFTs. Public
          blockchain activity (wallet addresses, contract interactions,
          transaction hashes) is inherently transparent. We collect only minimal
          off‑chain information needed to operate and improve the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">2. Data We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Profile: display name, optional avatar, email (if provided),
            preferences.
          </li>
          <li>
            Wallet & On‑Chain: connected wallet address(es), NFT + transaction
            metadata (already public).
          </li>
          <li>
            Usage & Technical: pages visited, approximate region, device/browser
            attributes, aggregated analytics.
          </li>
          <li>
            Communications: support requests, newsletter opt‑ins, security
            verification emails.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          We never collect private keys or seed phrases. Never share them.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">3. How We Use Data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Enable core features (minting, listing, bidding, profile
            customization).
          </li>
          <li>
            Authenticate and secure accounts (sessions, verification, fraud
            monitoring).
          </li>
          <li>Improve performance, relevance, and UI/UX.</li>
          <li>
            Send essential transactional messages and optional updates (with
            consent).
          </li>
          <li>Monitor abuse, spam, and platform integrity.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">4. Cookies & Local Storage</h2>
        <p>
          We use limited cookies / local storage for session tokens, UI
          preferences (theme, filters), and analytics. Disabling essential
          storage may break authentication or listing flows.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">5. Blockchain Transparency</h2>
        <p>
          On‑chain actions (minting, transfers, bids) are permanent and public.
          We cannot alter or delete blockchain records. NFT content or metadata
          pinned to decentralized storage (e.g., IPFS) may persist beyond
          account deletion.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">6. Data Sharing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Vetted service providers (infrastructure, email, analytics) under
            confidentiality terms.
          </li>
          <li>Regulatory or legal requests when lawfully required.</li>
          <li>
            Aggregated, anonymized insights (e.g., total marketplace volume).
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">7. Security</h2>
        <p>
          We apply industry practices (TLS, hashed credentials where applicable,
          access minimization, monitoring). No system is flawless—report
          vulnerabilities via support with reproduction steps.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">8. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Edit profile data in settings.</li>
          <li>
            Request deletion of off‑chain personal data (on‑chain data cannot be
            removed).
          </li>
          <li>Unsubscribe from non-essential communications anytime.</li>
          <li>
            Disconnect your wallet (historic blockchain data remains public).
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">9. Risk Disclaimer</h2>
        <p>
          NFTs are speculative and volatile. Nothing herein is financial, legal,
          or tax advice. Perform independent research. Smart contracts may
          contain bugs; interact at your own risk. You bear full responsibility
          for wallet security.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">10. Underage Use</h2>
        <p>
          The service is not intended for individuals below the legally required
          age to enter digital agreements in their jurisdiction. We will remove
          ineligible account data where feasible.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">11. Policy Changes</h2>
        <p>
          We may update this policy for operational, legal, or technical
          reasons. Material changes will be communicated via in‑app notice or
          email (if subscribed). Continued use indicates acceptance.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">12. Contact</h2>
        <p>
          For questions or data requests, use the support page or email
          support@placeholder.example. For security reports, please provide
          non-public details responsibly.
        </p>
      </section>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">Stay Informed</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Subscribe for feature updates and security notices.
        </p>
        <Newsletter />
      </div>
    </div>
  );
}
