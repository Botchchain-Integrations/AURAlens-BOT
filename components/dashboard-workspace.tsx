"use client";

import { FormEvent, useState, useTransition } from "react";
import { ArrowRight, LayoutDashboard, RotateCcw, ScanSearch, Settings2, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isAddress } from "viem";
import type { AuraAnalysis } from "@/lib/aura/types";
import { WalletOverview } from "@/components/wallet-overview";
import { StrategyResults } from "@/components/strategy-results";
import { DeveloperPanel } from "@/components/developer-panel";

type WorkspaceView = "overview" | "strategies" | "developer";

const viewMeta: Record<WorkspaceView, { label: string; title: string }> = {
  overview: { label: "Wallet overview", title: "What does this wallet need to know?" },
  strategies: { label: "AURA strategies", title: "What could be useful next?" },
  developer: { label: "Developer integration", title: "Build wallet-aware experiences with AURA." },
};

export function DashboardWorkspace({ view, analysis, initialAddress, initialError = "" }: { view: WorkspaceView; analysis: AuraAnalysis | null; initialAddress: string; initialError?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState(initialError);
  const [isPending, startTransition] = useTransition();

  function analyze(event?: FormEvent) {
    event?.preventDefault();
    const candidate = address.trim();
    if (!isAddress(candidate)) {
      setError("Enter a valid EVM wallet address.");
      return;
    }
    startTransition(() => router.push(`${pathname}?address=${encodeURIComponent(candidate)}`));
  }

  const suffix = analysis ? `?address=${encodeURIComponent(analysis.address)}` : "";

  return (
    <main className="dashboard-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="AuraLens home"><span className="brand-mark"><ScanSearch size={20} /></span><span>AuraLens</span></Link>
        <div className="header-meta"><Link href="/">Exit workspace</Link></div>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-intro"><p>Workspace</p><h1>Wallet intelligence.</h1></div>
          <nav className="dashboard-nav" aria-label="Workspace navigation">
            <Link className={view === "overview" ? "active" : ""} href={`/dashboard${suffix}`}><LayoutDashboard size={16} /> Overview</Link>
            <Link className={view === "strategies" ? "active" : ""} href={`/dashboard/strategies${suffix}`}><Sparkles size={16} /> Strategies</Link>
            <Link className={view === "developer" ? "active" : ""} href={`/dashboard/developer${suffix}`}><Settings2 size={16} /> Developer integration</Link>
          </nav>
          <div className="sidebar-foot"><span className="status-dot" /> AURA API <b>LIVE</b><p>Recommendations are informational. Review protocols and risks before acting.</p></div>
        </aside>

        <div className="dashboard-main">
          <section className="dashboard-toolbar">
            <div><p className="section-index">{viewMeta[view].label}</p><h2>{viewMeta[view].title}</h2></div>
            <form className="analysis-form" onSubmit={analyze} noValidate>
              <label htmlFor="wallet-address">Add wallet address</label>
              <div className={`address-field ${error ? "has-error" : ""}`}>
                <input id="wallet-address" value={address} onChange={(event) => { setAddress(event.target.value); setError(""); }} placeholder="Paste an EVM address to analyze" autoComplete="off" spellCheck={false} />
                <button className="analyze-button" type="submit" disabled={isPending}>{isPending ? <RotateCcw className="spin" size={17} /> : <ArrowRight size={17} />}{isPending ? "Analyzing" : "Analyze"}</button>
              </div>
              <div className="form-foot"><span>{error || "Real data from the public AURA API."}</span></div>
            </form>
          </section>

          {isPending && <LoadingState />}
          {!isPending && analysis && view === "overview" && <div className="results-shell"><WalletOverview analysis={analysis} /></div>}
          {!isPending && analysis && view === "strategies" && <div className="results-shell"><StrategyResults analysis={analysis} /></div>}
          {!isPending && analysis && view === "developer" && <div className="results-shell"><DeveloperPanel analysis={analysis} /></div>}
          {!isPending && !analysis && <EmptyState view={view} />}
        </div>
      </div>

      <footer><span>AuraLens workspace</span><p>Application layer by AuraLens. Wallet intelligence by AURA.</p><span>2026</span></footer>
    </main>
  );
}

function EmptyState({ view }: { view: WorkspaceView }) {
  return <section className="awaiting-state"><span>READY</span><div><h2>Add a wallet address to open {view === "developer" ? "the developer view" : `its ${view}`}.</h2><p>Paste any valid EVM address above to load real wallet intelligence.</p></div><ScanSearch size={38} /></section>;
}

function LoadingState() {
  return <section className="loading-state" aria-live="polite"><div className="loading-line"><span /><span /><span /></div><p>AURA is reading portfolio context and generating strategies.</p></section>;
}
