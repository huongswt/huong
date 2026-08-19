import { defineChain } from "viem";

export const ARC_TESTNET_CHAIN_ID = 5_042_002;
export const ARC_TESTNET_CHAIN_ID_HEX = "0x4CEF52";
export const ARC_TESTNET_RPC =
  process.env.NEXT_PUBLIC_ARC_RPC_URL || "https://rpc.testnet.arc.network";
export const ARC_TESTNET_EXPLORER = "https://testnet.arcscan.app";
export const ARC_USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  "0x3600000000000000000000000000000000000000") as `0x${string}`;

export const arcTestnet = defineChain({
  id: ARC_TESTNET_CHAIN_ID,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: { http: [ARC_TESTNET_RPC] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: ARC_TESTNET_EXPLORER },
  },
  testnet: true,
});

export const addArcTestnetParams = {
  chainId: ARC_TESTNET_CHAIN_ID_HEX,
  chainName: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: [ARC_TESTNET_RPC],
  blockExplorerUrls: [ARC_TESTNET_EXPLORER],
};
