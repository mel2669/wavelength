# Figma Audit — Wavelength Music Player
*Generated: 2026-03-13 | Step 1 — Do not overwrite*

---

## 1. Pages & Routes

### Home Page (`/`)
- **Route Path**: `/`
- **Display Name**: Wavelength Music Player
- **Layout Structure**: Full-screen centered player card with ambient animated background
- **Viewport**: No explicit breakpoints; card is 440px wide, `max-width: calc(100vw - 2rem)`

**UI States**:
| State | Description |
|-------|-------------|
| Default (Paused) | Vinyl disc visible, play button shown, progress bar static |
| Playing | Vinyl disc rotates (~8s/revolution), play→pause button, progress bar animates |
| Queue Open | Right drawer slides in from right edge; dark semi-transparent backdrop covers main content |
| Queue Closed | Drawer hidden, player card centered |
| Track Change | Smooth crossfade on track title / artist / album; ambient gradient color transitions (1.4s) |
| Volume Adjustment | Volume slider thumb scales up on hover/drag |
| Progress Seeking | Progress bar thumb scales up on hover/drag |

**Components on Page**:
- PlayerCard (wrapper)
- VinylDisc
- TrackControls (contains ProgressBar, VolumeSlider, playback buttons)
- QueueDrawer

---

## 2. Component Inventory

### PRIMITIVES

#### Button — Queue Toggle
- **File**: `src/components/PlayerCard.tsx` (lines 90–108)
- **Variants**: Default | Active (queue open)
- **States**: Default | Hover (scale 1.08) | Tap (scale 0.9)
- **Dimensions**: `px-4 py-2` (16px × 8px padding), `rounded-xl` (12px)
- **Typography**: `text-xs font-medium` (12px / 500)
- **Colors**:
  - Default: `text-white/40`, transparent background
  - Active: text = `accentColor`, background = `${accentColor}14`
- **Children**: QueueIcon (18×18px) + "Queue" text, `gap-2` (8px)

#### Button — Playback Previous
- **File**: `src/components/TrackControls.tsx` (lines 256–265)
- **States**: Default | Hover (scale 1.08, text-white) | Tap (scale 0.88)
- **Dimensions**: `p-2` (8px), icon 20×20px
- **Colors**: Default `text-white/60`, hover `text-white`

#### Button — Playback Play/Pause
- **File**: `src/components/TrackControls.tsx` (lines 268–287)
- **States**: Play icon (paused) | Pause icon (playing) | Tap (scale 0.9) | Icon crossfade animation
- **Dimensions**: `w-14 h-14` (56×56px), `rounded-full`
- **Colors**: Background `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)`
- **Shadow**: `0 4px 20px ${accentColor}55`
- **Icon**: 26×26px, white

#### Button — Playback Next
- **File**: `src/components/TrackControls.tsx` (lines 290–299)
- **States**: Default | Hover (scale 1.08, text-white) | Tap (scale 0.88)
- **Dimensions**: `p-2` (8px), icon 20×20px
- **Colors**: Default `text-white/60`, hover `text-white`

#### Button — Queue Close
- **File**: `src/components/QueueDrawer.tsx` (lines 81–88)
- **States**: Default | Hover (scale 1.1, text-white/80, bg-white/5) | Tap (scale 0.9)
- **Dimensions**: `p-1.5` (6px), `rounded-lg` (8px), icon 18×18px
- **Colors**: Default `text-white/40`

#### Button — Queue Track Item
- **File**: `src/components/QueueDrawer.tsx` (lines 96–174)
- **States**: Default | Hover (bg rgba(255,255,255,0.04)) | Active/Current (bg rgba(255,255,255,0.06)) | Tap (scale 0.98)
- **Dimensions**: Full width, `py-2.5 px-4` (10px × 16px)
- **Children**: Accent bar (2×auto, colored) | Artwork thumbnail (40×40px) | Track info | Duration or NowPlayingIcon
- **Gap**: `gap-3` (12px)

#### Slider — Progress Bar
- **File**: `src/components/TrackControls.tsx` (lines 86–160)
- **Dimensions**: `h-[3px]`, full width
- **Colors**: Track `rgba(255,255,255,0.1)`, filled `accentColor`, thumb white
- **Thumb**: `w-3 h-3` (12×12px), `rounded-full`
- **States**: Default (thumb scale 1) | Hover/Dragging (thumb scale 1.5)
- **Children**: Time display below (current / total)

