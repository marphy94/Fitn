# design-sync notes — Fitn

Fitn is a **Vite application**, not a packaged component library, and has **no
TypeScript**. The sync therefore runs the package shape in a synth-style mode
driven by a hand-written entry barrel.

## How this repo syncs

- **Entry barrel:** `.design-sync/entry.mjs` (committed). The four components
  are `export default`, which the converter's auto-synth (`export *`) skips, so
  the barrel re-exports them as named exports. It also `import`s
  `src/styles/tokens.css` so esbuild bundles the token `:root` block into
  `_ds_bundle.css` (the DS closure) — `copyTokens` does nothing here because the
  tokens live in `src/`, not a `tokensPkg`.
- **Build command (no library build exists):**
  ```
  node .ds-sync/package-build.mjs --config .design-sync/config.json \
    --node-modules ./node_modules --entry ./.design-sync/entry.mjs --out ./ds-bundle
  ```
  The driver (`resync.mjs`) takes the same `--entry`.
- **Scope:** core primitives only — `Button`, `Card`, `Chip`, `MonthCalendar`
  (pinned in `componentSrcMap`). App/router-bound components (`Screen`,
  `TabBar`, `PhoneFrame`) are intentionally excluded.
- **Props:** hand-written in `cfg.dtsPropsFor` (plain-JS components → the
  extractor emits empty bodies). Keep them in sync with the component sources.
- **Fonts:** Lato + Passion One load at runtime via a remote `@import` in
  `.design-sync/webfonts.css` (`cfg.cssEntry`); `cfg.runtimeFontPrefixes`
  suppresses `[FONT_MISSING]`. Keep the URL in step with `index.html`'s font
  link.

## Known render warns (triaged, non-blocking)

- `[DTS_REACT]` — `@types/react` isn't in the **repo** `node_modules` (JS app).
  Props are supplied via `dtsPropsFor`, so this is expected.
- Font-host warnings / informational CSS warns — expected (runtime fonts).

## Re-sync risks (watch-list)

- **Font rendering in the render check is not verified.** The sandbox blocks the
  remote font host, so review screenshots show a **fallback** font, not
  Lato/Passion One. Colors/spacing/tokens ARE verified. The real design
  environment loads the fonts. Don't chase the fallback as a bug.
- **`dtsPropsFor` can silently rot** if a component's props change in source —
  it's a hand-written copy. Re-check the four bodies against the `.jsx` on
  re-sync.
- **`conventions.md` token/prop names** are validated against the build at sync
  time; if tokens are renamed in `src/styles/tokens.css`, re-validate the header.
- **Scope drift:** only 4 components are synced. New primitives worth sharing
  must be added to `componentSrcMap` + the entry barrel + `dtsPropsFor`.
