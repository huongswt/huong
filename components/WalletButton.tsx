"use client";

import { useEffect, useState } from "react";
import { createWalletClient, custom, getAddress } from "viem";
import { addArcTestnetParams, arcTestnet, ARC_TESTNET_CHAIN_ID_HEX } from "@/lib/arc";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
    };
  }
}

function shorten(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletButton({ onConnected }: { onConnected?: (address: `0x${string}`) => void }) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        const first = (accounts as string[])[0];
        if (first) {
          const checksummed = getAddress(first);
          setAddress(checksummed);
          onConnected?.(checksummed);
        }
      })
      .catch(() => undefined);
  }, [onConnected]);

  async function connect() {
    if (!window.ethereum) {
      alert("Please install MetaMask or another EVM wallet first.");
      return;
    }

    setBusy(true);
    try {
      const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;
      if (chainId.toLowerCase() !== ARC_TESTNET_CHAIN_ID_HEX.toLowerCase()) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ARC_TESTNET_CHAIN_ID_HEX }],
          });
        } catch {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [addArcTestnetParams],
          });
        }
      }

      const client = createWalletClient({ chain: arcTestnet, transport: custom(window.ethereum) });
      const [account] = await client.requestAddresses();
      setAddress(account);
      onConnected?.(account);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className="walletButton" onClick={connect} disabled={busy}>
      {busy ? "Connecting…" : address ? shorten(address) : "Connect wallet"}
    </button>
  );
}
