"use client";

import { LogOut, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortAddress } from "@/lib/formatters";

export function WalletControl({ onAddress }: { onAddress: (address: string) => void }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  if (isConnected && address) {
    return (
      <div className="wallet-connected">
        <button className="wallet-address" type="button" onClick={() => onAddress(address)}>
          <span className="status-dot" />
          {shortAddress(address)}
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
