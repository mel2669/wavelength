# Wavelength — Development History

A record of how this project evolved from initial scaffolding to its current state, including the design system work that preceded it.

---

## Phase 0 — Design System Audit & Figma Extraction (wavelength/, ~Mar 13–18, 2026)

Before any features were iterated on, a structured Figma design system extraction workflow was run against the initial codebase. This work lived in the `wavelength/` directory and produced a complete record of every design decision in the app.

### Step 1 — Codebase Audit

A full audit of the codebase was written to `figma-audit.md`. It catalogued:

**All components with exact dimensions, states, and spacing:**
- `PlayerCard` — 440px wide, `p-7` padding, `blur(28px) saturate(180%)` backdrop, spring entry animation
- `VinylDisc` — ~288px diameter, paused/playing states, groove gradient, spindle, artwork circle
- `TrackControls` — progress bar (3px track, 12px thumb), volume slider (10px thumb), playback buttons
- `QueueDrawer` — 320px wide, full-height, `blur(32px)`, spring slide animation (stiffness 280, damping 30)
- All 9 inline SVG icons (Queue, Close, NowPlaying, Prev, Next, Play, Pause, VolumeHigh, VolumeLow)

**Complete design token inventory:**
- 27 color styles: 4 background tokens, 15 white-opacity steps (`white/02` through `white/55`), 6 accent presets, 2 vinyl tones
- 11 text styles: 2 headings, 2 body, 7 labels — mapped to exact Tailwind classes
- 7 effect/elevation styles: card, vinyl, play button, slider thumb, track glow, spindle, art ring

**Typography:**
- Font: Inter (weights 300–700), later replaced with Bricolage Grotesque in v0.2
- Track title: `text-xl` / semibold; Artist: `text-sm` / medium; Album: `text-xs` / regular

**Spacing:** Full 4px grid mapping (Tailwind 0.5 → 7, covering all padding, gap, and margin values in use)

### Steps 2–3 — Figma File Build (Figma file: "Wavelength 2", key `8BvqRs3gNA6aFcDtntMmAM`)

The Figma design system was built out across multiple sessions:

**Step 2 — Token Styles:**
- Created Figma file with 5 pages: `🎨 Tokens`, `🧩 Components`, `📄 Home Player`, `📄 Loading States`, `📄 Empty States`
- 27 color styles, 11 text styles, 7 effect styles — all named semantically and linked to local Figma styles (no hardcoded values)
- Color swatch frame and typography specimen frame on the Tokens page

**Steps 3a–3c — Component Library:**

All primitive, icon, and composite components built as Figma components with Auto Layout, local styles, and variant sets:

| Component | Variants |
|---|---|
| Button/Queue Toggle | Default, Active |
| Button/Playback Prev | Default, Hover |
| Button/Playback Next | Default, Hover |
| Button/Playback Play-Pause | Play, Pause |
| Button/Queue Close | Default, Hover |
| Button/Queue Track Item | Default, Active |
| Slider/Progress Bar | Default, Hover |
| Slider/Volume | Default, Hover |
| Icon/Queue, Close, NowPlaying, Prev, Next, Play, Pause, VolumeLow, VolumeHigh | Single each |
| Artwork/Vinyl Center | Single |
| Artwork/Queue Thumbnail | Single |
| NowPlaying Indicator | Single |
| Backdrop/Overlay | Single |
| Ambient/Gradient | Single |
| Noise/Texture | Single |
| VinylDisc | Paused, Playing |
| TrackControls | Single (composite) |

**Known issues logged:**
- `elevation/play-btn` and `elevation/track-glow` reference teal as placeholder — runtime-dynamic
- Play/Pause gradient background has no style token (accent is runtime-dynamic)
- Queue Track Item accent bar uses absolute positioning by design (edge-anchored)

**Next planned step at time of branch:** Step 3d — Composite Components (QueueDrawer, PlayerCard full assembly)

---

## v0.1 — Initial Commit (Mar 18, 2026)

The first commit in `wavelength2/` established the full structural foundation. Despite being an "initial" commit, it shipped a largely complete UI shell informed by the Figma audit above.

**What was built:**

