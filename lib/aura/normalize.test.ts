import { describe, expect, it } from "vitest";
import { normalizeAuraResponse } from "@/lib/aura/normalize";

describe("normalizeAuraResponse", () => {
  it("turns the live nested response into application data", () => {
    const result = normalizeAuraResponse("0xabc", {
      address: "0xabc",
      portfolio: [{
        network: { name: "Base", chainId: "8453" },
        tokens: [{ symbol: "USDC", balance: 12, balanceUSD: 12 }],
        totalBalanceUSD: 12,
      }],
      strategies: [{
        response: [{
          name: "Stablecoin lending",
          risk: "low",
          actions: [{ description: "Supply USDC", tokens: "USDC" }],
        }],
      }],
      cached: false,
      version: "1.1.12",
    });

    expect(result.totalBalanceUSD).toBe(12);
    expect(result.networkCount).toBe(1);
    expect(result.assetCount).toBe(1);
    expect(result.strategies[0]).toMatchObject({
      name: "Stablecoin lending",
      risk: "low",
      description: "Supply USDC",
      tokens: "USDC",
    });
  });

  it("handles incomplete wallet responses without crashing", () => {
    const result = normalizeAuraResponse("0xempty", {});

    expect(result.portfolio).toEqual([]);
    expect(result.strategies).toEqual([]);
    expect(result.totalBalanceUSD).toBe(0);
    expect(result.assetCount).toBe(0);
  });
});
