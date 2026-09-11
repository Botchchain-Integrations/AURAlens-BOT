"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { AuraAnalysis } from "@/lib/aura/types";
import { formatCurrency, formatTokenBalance } from "@/lib/formatters";

const PAGE_SIZE = 25;

export function WalletOverview({ analysis }: { analysis: AuraAnalysis }) {
  const [page, setPage] = useState(1);
  const botOnly = analysis.portfolio.length === 1 && analysis.portfolio[0].network.chainId === "968";
  const botAssets = botOnly ? analysis.portfolio[0].tokens : [];
  const lowBalance = !botOnly && analysis.totalBalanceUSD < 10;
  const assets = analysis.portfolio
    .flatMap((entry) => entry.tokens.map((token) => ({ token, network: entry.network })))
    .sort((left, right) => botOnly ? right.token.balance - left.token.balance : right.token.balanceUSD - left.token.balanceUSD);
  const pageCount = Math.max(1, Math.ceil(assets.length / PAGE_SIZE));
  const visibleAssets = assets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="overview-section standalone-section" aria-labelledby="overview-title">
      <div className="section-heading">
        <div><p className="section-index">01 / Wallet context</p><h2 id="overview-title">What the app knows.</h2></div>
        <span className="api-stamp">AURA + BOT Chain RPC</span>
      </div>

      <div className="overview-grid">
        <div className="balance-block">
          <span>{botOnly ? "BOT Chain balance" : "Estimated portfolio"}</span>
          <strong>{botOnly ? botAssets.map((t) => `${formatTokenBalance(t.balance)} ${t.symbol}`).join(" · ") : formatCurrency(analysis.totalBalanceUSD)}</strong>
          <p>{botOnly ? "Asset totals on BOT Chain testnet, read via RPC. Testnet balances are not USD-priced." : lowBalance ? "Low balance detected. AURA is prioritizing foundational next steps." : "Portfolio context is informing the opportunities available in the Strategies view."}</p>
        </div>
        <dl className="metrics-grid">
          <div><dt>Networks</dt><dd>{analysis.networkCount}</dd></div>
          <div><dt>Assets</dt><dd>{analysis.assetCount}</dd></div>
          <div><dt>Strategies</dt><dd>{analysis.strategies.length}</dd></div>
          <div><dt>Source</dt><dd>{botOnly ? "BOT RPC" : analysis.cached ? "Cached" : "Live"}</dd></div>
        </dl>
      </div>

      <div className="asset-table-toolbar">
        <div><strong>Asset inventory</strong><span>{assets.length} assets across {analysis.networkCount} networks</span></div>
        {pageCount > 1 && <span>Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, assets.length)}</span>}
      </div>
      <div className="asset-table" role="table" aria-label="Wallet assets">
        <div className="asset-head" role="row"><span>Asset</span><span>Network</span><span>Balance</span><span>USD value</span></div>
        {visibleAssets.map(({ token, network }, index) => (
          <div className="asset-row" role="row" key={`${network.chainId}-${token.address ?? token.symbol}-${index}`}>
            <span><i>{token.symbol.slice(0, 1)}</i><b>{token.symbol}</b></span>
            <span>{network.name}</span><span>{formatTokenBalance(token.balance)}</span><span>{formatCurrency(token.balanceUSD)}</span>
          </div>
        ))}
        {assets.length === 0 && <div className="table-empty">No on-chain assets were returned for this wallet.</div>}
      </div>
      {pageCount > 1 && (
        <div className="pagination" aria-label="Asset pages">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}><ChevronLeft size={16} /> Previous</button>
          <span>Page {page} of {pageCount}</span>
          <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount}>Next <ChevronRight size={16} /></button>
        </div>
      )}
    </section>
  );
}
