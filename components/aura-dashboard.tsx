"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LayoutDashboard, RotateCcw, ScanSearch, Settings2, Sparkles } from "lucide-react";
import Link from "next/link";
import { isAddress } from "viem";
import type { AuraAnalysis } from "@/lib/aura/types";
import { WalletControl } from "@/components/wallet-control";
import { AnalysisResults } from "@/components/analysis-results";

const DEMO_ADDRESS = "0x3F5b96A494061F7338Da529e3047809Ac6a7FB84";

export function AuraDashboard() {
  const [address, setAddress] = useState(DEMO_ADDRESS);
  const [analysis, setAnalysis] = useState<AuraAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function analyze(event?: FormEvent) {
    event?.preventDefault();
    const candidate = address.trim();
    if (!isAddress(candidate)) {
      setError("Enter a valid EVM wallet address.");
      return;
    }

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
  }

  function useWalletAddress(nextAddress: string) {
    setAddress(nextAddress);
    setError("");
  }

  return (
    <main className="dashboard-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="AuraLens home">
          <span className="brand-mark"><ScanSearch size={20} /></span>
          <span>AuraLens</span>
        </Link>
        <div className="header-meta"><Link href="/">Exit workspace</Link><WalletControl onAddress={useWalletAddress} /></div>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-intro"><p>Workspace</p><h1>Wallet intelligence.</h1></div>
          <nav className="dashboard-nav" aria-label="Workspace navigation">
            <a className="active" href="#analyze"><LayoutDashboard size={16} /> Overview</a>
            {analysis ? <a href="#strategies"><Sparkles size={16} /> Strategies</a> : <span aria-disabled="true"><Sparkles size={16} /> Strategies</span>}
            {analysis ? <a href="#developer"><Settings2 size={16} /> Developer view</a> : <span aria-disabled="true"><Settings2 size={16} /> Developer view</span>}
          </nav>
          <div className="sidebar-foot"><span className="status-dot" /> AURA API <b>LIVE</b><p>Recommendations are informational. Review protocols and risks before acting.</p></div>
        </aside>

        <div className="dashboard-main">
          <section className="dashboard-toolbar" id="analyze">
            <div><p className="section-index">Analyze wallet</p><h2>What does this wallet need to know?</h2></div>
            <form className="analysis-form" onSubmit={analyze} noValidate>
              <label htmlFor="wallet-address">Wallet address</label>
              <div className={`address-field ${error ? "has-error" : ""}`}>
                <input id="wallet-address" value={address} onChange={(event) => { setAddress(event.target.value); setError(""); }} placeholder="Paste an EVM address" autoComplete="off" spellCheck={false} />
                <button className="analyze-button" type="submit" disabled={isLoading}>{isLoading ? <RotateCcw className="spin" size={17} /> : <ArrowRight size={17} />}{isLoading ? "Analyzing" : "Analyze"}</button>
              </div>
              <div className="form-foot"><span>{error || "Real data from the public AURA API."}</span><button type="button" onClick={() => { setAddress(DEMO_ADDRESS); setError(""); }}>Use demo wallet</button></div>
            </form>
          </section>

          {isLoading && <LoadingState />}
          {!isLoading && analysis && <div id="strategies"><AnalysisResults analysis={analysis} /></div>}
          {!isLoading && !analysis && <section className="awaiting-state"><span>READY</span><div><h2>One request. Broader wallet context.</h2><p>Run the demo wallet or connect your own address to reveal the application layer.</p></div><ScanSearch size={38} /></section>}
        </div>
      </div>

      <footer><span>AuraLens workspace</span><p>Application layer by AuraLens. Wallet intelligence by AURA.</p><span>2026</span></footer>
    </main>
  );
}

function LoadingState() {
  return (
    <section className="loading-state" aria-live="polite">
      <div className="loading-line"><span /><span /><span /></div>
      <p>AURA is reading portfolio context and generating strategies.</p>
    </section>
  );
}
