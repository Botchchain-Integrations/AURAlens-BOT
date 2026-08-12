import { ArrowRight, Layers3, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
  { number: "01", title: "Wallet context", text: "Assets, networks, balances, and USD values from a single EVM address." },
  { number: "02", title: "AURA intelligence", text: "Strategies and risk context returned by the intelligence layer." },
  { number: "03", title: "Application UX", text: "A focused next-action experience built for your product, not ours." },
];

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <a className="brand" href="#top" aria-label="AuraLens home">
          <span className="brand-mark"><ScanSearch size={20} /></span>
          <span>AuraLens</span>
        </a>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#why">Why AuraLens</a>
          <a href="#how">How it works</a>
          <Link className="nav-cta" href="/dashboard">Open workspace <ArrowRight size={15} /></Link>
        </nav>
      </header>

      <section className="landing-hero" id="top">
        <div className="landing-hero-copy">
          <p className="hero-label"><span /> A developer application built on AURA</p>
          <h1>Give your dApp a <em>point of view.</em></h1>
          <p className="landing-lede">Most Web3 apps show users what they own. AuraLens shows how AURA can help an app understand what may be useful next.</p>
          <div className="landing-actions">
            <Link className="primary-link" href="/dashboard">Try the workspace <ArrowRight size={16} /></Link>
            <a className="text-link" href="#how">See the integration <ArrowRight size={15} /></a>
          </div>
          <p className="landing-note">No wallet transaction required. Just intelligence.</p>
        </div>

        <div className="architecture-card" aria-label="AuraLens integration architecture">
          <div className="architecture-topline"><span>Application architecture</span><span>01 / 03</span></div>
          <div className="architecture-flow">
            <div className="flow-node flow-user"><span className="flow-icon"><Layers3 size={17} /></span><div><small>Input</small><strong>Wallet address</strong></div></div>
            <div className="flow-connector"><i /><span>request</span></div>
            <div className="flow-node flow-aura"><span className="flow-icon"><Sparkles size={17} /></span><div><small>Intelligence layer</small><strong>AURA API</strong></div></div>
            <div className="flow-connector"><i /><span>normalize</span></div>
            <div className="flow-node flow-output"><span className="flow-icon"><ShieldCheck size={17} /></span><div><small>Our experience</small><strong>Next action UI</strong></div></div>
          </div>
          <div className="architecture-code"><span>GET</span><code>/api/portfolio/strategies?address=</code><b>0x...</b></div>
        </div>
      </section>

      <section className="landing-statement" id="why">
        <p className="section-index">The gap</p>
        <h2>Context is the missing layer between a wallet and a useful product.</h2>
        <div className="statement-aside"><span>Most dApps</span><strong>What you own</strong><i>→</i><span>AuraLens</span><strong>What to consider next</strong></div>
      </section>

      <section className="landing-how" id="how">
        <div className="how-heading"><p className="section-index">The integration</p><h2>Infrastructure in. Experience out.</h2></div>
        <div className="step-list">
          {steps.map((step) => <article className="step-item" key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}
        </div>
      </section>

      <section className="landing-cta">
        <div><p className="section-index">See it in practice</p><h2>Don&apos;t build another wallet dashboard.</h2><p>Build the layer that helps your application make better use of the wallet context it already has.</p></div>
        <Link className="primary-link" href="/dashboard">Open AuraLens <ArrowRight size={16} /></Link>
      </section>

      <footer><span>AuraLens</span><p>Application layer by AuraLens. Wallet intelligence by AURA.</p><span>2026</span></footer>
    </main>
  );
}
