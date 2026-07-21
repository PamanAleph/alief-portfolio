---
type: "project"
title: "Feature-based architecture, capstone"
description: "Domain-encapsulated Next.js structure decoupling business logic from UI layers — 95% sprint completion rate across the build."
date: 2025-04-01
org: "President University — Internal Capstone Project"
tags: ["Next.js", "Agile / CI-CD"]
---

A capstone build used to test whether a stricter architecture would actually reduce the day-to-day cost of change on a Next.js codebase — not just look tidier on a diagram.

## The architecture

Enforced a **feature-based structure** in Next.js: each domain owns its own colocated code (components, hooks, API calls, types), instead of the usual split-by-layer folders (`components/`, `hooks/`, `services/`) that scatter one feature across five directories.

- Strict domain encapsulation — a feature's internals stay inside its own folder, imported only through an explicit public surface.
- Business logic decoupled from UI layers, so a component swap didn't risk a logic change and vice versa.
- API design coordinated with the backend team up front, to keep data-fetching and type safety consistent across the boundary.

## Process

Ran under Agile engineering practices with CI/CD wired in from the start, aiming for fast, low-risk iteration rather than infrequent large releases.

## Result

**95% sprint completion rate** across the build, and — the actual point of the exercise — a measurable drop in the cognitive load of picking up someone else's feature.
