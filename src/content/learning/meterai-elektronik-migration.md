---
type: "project"
title: "Meterai Elektronik frontend migration"
description: "PHP to Next.js, then Astro as a layout wrapper over the same React component architecture — 50% faster page loads, improved SEO."
date: 2025-03-01
org: "Percetakan Uang Republik Indonesia (GovTech)"
tags: ["Astro", "Next.js", "TypeScript"]
---

Peruri's Meterai Elektronik system — Indonesia's electronic stamp-duty platform — was running on a legacy PHP frontend. My job during the internship was to move it forward without breaking a system already in production use.

## Two-stage migration

1. **PHP → Next.js.** Rebuilt the frontend in Next.js with TypeScript, keeping the React component architecture the primary abstraction.
2. **Next.js → Astro layout wrapper.** A final pass swapped the routing/layout shell to Astro while keeping the same React components underneath — Astro's islands model meant most of the page shipped zero JS, only the interactive parts hydrated.

## Alongside the migration

- Designed and shipped **60+ secure RESTful endpoints** (Express.js, PostgreSQL) protected with JWT and RBAC.
- Added strict input validation on both frontend and backend to cut down XSS and SQL-injection surface.
- Applied backend-level **data masking on NIK** (Indonesian National ID) fields by role, plus centralized error masking to stop debug traces leaking PII.
- Deployed to VMs via SSH, with Docker + Portainer for orchestration and CI/CD for release.

## Result

**50% faster page loads**, better SEO from server-rendered routes, and a **40%** lift in frontend scalability headroom — with API-related bug reports down **65%** during QA once the new endpoints landed.
