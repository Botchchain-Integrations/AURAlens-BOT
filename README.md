# Auralens

AuraLens is a developer case study showing how a Web3 application on **BOT Chain** can use AURA as an external wallet-intelligence layer.

Most Web3 applications can show users what they own.
AuraLens demonstrates how an application can also surface what may be useful to consider next, without rebuilding AURA's portfolio analysis and recommendation engine.

## Product Boundary

AuraLens is not a wallet, portfolio tracker, trading agent, or clone of heyAura.

AURA provides the intelligence.
AuraLens provides the application experience around that intelligence.
BOT Chain is the blockchain layer the analysis starts from.

```text
Connect BOT Chain wallet (or paste an EVM address)
      |
      v
AuraLens route handler
      |
      v
AURA portfolio strategies API  +  BOT Chain RPC balance read
      |
      v
Typed and normalized intelligence
      |
      v
Portfolio context + next-action UI
```

## Current Features

- Connect a wallet and analyze it on BOT Chain (chain 968, `rpc.bohr.life`)
- Manual EVM address analysis using an address supplied by the user
- EVM address validation through viem
- Server-side AURA API integration, kept as the intelligence layer
- Native BOT and tUSDT balances read directly from BOT Chain RPC and fused with AURA portfolio context
- Portfolio value, network, asset, and source summaries
- AURA strategy presentation with risk and action context
- Developer view showing the AURA request, the normalized data, and the BOT Chain RPC read
- Invalid-address, loading, low-balance, empty-portfolio, and API-error states
- Responsive desktop and mobile layouts

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- wagmi and viem
- TanStack Query
- Vitest
- Native CSS design system

## BOT Chain Integration

AuraLens reads balances from BOT Chain (chain 968) directly:

```text
Network:  BOT Chain Testnet (chain 968)
RPC:      https://rpc.bohr.life
Explorer: https://scan.bohr.life
Native:   BOT (18 decimals)
tUSDT:    0x75edC9335175Fc0552D51D48439F229c10420fe3 (6 decimals)
```

The wagmi config includes BOT Chain first, so a connected wallet is switched to chain 968 and analyzed automatically.
Native BOT and tUSDT balances are read via `eth_getBalance` and `balanceOf` during analysis and appended to the AURA portfolio as a BOT Chain network entry.

## AURA Integration

AuraLens calls the public AURA endpoint through a local route handler:

```text
GET /api/aura/strategies?address=<EVM_ADDRESS>
```

The server then requests:

```text
GET https://aura.adex.network/api/portfolio/strategies?address=<EVM_ADDRESS>
```

The external response is normalized in `lib/aura/normalize.ts` before it reaches the UI.
The original response is retained for the developer integration view.

The public AURA API may enforce address and rate limits.
An optional server-side `AURA_API_KEY` can be configured when higher access is available.

AURA does not currently index BOT Chain, so BOT Chain balances are read through RPC instead of being inferred.
The AURA endpoint is never replaced or bypassed; it stays the recommendation and price layer for the networks it covers.

## Local Development

Requirements:

- Node.js 20 or newer
- npm 10 or newer

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Demo Address

```text
0x3F5b96A494061F7338Da529e3047809Ac6a7FB84
```

This wallet held a small amount of USDC.E on Polygon and tUSDT / BOT on BOT Chain testnet at the time of development.
AURA classified it as a low-balance wallet and suggested topping it up, while the BOT Chain RPC read surfaced its tUSDT and BOT balances.
Live balances and recommendations can change over time.

## Disclaimer

AuraLens displays third-party wallet intelligence supplied by AURA and balances read from the BOT Chain testnet.
Strategies are informational and are not financial advice.
No transaction execution is implemented in the current version.
