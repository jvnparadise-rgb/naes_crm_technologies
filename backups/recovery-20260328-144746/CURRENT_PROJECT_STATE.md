# CURRENT PROJECT STATE

## Current protected state
This repository is now operating under a strict greenfield reset for the NAES CRM project.

## Source-of-truth header
- Project: AWS NATIVE NAES CRM Project
- Repo path: /Users/jeffyarbrough/workspace/naes-crm-backend
- Primary branch: main
- Working rule: local repository is the only implementation source of truth

## Greenfield reset rules
1. This is a true from-scratch NAES CRM.
2. Do not reuse, patch, reference, migrate, or recover any V1, V2, or V3 CRM code.
3. Do not assume any legacy routes, entities, frontend components, or page modules exist.
4. Prior CRM discussions may inform requirements and UX intent only, not implementation.
5. Build slowly, validate UX as we go, and protect the repo before meaningful changes.

## Current proven infrastructure state
- API Gateway working
- Lambda working
- Aurora reachable from Lambda
- Real PostgreSQL query works through deployed /db-check
- Deployed backend is running from local repo package
- Lambda handler is set to src/handler.handler

## Current backend routes confirmed in code
- GET /health
- GET /db-check
- GET /accounts
- GET /contacts
- GET /opportunities
- GET /tasks
- GET /activities

## Repo-resident documentation
- PROJECT_RULES.md
- PROJECT_BLUEPRINT.md
- SESSION_HANDOFF_TEMPLATE.md
- CURRENT_PROJECT_STATE.md
- FRONTEND_IMPLEMENTATION_PLAN.md

## Locked product and shell requirements
- Sidebar top-left placard required with name, title/role, profile/access level, and photo/avatar
- Approved user roles:
  - Admin
  - Executive
  - Sales Manager
  - Sales Associate
- Dashboard must support embedded tutorial/help video such as Vimeo
- Logo asset access required for:
  - NAES Technologies
  - NAES Renewables
  - StratoSight

## Locked navigation direction
Approved top-level application areas:
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

## Locked pricing direction
Commercial toggles:
- Renewables
- StratoSight
- Both
- Other O&M

Pricing notes preserved:
- DG under 20 MWdc: $14 to $23 per MW
- USS over 20 MWdc: preserve stated range conflict until normalized
- MWDC and MWAC both supported, MWAC should evaluate a bit lower
- StratoSight: $0.04 to $0.11 per sqft
- Other O&M: manual per-unit or overall pricing

## Build order now locked
1. Foundation
2. Accounts
3. Contacts
4. Opportunities
5. Tasks / Activities
6. Pipeline / Forecast / Executive surfaces

## Current implementation intent
The project should move from clean shell and registry definition into greenfield feature build.
Do not continue any opportunity-contract-first implementation path as the governing direction.

## Next smallest safe step
Create the greenfield frontend and backend implementation map for:
1. app shell
2. navigation registry
3. route registry
4. page registry
5. Accounts module first-pass API and page scope
