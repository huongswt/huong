import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    arcTestnet: {
      url: process.env.NEXT_PUBLIC_ARC_RPC_URL || "https://rpc.testnet.arc.network",
      chainId: 5_042_002,
      accounts: privateKey ? [privateKey] : [],
    },
  },
};

export default config;