- `PlayerCard` — glassmorphism card with backdrop blur, noise texture overlay, and ambient per-track background gradient
- `VinylDisc` — rotating disc with album artwork at center, groove gradient, and specular highlight
- `TrackControls` — progress bar with drag-to-seek, volume slider, and playback buttons (prev / play-pause / next) all built custom (no `<input type="range">`)
- `QueueDrawer` — slide-in drawer from the right with scrollable track list and active track highlight
- `usePlayer` hook — playback state management (play/pause, seek, volume, track switching, queue)
- `tracks.ts` — six CC-licensed tracks from Internet Archive, each with an `accentColor` driving theming throughout the UI
- Full Framer Motion animation layer: spring-physics button interactions, crossfade track transitions, scale/opacity enter animations on card mount
- Tailwind config extended with a custom `rounded-4xl` (72px) border-radius token

The UI was designed at 440px card width. All spacing follows a 4px grid.

---

## v0.2 — Real Audio Playback, DJ Scratching & UI Polish (Mar 22, 2026)

Upgraded from a static/mock UI to a fully functional audio player.

**Audio:**
- Wired `HTMLAudioElement` into `usePlayer` for real playback of the CC-licensed MP3s hosted on archive.org
- `crossOrigin="anonymous"` set on the audio element for Web Audio API compatibility with cross-origin streams
- Progress and time tracking via `timeupdate` events; auto-advance to next track on `ended`

**DJ Scratch gesture:**
- Dragging the vinyl disc triggers a scratch effect via `playbackRate` manipulation
- Forward drag: proportional speed-up (`playbackRate` scales with delta)
- Backward drag: stutter effect — plays at 2× forward while seeking the position back each frame, replicating the characteristic scratch sound without reversing the buffer

**UI polish:**
- Bricolage Grotesque font loaded via `next/font/google` (replaced Inter from the original design spec)
- Mouse-tracking border glow on the player card (Stripe-style radial gradient follows cursor position via `useMotionValue` + `useMotionTemplate`)
- Rotating groove shimmer and fixed specular highlight rings on the vinyl disc
- All slider and button hit areas expanded to 40px minimum for accessibility
- Progress bar thumb scales up on hover/drag with spring animation

---

## v0.3 — Frequency Visualizer & Web Audio API (Mar 23, 2026)

Added a real-time audio visualizer flanking the vinyl disc.

**Changes:**
- `FrequencyVisualizer` component — two mirrored columns of bars (left and right of the vinyl) that animate in real time using FFT frequency data
- `AnalyserNode` wired into `usePlayer` (`fftSize: 64`, `smoothingTimeConstant: 0.8`) and passed down through `PlayerCard → VinylDisc → FrequencyVisualizer`
- The analyser is lazily initialized on first user interaction (required by browser autoplay policy) and reused for the lifetime of the session
- Album art `AnimatePresence` refactored to animate the outer rounded container directly for a cleaner crossfade

---

## v0.4 — Playback Controls Reveal Animation (Mar 24, 2026)

The skip (prev/next) buttons were made hidden by default and revealed on hover with a coordinated animation.

**Behavior:**
- At rest, prev and next buttons are invisible (`opacity: 0`) and positioned overlapping the play button
- On hover of the controls area, they animate outward to their natural positions — a combined fade-in and slide
- On mouse leave, the animation reverses

**Animation details:**
- Initial approach used a spring, then refined to a tween for a gentler feel
- Final: per-property transitions — opacity fades in over 0.18s on a fast ease-in (`[0.4, 0, 1, 1]`); position drifts out over 0.42s on an expo-out curve (`[0.16, 1, 0.3, 1]`)
- Travel distance: 22px — subtle enough that the fade dominates; the movement is a whisper, not a slide
- `pointerEvents` disabled while hidden to prevent accidental clicks

---

## v0.5 — Like & Share Buttons (Mar 24, 2026)

Added two secondary action buttons that participate in the same hover reveal as the skip buttons.

**Layout:** `[Like] [Prev] [Play] [Next] [Share]`

- Like button (outlined heart SVG) — left of Prev, animates in from right using `custom={1}`
- Share button (outlined share SVG) — right of Next, animates in from left using `custom={-1}`
- Both use identical `skipVariants` / `skipTransition` as the skip buttons for visual consistency
- Outlined stroke style (`fill="none"`, `stroke="currentColor"`) keeps them visually lighter than the filled transport icons
- Slightly dimmer resting color (`text-white/50`) to sit a step below Prev/Next in hierarchy

---

## v0.6 — Waveform Progress Bar (Mar 24, 2026)

Replaced the flat progress bar with a waveform visualization.

