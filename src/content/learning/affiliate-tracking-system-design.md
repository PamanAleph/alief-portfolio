---
type: "writing"
title: "Building an Affiliate Tracking System: Attribution, Commission, and Payout in One Pipeline"
description: "How I designed an end-to-end affiliate tracking system — click attribution, commission calculation, wallet ledger, and withdrawal — across API, admin, and a partial mobile rollout."
date: 2026-07-22
tags: ["Node.js", "MongoDB", "System Design", "Affiliate Marketing"]
---

Affiliate programs sound simple until you build one: track a click, credit the right person, pay them correctly, and don't let anyone double-dip. Four separate failure modes hide in that one sentence — attribution, calculation, ledger integrity, payout. Each needed its own model, not a bolted-on flag on the `Order` schema.

## Attribution: click before conversion

Every affiliate action starts at `AffiliateClick` — `affiliatorId`, `productId`, `platform`, and `clickerInfo` (IP, user agent, referer, country). Conversion isn't assumed; a click only becomes revenue when it's later matched to an `orderId` via `converted`.

Click spam is the obvious attack — an affiliator refreshing their own link to inflate reach. Fixed with a compound "click protection index" on IP + product + affiliator, so repeat clicks from the same source don't fan out into fake attribution.

## Commission: rate lives outside the transaction

Commission rate isn't hardcoded per affiliator. `AffiliateCommission` holds a percentage rate scoped per nation, with a uniqueness constraint enforcing one active rate per nation at a time. `AdminCommissionConfig` sits underneath as a global fallback when no nation-specific rate applies.

Actual earnings land in `AffiliateEarning` — one record per order item, storing `commissionRate`, `commissionAmount`, and a `commissionSnapshot`. The snapshot matters: if the rate config changes next month, past earnings don't silently recalculate. Status moves `pending → confirmed → canceled`, tied to order lifecycle — a canceled order cancels the earning.

## Ledger: money doesn't move without a paper trail

`AffiliateWalletLedger` is append-only — every earning or withdrawal writes a `credit`/`debit` entry, never a mutation of a running balance field. Idempotency is enforced with a unique index on `source + refId + side`, so a retried webhook or duplicate job can't double-credit the same earning.

Withdrawal is its own state machine — `AffiliateWithdrawal`: `requested → approved → rejected/paid/failed`, minimum Rp100.000, with a snapshot of the bank account at request time, so a later profile edit doesn't retroactively change where money already in flight was supposed to go.

## Three surfaces, one backend

- **titip-bos-api** — owns all of the above: models, commission engine, wallet ledger, ~19 admin endpoints for application review, tracking, and payout, plus one-off scripts (`fix-missing-commissions.js`, `backfillAffiliateWalletLedger.js`) that tell the honest story of a system patched against real production data issues, not just designed on paper.
- **titip-bos-admin** — ops-facing: approve/reject/suspend affiliator applications, edit commission rates, review and mark withdrawals paid, inspect click-tracking detail per affiliator.
- **titip-bos (web)** — the affiliator-facing product: registration, dashboard, link/share generation, performance analytics, wallet and withdrawal UI. This is where an affiliator actually lives day to day.
- **mobile-app-rn** — API plumbing only (`trackAffiliateClick`, `applyAffiliator`) with no screens consuming it yet. The backend contract exists; the mobile UI is the open gap.

## What I'd flag as unfinished

`AffiliateShare` has methods referencing `this.metrics`, but no `metrics` field is defined on the schema — a latent bug waiting for whoever calls that method first. Worth naming here rather than pretending the system is flawless.

## Business impact

- **Trust with affiliators.** Snapshotted commission rate and bank info mean an affiliator's payout can't shift under them after the fact — fewer disputes, fewer support tickets asking why a balance changed.
- **Fraud cost avoided.** The click-protection index blocks self-inflated click counts before they become fake commission liability — the program doesn't pay for clicks that were never real reach.
- **Ops time back.** Admin approval/suspend/withdrawal-review flow turns affiliator onboarding and payout from manual finance work into a queue — scales past approving each application by hand.
- **Auditable money movement.** Append-only ledger with idempotent credit/debit means finance can reconcile "why does this affiliator have this balance" without re-deriving it from order history — matters the moment a payout gets disputed or audited.
- **Per-nation commission flexibility.** Rate scoped by nation, not hardcoded, means expansion to a new market doesn't require a code change — just a new `AffiliateCommission` row. A business lever, not an engineering ticket.
- **Untapped channel flagged, not hidden.** Mobile API hooks exist with no UI — an honest data point for a growth conversation: the backend is ready, mobile affiliate acquisition is a build-not-rebuild away.

## The shape of the idea

Attribution, valuation, and settlement are three different concerns that all touch "an affiliate gets paid" — collapsing them into one model is why naive affiliate features rot. Keeping them as separate collections, joined by reference ID and reconciled through an append-only ledger, is what makes the payout number defensible when someone asks why an affiliator has the balance they have.
