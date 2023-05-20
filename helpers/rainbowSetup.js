import { createClient, configureChains } from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";


export const filecoinHyperspace = {
  id: 3141,
  name: 'Hyperspace ',
  network: 'Hyperspace ',
  nativeCurrency: {
    decimals: 18,
    name: 'tFIL',
    symbol: 'tFIL',
  },
  rpcUrls: {
    public: { http: ['https://filecoin-hyperspace.chainup.net/rpc/v1'] },
    default: { http: ['https://filecoin-hyperspace.chainup.net/rpc/v1'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'ttps://hyperspace.filfox.info/en' },
    default: { name: 'SnowTrace', url: 'ttps://hyperspace.filfox.info/en' },
  },
  
}

export const { chains, provider } = configureChains(
  [
    // chain.mainnet,
    //  ,
    filecoinHyperspace,

    // chain.optimism,
    // chain.arbitrum,
    // chain.polygon,
    // chain.localhost,
    // chain.hardhat,
  ],
  [ publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "Web3 Starter Kit",
  chains,
});
export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