**Initial implementation (seeded placeholder):**
- 72 vertical bars of varying height replace the single filled track
- Heights generated by a seeded LCG (linear congruential generator) keyed to `track.id`, smoothed with a 5-sample moving average to look like real audio energy
- Each track gets a unique, stable waveform shape
- Two-layer rendering: dim base layer (`rgba(255,255,255,0.15)`) + accent color layer clipped by `clip-path: inset(0 ${100 - progress}% 0 0 round 1px)` — the clip shrinks left-to-right as playback progresses

**Upgraded to real audio waveform (`useWaveform` hook):**
- Fetches the full audio file, decodes it via `OfflineAudioContext.decodeAudioData()` (no user gesture required)
- Computes RMS amplitude across 72 equal blocks of the decoded PCM data
- Normalized to a 0.05–1.0 range so quiet passages still have a visible bar
- Module-level `Map` cache — each track decodes at most once per session
- Seeded fallback renders instantly while decoding; replaced seamlessly when real data arrives

---

## v0.7 — Waveform Refinements (Mar 24, 2026)

A series of visual polish passes on the waveform bar.

**Height tuning:** `h-12` (48px) → `h-[34px]` (30% reduction per request) → `h-10` (40px, matched to skip button height for rhythm) → `h-[25px]` (final, slender and proportional to the card)

**Edge fade:**
- CSS `mask-image` linear gradient fades the waveform from transparent → opaque over the first 8% of width, and back out over the last 8%
- Applied as a mask on the container so both dim and accent layers blend into the background identically

**Opacity at rest:**
- Waveform renders at `opacity: 0.4` by default
- Animates to `opacity: 1.0` on hover or during drag (400ms ease)
- `isDragging` keeps it fully visible while seeking even if the cursor leaves the element

**Track change transition:**
- Both bar layers wrapped in `AnimatePresence mode="wait"` with `key={trackId}`
- Old waveform fades out (350ms), new one fades in — clean crossfade, no jarring swap

---

## Current Feature Summary

| Feature | Details |
|---|---|
| Audio playback | Real `HTMLAudioElement` with Web Audio API routing |
| Tracks | 6 CC-licensed tracks from Internet Archive, each with an accent color |
| Vinyl disc | Rotates while playing; DJ scratch gesture via `playbackRate` manipulation |
| Frequency visualizer | Real-time FFT bars flanking the vinyl, powered by `AnalyserNode` |
| Waveform progress bar | Real RMS-decoded waveform per track; clip-path fill; edge fade; opacity at rest |
| Playback controls | Play/pause pill, skip buttons with hover-reveal animation |
| Like / Share | Outlined icon buttons that reveal alongside the skip buttons |
| Volume slider | Custom drag slider with spring thumb animation |
| Queue drawer | Slide-in drawer with scrollable track list |
| Theming | Per-track `accentColor` drives gradient, waveform fill, sliders, and glow |
| Card | Glassmorphism with backdrop blur, noise texture, and mouse-tracking border glow |
| Figma design system | Complete component library and token system in Figma (file: "Wavelength 2") |

---

## Stack

- [Next.js 14](https://nextjs.org) — App Router
- [React 18](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/) — all animation
- [Tailwind CSS](https://tailwindcss.com)
- Web Audio API — `AnalyserNode` for visualizer, `OfflineAudioContext` for waveform decode
- TypeScript

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Font loading (Bricolage Grotesque), global styles
│   ├── page.tsx                 # Root — renders PlayerCard
│   └── globals.css              # Tailwind base + custom utilities
├── components/
│   ├── PlayerCard.tsx           # Card shell, ambient gradient, mouse glow, queue toggle
│   ├── VinylDisc.tsx            # Rotating disc, scratch gesture, FrequencyVisualizer mount
│   ├── TrackControls.tsx        # Waveform bar, playback buttons, volume slider, like/share
│   ├── FrequencyVisualizer.tsx  # Real-time FFT bar columns
│   └── QueueDrawer.tsx          # Slide-in track queue
├── hooks/
│   ├── usePlayer.ts             # All playback state: audio element, Web Audio, scratch
│   └── useWaveform.ts           # Fetch → decode → RMS sample → cache per track
└── lib/
    └── tracks.ts                # Track metadata and type definitions
```

---

## Related

- `wavelength/` — original project directory; contains `figma-audit.md` (full design token inventory), `figma-extraction-prompt.md` (multi-session Figma workflow guide), and `figma-progress.md` (component build log)
