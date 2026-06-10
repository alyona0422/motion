# pm-prototype-demo

Plan B fitness prototype (static HTML/CSS/JS) global map.

## 1) Project Positioning

- This repo is a static prototype focused on Plan B product flow validation.
- Core implementation pattern:
  - Multiple independent HTML entries (split-by-screen pages)
  - Shared stylesheet modules under `css/`
  - Shared interaction/data script under `js/`
- Main interaction logic is centralized in `js/plan-b-verify.js`, then activated by each page via `data-plan-b-page`.

## 2) Top-Level Structure

```text
pm-prototype-demo/
├─ assets/                             # images/video/material assets
├─ css/                                # style modules
├─ js/
│  ├─ data/explore-library.js          # demo library data source
│  └─ plan-b-verify.js                 # shared interaction + page bootstrap
├─ index-plan-b-home.html              # home (split-page mode)
├─ plan-b-all-training.html            # all training list page
├─ plan-b-plan-detail.html             # plan detail page
├─ plan-b-move-detail.html             # move detail page
├─ plan-b-immersive-workout.html       # immersive workout page
├─ plan-b-free-training-pilates.html   # pilates free training page
├─ plan-b-training-report.html         # training report page
├─ plan-b-profile.html                 # profile page
└─ free-training-strength-temp.html    # temporary strength demo page
```

## 3) Page Map (Global Screen Navigation)

### 3.1 Page Identity (`data-plan-b-page`)

- `index-plan-b-home.html` -> `home`
- `plan-b-profile.html` -> `profile`
- `plan-b-all-training.html` -> `all-training`
- `plan-b-plan-detail.html` -> `plan-detail`
- `plan-b-move-detail.html` -> `move-detail`
- `plan-b-immersive-workout.html` -> `immersive`
- `plan-b-free-training-pilates.html` -> `pilates`
- `plan-b-training-report.html` -> `report`

`js/plan-b-verify.js` reads:

- `document.body.dataset.planBPage`
- and conditionally initializes the corresponding modules.

### 3.2 Typical Flow (Split-Page Mode)

1. Home (`home`) browse cards/list
2. Enter move detail (`move-detail`)
3. Start immersive workout (`immersive`)
4. End session -> report (`report`)
5. Return to home/profile (`home` / `profile`)

Parallel entrances:

- Home/Profile -> All Training (`all-training`)
- All Training(Plans) -> Plan Detail (`plan-detail`)
- Home/Profile -> Pilates (`pilates`)

## 4) CSS Responsibility Map

Shared by major Plan B pages:

- `css/plan-b-base.css` - base layout, shell, global component foundations
- `css/plan-b-modal-detail.css` - modal + move detail related visuals
- `css/plan-b-profile.css` - profile screen styles
- `css/plan-b-immersive.css` - immersive workout visuals/interactions
- `css/plan-b-pilates-report.css` - pilates + report related style layer

Additional/legacy style files (for comparison, migration, or temporary screens):

- `css/base.css`, `css/home.css`, `css/immersive-workout.css`, `css/pilates.css`
- `css/training-report.css`, `css/screens-profile-move-shell.css`
- `css/tokens-overrides.css`
- `css/plan-b-verify.css`

## 5) JavaScript Responsibility Map

## `js/data/explore-library.js`

- Provides demo card/library data (`window.PlanBDemo.libraryData`)
- Provides asset fallback list (`window.PlanBDemo.assetPaths`)
- Must be loaded before `js/plan-b-verify.js`

## `js/plan-b-verify.js`

Main responsibilities:

- Page bootstrap based on `PLAN_B_PAGE`
- Explore grid rendering (category/filter)
- Move detail open/close and data sync
- Immersive workout control (mode/weight/equipment/chart/drawer interactions)
- Training report data assembly and rendering
- Pilates dashboard simulation and training timer
- Cross-page navigation wiring (home/profile/all-training/report routes)

State/storage anchors:

- `STORAGE_AD_META` (`planBAdMetaV1`)
- `STORAGE_REPORT_PAYLOAD` (`planBReportPayloadV1`)

## 6) Key Contracts (Do Not Break)

- Every new/adjusted page should explicitly set `data-plan-b-page`.
- Keep script load order:
  1) `js/data/explore-library.js`
  2) `js/plan-b-verify.js`
