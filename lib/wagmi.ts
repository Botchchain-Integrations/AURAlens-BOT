import { createConfig, http } from "wagmi";
import { base, mainnet, polygon } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { botChain } from "@/lib/bot/chain";

export const wagmiConfig = createConfig({
  chains: [botChain, mainnet, base, polygon],
  connectors: [injected()],
  transports: {
    [botChain.id]: http(botChain.rpcUrls.default.http[0]),
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});