#### Slider — Volume Control
- **File**: `src/components/TrackControls.tsx` (lines 170–220)
- **Dimensions**: `w-32` (128px), `h-[3px]`
- **Colors**: Track `rgba(255,255,255,0.1)`, filled `accentColor`, thumb white
- **Thumb**: `w-2.5 h-2.5` (10×10px), `rounded-full`
- **States**: Default (thumb scale 1) | Hover (thumb scale 1.4)
- **Children**: VolumeIcon (14×14px) | slider | VolumeHighIcon (14×14px)

---

### DISPLAY

#### VinylDisc
- **File**: `src/components/VinylDisc.tsx`
- **Dimensions**: ~600px diameter (desktop)
- **States**: Paused (static) | Playing (rotation animation, ~8s per revolution)
- **Children**:
  - Vinyl groove gradient (radial, simulated grooves)
  - Ambient glow (blurred circle behind disc)
  - Album artwork (circular center, ~48% of disc diameter)
  - Spindle hole
  - Label edge ring

#### Album Artwork — Vinyl Center
- **File**: `src/components/VinylDisc.tsx` (lines 109–115)
- **Dimensions**: Circular, ~48% of disc size
- **Shape**: `rounded-full`
- **Animation**: Scale 0.75→1 + fade on track change
- **Implementation**: Next.js `Image` with `fill`, `unoptimized`

#### Album Artwork — Queue Thumbnail
- **File**: `src/components/QueueDrawer.tsx` (lines 135–141)
- **Dimensions**: 40×40px, `rounded-md` (6px)
- **States**: Default | Active (shadow `0 0 12px ${accentColor}55`)
- **Implementation**: Next.js `Image` with `fill`, `unoptimized`

#### NowPlaying Indicator
- **File**: `src/components/QueueDrawer.tsx` (lines 21–27)
- **Type**: SVG icon (music note)
- **Dimensions**: 14×14px
- **Color**: `accentColor` (track-specific)
- **Shown**: In place of duration when track is active

---

### ICONS (SVG, inline)

| Icon | File | Size | Color |
|------|------|------|-------|
| Queue | PlayerCard.tsx (9–15) | 18×18 | Inherits |
| Close (X) | QueueDrawer.tsx (13–19) | 18×18 | Inherits |
| Now Playing | QueueDrawer.tsx (21–27) | 14×14 | accentColor |
| Previous | TrackControls.tsx (16–22) | 20×20 | Inherits |
| Next | TrackControls.tsx (24–30) | 20×20 | Inherits |
| Play | TrackControls.tsx (32–38) | 26×26 | Inherits |
| Pause | TrackControls.tsx (40–46) | 26×26 | Inherits |
| Volume Low | TrackControls.tsx (48–60) | 14×14 | text-white/40 |
| Volume High | TrackControls.tsx (62–74) | 14×14 | text-white/40 |

---

### LAYOUT

#### PlayerCard
- **File**: `src/components/PlayerCard.tsx` (lines 44–111)
- **Dimensions**: 440px wide, `p-7` (28px padding), `rounded-3xl` (24px)
- **Background**: `rgba(255,255,255,0.035)` glassmorphism
- **Border**: `1px solid rgba(255,255,255,0.08)`
- **Backdrop filter**: `blur(28px) saturate(180%)`
- **Shadow**: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04) inset`
- **Entry animation**: opacity 0→1, y 32→0, scale 0.96→1 (spring)
- **Children**:
  - Ambient gradient background
  - Noise texture overlay
  - VinylDisc
  - Track info section (`min-h-[72px]`)
  - TrackControls
  - Queue toggle button
  - Footer wordmark

#### QueueDrawer
- **File**: `src/components/QueueDrawer.tsx` (lines 60–178)
- **Dimensions**: `w-80` (320px), full viewport height, fixed right edge
- **Background**: `rgba(12,12,18,0.92)`
- **Backdrop filter**: `blur(32px)`
- **Border**: `1px solid rgba(255,255,255,0.07)` (left edge)
- **Layout**: Header (`px-5 py-5`) + scrollable list (`flex-1 overflow-y-auto`)
- **Animation**: x 100%→0 on open, spring (stiffness 280, damping 30, mass 0.9)

#### Backdrop Overlay
- **File**: `src/components/QueueDrawer.tsx` (lines 49–57)
- **Dimensions**: Fixed inset-0
- **Background**: `rgba(0,0,0,0.30)`
- **Backdrop blur**: `backdrop-blur-sm` (4px)
- **Animation**: Opacity 0→1 fade (0.25s)
- **Behavior**: Click-to-close

---

### BACKGROUND / DECORATIVE

#### Ambient Gradient
- **File**: `src/components/PlayerCard.tsx` (lines 25–31)
- **Style**: `radial-gradient(ellipse 70% 60% at 50% 45%, ${accentColor}18 0%, transparent 70%)`
- **Transition**: 1.4s, cubic `[0.25, 0.1, 0.25, 1]`

#### Noise Texture
- **File**: `src/components/PlayerCard.tsx` (lines 34–41)
- **Opacity**: 2.5%
- **Pattern**: 200×200px SVG procedural noise (repeated)

---

## 3. Design Tokens

### Colors

**Base Backgrounds**:
| Token Name | Value | Role |
|-----------|-------|------|
| `bg/page` | `#0A0A0F` | Page background |
| `bg/card` | `rgba(255,255,255,0.035)` | Glassmorphism card |
| `bg/drawer` | `rgba(12,12,18,0.92)` | Queue drawer |
| `bg/overlay` | `rgba(0,0,0,0.30)` | Backdrop overlay |

