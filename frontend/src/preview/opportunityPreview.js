import { buildFrontendShell } from '../layout/buildFrontendShell.js';
import { renderOpportunityPagePlaceholder } from '../renderers/renderOpportunityPagePlaceholder.js';

const shell = buildFrontendShell();
const view = renderOpportunityPagePlaceholder();

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\"', '&quot;')
    .replaceAll("'", '&#39;');
}

function listCard(title, items, mapFn) {
  return `
    <section class="card">
      <h2>${escapeHtml(title)}</h2>
      <div class="list">
        ${items.map(mapFn).join('')}
      </div>
    </section>
  `;
}

function metaCard(title, entries) {
  return `
    <section class="card">
      <h2>${escapeHtml(title)}</h2>
      <div class="meta">
        ${entries.map(([label, value]) => `
          <div class="meta-item">
            <div class="label">${escapeHtml(label)}</div>
            <div class="value">${escapeHtml(value)}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderSidebar() {
  const items = Array.isArray(shell.sidebar?.items) ? shell.sidebar.items : [];
  return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-brand-kicker">${escapeHtml(shell.headerTitle ?? 'NAES CRM')}</div>
        <div class="sidebar-brand-subtitle">Shell-mounted preview</div>
      </div>
      <div class="sidebar-list">
        ${items.map((item) => `
          <div class="sidebar-item ${item.pageType === 'OpportunityPagePlaceholder' ? 'sidebar-item-active' : ''}">
            <span>${escapeHtml(item.label ?? item.pageType ?? 'Item')}</span>
          </div>
        `).join('')}
      </div>
    </aside>
  `;
}

function renderTopbar() {
  const segments = ['Technologies', 'Renewables', 'StratoSight'];
  return `
    <div class="topbar">
      ${segments.map((segment) => `<div class="topbar-segment">${escapeHtml(segment)}</div>`).join('')}
    </div>
  `;
}

const app = document.getElementById('app');

app.innerHTML = `
  <div class="shell">
    ${renderSidebar()}

    <main class="main">
      <div class="page">
        ${renderTopbar()}

        <section class="hero">
          <div>
            <h1>${escapeHtml(view.pageTitle)} Live Preview</h1>
            <p>Browser preview driven from buildFrontendShell() and renderOpportunityPagePlaceholder(), not a separate mock.</p>
          </div>
          <div class="badge">${escapeHtml(view.type)}</div>
        </section>

        <div class="grid">
          <div class="stack">
            ${metaCard('Shell + Page Contracts', [
              ['Shell Type', shell.type ?? 'missing'],
              ['Header Title', shell.header?.title ?? 'missing'],
              ['Sidebar Count', String(shell.sidebar?.itemCount ?? 0)],
              ['Active Page Outlet', shell.pageOutlet?.type ?? 'missing'],
              ['Header Block', view.headerBlock?.type ?? 'missing'],
              ['Relationship Block', view.relationshipBlock?.type ?? 'missing'],
              ['Service Toggle Block', view.serviceToggleBlock?.type ?? 'missing'],
              ['Workflow Block', view.workflowBlock?.type ?? 'missing'],
              ['Quotes Summary', view.summaries?.quotes?.summaryId ?? 'missing'],
              ['Audit Summary', view.summaries?.audit?.summaryId ?? 'missing']
            ])}

            ${listCard(
              'Shell Sidebar Items',
              shell.sidebar?.items ?? [],
              (item) => `
                <div class="list-item">
                  <div class="label">Navigation</div>
                  <div class="value">${escapeHtml(item.label ?? item.pageType ?? 'Item')}</div>
                </div>
              `
            )}

            ${listCard(
              'Required Placeholder Sections',
              view.sections ?? [],
              (section) => `
                <div class="list-item">
                  <div class="label">Section</div>
                  <div class="value">${escapeHtml(section.id)}</div>
                </div>
              `
            )}

            ${listCard(
              'Reserved Opportunity Zones',
              [
                ['Header', view.headerBlock?.type ?? 'missing'],
                ['Relationships', view.relationshipBlock?.type ?? 'missing'],
                ['Service Toggle', view.serviceToggleBlock?.type ?? 'missing'],
                ['Workflow', view.workflowBlock?.type ?? 'missing'],
                ['Quotes', view.summaries?.quotes?.summaryId ?? 'missing'],
                ['Audit', view.summaries?.audit?.summaryId ?? 'missing']
              ],
              ([label, value]) => `
                <div class="list-item">
                  <div class="label">${escapeHtml(label)}</div>
                  <div class="value">${escapeHtml(value)}</div>
                </div>
              `
            )}
          </div>

          <div class="stack">
            ${listCard(
              'Header Fields',
              view.summaries?.header?.fields ?? [],
              (field) => `
                <div class="list-item">
                  <div class="label">${escapeHtml(field.label)}</div>
                  <div class="value">${escapeHtml(field.key)}${field.required ? ' , required' : ''}</div>
                </div>
              `
            )}

            ${listCard(
              'Relationship Slots',
              view.relationshipBlock?.slots ?? [],
              (slot) => `
                <div class="list-item">
                  <div class="label">${escapeHtml(slot.label)}</div>
                  <div class="value">${escapeHtml(slot.key)}${slot.required ? ' , required' : ''}</div>
                </div>
              `
            )}

            ${listCard(
              'Service Toggle Options',
              view.serviceToggleBlock?.options ?? [],
              (option) => `
                <div class="list-item">
                  <div class="label">${escapeHtml(option.label)}</div>
                  <div class="value">${escapeHtml(option.key)}</div>
                </div>
              `
            )}

            ${listCard(
              'Workflow Metrics',
              view.workflowBlock?.metrics ?? [],
              (metric) => `
                <div class="list-item">
                  <div class="label">${escapeHtml(metric.label)}</div>
                  <div class="value">${escapeHtml(metric.key)}</div>
                </div>
              `
            )}
          </div>
        </div>

        <pre class="json">${escapeHtml(JSON.stringify({ shell, view }, null, 2))}</pre>
      </div>
    </main>
  </div>
`;

console.log('Shell preview model:', shell);
console.log('Opportunity page preview model:', view);
