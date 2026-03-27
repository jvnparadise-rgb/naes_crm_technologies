## Current protected state

### Protected checkpoint
- Current protected branch: `main`
- Current protected commit: `cdee875`
- Commit message: `checkpoint: wire opportunity header and relationship section contracts`

### Opportunity section-contract progress
Completed and checkpointed:
- Added `OpportunityHeaderSectionModel`
- Added `OpportunityRelationshipSectionModel`
- Added `validateOpportunityHeaderSectionModel`
- Added `validateOpportunityRelationshipSectionModel`
- Extended `OpportunityPageModel` with:
  - `headerSection`
  - `relationshipSection`
- Extended `renderOpportunityPagePlaceholder()` to expose:
  - `headerSection`
  - `relationshipSection`
- Extended `validateOpportunityPagePlaceholder()` to validate both section contracts

### Current validated opportunity placeholder state
- `pageTitle`: `Opportunities`
- `headerSectionId`: `opportunityHeader`
- `relationshipSectionId`: `accountRelationship`
- `sectionCount`: `9`
- `quoteActionCount`: `4`
- `auditRequired`: `true`

### Next smallest safe step
- Update only the Opportunity track
- Do not broaden into full UI rendering
- Do not mutate Accounts or Contacts
- Next likely safe implementation target:
  - minimal header-summary placeholder contract, or
  - minimal relationship-summary placeholder contract


# CURRENT PROJECT STATE

## Repository
- Repo path: /Users/jeffyarbrough/workspace/naes-crm-backend
- Source of truth: local repo plus GitHub remote
- Protected by: checkpoint script, tag script, blueprint, rules, handoff template

## Current workflow guardrails
- Work from local files only
- One command block at a time
- Checkpoint before meaningful changes
- Push to origin/main after meaningful changes
- Use milestone tags at major phases
- Deploy to AWS only from local repo artifacts

## Proven infrastructure state
- API Gateway working
- Lambda working
- Aurora reachable from Lambda
- Real PostgreSQL query works through deployed /db-check
- Deployed backend is running from local repo package
- Lambda handler is set to src/handler.handler

## Current backend routes in code
- GET /health
- GET /db-check
- GET /accounts
- GET /contacts
- GET /opportunities
- GET /tasks
- GET /activities

## Repo-resident documentation completed
- PROJECT_RULES.md
- PROJECT_BLUEPRINT.md
- SESSION_HANDOFF_TEMPLATE.md
- CURRENT_PROJECT_STATE.md

## Registry / structure state
- Navigation blueprint defined in PROJECT_BLUEPRINT.md
- Pricing card specification defined in PROJECT_BLUEPRINT.md
- Core backend route skeletons added
- Clean module folders established under src/

## Pricing logic currently locked
- Toggles: Renewables, StratoSight, Both, Other O&M
- DG: under 20 MWdc, $14 to $23 per MW
- USS: over 20 MWdc, stated range conflict preserved in blueprint
- MWDC and MWAC supported, MWAC should evaluate a bit lower
- StratoSight: $0.04 to $0.11 per sqft
- Other O&M: manual per-unit or overall pricing

## Milestones
- v0.1: Infra proven and repo protection established
- v0.2: Live backend deployed from local repo with working health and db-check

## Current protected direction
- Keep route/resource wiring clean
- Keep sidebar/navigation from a single contract
- Avoid scattered logic
- Avoid aggressive rewrites
- Build slowly and modularly

## Recommended next step
Create formal registry contracts for:
1. navigation
2. features/pages
3. pricing schema
Then continue into clean frontend shell and API expansion from those contracts.

## User and shell requirements currently locked
- Sidebar top-left placard required with name, title/role, profile/access level, and photo/avatar
- Approved user roles: Admin, Executive, Sales Manager, Sales Associate
- Dashboard must support embedded tutorial/help video such as Vimeo
- Logo asset access required for NAES Technologies, NAES Renewables, and StratoSight


