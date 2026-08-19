# Arc Creator Agent

**Agents commission. Humans create. USDC settles.**

Arc Creator Agent is an MVP marketplace for commissioning human artists, illustrators and video creators. A buyer today — and a Circle Agent Wallet in the next milestone — can fund a creative brief in USDC. A smart contract on Arc holds the money until the creator submits work and the buyer approves it.

## Why Arc

- Arc Testnet chain ID: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- Canonical Arc Testnet USDC: `0x3600000000000000000000000000000000000000`
- USDC has 6 decimals and is also Arc's native gas asset.

## MVP flow

1. Buyer connects an EVM wallet on Arc Testnet.
2. Buyer chooses a human creator, budget and deadline.
3. Buyer approves USDC and funds `CreativeEscrow`.
4. Creator accepts the job and submits a deliverable URI/hash.
5. Buyer approves the work.
6. Contract pays 95% to the creator and 5% to the platform treasury.
7. Either party can raise a dispute; the MVP owner resolves it.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Compile the contract

```bash
npm run compile
```

## Deploy to Arc Testnet

Never commit a private key.

```bash
cp .env.example .env
# Set DEPLOYER_PRIVATE_KEY and TREASURY_ADDRESS in .env
npm run deploy:arc
```

Then put the deployed address into:

```bash
NEXT_PUBLIC_ESCROW_ADDRESS=0x...
```

and restart the frontend.

## Security model for the MVP

- USDC transfers use OpenZeppelin `SafeERC20`.
- Payment/refund functions use `ReentrancyGuard`.
- State is updated before outbound transfers.
- Platform fee is capped at 10%.
- Dispute resolution is intentionally centralized for the hackathon MVP; it can later move to multisig/arbitration.
- Artwork/video bytes are not stored onchain. Only a URI/hash should be stored.

## Next milestone: Circle Agent Wallet

The buyer role will be extended so a Circle Agent Wallet can operate within a defined USDC budget and create jobs autonomously. The agent should evaluate objective requirements, while subjective creative approval remains human-controlled or disputeable.

## Product thesis

This is not “Fiverr + crypto”. The core thesis is that autonomous software becomes a buyer of human creativity, while Arc provides programmable, dollar-denominated settlement.
