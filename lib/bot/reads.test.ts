import { describe, expect, it } from "vitest";
import { buildBotEntry, buildBotTokens, formatBotRead } from "@/lib/bot/reads";
import { TUSDT_ADDRESS } from "@/lib/bot/chain";

describe("buildBotTokens", () => {
  it("includes native BOT only when the balance is greater than zero", () => {
    expect(buildBotTokens({ nativeBOT: 22.929, tusdt: 0 })).toEqual([
      { symbol: "BOT", balance: 22.929, balanceUSD: 0, decimals: 18 },
    ]);
  });

  it("includes tUSDT only when the balance is greater than zero", () => {
    expect(buildBotTokens({ nativeBOT: 0, tusdt: 909.4 })).toEqual([
      { symbol: "USDT", balance: 909.4, balanceUSD: 0, decimals: 6, address: TUSDT_ADDRESS },
    ]);
  });

  it("includes both assets when both balances are present", () => {
    const tokens = buildBotTokens({ nativeBOT: 1.5, tusdt: 2 });
    expect(tokens).toHaveLength(2);
    expect(tokens.map((token) => token.symbol)).toEqual(["BOT", "USDT"]);
  });

  it("returns no tokens when both balances are zero", () => {
    expect(buildBotTokens({ nativeBOT: 0, tusdt: 0 })).toEqual([]);
  });
});

describe("buildBotEntry", () => {
  it("maps the BOT Chain network with explorer and ISO-style chain id", () => {
    const entry = buildBotEntry({ nativeBOT: 1, tusdt: 1 });
    expect(entry.network).toEqual({
      name: "BOT Chain",
      chainId: "677",
      explorerUrl: "https://scan.botchain.ai",
    });
  });

  it("reports a zero USD total because AURA prices BOT Chain assets as unknown", () => {
    const entry = buildBotEntry({ nativeBOT: 10, tusdt: 100 });
    expect(entry.totalBalanceUSD).toBe(0);
  });
});

describe("formatBotRead", () => {
  it("joins non-zero balances in a readable summary", () => {
    const read = {
      chainId: "677",
      network: "BOT Chain Testnet",
      rpcUrl: "https://rpc.botchain.ai",
      explorerUrl: "https://scan.botchain.ai",
      balances: { nativeBOT: 22.929, tusdt: 909.4 },
    };
    expect(formatBotRead(read)).toBe("22.9290 BOT · 909.4000 USDT");
  });

  it("falls back to a discovery message when the wallet has no BOT Chain assets", () => {
    const read = {
      chainId: "677",
      network: "BOT Chain Testnet",
      rpcUrl: "https://rpc.botchain.ai",
      explorerUrl: "https://scan.botchain.ai",
      balances: { nativeBOT: 0, tusdt: 0 },
    };
    expect(formatBotRead(read)).toBe("No BOT Chain assets found");
  });
});