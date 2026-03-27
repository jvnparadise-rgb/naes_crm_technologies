import React from 'react';

const sidebarItems = [
  'Dashboard',
  'My Pipeline',
  'Pipeline Rollup',
  'Forecast Dashboard',
  'Forecast Integrity',
  'Period Control',
  'Accounts',
  'Contacts',
  'Tasks',
  'Activities',
  'Opportunities',
  'Revenue Command Center',
  'Client Reports',
  'Settings'
];

const topStrip = [
  { label: 'TECHNOLOGIES', accent: '#19D4D4', bg: '#063C43' },
  { label: 'RENEWABLES', accent: '#6E9F52', bg: '#183523' },
  { label: 'STRATOSIGHT', accent: '#1FA8FF', bg: '#0A2E52' }
];

const serviceOptions = ['Renewables', 'StratoSight', 'Both', 'Other O&M'];
const workflowStages = [
  '0 Prospecting',
  '1 Qualified',
  '2 Discovery',
  '3 Solution Fit',
  '4 Commercials',
  '5 Security Legal',
  '6 Commit',
  '7 Closed Won',
  '8 Closed Lost'
];

const kpis = [
  ['Estimated Year 1', '$245,000'],
  ['Weighted Revenue', '$122,500'],
  ['Expected Close', 'Jun 30, 2026'],
  ['Forecast', 'Best Case']
];

