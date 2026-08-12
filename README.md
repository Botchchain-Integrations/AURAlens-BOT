# AuraLens

AuraLens is a developer case study showing how a Web3 application can use AURA as an external wallet-intelligence layer.

Most Web3 applications can show users what they own.
AuraLens demonstrates how an application can also surface what may be useful to consider next, without rebuilding AURA's portfolio analysis and recommendation engine.

## Product Boundary

AuraLens is not a wallet, portfolio tracker, trading agent, or clone of heyAura.

AURA provides the intelligence.
AuraLens provides the application experience around that intelligence.

```text
Wallet address
      |
      v
AuraLens route handler
      |
      v
AURA portfolio strategies API
      |
      v
Typed and normalized intelligence
      |
      v
Portfolio context + next-action UI
```

## Current Features

- Manual EVM address analysis with a real demo wallet
- Injected wallet connection through wagmi and viem
- Server-side AURA API integration
- Portfolio value, network, asset, and source summaries
- AURA strategy presentation with risk and action context
- Developer view showing the request and normalized application data
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

At the time of development, this wallet held a small amount of USDC.E on Polygon.
The live AURA response classified it as a low-balance wallet and suggested topping it up.
Live balances and recommendations can change over time.

## Disclaimer

AuraLens displays third-party wallet intelligence supplied by AURA.
Strategies are informational and are not financial advice.
No transaction execution is implemented in the current version.
