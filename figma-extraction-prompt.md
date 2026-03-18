# App → Figma Component Extraction
## Multi-Session Workflow for Claude Code + Figma MCP

---

## HOW TO START EACH SESSION

At the beginning of every session, tell Claude which step to run:

> "Run Step 1 — Audit"
> "Run Step 3 — Primitive Components (buttons, inputs)"
> "Run Step 5 — Page Reconstruction: Dashboard"

Claude will read the progress files, orient itself, check context usage, 
and proceed with only the scope for that step.

---

## GROUND RULES (apply to every session)

### Context Management
- Run `/context` immediately when the session starts. Do not proceed if 
  already above 25% usage — ask the user to start a fresh session.
- Run `/context` after every 5 Figma MCP operations.
- If context usage exceeds 60%, stop work, write progress files, 
  and tell the user to start a new session for the next batch.
- Only load source files directly relevant to the current step's scope. 
  Do not speculatively read files "for context."

### Progress Persistence
- All progress is tracked in two files at the project root:
  - `figma-audit.md` — written once in Step 1, never overwritten
  - `figma-progress.md` — updated at the END of every session
- Always read both files at the start of a session before doing anything else.
- Never rely on conversation memory across sessions — 
  the files are the only source of truth.

### Figma MCP Operations
- Verify each Figma operation succeeded before moving to the next one.
- Record the Figma node ID of every created component/frame in 
  figma-progress.md immediately after creation.
- If a Figma MCP call fails, retry once. If it fails again, 
  log the failure in figma-progress.md and skip — do not halt the session.
- Never hardcode hex values, font sizes, or spacing — 
  always reference local Figma styles by name.

---

## STEP 1 — CODEBASE AUDIT
*Run once. No Figma calls. Output goes to figma-audit.md.*

### Scope
Read the codebase and produce a complete design audit. 
Do not open Figma or make any MCP calls during this step.

### What to Extract

**1. Pages & Routes**
List every distinct screen/route in the application.
For each, document:
- Route path and display name
- Layout structure (e.g., sidebar + main, top nav + content, full-screen)
- All significant UI states (default, loading, empty, error, success, 
  modal open, form validation shown, etc.)
- Which components appear on this page

