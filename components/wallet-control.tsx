"use client";

import { useEffect, useRef } from "react";
import { LogOut, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { shortAddress } from "@/lib/formatters";
import { botChain } from "@/lib/bot/chain";

export function WalletControl({ onAddress }: { onAddress: (address: string) => void }) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const triggered = useRef<string | null>(null);
  const connector = connectors[0];

  useEffect(() => {
    if (isConnected && address && chainId !== botChain.id) {
      switchChain({ chainId: botChain.id });
    }
  }, [isConnected, address, chainId, switchChain]);

  useEffect(() => {
    const key = address && chainId ? `${address}:${chainId}` : null;
    if (isConnected && address && chainId === botChain.id && triggered.current !== key) {
      triggered.current = key;
      onAddress(address);
    }
  }, [isConnected, address, chainId, onAddress]);

  if (isConnected && address) {
    return (
      <div className="wallet-connected">
        <button className="wallet-address" type="button" onClick={() => onAddress(address)} title={chainId === botChain.id ? "Re-analyze this BOT Chain wallet" : "Wallet is not on BOT Chain"}>
          <span className="status-dot" />
          {shortAddress(address)}
          <b>{chainId === botChain.id ? "BOT Chain" : `Chain ${chainId}`}</b>
        </button>
        <button className="icon-button" type="button" onClick={() => disconnect()} aria-label="Disconnect wallet" title="Disconnect wallet">
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      className="secondary-button"
      type="button"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
    >
      <Wallet size={16} />
      {isPending ? "Connecting" : "Connect wallet"}
    </button>
  );
}