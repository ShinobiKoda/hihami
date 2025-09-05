"use client";
import { Newsletter } from "../components/Newsletter";
import { motion } from "motion/react";
import { fadeInUp, fadeInDown, zoomIn } from "../components/animations/motion";

export default function PolicyPage() {
  return (
    <motion.div
      className="w-full max-w-[1440px] mx-auto p-4 md:px-8 lg:px-12 space-y-14 text-white"
      initial="hidden"
      animate="visible"
    >
      <motion.header className="space-y-2" variants={fadeInDown}>
        <motion.h1
          className="text-3xl font-semibold tracking-tight"
          variants={fadeInDown}
        >
          Privacy Policy & User Disclaimer
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-sm md:text-base"
          variants={fadeInUp}
        >
          Last updated: {new Date().getFullYear()} • Please review before using
          the platform.
        </motion.p>
      </motion.header>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">1. Overview</h2>
        <p>
          This platform lets you discover, mint, list, and trade NFTs. Public
          blockchain activity (wallet addresses, contract interactions,
          transaction hashes) is inherently transparent. We collect only minimal
          off‑chain information needed to operate and improve the service.
        </p>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">2. Data We Collect</h2>
        <motion.ul className="list-disc pl-6 space-y-2" variants={fadeInUp}>
          <motion.li variants={fadeInUp}>
            Profile: display name, optional avatar, email (if provided),
            preferences.
          </motion.li>
          <motion.li variants={fadeInUp}>
            Wallet & On‑Chain: connected wallet address(es), NFT + transaction
            metadata (already public).
          </motion.li>
          <motion.li variants={fadeInUp}>
            Usage & Technical: pages visited, approximate region, device/browser
            attributes, aggregated analytics.
          </motion.li>
          <motion.li variants={fadeInUp}>
            Communications: support requests, newsletter opt‑ins, security
            verification emails.
          </motion.li>
        </motion.ul>
        <motion.p className="text-sm text-muted-foreground" variants={fadeInUp}>
          We never collect private keys or seed phrases. Never share them.
        </motion.p>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">3. How We Use Data</h2>
        <motion.ul className="list-disc pl-6 space-y-2" variants={fadeInUp}>
          <motion.li variants={fadeInUp}>
            Enable core features (minting, listing, bidding, profile
            customization).
          </motion.li>
          <motion.li variants={fadeInUp}>
            Authenticate and secure accounts (sessions, verification, fraud
            monitoring).
          </motion.li>
          <motion.li variants={fadeInUp}>
            Improve performance, relevance, and UI/UX.
          </motion.li>
          <motion.li variants={fadeInUp}>
            Send essential transactional messages and optional updates (with
            consent).
          </motion.li>
          <motion.li variants={fadeInUp}>
            Monitor abuse, spam, and platform integrity.
          </motion.li>
        </motion.ul>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">4. Cookies & Local Storage</h2>
        <p>
          We use limited cookies / local storage for session tokens, UI
          preferences (theme, filters), and analytics. Disabling essential
          storage may break authentication or listing flows.
        </p>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">5. Blockchain Transparency</h2>
        <p>
          On‑chain actions (minting, transfers, bids) are permanent and public.
          We cannot alter or delete blockchain records. NFT content or metadata
          pinned to decentralized storage (e.g., IPFS) may persist beyond
          account deletion.
        </p>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">6. Data Sharing</h2>
        <motion.ul className="list-disc pl-6 space-y-2" variants={fadeInUp}>
          <motion.li variants={fadeInUp}>
            Vetted service providers (infrastructure, email, analytics) under
            confidentiality terms.
          </motion.li>
          <motion.li variants={fadeInUp}>
            Regulatory or legal requests when lawfully required.
          </motion.li>
          <motion.li variants={fadeInUp}>
            Aggregated, anonymized insights (e.g., total marketplace volume).
          </motion.li>
        </motion.ul>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">7. Security</h2>
        <p>
          We apply industry practices (TLS, hashed credentials where applicable,
          access minimization, monitoring). No system is flawless—report
          vulnerabilities via support with reproduction steps.
        </p>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">8. Your Rights</h2>
        <motion.ul className="list-disc pl-6 space-y-2" variants={fadeInUp}>
          <motion.li variants={fadeInUp}>
            Edit profile data in settings.
          </motion.li>
          <motion.li variants={fadeInUp}>
            Request deletion of off‑chain personal data (on‑chain data cannot be
            removed).
          </motion.li>
          <motion.li variants={fadeInUp}>
            Unsubscribe from non-essential communications anytime.
          </motion.li>
          <motion.li variants={fadeInUp}>
            Disconnect your wallet (historic blockchain data remains public).
          </motion.li>
        </motion.ul>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">9. Risk Disclaimer</h2>
        <p>
          NFTs are speculative and volatile. Nothing herein is financial, legal,
          or tax advice. Perform independent research. Smart contracts may
          contain bugs; interact at your own risk. You bear full responsibility
          for wallet security.
        </p>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">10. Underage Use</h2>
        <p>
          The service is not intended for individuals below the legally required
          age to enter digital agreements in their jurisdiction. We will remove
          ineligible account data where feasible.
        </p>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">11. Policy Changes</h2>
        <p>
          We may update this policy for operational, legal, or technical
          reasons. Material changes will be communicated via in‑app notice or
          email (if subscribed). Continued use indicates acceptance.
        </p>
      </motion.section>

      <motion.section
        className="space-y-4"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <h2 className="text-xl font-medium">12. Contact</h2>
        <p>
          For questions or data requests, use the support page or email
          support@placeholder.example. For security reports, please provide
          non-public details responsibly.
        </p>
      </motion.section>

      <motion.div
        className="pt-4 border-t"
        variants={zoomIn}
        viewport={{ once: true, amount: 0.25 }}
        initial="hidden"
        whileInView="visible"
      >
        <motion.h3 className="text-lg font-medium mb-2" variants={fadeInDown}>
          Stay Informed
        </motion.h3>
        <motion.p
          className="text-sm text-muted-foreground mb-4"
          variants={fadeInUp}
        >
          Subscribe for feature updates and security notices.
        </motion.p>
        <Newsletter />
      </motion.div>
    </motion.div>
  );
}
