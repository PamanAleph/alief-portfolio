---
type: "writing"
title: "Separation of Files vs Separation of Concerns: Evolution to Feature-Based Architecture in React"
description: "Why grouping React code by type (components/hooks/services) is Separation of Files, not Separation of Concerns — and what a feature-based structure fixes."
date: 2025-11-24
tags: ["React", "TypeScript", "Frontend Architecture"]
---

Scaling a frontend app usually starts the same way: a `components/` folder, a `hooks/` folder, a `services/` folder, a `types/` folder. It looks organized. It isn't — it's Separation of Files wearing the costume of Separation of Concerns.

Full article originally published on Medium: [Separation of Files vs Separation of Concerns: Evolution to Feature-Based Architecture in React](https://medium.com/@aliefbuscode/separation-of-files-vs-separation-of-concerns-evolution-to-feature-based-architecture-in-react-b83f0ee55553)

## The illusion of organization

Grouping by type creates context-switching fatigue. Touch the Login feature and you're jumping across five unrelated directories:

- `pages/LoginPage.tsx`
- `components/LoginForm.tsx`
- `hooks/useAuth.tsx`
- `services/authService.ts`
- `types/authTypes.ts`

None of those files know about each other by folder — only by import path. That's not Separation of Concerns. It's Separation of Files.

## Embracing colocation

The fix is organizing by business domain instead of file extension:

```
src/
  /navigation/
  /shared
    |- components/
    |- types/
    |- utils/
    |- context/
    |- constant/
  /features/auth
    |- components/
    |- services/
    |- hooks/
    |- validation/
    |- types/
    |- pages/
    |- utils/
    |- constant/
    |- context/
```

## Why this structure holds up

**Reduced cognitive load.** Open `features/auth` and everything relevant to auth is right there — no unrelated features to filter out.

**The delete-ability test.** Removing a feature means deleting one folder. Dead code doesn't linger scattered across five directories waiting to be found.

**Smart components stay contained.** Colocating fetching logic and state with the components that use it keeps re-render cascades local instead of rippling up through the whole app.

## The trade-offs

**"Where do I put this?"** Start everything inside the feature folder. Only promote a piece to `shared/` once a second feature actually needs it. Premature abstraction is the root of all evil.

**Circular dependencies.** Enforce the rule strictly: features can import from shared, shared never imports from features, and Feature A never reaches directly into Feature B.

**Long import paths.** Solved with `tsconfig.json` path aliases — `@features/*`, `@shared/*` — so imports stay short without breaking the boundary.

## Framework agnostic by design

Because business logic lives in `src/features` as plain React/TypeScript, the same structure survives a framework swap — React Native (Expo), React (Vite), Next.js App Router. Routing changes; the features don't.

## The test

Grouping by file type satisfies the itch for visual order. Grouping by feature satisfies the actual engineering need: maintainability.

The question that settles it: if I delete this feature tomorrow, how many folders do I have to open? If the answer is more than one, it's time to refactor.
