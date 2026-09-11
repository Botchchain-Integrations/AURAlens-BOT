import { createPublicClient, http } from "viem";
import { botChain, TUSDT_ADDRESS, TUSDT_ABI } from "@/lib/bot/chain";
import type { AuraAnalysis, AuraBotRead, AuraNetworkPortfolio, AuraToken } from "@/lib/aura/types";

const botClient = createPublicClient({
  chain: botChain,
  transport: http(botChain.rpcUrls.default.http[0]),
});

export type BotBalances = {
  nativeBOT: number;
  tusdt: number;
};

export async function readBotBalances(address: string): Promise<BotBalances | null> {
  try {
    const [nativeBigInt, tusdtBigInt, decimals] = await Promise.all([
      botClient.getBalance({ address: address as `0x${string}` }),
      botClient.readContract({
        address: TUSDT_ADDRESS,
        abi: TUSDT_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      }),
      botClient.readContract({
        address: TUSDT_ADDRESS,
        abi: TUSDT_ABI,
        functionName: "decimals",
      }),
    ]);

    return {
      nativeBOT: Number(nativeBigInt) / 10 ** 18,
      tusdt: Number(tusdtBigInt) / 10 ** Number(decimals),
    };
  } catch {
    return null;
  }
}

export async function augmentWithBotChain(analysis: AuraAnalysis): Promise<AuraAnalysis> {
  const balances = await readBotBalances(analysis.address);
  if (!balances) return analysis;

  const tokens = buildBotTokens(balances);
  const botEntry = buildBotEntry(balances);

  return {
    ...analysis,
    portfolio: [...analysis.portfolio, botEntry],
    totalBalanceUSD: analysis.totalBalanceUSD, // BOT testnet assets are not priced by AURA
    networkCount: analysis.networkCount + 1,
    assetCount: analysis.assetCount + tokens.length,
    bot: {
      chainId: "968",
      network: "BOT Chain Testnet",
      rpcUrl: botChain.rpcUrls.default.http[0],
      explorerUrl: "https://scan.bohr.life",
      balances,
    },
  };
}

export function buildBotTokens(balances: BotBalances): AuraToken[] {
  const tokens: AuraToken[] = [];
  if (balances.nativeBOT > 0) {
    tokens.push({
      symbol: "BOT",
      balance: balances.nativeBOT,
      balanceUSD: 0,
      decimals: 18,
    });
  }
  if (balances.tusdt > 0) {
    tokens.push({
      symbol: "USDT",
      balance: balances.tusdt,
      balanceUSD: 0,
      decimals: 6,
      address: TUSDT_ADDRESS,
    });
  }
  return tokens;
}

export function buildBotEntry(balances: BotBalances): AuraNetworkPortfolio {
  return {
    network: {
      name: "BOT Chain Testnet",
      chainId: "968",
      explorerUrl: "https://scan.bohr.life",
    },
    tokens: buildBotTokens(balances),
    totalBalanceUSD: 0,
  };
}

export function formatBotRead(read: AuraBotRead): string {
  const entries: string[] = [];
  if (read.balances.nativeBOT > 0) entries.push(`${read.balances.nativeBOT.toFixed(4)} BOT`);
  if (read.balances.tusdt > 0) entries.push(`${read.balances.tusdt.toFixed(4)} USDT`);
  return entries.length > 0 ? entries.join(" · ") : "No BOT Chain assets found";
}