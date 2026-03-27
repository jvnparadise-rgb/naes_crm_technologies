# FRONTEND IMPLEMENTATION PLAN

## Objective
Build the NAES CRM frontend shell in a controlled, modular way using the existing repo contracts.

## Non-negotiable rules
- Do not hardcode scattered sidebar structures
- Do not hardcode duplicated route labels
- Do not bypass the registries
- Do not build large unvalidated UI batches
- Do not mutate architecture to move faster
- Build one shell layer at a time

## Source contracts
Frontend implementation must follow:
- PROJECT_RULES.md
- PROJECT_BLUEPRINT.md
- CURRENT_PROJECT_STATE.md
- feature registry
- pricing schema registry
- navigation resolver
- page registry resolver
- frontend shell contract

## Planned frontend layers
1. App shell container
2. Sidebar renderer
3. Header/top bar shell
4. Page outlet shell
5. Placeholder pages mapped from page registry
6. Theme token consumption
7. API service wiring
8. Data-driven page replacement by module

## Sidebar rules
- Sidebar must render from the navigation resolver only
- Nested groups must be rendered from resolver output only
- Labels and paths must not be redefined elsewhere
- Reordering should require registry change, not component surgery

## Page rules
- Page placeholders should come from page registry
- Nested page layout should follow parent/child structure
- No orphan page should be introduced
- No unregistered route should appear in the shell

## Pricing context rules
The following areas must remain pricing-aware:
- Opportunities
- Revenue Command Center
- Revenue Intelligence

Pricing-aware areas must consume the pricing schema registry and not invent local logic.

## Initial implementation order
1. Build minimal frontend folder structure
2. Build shell-only layout
3. Build registry-driven sidebar
4. Build placeholder routed pages
5. Validate route/path alignment
6. Add styling tokens to shell
7. Add first real page module intentionally

## Initial target pages for first real implementations
- Welcome
- Accounts
- Opportunities
- Revenue Command Center

## Stability requirements
- Frontend shell should not crash if child pages are placeholders
- Missing page modules should fail visibly but safely
- Sidebar should remain renderable from registry even during incremental build
- Theme tokens should be consumed centrally

## Definition of done for shell phase
- Sidebar renders from contracts
- Nested items render correctly
- Page outlet works
- Theme tokens are applied
- Placeholder pages load for all approved routes
- No hardcoded duplicate navigation structures exist
