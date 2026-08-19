# Arc Programmable Money Hackathon — Submission Brief

## Project

**Arc Creator Agent**

**Tagline:** Agents commission. Humans create. USDC settles.

## Track

Agentic Track

## Problem

AI agents are becoming economic actors, but most agentic marketplaces focus on software buying software. Human creators still face fragmented cross-border payments, platform custody, payout delays, and unclear payment guarantees.

## Solution

Arc Creator Agent is an agent-to-human creative marketplace. A buyer — and in the next milestone a bounded Circle Agent Wallet — commissions a human artist or video creator. USDC is locked in an Arc smart-contract escrow. The creator accepts the brief, submits a deliverable URI/hash, and the buyer approves settlement. The contract then pays the creator and marketplace fee atomically.

## Why Arc

- USDC-denominated settlement and gas improve creator UX.
- Arc is designed for programmable stablecoin money movement.
- The product maps directly to agentic marketplaces and gig/marketplace payout systems.
- Fast settlement makes approval-to-payout immediate for creators.

## Circle / Arc usage

### Implemented in MVP

- Arc Testnet
- Canonical Arc Testnet USDC
- Solidity escrow contract
- USDC approval + funding flow
- Wallet connection and Arc network switching
- Onchain creator accept / submit / approve / dispute lifecycle
- ArcScan transaction verification

### Next integration milestone

- Circle Agent Wallet with bounded spending policy
- Autonomous creator discovery and commissioning
- Circle Wallets for creator onboarding
- Optional Gateway / CCTP for cross-chain funding
- Nanopayments for per-use creative licensing or agent service calls

## Demo flow

1. Connect buyer wallet to Arc Testnet.
2. Enter creator wallet, brief, budget and deadline.
3. Approve USDC and fund the job escrow.
4. Switch to creator wallet and accept the job.
5. Submit a deliverable URI/hash.
6. Switch back to buyer wallet.
7. Approve work.
8. Show creator USDC payment and transaction on ArcScan.

## 3-minute pitch structure

### 0:00–0:25 — Problem

AI agents can buy APIs, but there is no clean economic rail for an agent to hire a human creator with guaranteed programmable payment.

### 0:25–0:50 — Thesis

Arc Creator Agent turns autonomous software into a customer of human creativity: **Agents commission. Humans create. USDC settles.**

### 0:50–2:15 — Live demo

Run the full buyer → escrow → creator → submit → approve → payout flow on Arc Testnet. Show the ArcScan transaction.

### 2:15–2:40 — Why Arc/Circle

Explain USDC settlement, Arc-native money movement, and the planned Circle Agent Wallet bounded-spend flow.

### 2:40–3:00 — Path to production

Add creator reputation, milestone escrow, dispute arbitration, Circle Wallet onboarding, cross-chain USDC funding and pay-per-use licensing.

## Repository

https://github.com/huongswt/huong

## Online demo

GitHub Pages target: `https://huongswt.github.io/huong/`

The repository includes `.github/workflows/pages.yml` and serves the static dApp from `docs/`.

## Submission checklist

- [x] Public GitHub repository
- [x] Frontend prototype
- [x] Arc Testnet wallet flow
- [x] USDC smart-contract escrow source
- [x] GitHub Pages deployment workflow
- [x] 3-minute pitch outline
- [ ] GitHub Pages enabled in repository settings
- [ ] Escrow contract deployed to Arc Testnet
- [ ] End-to-end transaction recorded on ArcScan
- [ ] Demo video recorded and uploaded
- [ ] Final Encode/Arc submission form completed
