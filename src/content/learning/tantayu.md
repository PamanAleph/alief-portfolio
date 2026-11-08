---
type: "project"
title: "Tantayu: A Transport Management System With Arrival Estimates That Explain Themselves"
description: "Transport management system for Indonesian logistics teams: orders, loads, trips, driver PWA, proof of delivery, and billing data in one flow, plus a route-intelligence engine that estimates arrival as a range, with reasons. Now in beta."
date: 2026-11-08
org: "Tantayu"
image: "/images/tantayu.png"
links: []
tags: ["Co-founder", "Product Management", "Strategy", "Logistics", "Route Intelligence", "SaaS"]
---

Tantayu is a transport management system (TMS) for teams that move goods by truck. Orders, loads, trips, drivers, proof of delivery, and billing quantities live in one flow instead of being scattered across chats and spreadsheets. It ships as five projects: a Go backend, a React web and driver app, a login and account app, an Astro landing page, and a brand pack.

## My role

I am a co-founder of Tantayu, and I also act as its product manager and strategic planner. I decide what the product does and in what order it ships, and I plan how it reaches its first customers. The engineering sits on top of that: a Go backend, a React web and driver app, and a design system, all described below.

## How the pieces fit

- **Backend (`tantayu-be`).** Go and Hertz on PostgreSQL 18. It serves the TMS API, acts as the OIDC issuer (Fosite), and runs a background worker (RabbitMQ) from the same image. The codebase registers 163 API routes and 53 TMS plus 63 Auth migrations.
- **Frontend (`tantayu-fe`).** React 19 and React Router v8 with server rendering, Tailwind v4, TanStack Query, and MapLibre. One app, one route tree: office and driver views come from permissions and viewport, not from separate apps. The browser never calls the backend directly; every call goes through the frontend server (BFF).
- **Accounts (`tantayu-accounts`).** Sign-in, organization signup, password recovery, invitations, TOTP, and consent screens.
- **Landing page (`tantayu-lp`).** Static Astro site with a three.js hero simulating van CSD-233 on a delivery.
- **Brand (`tantayu-logo-pack`).** "Two squares and a dot" mark, lockups, favicons, app icons, and design tokens, built on Figtree.

## The core flow

An order splits into one or more **loads**, loads go onto a **trip** (one vehicle, one driver, one pickup, many ordered drop-offs), the driver completes stops one by one, and the quantities accepted on **proof of delivery** decide what is billable.

- One order can be split across many loads, and one trip can carry loads from many orders.
- Allocation is guarded in a transaction: accepted plus reserved plus newly requested can never exceed what the order asked for.
- A POD correction never overwrites. The old version is superseded, and any billing export that used it is flagged for reconciliation.
- Failed deliveries keep the cargo on record in the vehicle, and only failed loads can be re-planned.
- Every command is idempotent, and device time and server time are stored separately.

## Features

### Office

- Orders with multiple pickups and drop-offs, amendments with a recorded reason, and partial close.
- A six-step trip wizard that checks weight and volume against vehicle capacity and blocks assignment when a required document has expired or the vehicle or driver is unavailable.
- Daily summary of what needs action first: failures, late trips, partial deliveries, and missing PODs.
- Live fleet map, a POD board, five reports (on-time delivery, vehicle activity, driver activity, document compliance, billing summary), and global search.
- Fleet and driver documents (STNK, KIR, SIM) with expiry dates, vehicle CSV import, service periods, and driver availability.

### Drivers (installable PWA)

- Today's tasks with accept or reject, then a gated stop flow: Depart, Arrive, proof, Finish. "Finish delivery" stays locked until proof is taken.
- Pickup proof and POD with photos, receiver name, optional on-screen signature, and per-line quantities and condition.
- Nine failure reasons with required photo and cargo custody.
- Installable, with an offline banner, per-user caches, and a local action queue. Depart and Arrive reach the server; other drafts are stored on the device until the signal returns.
- Location is captured as a single point only when the driver taps Depart or Arrive, never continuously, and is deleted after 90 days.

### Customers and billing

- One private tracking link per order: no login, token kept in the URL fragment, 30-day expiry, replaceable at any time. It shows status, accepted versus ordered per item, and amendment history. It never shows prices, driver contact, POD, or other orders on the same truck.
- Billing CSV export built from accepted POD quantities, blocked by open issues, with an audit trail.

### Access and security

- Permission-based access with Owner, Admin, Dispatcher, and Driver templates plus custom roles and groups. Menus appear only when the route is allowed, and the server enforces the same table.
- Password sign-in (Argon2id), optional TOTP with recovery codes, one-time invitation links, and password reset that revokes every session.
- Risky actions (amend, override, POD correction) require a reason of at least 15 characters. Out-of-scope data returns 404, not 403.
- Indonesian and English with typechecked key parity, dark mode, and a token-only design system.

## Route intelligence

The part I find most interesting. Instead of one exact time, Tantayu gives a **range**, a **risk status** (On track, Tight, Late, No update), and the **reasons**.

- It learns from the driver's own Depart and Arrive taps, building log-scale histograms per location, lane, time band, day band, and season (including Ramadan and Lebaran).
- Truck road times come from Valhalla, and an organization can switch them on only after they beat straight-line distance by at least 20% on at least 50 of its own legs.
- With too little data it says "no estimate yet" instead of inventing a number.
- A route planner ported in structure from VROOM builds a day's trips, prioritizing kept promises over shortest distance. Dispatchers get a latest-departure time, stop-order suggestions, and a copy-ready customer message that Tantayu never sends or stores.

## What is not built yet

Honest scope, from reading the code: Excel order import, trip costs, driver issue reports, push notifications, profit reports, invoices, and continuous GPS are still sample screens or absent. POD verification on the dispatcher side is read-only for now.

## Status

Tantayu is in beta and we are looking for our first clients: logistics and distribution teams that dispatch their own trucks and want one place for orders, trips, proof of delivery, and honest arrival estimates. If that sounds like your team, [get in touch](mailto:aliefbuscode@gmail.com).
