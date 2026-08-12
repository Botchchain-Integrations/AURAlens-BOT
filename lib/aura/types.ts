export type AuraToken = {
  symbol: string;
  balance: number;
  balanceUSD: number;
  priceUSD?: number;
  priceChange24h?: number;
  address?: string;
  decimals?: number;
};

export type AuraNetworkPortfolio = {
  network: {
    name: string;
    chainId: string;
    explorerUrl?: string;
  };
  tokens: AuraToken[];
  totalBalanceUSD: number;
};

export type AuraAction = {
  description: string;
  tokens?: string;
};

export type AuraStrategy = {
  name: string;
  risk: string;
  description?: string;
  tokens?: string;
  actions: AuraAction[];
  network?: string;
  apy?: number;
  protocol?: string;
};

export type AuraAnalysis = {
  address: string;
  portfolio: AuraNetworkPortfolio[];
  strategies: AuraStrategy[];
  totalBalanceUSD: number;
  networkCount: number;
  assetCount: number;
  raw: unknown;
  cached?: boolean;
  version?: string;
};

export type AuraApiResponse = {
  address?: unknown;
  portfolio?: unknown;
  strategies?: unknown;
  cached?: unknown;
  version?: unknown;
};
