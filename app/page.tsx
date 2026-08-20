"use client";

import { CreateJobForm } from "@/components/CreateJobForm";
import { WalletButton } from "@/components/WalletButton";

const briefs = [
  { type: "Illustration", title: "Protocol launch key visual", budget: "25 USDC", status: "Demo brief" },
  { type: "Motion", title: "15s product teaser", budget: "60 USDC", status: "Demo brief" },
  { type: "Video", title: "Creator story short", budget: "90 USDC", status: "Demo brief" },
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <div className="brand"><span className="mark">M</span><span>MusePay</span></div>
        <div className="navActions"><span className="networkPill">Arc Testnet</span><WalletButton /></div>
      </nav>

      <section className="hero">
        <div className="eyebrow">AGENT → HUMAN CREATIVE ECONOMY</div>
        <h1>Agents commission.<br /><span>Humans create.</span><br />USDC settles.</h1>
        <p className="heroCopy">MusePay is a programmable creative marketplace where humans are paid transparently for artwork, motion and video — with escrow settlement on Arc.</p>
        <div className="heroBadges"><span>USDC escrow</span><span>Arc Testnet</span><span>Agent-ready</span></div>
      </section>

      <section className="howItWorks">
        <div className="sectionHeading"><span>01</span><h2>One clean payment loop</h2></div>
        <div className="steps">
          <article><b>01</b><h3>Commission</h3><p>A buyer or agent selects a human creator and funds a brief in USDC.</p></article>
          <article><b>02</b><h3>Create</h3><p>The creator accepts the job and submits the artwork or video deliverable.</p></article>
          <article><b>03</b><h3>Approve</h3><p>The buyer reviews objective requirements and approves the work.</p></article>
          <article><b>04</b><h3>Settle</h3><p>The escrow contract pays the creator and routes the platform fee.</p></article>
        </div>
      </section>

      <section className="market">
        <div className="sectionHeading"><span>02</span><h2>Creative briefs</h2></div>
        <div className="briefGrid">
          {briefs.map((brief) => <article className="briefCard" key={brief.title}>
            <div className="briefMeta"><span>{brief.type}</span><span>{brief.status}</span></div>
            <h3>{brief.title}</h3><strong>{brief.budget}</strong>
          </article>)}
        </div>
      </section>

      <section className="createSection">
        <div>
          <div className="sectionHeading"><span>03</span><h2>Fund the first job</h2></div>
          <p className="sectionCopy">After the CreativeEscrow contract is deployed, this form performs two real Arc transactions: USDC approval, then escrow funding.</p>
          <div className="proofBox"><span>Canonical testnet USDC</span><code>0x3600000000000000000000000000000000000000</code></div>
        </div>
        <CreateJobForm />
      </section>

      <footer><span>MusePay · Built for Arc Programmable Money</span><span>Human creativity deserves programmable payment.</span></footer>
    </main>
  );
}