- Keep shared element IDs/class names stable when reusing existing JS logic.
- If changing page file names, update hardcoded `window.location.href` targets in `js/plan-b-verify.js`.
- Plans in `js/plan-b-all-training.js` should route to `plan-b-plan-detail.html?planId=<id>`; non-plan tabs keep move detail routing.

## 7) Change Workflow (Recommended)

When adjusting any feature, follow this sequence:

1. Define target page key (`home`, `profile`, `immersive`, etc.)
2. Confirm impacted HTML entries
3. Confirm impacted CSS modules (base vs feature-specific)
4. Locate related JS block in `js/plan-b-verify.js`
5. Verify route jump + state persistence (`localStorage`) behaviors
6. Run end-to-end flow checks:
   - Home -> Move Detail -> Immersive -> Report -> Back
   - Home/Profile tab switching
   - All Training entry and return path
   - Pilates independent flow

## 8) Suggested README Maintenance Rules

- Add/remove page: update **Section 2 + Section 3** together.
- Add/remove style file: update **Section 4** and note ownership.
- Add/remove JS module: update **Section 5** and load order contract.
- Route/state changes: update **Section 3.2** and **Section 6**.

## 8.1) Global Design Tokens (Persistent Spec)

- Global UI tokens are defined in `css/plan-b-base.css` under `:root` and should be treated as the source of truth.
- For plan-detail meta tags, use the `--plan-meta-*` token family (category label + value color), and avoid hard-coded color literals in feature CSS.
- Naming convention:
  - Category token: `--plan-meta-cat-<category>-label`
  - Value token: `--plan-meta-<category>-<value>-<property>`
- Current covered categories for plan detail:
  - `scene`: Strength Training / Pilates / Cardio Fat Burn / Stretch Recovery
  - `cycle`: 2 Weeks / 3 Weeks / 4 Weeks
  - `sessions`: 3 Sessions / 4 Sessions / 5 Sessions
  - `difficulty`: Beginner / Intermediate / Advanced
- When adding new business values, first add the corresponding token in `css/plan-b-base.css`, then map class names in feature CSS.

---

If you keep this document aligned with each iteration, it serves as a stable project navigation map for future refactors and UI experiments.

## 9) Change Log Template

Use this section to keep iteration records in one place.

### 9.1 Logging Rules

- Add one entry per change batch (or PR/task).
- Keep entries reverse chronological (newest first).
- Keep scope explicit: pages, CSS modules, JS modules, and data/state impact.
- Always include test coverage of the modified flows.

### 9.2 Entry Template

```md
### [YYYY-MM-DD] <change title>
- **Owner**: <name>
- **Type**: feature | fix | refactor | style | chore
- **Summary**: <1-2 lines of why this change exists>
- **Impacted pages**: `index-plan-b-home.html`, `plan-b-move-detail.html`
- **Impacted styles**: `css/plan-b-base.css`, `css/plan-b-immersive.css`
- **Impacted scripts**: `js/plan-b-verify.js`, `js/data/explore-library.js`
- **Route/state impact**:
  - Route: <what changed in navigation>
  - Storage: <new/updated/removed localStorage keys>
- **Validation checklist**:
  - [ ] Home -> Move Detail -> Immersive -> Report flow
  - [ ] Home/Profile tab switching
  - [ ] All Training entry + return path
  - [ ] Pilates independent flow
- **Risk / follow-up**:
  - <known risk 1>
  - <next action 1>
```

### 9.3 Change Log

### [2026-03-28] Add project global map README
- **Owner**: Alyona
- **Type**: docs
- **Summary**: Added a maintainable global structure map for pages, styles, scripts, and key contracts.
- **Impacted pages**: `index-plan-b-home.html`, `plan-b-*.html` (referenced only)
- **Impacted styles**: `css/plan-b-*.css` (referenced only)
- **Impacted scripts**: `js/plan-b-verify.js`, `js/data/explore-library.js` (referenced only)
- **Route/state impact**:
  - Route: Documentation only, no runtime routing changes.
  - Storage: Documentation only, no key changes.
- **Validation checklist**:
  - [x] README structure complete
  - [x] Page map and contracts documented
- **Risk / follow-up**:
  - Keep this section updated with every functional/UI iteration.
