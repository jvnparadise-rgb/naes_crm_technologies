const view = {
  type: 'OpportunityPagePlaceholder',
  pageTitle: 'Opportunities',
  sections: [
    { id: 'header', status: 'placeholder' },
    { id: 'relationships', status: 'placeholder' },
    { id: 'serviceToggle', status: 'placeholder' },
    { id: 'pricingArea', status: 'placeholder' },
    { id: 'workflow', status: 'placeholder' },
    { id: 'quotes', status: 'placeholder' },
    { id: 'audit', status: 'placeholder' },
    { id: 'accountsLinkage', status: 'placeholder' },
    { id: 'contactsLinkage', status: 'placeholder' }
  ],
  headerSection: {
    sectionId: 'opportunityHeader'
  },
  headerSummary: {
    summaryId: 'opportunityHeaderSummary',
    fields: [
      { key: 'name', label: 'Opportunity Name', required: true },
      { key: 'serviceLine', label: 'Service Line', required: true },
      { key: 'stage', label: 'Stage', required: true },
      { key: 'owner', label: 'Owner', required: true },
      { key: 'expectedCloseDate', label: 'Expected Close Date', required: false }
    ]
  },
  relationshipSection: {
    sectionId: 'accountRelationship'
  },
  relationshipSummary: {
    summaryId: 'opportunityRelationshipSummary',
    slots: [
      { key: 'account', label: 'Account', required: true, cardinality: 'single' },
      { key: 'primaryContact', label: 'Primary Contact', required: true, cardinality: 'single' },
      { key: 'additionalContacts', label: 'Additional Contacts', required: false, cardinality: 'multiple' }
    ]
  },
  serviceToggleSummary: {
    summaryId: 'opportunityServiceToggleSummary',
    options: [
      { key: 'renewables', label: 'Renewables', required: true },
      { key: 'stratosight', label: 'StratoSight', required: true },
      { key: 'both', label: 'Both', required: true },
      { key: 'otherOM', label: 'Other O&M', required: true }
    ]
  },
  workflowSummary: {
    summaryId: 'opportunityWorkflowSummary',
    metrics: [
      { key: 'stages', label: 'Stages', required: true },
      { key: 'statuses', label: 'Statuses', required: true },
      { key: 'rules', label: 'Rules', required: true }
    ]
  },
  quotesSummary: {
    summaryId: 'opportunityQuotesSummary',
    metrics: [
      { key: 'brandingProfiles', label: 'Branding Profiles', required: true },
      { key: 'requiredActions', label: 'Required Actions', required: true },
      { key: 'retentionRequirements', label: 'Retention Requirements', required: true }
    ]
  },
  quotes: {
    brandingProfiles: ['StratoSight', 'Renewables', 'Generic'],
    actionCount: 4
  },
  audit: {
    required: true
  }
};

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
