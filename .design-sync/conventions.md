# Fitn design system

Fitn is a **dark-mode fitness-tracker UI**. Components are compiled React
exports on `window.Fitn.*`; import them by name:
`import { Button, Card, Chip, MonthCalendar } from 'fitn'`.

## Setup — no provider, but design on a dark surface

No context/provider wrapper is required; every component is self-contained.
Two things must hold:

- **Load `styles.css`** (the token + component-style closure). Without it the
  components render unstyled.
- **Use a dark app background.** Components are built for the dark surface
  `var(--color-bg)` (#0F0F1B) with light text. On a white background, `ghost`
  and `outline` buttons and secondary text become invisible. Set your page/root
  background to `var(--color-bg)`.

Fonts (Lato body, Passion One headlines) load at runtime via `styles.css`.

## Styling idiom — CSS-variable tokens, styled via props

There are **no utility classes** to apply. Style the components through their
**props**, and style your own layout glue with the DS's **`var(--*)` tokens**:

- Surfaces: `--color-bg`, `--color-bg-elevated`, `--color-card`, `--color-field`
- Borders: `--color-border` (hairline), `--color-border-strong`
- Accent / status: `--color-accent` (#A64D79), `--color-positive` (#A6C156),
  `--color-negative` (#AE1C4D), `--color-error` (#D40B38)
- Text: `--text-primary`, `--text-secondary`, `--text-dulled`
- Radius: `--radius-sm` (10px), `--radius-md` (12px), `--radius-lg` (15px),
  `--radius-pill`
- Type: `--font-body` (Lato), `--font-display` (Passion One)
- Motion: `--ease-out`, `--dur-fast`, `--dur-base`

Component APIs (full props in each `<Name>.prompt.md` / `<Name>.d.ts`):

- **Button** — `variant` (`primary` | `outline` | `ghost` | `positive` |
  `danger`), `size` (`sm` | `md` | `lg` | `pill`), `full`, `icon` / `iconRight`
  (an icon component), `onClick`, children.
- **Card** — `glass`, `interactive`; forwards `style` / `onClick` / `className`
  to its element. Add your own padding.
- **Chip** — `selected`, `onClick`, children. A small selectable token.
- **MonthCalendar** — `year`, `month` (0-indexed), `workoutDays` (`number[]`
  rendered as filled rings).

## Where the truth lives

Read `styles.css` and its imports (tokens are the `:root` block of the bundled
CSS) before choosing colors/spacing; read each component's `.prompt.md` for
usage.

## Build snippet

```tsx
import { Card, Button } from 'fitn'

<div style={{ background: 'var(--color-bg)', padding: 16, fontFamily: 'var(--font-body)' }}>
  <Card style={{ padding: 16 }}>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', margin: 0 }}>
      Leg Day
    </p>
    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 12px' }}>
      5 exercises
    </p>
    <Button variant="primary" full>Start workout</Button>
  </Card>
</div>
```
