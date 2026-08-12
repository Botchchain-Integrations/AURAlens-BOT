"use client";

import { FormEvent, useEffect, useEffectEvent, useState } from "react";
import { ArrowRight, LayoutDashboard, RotateCcw, ScanSearch, Settings2, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isAddress } from "viem";
import type { AuraAnalysis } from "@/lib/aura/types";
import { WalletControl } from "@/components/wallet-control";
import { WalletOverview } from "@/components/wallet-overview";
import { StrategyResults } from "@/components/strategy-results";
import { DeveloperPanel } from "@/components/developer-panel";

const DEMO_ADDRESS = "0x3F5b96A494061F7338Da529e3047809Ac6a7FB84";

type WorkspaceView = "overview" | "strategies" | "developer";

const viewMeta: Record<WorkspaceView, { label: string; title: string }> = {
  overview: { label: "Wallet overview", title: "What does this wallet need to know?" },
  strategies: { label: "AURA strategies", title: "What could be useful next?" },
  developer: { label: "Developer integration", title: "How does the intelligence become UI?" },
};

export function DashboardWorkspace({ view }: { view: WorkspaceView }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryAddress = searchParams.get("address") ?? "";
  const [address, setAddress] = useState(queryAddress || DEMO_ADDRESS);
  const [analysis, setAnalysis] = useState<AuraAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalysis = useEffectEvent(async (candidate: string) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(`/api/aura/strategies?address=${encodeURIComponent(candidate)}`);
      const data = await response.json() as AuraAnalysis | { error?: string };
      if (!response.ok) throw new Error("error" in data && data.error ? data.error : "Analysis failed.");
      setAnalysis(data as AuraAnalysis);
    } catch (caught) {
      setAnalysis(null);
      setError(caught instanceof Error ? caught.message : "AURA could not analyze this wallet.");
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (!isAddress(queryAddress)) return;
    void loadAnalysis(queryAddress);
  }, [queryAddress]);

  function analyze(event?: FormEvent) {
    event?.preventDefault();
    const candidate = address.trim();
    if (!isAddress(candidate)) {
      setError("Enter a valid EVM wallet address.");
      return;
    }
    if (candidate === queryAddress) void loadAnalysis(candidate);
    else router.push(`${pathname}?address=${encodeURIComponent(candidate)}`);
  }

  function useWalletAddress(nextAddress: string) {
    setAddress(nextAddress);
    setError("");
  }

  const suffix = analysis ? `?address=${encodeURIComponent(analysis.address)}` : "";

  return (
    <main className="dashboard-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="AuraLens home"><span className="brand-mark"><ScanSearch size={20} /></span><span>AuraLens</span></Link>
        <div className="header-meta"><Link href="/">Exit workspace</Link><WalletControl onAddress={useWalletAddress} /></div>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-intro"><p>Workspace</p><h1>Wallet intelligence.</h1></div>
          <nav className="dashboard-nav" aria-label="Workspace navigation">
            <Link className={view === "overview" ? "active" : ""} href={`/dashboard${suffix}`}><LayoutDashboard size={16} /> Overview</Link>
            <Link className={view === "strategies" ? "active" : ""} href={`/dashboard/strategies${suffix}`}><Sparkles size={16} /> Strategies</Link>
            <Link className={view === "developer" ? "active" : ""} href={`/dashboard/developer${suffix}`}><Settings2 size={16} /> Developer view</Link>
          </nav>
          <div className="sidebar-foot"><span className="status-dot" /> AURA API <b>LIVE</b><p>Recommendations are informational. Review protocols and risks before acting.</p></div>
        </aside>

        <div className="dashboard-main">
          <section className="dashboard-toolbar">
            <div><p className="section-index">{viewMeta[view].label}</p><h2>{viewMeta[view].title}</h2></div>
            <form className="analysis-form" onSubmit={analyze} noValidate>
              <label htmlFor="wallet-address">Wallet address</label>
              <div className={`address-field ${error ? "has-error" : ""}`}>
                <input key={queryAddress} id="wallet-address" value={address} onChange={(event) => { setAddress(event.target.value); setError(""); }} placeholder="Paste an EVM address" autoComplete="off" spellCheck={false} />
                <button className="analyze-button" type="submit" disabled={isLoading}>{isLoading ? <RotateCcw className="spin" size={17} /> : <ArrowRight size={17} />}{isLoading ? "Analyzing" : "Analyze"}</button>
              </div>
              <div className="form-foot"><span>{error || "Real data from the public AURA API."}</span><button type="button" onClick={() => { setAddress(DEMO_ADDRESS); setError(""); }}>Use demo wallet</button></div>
            </form>
          </section>

          {isLoading && <LoadingState />}
          {!isLoading && analysis && view === "overview" && <div className="results-shell"><WalletOverview analysis={analysis} /></div>}
          {!isLoading && analysis && view === "strategies" && <div className="results-shell"><StrategyResults analysis={analysis} /></div>}
          {!isLoading && analysis && view === "developer" && <div className="results-shell"><DeveloperPanel analysis={analysis} /></div>}
          {!isLoading && !analysis && <EmptyState view={view} />}
        </div>
      </div>

      <footer><span>AuraLens workspace</span><p>Application layer by AuraLens. Wallet intelligence by AURA.</p><span>2026</span></footer>
    </main>
  );
}

function EmptyState({ view }: { view: WorkspaceView }) {
  return <section className="awaiting-state"><span>READY</span><div><h2>Analyze a wallet to open {view === "developer" ? "the developer view" : `its ${view}`}.</h2><p>Use the demo wallet or paste any valid EVM address above.</p></div><ScanSearch size={38} /></section>;
}

function LoadingState() {
  return <section className="loading-state" aria-live="polite"><div className="loading-line"><span /><span /><span /></div><p>AURA is reading portfolio context and generating strategies.</p></section>;
}
