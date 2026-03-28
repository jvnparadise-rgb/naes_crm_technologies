# GREENFIELD IMPLEMENTATION MAP

## Source-of-truth header
- Project: AWS NATIVE NAES CRM Project
- Repo path: /Users/jeffyarbrough/workspace/naes-crm-backend
- Branch: main
- Working mode: greenfield only
- Legacy rule: do not reuse, patch, reference, migrate, or recover V1, V2, or V3 CRM code

## Build intent
Build the NAES CRM from clean contracts and clean modules in this repository only.
Work from shell and registries first, then implement Accounts as the first real module.

---

## 1. Frontend shell implementation map

### Shell layers
1. app bootstrap
2. theme tokens
3. app shell layout
4. sidebar renderer
5. top bar / page header region
6. route registry
7. page registry
8. placeholder pages
9. API service layer
10. first real feature module: Accounts

### Planned frontend folder map
frontend/src/
- app/
  - App.jsx
  - router.js
- theme/
  - tokens.css
  - theme.js
- shell/
  - AppShell.jsx
  - Sidebar.jsx
  - TopBar.jsx
  - UserPlacard.jsx
- registry/
  - navigationRegistry.js
  - routeRegistry.js
  - pageRegistry.js
- pages/
  - PlaceholderPage.jsx
  - WelcomePage.jsx
- features/
  - accounts/
    - api/
    - components/
    - pages/
    - model/
  - contacts/
    - api/
    - components/
    - pages/
    - model/
  - opportunities/
    - api/
    - components/
    - pages/
    - model/
- services/
  - apiClient.js
- assets/
  - logos/
- lib/
  - formatters.js
  - guards.js

### Frontend shell rules
- navigation must come only from navigationRegistry.js
- route definitions must come only from routeRegistry.js
- page-to-module resolution must come only from pageRegistry.js
- shell components must not redefine route labels or paths locally
- placeholder pages must render safely for all registered routes
- missing modules should fail visibly but not crash the shell

---

## 2. Navigation registry map

### Approved top-level nav
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

### Approved nested nav
- Welcome
  - Training / User Guide
- Accounts
  - Client Reports

### Navigation item contract
Each navigation item should define:
- id
- label
- path
- iconKey
- parentId (nullable)
- order
- enabled
- pageId

---

## 3. Route registry map

### Initial route set
- /
- /welcome/training
- /executive-dashboard
- /my-pipeline
- /pipeline-rollup
- /forecast-dashboard
- /forecast-integrity
- /forecast-period-control
- /accounts
- /accounts/new
- /accounts/:accountId
- /accounts/:accountId/edit
- /accounts/:accountId/client-reports
- /contacts
- /contacts/new
- /contacts/:contactId
- /contacts/:contactId/edit
- /tasks
- /activities
- /opportunities
- /opportunities/new
- /opportunities/:opportunityId
- /opportunities/:opportunityId/edit
- /revenue-command-center
- /settings
- /user-access
- /business-reviews
- /revenue-intelligence

### Route contract
Each route should define:
- routeId
- path
- pageId
- navId (nullable)
- featureKey
- authRequired
- roleAccess

---

## 4. Page registry map

### Initial page ids
- welcome.home
- welcome.training
- dashboard.executive
- pipeline.mine
- pipeline.rollup
- forecast.dashboard
- forecast.integrity
- forecast.periodControl
- accounts.list
- accounts.new
- accounts.detail
- accounts.edit
- accounts.clientReports
- contacts.list
- contacts.new
- contacts.detail
- contacts.edit
- tasks.list
- activities.list
- opportunities.list
- opportunities.new
- opportunities.detail
- opportunities.edit
- revenue.commandCenter
- settings.home
- userAccess.home
- businessReviews.home
- revenue.intelligence

### Page contract
Each page entry should define:
- pageId
- title
- featureKey
- renderMode
- placeholderEnabled
- componentPath

---

## 5. Backend implementation map

### Current confirmed route base
- GET /health
- GET /db-check
- GET /accounts
- GET /contacts
- GET /opportunities
- GET /tasks
- GET /activities

### Planned backend module structure
src/
- app.js
- handler.js
- config/
- db/
- lib/
- routes/
  - health.js
  - dbCheck.js
  - accounts.js
  - contacts.js
  - opportunities.js
  - tasks.js
  - activities.js
- domain/
  - accounts/
  - contacts/
  - opportunities/
  - tasks/
  - activities/

### Backend rules
- each resource route file should own only its own resource handlers
- shared response helpers belong in lib/
- DB access helpers belong in db/
- no route should silently absorb another resource's logic
- expand resources intentionally, not opportunistically

---

## 6. Accounts first-pass implementation map

### Backend API target for Accounts
- GET /accounts
- GET /accounts/:accountId
- POST /accounts
- PUT /accounts/:accountId

### Account object first-pass fields
- id
- accountName
- legalName
- accountType
- industry
- serviceLine
- status
- ownerName
- ownerRole
- primaryContactName
- primaryContactEmail
- phone
- website
- city
- state
- notes
- createdAt
- updatedAt

### Accounts list page first-pass UX
Must include:
- page title
- create account button
- search input
- readable table
- columns for account name, type, service line, status, owner, location, updated date
- clickable row or view action to open detail
- safe empty state
- safe loading state
- safe error state

### Account detail page first-pass UX
Must include:
- account summary header
- edit button
- core information cards/sections
- related contacts panel
- related opportunities panel
- related tasks panel
- back path to Accounts list
- safe empty/loading/error states

### Account create/edit first-pass UX
Must include:
- predictable form layout
- save button
- cancel/back behavior
- required field handling
- visible success or failure handling

---

## 7. Contacts first-pass dependency note
Contacts should be built after Accounts and should consume account relationship data from the clean Account model, not from ad hoc local assumptions.

---

## 8. Opportunities dependency note
Opportunities should be built after Accounts and Contacts.
Opportunity rollup/detail, commercial summary, save-with-reason, and audit history should be implemented on clean greenfield contracts, not on any prior placeholder path.

---

## 9. Definition of readiness to start coding
Ready to start shell coding when:
- implementation map is accepted in repo
- shell folder/file plan is accepted
- registries are accepted as the single source for nav/routes/pages
- Accounts first-pass scope is accepted as the first real module
