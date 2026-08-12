"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, RotateCcw, ScanSearch } from "lucide-react";
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
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AuraLens home">
          <span className="brand-mark"><ScanSearch size={20} /></span>
          <span>AuraLens</span>
        </a>
        <div className="header-meta"><span>Developer case study</span><WalletControl onAddress={useWalletAddress} /></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="hero-label"><span /> AURA intelligence layer</p>
          <h1>Your dApp knows the wallet. <strong>Now it knows what comes next.</strong></h1>
          <p>See how AURA turns an EVM address into portfolio context and actionable intelligence inside another Web3 product.</p>
        </div>

        <form className="analysis-form" onSubmit={analyze} noValidate>
          <label htmlFor="wallet-address">Wallet address</label>
          <div className={`address-field ${error ? "has-error" : ""}`}>
            <span>0x</span>
            <input
              id="wallet-address"
              value={address}
              onChange={(event) => { setAddress(event.target.value); setError(""); }}
              placeholder="Paste an EVM address"
              autoComplete="off"
              spellCheck={false}
            />
            <button className="analyze-button" type="submit" disabled={isLoading}>
              {isLoading ? <RotateCcw className="spin" size={17} /> : <ArrowRight size={17} />}
              {isLoading ? "Analyzing" : "Analyze"}
            </button>
          </div>
          <div className="form-foot">
            <span>{error || "Real portfolio and strategy data from the public AURA API."}</span>
            <button type="button" onClick={() => { setAddress(DEMO_ADDRESS); setError(""); }}>Use demo wallet</button>
          </div>
        </form>

        <div className="pipeline" aria-label="AuraLens data flow">
          <span>Wallet address</span><i /><span>AURA API</span><i /><span>Typed intelligence</span><i /><strong>Next action UI</strong>
        </div>
      </section>

      {isLoading && <LoadingState />}
      {!isLoading && analysis && <AnalysisResults analysis={analysis} />}
      {!isLoading && !analysis && (
        <section className="awaiting-state">
          <span>01</span>
          <div><h2>One request. Broader wallet context.</h2><p>Run the demo wallet or connect your own address to reveal the application layer.</p></div>
          <ScanSearch size={38} />
        </section>
      )}

      <footer><span>AuraLens</span><p>Application layer by AuraLens. Wallet intelligence by AURA.</p><span>2026</span></footer>
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
