"use client";

import { FormEvent, useState } from "react";
import { createPublicClient, createWalletClient, custom, http, parseUnits } from "viem";
import { creativeEscrowAbi, erc20Abi } from "@/lib/abi";
import { ARC_USDC_ADDRESS, arcTestnet } from "@/lib/arc";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const escrowAddress = process.env.NEXT_PUBLIC_ESCROW_ADDRESS as `0x${string}` | undefined;

export function CreateJobForm() {
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.ethereum) return alert("Connect an EVM wallet first.");
    if (!escrowAddress) return alert("Escrow contract is not deployed yet. Set NEXT_PUBLIC_ESCROW_ADDRESS after deployment.");

    const form = new FormData(event.currentTarget);
    const creator = String(form.get("creator")) as `0x${string}`;
    const amount = parseUnits(String(form.get("amount")), 6);
    const brief = String(form.get("brief"));
    const days = Number(form.get("days") || 7);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + days * 86_400);

    setBusy(true);
    try {
      const walletClient = createWalletClient({ chain: arcTestnet, transport: custom(window.ethereum) });
      const publicClient = createPublicClient({ chain: arcTestnet, transport: http() });
      const [account] = await walletClient.requestAddresses();

      setStatus("1/2 Approving USDC…");
      const approveHash = await walletClient.writeContract({
        account,
        address: ARC_USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [escrowAddress, amount],
        gas: 80_000n,
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      setStatus("2/2 Funding escrow…");
      const createHash = await walletClient.writeContract({
        account,
        address: escrowAddress,
        abi: creativeEscrowAbi,
        functionName: "createJob",
        args: [creator, amount, deadline, brief],
        gas: 350_000n,
      });
      await publicClient.waitForTransactionReceipt({ hash: createHash });
      setStatus(`Job funded · ${createHash.slice(0, 10)}…`);
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="jobForm" onSubmit={submit}>
      <label>
        Creator wallet
        <input name="creator" placeholder="0x…" required pattern="0x[a-fA-F0-9]{40}" />
      </label>
      <div className="formGrid">
        <label>
          Budget (USDC)
          <input name="amount" type="number" min="0.01" step="0.01" defaultValue="25" required />
        </label>
        <label>
          Deadline (days)
          <input name="days" type="number" min="1" max="30" defaultValue="7" required />
        </label>
      </div>
      <label>
        Creative brief / metadata URI
        <textarea name="brief" rows={4} placeholder="Create a 16:9 launch artwork for Arc…" required />
      </label>
      <button className="primaryButton" disabled={busy}>
        {busy ? "Processing…" : "Fund job with USDC"}
      </button>
      <p className="statusLine">{status}</p>
    </form>
  );
}
