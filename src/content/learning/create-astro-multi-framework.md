---
type: "project"
title: "create-astro: An Open-Source CLI and Multi-Framework Astro Template"
description: "Open-source Astro starter kit — a React or Vue template plus an interactive CLI published to npm as @pamanaleph/create-astro that scaffolds it in one command."
date: 2026-10-26
org: "Open source"
links:
  - label: "npm"
    url: "https://www.npmjs.com/package/@pamanaleph/create-astro"
  - label: "CLI on GitHub"
    url: "https://github.com/PamanAleph/create-astro"
  - label: "Template on GitHub"
    url: "https://github.com/PamanAleph/astro-multi-framework-template"
tags: ["Open Source", "CLI", "Astro", "TypeScript", "npm"]
---

One open-source project in two repositories: a production-ready Astro template with a choice of UI framework, and `@pamanaleph/create-astro`, the CLI that scaffolds it. Both are MIT licensed.

## The template

[astro-multi-framework-template](https://github.com/PamanAleph/astro-multi-framework-template) holds React and Vue presets, each built on Astro with TypeScript and Tailwind CSS v4.

- **Feature-based structure.** Code is organized by domain, with clear boundaries between UI, logic, and data.
- **SSR and API routes.** Server-side rendering with the Node.js adapter, plus example REST routes for a todos resource (GET, POST, PUT, PATCH, DELETE).
- **Quality tooling.** Strict TypeScript, ESLint, Prettier, Husky with lint-staged, and Vitest with Testing Library or Vue Test Utils.

## The CLI

[@pamanaleph/create-astro](https://www.npmjs.com/package/@pamanaleph/create-astro) is an interactive initializer, not just a template copier.

- **Guided or scripted.** It prompts for project name, framework (React or Vue), package manager (pnpm, npm, or yarn), and whether to include API routes. Flags such as `--framework`, `--api`, and `-y` skip every prompt for CI use.
- **Fast scaffolding.** It streams the template subfolder from GitHub as a tarball and falls back to `git clone` if that fails. `--ref` pins a branch, tag, or commit.
- **Clean output.** A `.templateignore` file strips template-only files such as workflows and docs, and a BOM sanitizer removes UTF-8 byte-order marks that cause cross-platform bugs.

```bash
npm create @pamanaleph/astro@latest
```

## Why I built it

Every new Astro project started with the same hour of setup: framework wiring, lint rules, folder conventions. This turns that hour into one command, with the architecture I use in production already in place.