### Protected checkpoint
- Current protected branch: `main`
- Current protected commit: `f05ad12`
- Commit message: `checkpoint: wire opportunity relationship summary contract`

### Opportunity summary-contract progress
Completed and checkpointed:
- Added `OpportunityHeaderSummaryModel`
- Added `validateOpportunityHeaderSummaryModel`
- Added `OpportunityRelationshipSummaryModel`
- Added `validateOpportunityRelationshipSummaryModel`
- Extended `OpportunityPageModel` with:
  - `headerSummary`
  - `relationshipSummary`
- Extended `renderOpportunityPagePlaceholder()` to expose:
  - `headerSummary`
  - `relationshipSummary`
- Extended `validateOpportunityPagePlaceholder()` to validate both summary contracts

### Current validated opportunity placeholder state
- `pageTitle`: `Opportunities`
- `headerSectionId`: `opportunityHeader`
- `headerSummaryId`: `opportunityHeaderSummary`
- `relationshipSectionId`: `accountRelationship`
- `relationshipSummaryId`: `opportunityRelationshipSummary`
- `sectionCount`: `9`
- `quoteActionCount`: `4`
- `auditRequired`: `true`

### Next smallest safe step
- Preserve contract-first progression
- Do not jump into full page rendering
- Do not mutate Accounts or Contacts
- Next likely safe implementation target:
  - minimal service-toggle summary contract, or
  - minimal workflow summary contract


### Protected checkpoint
- Current protected branch: `main`
- Current protected commit: `3551fdf`
- Commit message: `checkpoint: wire opportunity workflow summary contract`

### Opportunity service-toggle and workflow summary progress
Completed and checkpointed:
- Added `OpportunityServiceToggleSummaryModel`
- Added `validateOpportunityServiceToggleSummaryModel`
- Added `OpportunityWorkflowSummaryModel`
- Added `validateOpportunityWorkflowSummaryModel`
- Extended `OpportunityPageModel` with:
  - `serviceToggleSummary`
  - `workflowSummary`
- Extended `renderOpportunityPagePlaceholder()` to expose:
  - `serviceToggleSummary`
  - `workflowSummary`
- Extended `validateOpportunityPagePlaceholder()` to validate both summary contracts

### Current validated opportunity placeholder state
- `pageTitle`: `Opportunities`
- `headerSectionId`: `opportunityHeader`
- `headerSummaryId`: `opportunityHeaderSummary`
- `relationshipSectionId`: `accountRelationship`
- `relationshipSummaryId`: `opportunityRelationshipSummary`
- `serviceToggleSummaryId`: `opportunityServiceToggleSummary`
- `workflowSummaryId`: `opportunityWorkflowSummary`
- `sectionCount`: `9`
- `quoteActionCount`: `4`
- `auditRequired`: `true`

### Next smallest safe step
- Preserve contract-first progression
- Do not jump into full page rendering
- Do not mutate Accounts or Contacts
- Next likely safe implementation target:
  - minimal quotes summary contract, or
  - minimal audit summary contract

## Current implementation status

### Opportunity renderer progress
- `OpportunityHeaderBlock` is protected and pushed.
- `OpportunityRelationshipBlock` is now added, validated, and integrated into `renderOpportunityPagePlaceholder()`.
- `validateOpportunityRelationshipBlock()` passes standalone validation.
- `validateOpportunityPagePlaceholder()` now confirms both:
  - `headerBlockType: OpportunityHeaderBlock`
  - `relationshipBlockType: OpportunityRelationshipBlock`

### Current architecture truth
- The frontend remains in contract/model-shell phase.
- `buildFrontendShell()` still drives the page outlet from `renderOpportunityPagePlaceholder()`.
- This is not yet a true shell-mounted visual Opportunity page.
- Next milestone is the first shell-visible Opportunity review with:
  - header block visible
  - relationship block visible
  - remaining Opportunity sections still placeholder-backed