**White Opacity Scale**:
| Token Name | Value | Role |
|-----------|-------|------|
| `white/55` | `rgba(255,255,255,0.55)` | Artist name |
| `white/40` | `rgba(255,255,255,0.40)` | Queue button default, track count, artist |
| `white/35` | `rgba(255,255,255,0.35)` | Progress time display |
| `white/30` | `rgba(255,255,255,0.30)` | Album name, track duration |
| `white/15` | `rgba(255,255,255,0.15)` | Footer wordmark |
| `white/12` | `rgba(255,255,255,0.12)` | Range slider track |
| `white/10` | `rgba(255,255,255,0.10)` | Progress/volume track, card base |
| `white/08` | `rgba(255,255,255,0.08)` | Card border, spindle border |
| `white/07` | `rgba(255,255,255,0.07)` | Drawer left border |
| `white/06` | `rgba(255,255,255,0.06)` | Active queue item bg, card inset |
| `white/05` | `rgba(255,255,255,0.05)` | Button hover bg |
| `white/04` | `rgba(255,255,255,0.04)` | Queue item hover, card subtle |
| `white/035` | `rgba(255,255,255,0.035)` | Card glass bg |
| `white/025` | `rgba(255,255,255,0.025)` | Noise texture |
| `white/02` | `rgba(255,255,255,0.02)` | Vinyl highlights |

**Track Accent Colors** (dynamic, stored in `src/lib/tracks.ts`):
| Track | Accent Color | Hex |
|-------|-------------|-----|
| Bonobo — Dissolve | Teal/Cyan | `#2dd4bf` |
| Four Tet — Circling | Orange | `#fb923c` |
| Jon Hopkins — Noctuary | Purple | `#a78bfa` |
| Bon Iver — Holocene | Blue | `#60a5fa` |
| Air — La Femme D'Argent | Emerald | `#34d399` |
| Com Truise — Tripoli | Pink | `#f472b6` |

**Vinyl Disc Colors**:
| Token Name | Value | Role |
|-----------|-------|------|
| `vinyl/primary` | `#222222` | Groove color |
| `vinyl/secondary` | `#161616` | Deeper groove |

---

### Typography

**Font Family**: Inter (Google Fonts — weights 300, 400, 500, 600, 700)

| Style Name | Size | Weight | Color | Usage |
|-----------|------|--------|-------|-------|
| `heading/track-title` | 20px (text-xl) | 600 (semibold) | white | Track title |
| `body/artist` | 14px (text-sm) | 500 (medium) | white/55 | Artist name |
| `body/album` | 12px (text-xs) | 400 (regular) | white/30 | Album name |
| `heading/drawer` | 16px | 600 (semibold) | white | Queue drawer title |
| `label/queue-count` | 12px (text-xs) | 400 (regular) | white/40 | Track count |
| `label/queue-track-title` | 14px (text-sm) | 500 (medium) | white or white/75 | Queue item track |
| `label/queue-track-artist` | 12px (text-xs) | 400 (regular) | white/40 | Queue item artist |
| `label/duration` | 12px (text-xs) | 400 (regular) | white/30 | Track duration (tabular-nums) |
| `label/time` | 12px (text-xs) | 400 (regular) | white/35 | Progress time (tabular-nums) |
| `label/button` | 12px (text-xs) | 500 (medium) | Inherits | Queue button text |
| `label/wordmark` | 12px (text-xs) | 300 (light) | white/15 | Footer wordmark (tracking-[0.25em], uppercase) |

---

### Spacing Scale (Tailwind mapped)

