---
type: "project"
title: "Business Health Score & analytics engine"
description: "Golang errgroup concurrency parallelizing heavy queries across Postgres and ClickHouse — cut dashboard latency by 65% under high-volume ingestion."
date: 2025-11-01
org: "Cekat.AI"
tags: ["Golang", "PostgreSQL", "ClickHouse"]
---

Part of a centralized Enterprise SaaS ERP built at Cekat.AI, adopted across multiple departments.

## The problem

Revenue and business-development teams needed a single, trustworthy read on account health — enough signal for account managers to act on before a client churned, not after. The underlying data lived in two different stores (Postgres for transactional records, ClickHouse for event volume), and querying both serially made the dashboard too slow to use during a live call.

## What I built

- A **360-degree Business Health Score**, combining transactional and behavioural signals into one number account managers could act on for churn prevention, upselling, and onboarding.
- A **high-concurrency analytics engine** using Golang's `errgroup` to parallelize heavy queries across Postgres and ClickHouse, with non-blocking ingestion for high-volume streams.
- A **granular audit log system** with automated anomaly detection — flagging irregular transactions like abnormally high discounts — as part of the platform's IT governance (GRC) posture.

## Result

Dashboard latency dropped by **65%**, and every state-altering change on the platform now has an accountable trail.
