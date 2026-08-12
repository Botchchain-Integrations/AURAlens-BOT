import type {
  AuraAction,
  AuraAnalysis,
  AuraApiResponse,
  AuraNetworkPortfolio,
  AuraStrategy,
  AuraToken,
} from "@/lib/aura/types";

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asString(value: unknown, fallback = "Not specified"): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeToken(value: unknown): AuraToken {
  const token = asRecord(value);
  return {
    symbol: asString(token.symbol, "Unknown asset"),
    balance: asNumber(token.balance),
    balanceUSD: asNumber(token.balanceUSD),
    priceUSD: asOptionalNumber(token.priceUSD),
    priceChange24h: asOptionalNumber(token.priceChange24h),
    address: typeof token.address === "string" ? token.address : undefined,
    decimals: asOptionalNumber(token.decimals),
  };
}

function normalizePortfolio(value: unknown): AuraNetworkPortfolio[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const entry = asRecord(item);
    const network = asRecord(entry.network);
    const tokens = Array.isArray(entry.tokens) ? entry.tokens.map(normalizeToken) : [];

    return {
      network: {
        name: asString(network.name, "Unknown network"),
        chainId: asString(network.chainId, "-"),
        explorerUrl: typeof network.explorerUrl === "string" ? network.explorerUrl : undefined,
      },
      tokens,
      totalBalanceUSD: asNumber(entry.totalBalanceUSD),
    };
  });
}

function normalizeAction(value: unknown): AuraAction {
  const action = asRecord(value);
  return {
    description: asString(action.description, "Review this opportunity"),
    tokens: typeof action.tokens === "string" ? action.tokens : undefined,
  };
}

function normalizeStrategies(value: unknown): AuraStrategy[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((strategyValue) => {
    const strategy = asRecord(strategyValue);
    const responses = Array.isArray(strategy.response) ? strategy.response : [strategy.response];

    return responses.filter(Boolean).map((responseValue) => {
      const response = asRecord(responseValue);
      const actions = Array.isArray(response.actions) ? response.actions.map(normalizeAction) : [];
      const firstAction = actions[0];

      return {
        name: asString(response.name, "AURA opportunity"),
        risk: asString(response.risk, "Not specified"),
        description: firstAction?.description,
        tokens: firstAction?.tokens,
        actions,
        network: typeof response.network === "string" ? response.network : undefined,
        apy: asOptionalNumber(response.apy),
        protocol: typeof response.protocol === "string" ? response.protocol : undefined,
      };
    });
  });
}

export function normalizeAuraResponse(address: string, value: AuraApiResponse): AuraAnalysis {
  const portfolio = normalizePortfolio(value.portfolio);
  const strategies = normalizeStrategies(value.strategies);
  const totalBalanceUSD = portfolio.reduce((sum, item) => sum + item.totalBalanceUSD, 0);
  const assetCount = portfolio.reduce((sum, item) => sum + item.tokens.length, 0);

  return {
    address,
    portfolio,
    strategies,
    totalBalanceUSD,
    networkCount: portfolio.length,
    assetCount,
    raw: value,
    cached: typeof value.cached === "boolean" ? value.cached : undefined,
    version: typeof value.version === "string" ? value.version : undefined,
  };
}
