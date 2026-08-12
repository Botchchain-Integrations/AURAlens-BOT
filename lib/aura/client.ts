import { isAddress } from "viem";
import { normalizeAuraResponse } from "@/lib/aura/normalize";
import type { AuraAnalysis, AuraApiResponse } from "@/lib/aura/types";

const AURA_ENDPOINT = "https://aura.adex.network/api/portfolio/strategies";

export class AuraApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuraApiError";
    this.status = status;
  }
}

export async function getAuraStrategies(address: string): Promise<AuraAnalysis> {
  if (!isAddress(address)) {
    throw new AuraApiError("Enter a valid EVM wallet address.", 400);
  }

  const headers: HeadersInit = { accept: "application/json" };
  if (process.env.AURA_API_KEY) headers.authorization = `Bearer ${process.env.AURA_API_KEY}`;

  const response = await fetch(`${AURA_ENDPOINT}?address=${encodeURIComponent(address)}`, {
    headers,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const message = response.status === 429
      ? "AURA's public limit has been reached. Try again later or use another wallet."
      : "AURA could not analyze this wallet right now.";
    throw new AuraApiError(message, response.status);
  }

  const data = (await response.json()) as AuraApiResponse;
  return normalizeAuraResponse(address, data);
}
