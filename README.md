# Wavelength

A minimal, immersive music player built with Next.js. Features a glassmorphism UI, rotating vinyl disc, per-track ambient color theming, and a slide-in queue drawer.

## Features

- **Vinyl disc** — rotates while playing, displays album artwork at center
- **Ambient theming** — background gradient and accent colors shift per track
- **Progress & volume sliders** — custom-built with drag-to-seek support
- **Queue drawer** — slides in from the right with a scrollable track list
- **Smooth animations** — powered by Framer Motion (spring physics, crossfades, scale interactions)
- **Glassmorphism card** — backdrop blur, noise texture overlay, subtle borders

## Stack

- [Next.js 14](https://nextjs.org) (App Router)
- [React 18](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tracks

Six demo tracks with per-track accent colors:

| Track | Artist | Album | Accent |
|-------|--------|-------|--------|
| Dissolve | Bonobo | Migration | Teal `#2dd4bf` |
| Circling | Four Tet | There Is Love In You | Orange `#fb923c` |
| Noctuary | Jon Hopkins | Music for Psychedelic Therapy | Purple `#a78bfa` |
| Holocene | Bon Iver | Bon Iver, Bon Iver | Blue `#60a5fa` |
| La Femme D'Argent | Air | Moon Safari | Emerald `#34d399` |
| Tripoli | Com Truise | Iteration | Pink `#f472b6` |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── PlayerCard.tsx    # Main card shell, ambient gradient, noise texture
│   ├── VinylDisc.tsx     # Rotating disc with groove gradient and album art
│   ├── TrackControls.tsx # Progress bar, volume slider, playback buttons
│   └── QueueDrawer.tsx   # Slide-in queue with track list
├── hooks/
│   └── usePlayer.ts      # Playback state (play/pause, seek, volume, queue)
└── lib/
    └── tracks.ts         # Track data and type definitions
```
