import { renderOpportunityPagePlaceholder } from '../renderers/renderOpportunityPagePlaceholder.js';

const view = renderOpportunityPagePlaceholder();

function listCard(title, items, mapFn) {
  return `
    <section class="card">
      <h2>${title}</h2>
      <div class="list">
        ${items.map(mapFn).join('')}
      </div>
    </section>
  `;
}

function metaCard(title, entries) {
  return `
    <section class="card">
      <h2>${title}</h2>
      <div class="meta">
        ${entries.map(([label, value]) => `
          <div class="meta-item">
            <div class="label">${label}</div>
            <div class="value">${value}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

const app = document.getElementById('app');

app.innerHTML = `
  <div class="page">
    <div class="topbar">
      <div class="topbar-segment">Technologies</div>
      <div class="topbar-segment">Renewables</div>
      <div class="topbar-segment">StratoSight</div>
    </div>

    <section class="hero">
      <div>
        <h1>${view.pageTitle} Local Preview</h1>
        <p>Local contract-driven browser view for the current Opportunity placeholder build.</p>
      </div>
      <div class="badge">${view.type}</div>
    </section>

    <div class="grid">
      <div class="stack">
        ${metaCard('Header Contract', [
          ['Header Section', view.headerSection?.sectionId ?? 'missing'],
          ['Header Summary', view.headerSummary?.summaryId ?? 'missing'],
          ['Relationships Section', view.relationshipSection?.sectionId ?? 'missing'],
          ['Relationships Summary', view.relationshipSummary?.summaryId ?? 'missing'],
          ['Service Toggle Summary', view.serviceToggleSummary?.summaryId ?? 'missing'],
          ['Workflow Summary', view.workflowSummary?.summaryId ?? 'missing'],
          ['Quotes Summary', view.quotesSummary?.summaryId ?? 'missing'],
          ['Audit Required', String(view.audit?.required ?? false)]
        ])}

        ${listCard(
          'Required Placeholder Sections',
          view.sections ?? [],
          (section) => `
            <div class="list-item">
              <div class="label">Section</div>
              <div class="value">${section.id}</div>
            </div>
          `
        )}

        ${listCard(
          'Quote Branding Profiles',
          view.quotes?.brandingProfiles ?? [],
          (profile) => `
            <div class="list-item">
              <div class="label">Branding Profile</div>
              <div class="value">${typeof profile === 'string' ? profile : JSON.stringify(profile)}</div>
            </div>
          `
        )}
      </div>

      <div class="stack">
        ${listCard(
          'Header Summary Fields',
          view.headerSummary?.fields ?? [],
          (field) => `
            <div class="list-item">
              <div class="label">${field.label}</div>
              <div class="value">${field.key}${field.required ? ' , required' : ''}</div>
            </div>
          `
        )}

        ${listCard(
          'Relationship Summary Slots',
          view.relationshipSummary?.slots ?? [],
          (slot) => `
            <div class="list-item">
              <div class="label">${slot.label}</div>
              <div class="value">${slot.key} , ${slot.cardinality}${slot.required ? ' , required' : ''}</div>
            </div>
          `
        )}

        ${listCard(
          'Service Toggle Options',
          view.serviceToggleSummary?.options ?? [],
          (option) => `
            <div class="list-item">
              <div class="label">${option.label}</div>
              <div class="value">${option.key}</div>
            </div>
          `
        )}

        ${listCard(
          'Workflow Summary Metrics',
          view.workflowSummary?.metrics ?? [],
          (metric) => `
            <div class="list-item">
              <div class="label">${metric.label}</div>
              <div class="value">${metric.key}</div>
            </div>
          `
        )}

        ${listCard(
          'Quotes Summary Metrics',
          view.quotesSummary?.metrics ?? [],
          (metric) => `
            <div class="list-item">
              <div class="label">${metric.label}</div>
              <div class="value">${metric.key}</div>
            </div>
          `
        )}
      </div>
    </div>

    <pre class="json">${JSON.stringify(view, null, 2)}</pre>
  </div>
`;

console.log('Opportunity preview view model:', view);
