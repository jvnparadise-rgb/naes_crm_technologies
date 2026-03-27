# NAES CRM PROJECT BLUEPRINT

## Build posture
This CRM is built clean from the current repository only.
The goal is a stable, modular, enterprise-grade CRM with clean wiring from the beginning.

## Engineering rules
- No hacking
- No mutation-driven shortcuts
- No copy-paste drift across modules
- No hidden coupling between navigation, routes, and page logic
- No changes to deployed behavior without a checkpoint first
- All new work should fit the approved structure in this blueprint

## Architecture goals
- Clean module boundaries
- Predictable route handling
- Stable sidebar/navigation contract
- Safe future expansion
- Minimal crash risk from UI or route changes
- Changes should be simple because the wiring is clean

## Source of truth
- Local repository is the source of truth
- Git checkpoints are mandatory before meaningful changes
- Milestone tags are required at major phases
- Remote GitHub backup must stay current

## Approved top-level navigation
1. Welcome
2. Executive Dashboard
3. My Pipeline
4. Pipeline Rollup
5. Forecast Dashboard
6. Forecast Integrity
7. Forecast Period Control
8. Accounts
9. Contacts
10. Tasks
11. Activities
12. Opportunities
13. Revenue Command Center
14. Settings
15. User Access
16. Business Reviews
17. Revenue Intelligence

## Nested navigation
- Accounts
  - Client Reports
- Welcome
  - Training / User Guide

## Navigation wiring rules
- Sidebar structure must be defined from a single navigation source
- Page registration must be explicit, not inferred
- Nested items must belong to one parent only
- Route names, sidebar labels, and page modules must remain aligned
- No page should exist without a registered navigation and route decision
- No navigation item should point to an undefined route or module

## Backend resource map
Current base routes:
- GET /health
- GET /db-check
- GET /accounts
- GET /contacts
- GET /opportunities
- GET /tasks
- GET /activities

Planned resource expansion:
- /accounts
- /accounts/:id
- /accounts/:id/client-reports
- /contacts
- /contacts/:id
- /opportunities
- /opportunities/:id
- /tasks
- /tasks/:id
- /activities
- /activities/:id
- /settings
- /user-access
- /business-reviews
- /revenue-intelligence

## Module structure rules
Backend modules should remain separated by responsibility:
- config
- db
- lib
- routes
- handler/app orchestration

Future frontend should follow equivalent separation:
- navigation
- pages
- components
- services/api
- theme/tokens
- layouts

## Styling direction
Application style should be:
- light executive CRM
- clean enterprise presentation
- readable data-first layouts
- restrained use of accents
- polished but not flashy

## Color direction
Primary direction:
- NAES green accent
- light blue secondary accent
- clean neutrals for surfaces, borders, and typography

Color system should be token-based:
- primary
- secondary
- background
- surface
- border
- text
- text-muted
- success
- warning
- danger

## UX rules
- Tables must be readable first
- KPI cards must be concise and executive-friendly
- Forms must be structured and predictable
- Navigation changes should not require route rewrites
- Feature additions should plug into the approved structure without mutation
- Back navigation and safe user flow should be considered part of baseline UX

## Stability rules
- Avoid magic strings spread across the codebase
- Avoid duplicated route logic
- Avoid sidebar labels being hardcoded in multiple places
- Avoid direct edits in AWS as a normal workflow
- Deploy only from local repo artifacts
- Validate locally where possible before deploy
- Validate live after deploy for critical routes

## Current proven infrastructure state
- API Gateway working
- Lambda working
- Aurora connectivity working from Lambda
- Real SQL query working from deployed backend
- Local repo deploy package successfully running in Lambda
- Handler set to src/handler.handler

## Current protected repo state
- Git repo initialized
- GitHub remote configured and proven
- checkpoint.sh working
- tag_checkpoint.sh working
- v0.1 and v0.2 milestone tags created

## Immediate build priorities
1. Lock blueprint
2. Keep route/resource wiring clean
3. Extend backend safely
4. Add API route coverage intentionally
5. Define frontend/navigation contract before UI build
6. Build modules without cross-coupled hacks

## Non-negotiable outcome
This project should remain clean, modular, extensible, and stable from the beginning so later changes are straightforward and do not crash unrelated areas.

## Pricing card specification

### Commercial toggles
Approved pricing toggles:
- Renewables
- StratoSight
- Both
- Other O&M

### Renewables pricing logic
Renewables pricing should support two sizing frameworks:
- MWDC
- MWAC

MWAC pricing should evaluate a bit lower than MWDC based on the calculation method.

#### DG pricing
DG applies to opportunities under 20 MWdc.

DG pricing basis:
- price per MW

DG pricing range:
- low: $14 per MW
- high: $23 per MW

#### USS pricing
USS applies to opportunities over 20 MWdc.

USS pricing basis:
- price per MW

USS pricing was specified with two overlapping references that must remain visible until normalized:
- range stated as: $8 to $16 per MW
- working low/high anchors stated as: $10 low and $17 high

Do not silently normalize this conflict in code.
This must remain explicit until final pricing normalization is approved.

### StratoSight pricing logic
StratoSight pricing basis:
- price per square foot

StratoSight pricing range:
- low: $0.04 per sqft
- high: $0.11 per sqft

### Other O&M pricing logic
Other O&M pricing is manual and based on sales-associate judgment.

Other O&M should allow:
- per-unit pricing entry
- overall price entry

### Pricing architecture rules
- Pricing cards must be driven by explicit commercial logic, not scattered conditionals
- Toggle selection must cleanly determine which pricing card set is shown
- Both must support combined Renewables and StratoSight pricing presentation
- Other O&M must remain flexible and manually adjustable
- DG versus USS logic must be driven by MW threshold rules, not ad hoc overrides
- MWDC and MWAC calculations must remain explicit and traceable

## Exact main-page top strip requirement

The main page top strip must render exactly three branded segments in this order:
1. NAES Technologies
2. NAES Renewables
3. NAES StratoSight

Design intent:
- full-width horizontal strip
- equal visual segmentation
- uppercase labels
- clean executive styling
- distinct brand-aware color treatment by segment
- suitable for main-page/header presentation

This strip should be implemented as a reusable shell model, not as scattered page-specific styling.