**2. Component Inventory**
List every reusable UI element. For each component:
- Name and source file path
- All visual variants (driven by props, state, or CSS classes)
- All interactive states (default, hover, focus, active, disabled, loading)
- Exact dimensions, padding, and spacing values if defined in code
- Children / composition (what's nested inside)

Organize by category:
- Primitives: buttons, inputs, checkboxes, toggles, selects, radio groups
- Display: badges, chips, avatars, tags, icons, tooltips
- Feedback: alerts, toasts, banners, empty states, skeletons, spinners
- Layout: cards, panels, modals, drawers, dividers
- Navigation: top nav, sidebar, tabs, breadcrumbs, pagination
- Data: tables, lists, trees, charts
- Typography: all heading, body, label, caption, and code text styles

**3. Design Tokens**
Extract exact values from code (CSS variables, Tailwind config, 
theme files, constants, etc.):
- Colors: every value with its semantic role 
  (e.g., #1A1A2E → brand-primary, #FF4444 → status-error)
- Typography: font families, weights, sizes, line heights, letter spacing
- Spacing: every spacing value in use — map to a scale 
  (e.g., 4px=1, 8px=2, 16px=4, 24px=6)
- Border radius values
- Shadow/elevation definitions
- Opacity levels

**4. Session Plan**
Based on the audit, produce a recommended session breakdown:
- Step 2: Figma file setup + token styles
- Step 3a, 3b, 3c...: Component batches (group by category, 
  max 8–10 components per session)
- Step 4a, 4b...: One session per page or feature area

### Output
Write everything above to `figma-audit.md` at the project root.
Confirm the file was written, then stop. Do not proceed to Step 2.

---

## STEP 2 — FIGMA FILE SETUP & TOKEN STYLES
*Run once. Creates the Figma file structure and all design token styles.*

### On Session Start
1. Read `figma-audit.md` and `figma-progress.md`
2. Run `/context` — confirm usage is under 25% before continuing

### Tasks

**2a. Create the Figma File**
Create a new Figma file named: `[AppName] — Design System`

Record the file ID in `figma-progress.md`.

**2b. Create Pages**
Create pages in this order:
1. `🎨 Tokens`
2. `🧩 Components`
3. One page per app route from the audit 
   (e.g., `📄 Login`, `📄 Dashboard`, `📄 Settings`)
4. `📄 Empty States`
5. `📄 Error States`
6. `📄 Loading States`

Record each page ID in `figma-progress.md`.

**2c. Create Color Styles**
On the Tokens page, create a local color style for every color 
in the audit. Name styles using the semantic role, not the hex value:
- `brand/primary`, `brand/secondary`
- `text/default`, `text/subtle`, `text/disabled`, `text/inverse`
- `surface/default`, `surface/raised`, `surface/overlay`
- `border/default`, `border/subtle`, `border/focus`
- `status/success`, `status/warning`, `status/error`, `status/info`

Create a labeled color swatch frame on the Tokens page showing all styles.

**2d. Create Text Styles**
Create a local text style for every typography definition in the audit.
Naming convention: `heading/xl`, `heading/lg`, `body/md`, `label/sm`, etc.

Create a typography specimen frame on the Tokens page 
showing each style with sample text.

**2e. Create Effect Styles**
Create a local effect style for every shadow/elevation value in the audit.
Naming convention: `elevation/1`, `elevation/2`, `elevation/3`.

### On Session End
Update `figma-progress.md`:
- File ID
- All page IDs with their names
- Confirm: color styles created ✓, text styles created ✓, 
  effect styles created ✓
- List any styles that failed to create

---

## STEP 3 — COMPONENT CREATION
*Run once per component batch. One session = one category of components.*

### On Session Start
1. Read `figma-audit.md` and `figma-progress.md`
2. Confirm which component batch this session covers 
   (user will specify, e.g., "Step 3a — Buttons and Inputs")
3. Run `/context` — confirm usage is under 25% before continuing
4. Load only the source files for components in this batch

### Rules for Every Component
- Work on the `🧩 Components` page
- Use **Auto Layout** for every component frame — no manual positioning
- Apply **local styles** for all colors, text, and effects — 
  never hardcode values
- Name all layers semantically:
  `container`, `label`, `icon/leading`, `icon/trailing`, 
  `state-layer`, `supporting-text` — not `Frame 4` or `Rectangle 2`
- Match exact sizing, padding, and spacing from the codebase
- Add a **component description** in Figma's panel explaining 
  the component's purpose and what each variant controls
- Create **variants** for every visual state found in the code:
  default, hover, focus, active, disabled, loading, error, success

### Build Order Within a Batch
Always build in dependency order — a component must exist 
before it can be used inside another:
1. Icon components (if applicable)
2. Primitive/leaf components (no children from the library)
3. Composite components (composed of already-built primitives)

### After Each Component
- Verify the component exists in Figma via MCP before moving on
- Record its name and node ID in `figma-progress.md`
- Run `/context` every 5 components

### On Session End
Update `figma-progress.md` with:
- All completed components (name + node ID)
- Any components skipped due to errors (name + reason)
- Recommended next batch for Step 3 continuation (if any)

---

## STEP 4 — PAGE RECONSTRUCTION
*Run once per page. One session = one app page or closely related page group.*

### On Session Start
1. Read `figma-audit.md` and `figma-progress.md`
2. Confirm which page this session covers 
   (user will specify, e.g., "Step 4a — Dashboard page")
3. Run `/context` — confirm usage is under 25% before continuing
4. Load only the source files for the target page

### Rules for Every Page Frame

**Frame Setup**
- Use the app's primary viewport dimensions 
  (extract from code or ask the user if unclear)
- Create one frame per state listed in the audit for this page
- Label each frame: `[PageName] / [State]` 
  (e.g., `Dashboard / Default`, `Dashboard / Loading`, `Dashboard / Empty`)
- Arrange frames in a horizontal row on the Figma page, 
  spaced 120px apart

**Layout Fidelity**
- Reconstruct the page layout to match the coded implementation exactly
- Use **instances** of components from the library — 
  never place raw shapes or detached copies
- Match spacing, alignment, and nesting to what's in the code
- Use realistic content — actual labels, realistic data values, 
  real copy — not "Lorem Ipsum" unless the app itself uses it

**Component Gaps**
- If a needed component doesn't exist in the library yet 
  (missed in Step 3), create it now following the same component rules
- Record it in `figma-progress.md` under "Components added during page work"

**Annotations**
- Add a small text label below each frame: 
  route path · viewport size · state name
  (e.g., `/dashboard · 1440×900 · Default`)

### On Session End
Update `figma-progress.md` with:
- Page name + Figma page ID
- All frames created (name + node ID)
- Any components created mid-session
- Next recommended page session

---

## STEP 5 — QUALITY AUDIT
*Run once at the end, after all pages are complete.*

### On Session Start
1. Read `figma-audit.md` and `figma-progress.md`
2. Run `/context` — confirm usage is under 25%

### Checks to Run

For each page in the Figma file, verify:

**Component Integrity**
- [ ] All elements on page frames are instances from the component library
- [ ] No detached components, raw shapes used in place of components, 
      or manually recreated elements that have a library equivalent

**Style Integrity**
- [ ] All colors reference local styles — no hardcoded hex values
- [ ] All text references text styles — no hardcoded font properties
- [ ] All shadows reference effect styles

**Layout Integrity**
- [ ] Auto Layout is applied to all component frames
- [ ] Page frames use the correct viewport dimensions

**Coverage**
- [ ] Every route from the audit has at least one frame
- [ ] Every significant state from the audit is represented
- [ ] All components from the audit exist in the library

**Naming**
- [ ] No layers named Frame N, Rectangle N, Group N, or similar defaults
- [ ] Component descriptions are present

### Output
Write a `figma-qa.md` report listing:
- Passed checks
- Failed checks with the specific Figma node IDs that need fixing
- Recommended fixes

Fix any critical failures (detached components, hardcoded styles) 
before closing the session.

---

## figma-progress.md FORMAT

Keep this file updated throughout the project. Use this structure:
```
# Figma Progress

## File
- File ID: [id]
- File Name: [name]

## Pages
| Page Name | Figma Page ID | Status |
|-----------|--------------|--------|
| 🎨 Tokens | [id] | Complete |
| 🧩 Components | [id] | In Progress |
| 📄 Dashboard | [id] | Not Started |

## Token Styles
- Color styles: ✓ Created [N] styles
- Text styles: ✓ Created [N] styles  
- Effect styles: ✓ Created [N] styles

## Components
| Component Name | Node ID | Variants | Status |
|---------------|---------|----------|--------|
| Button | [id] | primary/secondary/ghost × default/hover/disabled | ✓ |

## Pages Reconstructed
| Page | Frame | Node ID | Status |
|------|-------|---------|--------|
| Dashboard | Dashboard / Default | [id] | ✓ |
| Dashboard | Dashboard / Loading | [id] | ✓ |

## Issues Log
- [Step 3a] Tooltip component: MCP call failed twice, skipped
- [Step 4a] Avatar component missing from library, created inline

## Next Session
Step: [next step]
Scope: [what to work on]
Files to load: [specific files]
```