| Tailwind | px | Usage |
|---------|-----|-------|
| 0.5 | 2px | Artist→album margin |
| 1 | 4px | — |
| 1.5 | 6px | Close button padding; slider gap |
| 2 | 8px | Control button padding |
| 2.5 | 10px | Queue item vertical padding |
| 3 | 12px | Queue item / control gaps |
| 4 | 16px | Queue item horizontal padding; control section gap |
| 5 | 20px | Drawer header padding; PlayerCard sub-spacing |
| 6 | 24px | Track info → controls margin |
| 7 | 28px | PlayerCard padding |

---

### Border Radius

| Value | Usage |
|-------|-------|
| `rounded-full` (50%) | Vinyl disc, artwork circles, slider thumbs, slider track |
| `rounded-3xl` (24px) | Player card |
| `rounded-xl` (12px) | Queue toggle button |
| `rounded-lg` (8px) | Queue close button |
| `rounded-md` (6px) | Queue track artwork thumbnail |

---

### Shadows / Elevation

| Name | Value | Applied To |
|------|-------|-----------|
| `elevation/card` | `0 32px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04) inset` | Player card |
| `elevation/vinyl` | `0 8px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)` | Vinyl disc |
| `elevation/play-btn` | `0 4px 20px ${accentColor}55` | Play/pause button (accent-driven) |
| `elevation/thumb` | `shadow-md` | Slider thumb |
| `elevation/track-glow` | `0 0 12px ${accentColor}55` | Active queue track artwork |
| `elevation/spindle` | `0 0 0 1px rgba(255,255,255,0.08)` | Spindle hole |
| `elevation/art-ring` | `0 0 0 1px rgba(255,255,255,0.06)` | Vinyl album art border |

---

### Backdrop Filters

| Usage | Value |
|-------|-------|
| Player card | `blur(28px) saturate(180%)` |
| Queue drawer | `blur(32px)` |
| Backdrop overlay | `blur(4px)` (backdrop-blur-sm) |
| Vinyl glow | `blur(64px)` (blur-3xl) |

---

### Custom CSS (globals.css)

**`.queue-scroll` scrollbar**:
- Width: 4px, border-radius: 2px
- Thumb: `rgba(255,255,255,0.1)`, hover `rgba(255,255,255,0.2)`
- Track: transparent

**Range input** (custom):
- Track: height 3px, border-radius 2px, `rgba(255,255,255,0.12)`
- Thumb: 12×12px, 50% radius, `#ffffff`, margin-top -4.5px
- Thumb hover: scale(1.4), box-shadow `0 0 0 3px rgba(255,255,255,0.15)`, transition 0.15s

---

## 4. Session Plan

### Step 2 — Figma File Setup & Token Styles
- Create file: `Wavelength — Design System`
- Pages: `🎨 Tokens`, `🧩 Components`, `📄 Home Player`, `📄 Loading States`, `📄 Empty States`
- Color styles: 15 white-opacity tokens + 6 accent presets + 4 bg tokens + 2 vinyl tokens
- Text styles: 11 styles (see typography table above)
- Effect styles: 7 shadow/elevation definitions

### Step 3a — Primitive Components: Buttons & Sliders (6–8 components)
- Queue Toggle Button
- Playback Previous Button
- Playback Play/Pause Button
- Playback Next Button
- Queue Close Button
- Queue Track Item Button (with accent bar, artwork, text, indicator)
- Progress Bar Slider
- Volume Slider

### Step 3b — Display & Icon Components (9 icons + 3 display)
- All 9 inline SVG icons (Queue, Close, NowPlaying, Previous, Next, Play, Pause, VolumeHigh, VolumeLow)
- Album Artwork — Vinyl Center
- Album Artwork — Queue Thumbnail
- NowPlaying Indicator

### Step 3c — Layout & Background Components (5 components)
- Backdrop Overlay
- Ambient Gradient
- Noise Texture
- VinylDisc (composite: groove gradient + glow + artwork + spindle)
- TrackControls (composite: ProgressBar + VolumeSlider + playback buttons)

### Step 3d — Composite Components (2 components)
- QueueDrawer (header + scrollable track list)
- PlayerCard (full assembly)

### Step 4a — Page Reconstruction: Home Player
- States: Default (Paused), Playing, Queue Open
- Viewport: 1440×900 (desktop assumed)
- One frame per state, 120px apart, with annotation labels

### Step 4b — State Frames: Loading, Empty, Error (if applicable)
- The app has no explicit loading/empty/error states in current code
- Frames can be placeholder/documented-as-N/A

### Step 5 — Quality Audit
- Verify component integrity, style integrity, layout integrity, coverage, naming

---
*End of audit. Proceed to Step 2 in a new session.*
