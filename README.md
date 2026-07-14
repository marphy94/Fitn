# Fitn

A dark-mode fitness tracking app built with React, inspired by modern Apple
design principles — a blend of Apple Fitness, Notion Calendar, Linear, Strong
and the *Gentler Streaks* aesthetic.

This first step scaffolds the **design system** and all **8 screens**. The
screens are dressed with placeholder content; real state and persistence come
in the next step.

## Screens

| Route | Screen | Notes |
| --- | --- | --- |
| `/` | Home | Greeting, next workout, month calendar, last-workout results |
| `/plans` | Fitness Plans | List of plans + exercise library entry (Workout tab) |
| `/plans/:id/edit` | Edit Fitness Plan | Drag-to-reorder items, bottom add bar |
| `/exercises` | Create Exercises | Exercise list with edit / delete |
| `/exercises/:id/edit` | Edit Exercise | Name field + muscle-group chips |
| `/rest` | Rest Timer | Full-screen countdown with progress ring |
| `/workout` | Workout | Live session: sets, rest blocks, up-next |
| `/statistics` | Statistics | Range selector, volume chart, personal records |

## Design system

Tokens live in [`src/styles/tokens.css`](src/styles/tokens.css).

- **Surfaces** — background `#0F0F1B`, cards `#17151F`
- **Borders** — hairline `rgba(255,255,255,0.08)` (borders over shadows)
- **Accent** `#A64D79` · **Positive** `#A6C156` · **Negative** `#AE1C4D`
- **Text** — primary `#FFFFFF`, secondary `#A6A6B3`, dulled `#72727F`
- **Type** — body *Lato*, headlines *Passion One*
- **Radius** 10–15px · glass effects · smooth motion (framer-motion)
- **Haptics** — [`src/lib/haptics.js`](src/lib/haptics.js) abstracts iOS
  impact/notification feedback (native bridge with a web Vibration fallback)

Reusable primitives (`Card`, `Button`, `Chip`, `Screen`, `TabBar`,
`PhoneFrame`) live in [`src/components`](src/components).

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the build
```

On desktop the app renders inside a phone frame; on a phone-sized viewport it
fills the screen edge to edge.