const shellCard = {
  borderRadius: '28px',
  border: '1px solid #D8E2D7',
  background: '#FFFFFF',
  padding: '24px',
  boxShadow: '0 18px 40px rgba(31,41,55,0.06)'
};

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#E8EEEB', color: '#0f172a', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', minHeight: '100vh' }}>
        <aside style={{ borderRight: '1px solid #0E545D', background: '#043941', color: '#fff' }}>
          <div style={{ borderBottom: '1px solid #0E545D', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#19D4D4' }}>
                  NAES CRM
                </div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  Operational commercial command
                </div>
              </div>
              <div style={{ border: '1px solid #0F6670', background: '#054E57', borderRadius: '12px', padding: '6px 10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#19D4D4' }}>
                Live
              </div>
            </div>

            <div style={{ marginTop: '12px', borderRadius: '24px', border: '1px solid #0C5A63', background: '#055059', padding: '16px', boxShadow: '0 12px 28px rgba(0,0,0,0.24)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Jeff Yarbrough</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>VP of Operations</div>
                  <div style={{ marginTop: '8px', display: 'inline-flex', borderRadius: '999px', background: '#0B6771', padding: '4px 10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B6FFFB' }}>
                    Admin
                  </div>
                </div>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#0C6670', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', color: '#DDFEFB' }}>
                  JY
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '16px 12px' }}>
            <div style={{ marginBottom: '12px', padding: '0 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)' }}>
              Workspace
            </div>
            <nav style={{ display: 'grid', gap: '4px' }}>
              {sidebarItems.map((item) => {
                const active = item === 'Opportunities';
                return (
                  <button
                    key={item}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      borderRadius: '18px',
                      padding: '10px 12px',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: active ? '#0B6771' : 'transparent',
                      color: active ? '#fff' : 'rgba(255,255,255,0.82)',
                      boxShadow: active ? '0 10px 24px rgba(0,0,0,0.28)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{item}</span>
                    {active ? <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.8 }}>Active</span> : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main style={{ minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', borderBottom: '1px solid #0E545D', background: '#052F35' }}>
            {topStrip.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  borderRight: '1px solid #0E545D',
                  background: `linear-gradient(180deg, ${item.bg}, #052F35)`
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: item.accent }}>
                  NAES {item.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(90deg,#063F47 0%,#0A7983 40%,#21C8D3 70%,#239EE2 100%)', padding: '32px', color: '#fff', boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                  Opportunity Workspace
                </div>
                <h1 style={{ margin: '4px 0 0 0', fontSize: '34px', fontWeight: 600, letterSpacing: '-0.03em', color: '#fff' }}>
                  Ashley Furniture MSA
                </h1>
                <p style={{ marginTop: '8px', maxWidth: '720px', fontSize: '14px', color: 'rgba(255,255,255,0.78)' }}>
                  Executive-grade Opportunity page direction with shell context, service-line controls, workflow governance, and space reserved for quotes and audit history.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ borderRadius: '999px', border: '1px solid rgba(255,255,255,0.30)', background: 'rgba(255,255,255,0.10)', padding: '8px 16px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>
                  App Preview
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
              <section style={shellCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#54745D' }}>Opportunity Header</div>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Ashley Furniture MSA</h2>
                      <span style={{ borderRadius: '999px', background: '#E8F2EA', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#2F6B4F' }}>Best Case</span>
                      <span style={{ borderRadius: '999px', background: '#FFF3DE', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#9B6A11' }}>Q2 2026</span>
                      <span style={{ borderRadius: '999px', background: '#FBE8E4', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#B25547' }}>At Risk</span>
                    </div>
                    <p style={{ marginTop: '12px', maxWidth: '760px', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
                      National opportunity spanning Renewables and StratoSight service lines, intended to show page density, leadership readability, and shell direction before deeper live page wiring.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gap: '12px', minWidth: '320px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    {kpis.map(([label, value]) => (
                      <div key={label} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                        <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 600 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section style={{ display: 'grid', gap: '24px', gridTemplateColumns: '0.72fr 1.28fr' }}>
                <div style={{ display: 'grid', gap: '24px' }}>
                  <div style={shellCard}>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#54745D' }}>Relationship Block</div>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Account and Contacts</h3>
                    <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
                      {[
                        ['Linked Account', 'Ashley Furniture Industries'],
                        ['Primary Contact', 'Megan Smethurst'],
                        ['Additional Contacts', '3 linked stakeholders']
                      ].map(([label, value]) => (
                        <div key={label} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                          <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={shellCard}>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#54745D' }}>Service Line Block</div>
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Pricing and Service Selection</h3>
                      <span style={{ borderRadius: '999px', background: '#E8F2EA', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#2F6B4F' }}>Single Select</span>
                    </div>
                    <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                      {serviceOptions.map((option) => {
                        const active = option === 'Both';
                        return (
                          <button
                            key={option}
                            style={{
                              borderRadius: '18px',
                              padding: '16px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              border: `1px solid ${active ? '#0B6771' : '#DCE7DD'}`,
                              background: active ? '#0B6771' : '#FBFCFB',
                              color: active ? '#fff' : '#1f2937',
                              boxShadow: active ? '0 12px 24px rgba(11,103,113,0.22)' : 'none'
                            }}
                          >
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{option}</div>
                            <div style={{ marginTop: '4px', fontSize: '12px', color: active ? 'rgba(255,255,255,0.8)' : '#64748b' }}>
                              {option === 'Other O&M' ? 'User-entered pricing path' : 'Predefined pricing path'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '24px' }}>
                  <div style={shellCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#54745D' }}>Workflow Block</div>
                        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Stage and Governance</h3>
                      </div>
                      <div style={{ borderRadius: '18px', border: '1px solid #E4ECE4', background: '#F5F8F5', padding: '8px 16px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                        9 stages, 6 statuses
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                      {[
                        ['Stages', '9'],
                        ['Statuses', '6'],
                        ['Rule Set', 'Quotes gated by stage']
                      ].map(([label, value]) => (
                        <div key={label} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                          <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 600 }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {workflowStages.map((stage, idx) => (
                        <span
                          key={stage}
                          style={{
                            borderRadius: '999px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 500,
                            background: idx === 3 ? '#0B6771' : '#F2F5F2',
                            color: idx === 3 ? '#fff' : '#334155'
                          }}
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <div style={{ ...shellCard, borderStyle: 'dashed', borderColor: '#C9D8CA' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#54745D' }}>Quotes Block</div>
                      <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Still placeholder-backed</h3>
                      <p style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
                        This is the next logical live renderer. It is shown here only so you can judge the visual balance and button treatment before we wire the repo slice.
                      </p>
                      <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {['Create Quote', 'Preview PDF', 'Send Quote', 'View History'].map((action) => (
                          <button key={action} style={{ borderRadius: '18px', border: '1px solid #DCE7DD', background: '#FBFCFB', padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ ...shellCard, borderStyle: 'dashed', borderColor: '#C9D8CA' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#54745D' }}>Audit Block</div>
                      <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Still placeholder-backed</h3>
                      <p style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
                        This remains summary-backed for now. In the mounted page it would show user, timestamp, and field-level change lineage.
                      </p>
                      <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
                        {[
                          'Updated close date from Jul 15 to Jun 30',
                          'Service line changed from Renewables to Both',
                          'Primary contact linked to Megan Smethurst'
                        ].map((item) => (
                          <div key={item} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '12px', fontSize: '14px', color: '#334155' }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
