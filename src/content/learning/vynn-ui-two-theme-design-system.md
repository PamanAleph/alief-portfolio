---
type: "writing"
title: "Vynn UI: Building a Design System with Two Deliberately Opposite Themes"
description: "Why I built a token-driven React design system with two themes that pull in opposite directions — Classic and Neobrutalism — and how the token pipeline, component templates, and the theme conflict itself became the real proof of the architecture."
date: 2026-08-06
tags: ["Design Systems", "React", "TypeScript", "Tailwind CSS", "Component Architecture"]
---

Most component libraries give you one visual language. Want a genuinely different look — not just a new accent color, but different border weight, different shadow physics, different press behavior — and the usual answer is fork it or rewrite it. I wanted to prove that doesn't have to be true: one set of React components, two visual identities that actively pull against each other, with the components themselves never knowing which theme is active.

That's Vynn UI — a monorepo design system with a Classic theme and a Neobrutalism theme, built on Base UI, Tailwind CSS v4, and a three-tier token pipeline.

## The split: four packages before a single component

Before writing any component, the repo split into `@vynn/tokens` (pure CSS custom properties, no React), `@vynn/styles` (the bridge from tokens into Tailwind's utility layer), `@vynn/utils`, and `@vynn/ui` (the components, depending on all three).

The split enforces a rule: components are never allowed to write a raw visual value — a hex code, a px shadow — directly. Everything routes through a token. Break that rule once and runtime theme-switching quietly stops working.

## A three-tier token pipeline, not a flat one

**Tier 1 — primitive palette** (`tokens/src/colors.css`), raw values, theme-unaware:

```css
--gray-200: #e4e4e2;
--yellow-400: #ffd23f;
--ink: #121212;
```

**Tier 2 — semantic tokens**, scoped per theme, aliasing tier 1:

```css
[data-theme="classic"] {
  --color-border-default: var(--gray-200);
}
[data-theme="neobrutalism"] {
  --color-border-default: var(--ink);   /* not gray — solid black */
}
```

**Tier 3 — role tokens** (`component-tokens.css`), the only layer components are allowed to consume:

```css
[data-theme="neobrutalism"] {
  --role-control-shadow: var(--shadow-sm);
  --role-press-transform: translate(3px, 3px);   /* classic: scale(0.98) */
}
```

The comment left in that file states the rule plainly: role tokens exist so every component family — Button, Card, Dialog, Input — inherits consistent treatment without redefining bg/border/radius/shadow per component. Components consume tier 3 only. Never tier 1 or 2 directly.

The harder problem wasn't the CSS — it was wiring it into Tailwind v4. Tailwind's `@theme inline` resolves at build time, which is exactly wrong for a runtime `[data-theme]` switch. Using plain `@theme` instead keeps the values as real CSS variables, resolved in the browser against whichever element carries `data-theme`. Get that one directive wrong and the entire "switch themes without a rebuild" premise collapses.

## Three templates, so component 45 isn't slower than component 5

Fifty components can't each be designed from scratch. Every component gets classified before it's written:

**Template A** — custom compound components, no external primitive (`Table`, `Breadcrumb`, `Sidebar`, `Pagination`), for structure that doesn't need heavy interaction behavior.

**Template B** — compound components wrapping a Base UI primitive, for anything needing real accessibility behavior. `Dialog` is a direct example:

```tsx
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';

function DialogContent({ className, ...props }: React.ComponentProps<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Popup
      className={cn(
        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[90vw]',
        'bg-surface border-overlay border-border rounded-surface shadow-overlay-role p-card-padding',
        className
      )}
      {...props}
    />
  );
}
```

Base UI owns focus management, portals, escape-to-close. Vynn UI only attaches token-driven classNames on top — behavior is never reimplemented, only restyled.

**Template C** — atomic, single-purpose, no sub-components (`Badge`, `Input`, `Switch`, `Label`).

Classifying first means adding a new component is a lookup, not a design decision made from scratch every time.

## What actually broke

Two failure modes were real, not hypothetical.

**Token drift under volume.** Once components pile up, the temptation to add a component-specific token instead of reusing an existing role token grows — especially moving fast. The discipline that has to hold: check whether `--role-overlay-shadow` already covers it before inventing `--dialog-shadow`. Skip that check once and consistency starts cracking quietly, not loudly.

**Code that looked done wasn't.** Components got written and looked correct by inspection, but running Storybook for real surfaced install and build errors that never showed up while just writing code — and Tailwind v4 wasn't scanning `packages/react` or `apps/storybook` at all, so every utility class the components used simply wasn't being generated, until `@source` got fixed in `globals.css`. Writing components without ever running them is a way of lying to yourself about whether they work.

## Why Neobrutalism — not a trend pick, a stress test

Neobrutalism wasn't chosen because it's having a moment. It was chosen because it's the most extreme opposite of Classic on every axis that matters:

| Axis | Classic | Neobrutalism |
|---|---|---|
| Default border | `1px`, `--gray-200` | `2–4px`, `--ink` (solid black) |
| Shadow | soft, blurred — `0 1px 2px rgb(0 0 0 / 0.06)` | hard, no blur — `3px 3px 0 0 var(--ink)` |
| Press effect | subtle — `scale(0.98)` | explicit — `translate(3px, 3px)`, shadow collapses to `0 0 0 0` |
| Chip border | hairline | default weight — can't share one alias across themes |

That last row is the important one architecturally. It's called out directly in `styles/src/globals.css`:

```css
/* Chip border width picks a different source token per theme (hairline in
   classic, default in neobrutalism) — unlike the :root aliases above, this
   can't be a single theme-agnostic chain, so it's declared per theme. */
```

If the two themes only differed by color, every token could collapse into a single `:root` alias chain — easy, and it would prove nothing. Because Neobrutalism demands physically opposite values — thick instead of thin, hard instead of soft, `translate` instead of `scale` — some tokens are forced to be redeclared per theme rather than aliased once. That's precisely where the token system's real flexibility gets tested: not in the cases that happened to work, but in the cases that couldn't be faked. Neobrutalism exists to stress-test the claim "token-driven, theme-agnostic" — not to chase a look.
