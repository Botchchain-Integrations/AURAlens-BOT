"use client";

import { useState } from "react";
import { Braces, Code2 } from "lucide-react";
import type { AuraAnalysis } from "@/lib/aura/types";

export function DeveloperPanel({ analysis }: { analysis: AuraAnalysis }) {
  const [view, setView] = useState<"request" | "normalized">("request");
  const endpoint = `/api/aura/strategies?address=${analysis.address}`;
  const normalized = {
    totalBalanceUSD: analysis.totalBalanceUSD,
    networkCount: analysis.networkCount,
    assetCount: analysis.assetCount,
    strategies: analysis.strategies,
  };

  return (
    <section className="developer-panel" id="developer" aria-labelledby="developer-title">
      <div className="section-heading developer-heading">
        <div>
          <p className="section-index">03 / Developer integration</p>
          <h2 id="developer-title">Infrastructure into experience.</h2>
        </div>
        <div className="segmented-control" aria-label="Developer data view">
          <button type="button" className={view === "request" ? "active" : ""} onClick={() => setView("request")}>
            <Code2 size={15} /> Request
          </button>
          <button type="button" className={view === "normalized" ? "active" : ""} onClick={() => setView("normalized")}>
            <Braces size={15} /> Normalized
          </button>
        </div>
      </div>

      <div className="code-window">
        <div className="code-meta">
          <span>GET</span>
          <span>{view === "request" ? "route.ts" : "AuraAnalysis"}</span>
        </div>
        {view === "request" ? (
          <pre><code>{`const response = await fetch(
  "${endpoint}"
);

const intelligence = await response.json();`}</code></pre>
        ) : (
          <pre><code>{JSON.stringify(normalized, null, 2)}</code></pre>
        )}
      </div>
    </section>
  );
}
