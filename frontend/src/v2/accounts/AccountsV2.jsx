import React, { useMemo, useState } from 'react';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

const inputStyle = {
  width: '100%',
  border: '1px solid #D8E2D9',
  borderRadius: 12,
  background: '#fff',
  padding: '9px 11px',
  fontSize: 12,
  color: '#0f172a',
  boxSizing: 'border-box',
};

const smallButton = {
  border: '1px solid #DCE7DD',
  borderRadius: 999,
  background: '#FBFCFB',
  color: '#334155',
  padding: '7px 10px',
  fontSize: 11,
  fontWeight: 800,
  cursor: 'pointer',
};

function getAccountName(account) {
  return account?.name || 'Unnamed Account';
}

function getIndustry(account) {
  return account?.businessType || '—';
}

function getOwner(account) {
  return account?.owner || account?.primaryAccountOwner || 'Megan Smethurst';
}

function getStatus(account) {
  return account?.status || account?.customerStatus || 'Prospect';
}

function getServiceFit(account) {
  return account?.interestedServices || account?.serviceLineFit || '—';
}

function getPotential(account) {
  if (account?.revenuePotential) return Number(account.revenuePotential);
  if (account?.totalMw) return Number(account.totalMw);
  return 0;
}


function csvEscape(value) {
  const raw = String(value ?? '');
  return `"${raw.replaceAll('"', '""')}"`;
}

function exportAccountsCSV(rows = []) {
  const headers = ['Account','Parent Account','Industry','Service Fit','Status','Owner','Main Phone','General Email','City','State','Website','Total MW','Potential'];

  const data = rows.map((account) => [
    getAccountName(account),
    account?.parentAccount || account?.parent_account || '',
    getIndustry(account),
    getServiceFit(account),
    getStatus(account),
    getOwner(account),
    account?.mainPhone || '',
    account?.generalEmail || '',
    account?.city || '',
    account?.state || '',
    account?.website || '',
    account?.totalMw || '',
    getPotential(account) || ''
  ]);

  const csv = [headers, ...data].map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `accounts_export_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function Metric({ label, value, sub }) {
  return (
    <div style={{ border: '1px solid #E5ECE5', borderRadius: 16, padding: 14, background: '#FBFCFB' }}>
      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
      <div style={{ marginTop: 7, fontSize: 21, fontWeight: 950, color: '#111827' }}>{value}</div>
      {sub ? <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>{sub}</div> : null}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#18342a' }}>{title}</h3>
      {subtitle ? <div style={{ marginTop: 4, marginBottom: 12, fontSize: 12, color: '#64748b' }}>{subtitle}</div> : <div style={{ height: 12 }} />}
      {children}
    </section>
  );
}

function mapLegacyAccountToModern(account = {}) {
  return {
    id: account.id || '',
    name: account.name || '',
    parentAccount: account.parentAccount || account.parent_account || '',
    industry: account.industry || account.businessType || account.accountType || 'Commercial / Industrial',
    serviceLineFit: account.serviceLineFit || account.interestedServices || 'Both',
    region: account.region || account.generalFootprintRegion || '',
    state: account.state || '',
    mainAddress: account.mainAddress || account.address1 || '',
    city: account.city || '',
    zip: account.zip || account.postalCode || '',
    country: account.country || 'USA',
    mainPhone: account.mainPhone || account.phone || '',
    generalEmail: account.generalEmail || account.email || '',
    website: account.website || '',
    siteCount: account.siteCount || account.estimatedBuildingCount || account.estimatedSiteCount || '',
    estimatedMw: account.estimatedMw || account.totalMw || '',
    estimatedSqft: account.estimatedSqft || account.estimatedSquareFootage || '',
    geographicSpread: account.geographicSpread || account.generalFootprintRegion || 'Regional',
    revenueTier: account.revenueTier || account.portfolioType || 'Mid, $250k-$1M',
    strategicAccount: account.strategicAccount || 'No',
    relationshipStatus: account.relationshipStatus || 'New Prospect',
    decisionComplexity: account.decisionComplexity || 'Medium',
    procurementType: account.procurementType || 'Formal RFP',
    customerDifficulty: account.customerDifficulty || 'Moderate',
    status: account.status || account.accountStatus || account.customerStatus || 'Prospect',
    owner: account.owner || account.primaryAccountOwner || '',
    notes: account.notes || '',
  };
}

function modernAccountToLegacy(account = {}) {
  return {
    ...account,
    businessType: account.industry,
    accountType: account.industry,
    interestedServices: account.serviceLineFit,
    totalMw: account.estimatedMw,
    estimatedMw: account.estimatedMw,
    estimatedBuildingCount: account.siteCount,
    siteCount: account.siteCount,
    estimatedSquareFootage: account.estimatedSqft,
    estimatedSqft: account.estimatedSqft,
    generalFootprintRegion: account.region,
    geographicSpread: account.geographicSpread,
    portfolioType: account.revenueTier,
    revenueTier: account.revenueTier,
    strategicAccount: account.strategicAccount,
    relationshipStatus: account.relationshipStatus,
    status: account.status,
    accountStatus: account.status,
    decisionComplexity: account.decisionComplexity,
    procurementType: account.procurementType,
    customerDifficulty: account.customerDifficulty,
    primaryAccountOwner: account.owner || account.primaryAccountOwner || '',
    owner: account.owner || account.primaryAccountOwner || '',
    notes: account.notes,
    legalBusinessName: account.legalBusinessName || account.name,
  };
}

export function NewAccountPanel({ onCancel, onCreate, initialAccount = {}, mode = 'new' }) {
  const [draft, setDraft] = 

  
useState(() => ({
    name: '',
    parentAccount: '',
    industry: 'Commercial / Industrial',
    serviceLineFit: 'Both',
    region: '',
    state: '',
    mainAddress: '',
    city: '',
    zip: '',
    country: 'USA',
    mainPhone: '',
    generalEmail: '',
    website: '',
    siteCount: '',
    estimatedMw: '',
    estimatedSqft: '',
    geographicSpread: 'Regional',
    revenueTier: 'Mid, $250k-$1M',
    strategicAccount: 'No',
    relationshipStatus: 'New Prospect',
    decisionComplexity: 'Medium',
    procurementType: 'Formal RFP',
    customerDifficulty: 'Moderate',
    status: 'Prospect',
    owner: '',
    notes: '',
    ...mapLegacyAccountToModern(initialAccount),
  }));

  function update(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function field(label, key, children) {
    return (
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b' }}>{label}</span>
        {children || <input value={draft[key]} onChange={(e) => update(key, e.target.value)} style={inputStyle} />}
      </label>
    );
  }

  function select(label, key, options) {
    return field(label, key, (
      <select value={draft[key]} onChange={(e) => update(key, e.target.value)} style={inputStyle}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    ));
  }

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Section title={mode === 'edit' ? 'Edit Account Intake' : 'New Account Intake'} subtitle="Structured account entry so contacts, deals, and analytics start clean.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          {field('Account Name', 'name')}
          {field('Parent Account', 'parentAccount')}
          {select('Industry', 'industry', ['Commercial / Industrial', 'Renewables', 'Retail', 'Manufacturing', 'Logistics', 'Municipal / Government', 'Utility / IPP', 'Other'])}
          {select('Service Line Fit', 'serviceLineFit', ['Renewables', 'StratoSight', 'Both', 'Other O&M'])}
          {field('Region', 'region')}
          {field('State', 'state')}
        </div>
      </Section>

      <Section title="Company Contact & Address" subtitle="Core account reachability and location details.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          {field('Main Address', 'mainAddress')}
          {field('City', 'city')}
          {field('State', 'state')}
          {field('ZIP', 'zip')}
          {field('Country', 'country')}
          {field('Main Phone', 'mainPhone')}
          {field('General Email', 'generalEmail')}
          {field('Website', 'website')}
        </div>
      </Section>

      <Section title="Portfolio Profile" subtitle="Scale and complexity profile used for segmentation and future deal quality.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
          {field('Site Count', 'siteCount')}
          {field('Estimated MW', 'estimatedMw')}
          {field('Estimated SqFt', 'estimatedSqft')}
          {select('Geographic Spread', 'geographicSpread', ['Local', 'Regional', 'National', 'Multi-region'])}
        </div>
      </Section>

      <Section title="Commercial & Customer Profile" subtitle="Flags that explain how hard the account will be to sell and support.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
          {select('Revenue Potential Tier', 'revenueTier', ['Small, <$250k', 'Mid, $250k-$1M', 'Large, $1M+', 'Enterprise, $5M+'])}
          {select('Strategic Account', 'strategicAccount', ['No', 'Yes'])}
          {select('Relationship Status', 'relationshipStatus', ['New Prospect', 'Existing Relationship', 'Active Customer', 'Former Customer'])}
          {select('Account Status', 'status', ['Prospect', 'Active Customer', 'Former Customer', 'Lost Opportunity', 'Archived'])}
          {select('Decision Complexity', 'decisionComplexity', ['Low', 'Medium', 'High'])}
          {select('Procurement Type', 'procurementType', ['Informal', 'Formal RFP', 'Sole Source', 'Framework Agreement', 'Unknown'])}
          {select('Customer Difficulty', 'customerDifficulty', ['Easy', 'Moderate', 'Difficult', 'Unknown'])}
          {field('Account Owner', 'owner')}
        </div>

        <label style={{ display: 'grid', gap: 6, marginTop: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b' }}>Notes</span>
          <textarea value={draft.notes} onChange={(e) => update('notes', e.target.value)} style={{ ...inputStyle, minHeight: 78 }} />
        </label>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        {mode === 'edit' ? (
          <button
            onClick={async () => {
              if (!confirm('Delete this account? This cannot be undone.')) return;
              if (window.deleteAccount) {
                await window.deleteAccount(draft._backend?.id || draft.id);
                alert('Account deleted.');
              }
              onCancel?.();
            }}
            style={{
              border: 0,
              borderRadius: 12,
              background: '#B11226',
              color: '#fff',
              padding: '10px 14px',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            Delete Account
          </button>
        ) : <div />}

        <button onClick={onCancel} style={smallButton}>Cancel</button>
        <button
            onClick={async () => {
              const converted = modernAccountToLegacy(draft);
              await onCreate?.({
                ...converted,
                ...(mode === 'edit' && draft.id ? { id: draft.id } : {}),
                created_at: draft.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }}
          style={{ ...smallButton, border: 0, background: '#0B6771', color: '#fff', padding: '10px 14px' }}
        >
          {mode === 'edit' ? 'Save Changes' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}

function exportCSV(rows) {
  const headers = ['Name','Industry','Services','Status','Owner','MW'];
  const data = rows.map(r => [
    r.name,
    r.businessType,
    r.interestedServices,
    r.status,
    r.primaryAccountOwner,
    r.totalMw
  ]);

  const csv = [headers, ...data].map(e => e.join(",")).join("\n");
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'accounts_export.csv';
  a.click();
}

export default function AccountsV2({ accounts = [], onOpenAccount, onStartNewAccount, onCreateAccount, onUpdateAccount, forceOpenNewAccount = false, onClearForceOpenNewAccount }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [showNew, setShowNew] = useState(false);

  React.useEffect(() => {
    if (forceOpenNewAccount) {
      setShowNew(true);
    }
  }, [forceOpenNewAccount]);


  const [editingAccount, setEditingAccount] = useState(null);
  const [localAccounts, setLocalAccounts] = useState([]);

  const allAccounts = (Array.isArray(accounts) ? accounts : []).map(mapLegacyAccountToModern);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allAccounts.filter((account) => {
      const text = `${getAccountName(account)} ${getIndustry(account)} ${getOwner(account)} ${getStatus(account)} ${getServiceFit(account)}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (statusFilter !== 'All' && getStatus(account) !== statusFilter) return false;
      if (serviceFilter !== 'All' && getServiceFit(account) !== serviceFilter) return false;
      return true;
    });
  }, [allAccounts, search, statusFilter, serviceFilter]);

  const statuses = ['All', ...Array.from(new Set(allAccounts.map(getStatus))).sort()];
  const services = ['All', ...Array.from(new Set(allAccounts.map(getServiceFit))).sort()];

const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('account');
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }
const pageSize = 25;
const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
const sorted = [...filtered].sort((a, b) => {
  const dir = sortDir === 'asc' ? 1 : -1;

  const getVal = (row) => {
    if (sortKey === 'account') return getAccountName(row).toLowerCase();
    if (sortKey === 'industry') return getIndustry(row).toLowerCase();
    if (sortKey === 'service') return getServiceFit(row).toLowerCase();
    if (sortKey === 'status') return getStatus(row).toLowerCase();
    if (sortKey === 'owner') return getOwner(row).toLowerCase();
    return '';
  };

  return getVal(a).localeCompare(getVal(b)) * dir;
});

const paged = sorted.slice((page-1)*pageSize, page*pageSize);


  if (editingAccount) {
    return (
      <AccountsV2Shell title="Edit Account" subtitle="Update account structure, ownership, service fit, and account intelligence.">
        <NewAccountPanel
          mode="edit"
          initialAccount={editingAccount}
          onCancel={() => setEditingAccount(null)}
          onCreate={async (draft) => {
            if (onUpdateAccount) {
              await onUpdateAccount(draft);
            }
            setEditingAccount(null);
          }}
        />
</AccountsV2Shell>

    );
  }

  if (showNew) {
    return (
      <AccountsV2Shell title="Add Account" subtitle="Create a new account record and connect it cleanly to contacts, deals, and ownership.">
        <NewAccountPanel
          onCancel={() => { setShowNew(false); onClearForceOpenNewAccount?.(); }}
            onCreate={async (account) => {
              if (onCreateAccount) {
                await onCreateAccount(account);
              }
              setShowNew(false);
              onClearForceOpenNewAccount?.();
            }}
        />
</AccountsV2Shell>

    );
  }

  return (
    <AccountsV2Shell onNew={onStartNewAccount || (() => setShowNew(true))}>
<section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 220px 220px', gap: 10 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search accounts, industry, owner..." style={inputStyle} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} style={inputStyle}>{services.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
      </section>

      <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', overflow: 'hidden' }}>
        <div style={{ padding: 14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#18342a' }}>Account Directory</h3>
</div>
  <div style={{ display: 'flex', gap: 8 }}>
    <button
      style={{ ...smallButton, border: 0, background: '#0B6771', color: '#fff' }}
      onClick={() => setShowNew(true)}
    >
      + New Account
    </button>
    <button style={smallButton} onClick={() => exportCSV(filtered)}>Export CSV</button>
  </div>
</div>
          <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>Compact, searchable account control with structured intake.</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead style={{ background: '#F8FBF8' }}>
                <tr>
                  {[
                    { label: 'Account', key: 'account' },
                    { label: 'Industry', key: 'industry' },
                    { label: 'Service Fit', key: 'service' },
                    { label: 'Status', key: 'status' },
                    { label: 'Owner', key: 'owner' }
                  ].map((h) => (
                    <th
                      key={h.key}
                      onClick={() => handleSort(h.key)}
                      style={{
                        textAlign: 'left',
                        padding: '9px 10px',
                        borderTop: '1px solid #E5ECE5',
                        borderBottom: '1px solid #E5ECE5',
                        color: '#64748b',
                        fontSize: 10,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      {h.label}{sortKey === h.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
            <tbody>
              {paged.map((account) => (
                <tr
  key={account.id || getAccountName(account)}
  onClick={() => setEditingAccount(account._backend || account)}
  style={{ borderBottom: '1px solid #EEF2F7', cursor: 'pointer' }}
>
                  <td style={td}><strong>{getAccountName(account)}</strong><div style={{ color: '#64748b', fontSize: 11 }}>{account.parentAccount || account.parent_account || ''}</div></td>
                  <td style={td}>{getIndustry(account)}</td>
                  <td style={td}>{getServiceFit(account)}</td>
                  <td style={td}>{getStatus(account)}</td>
                  <td style={td}>{getOwner(account)}</td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={5} style={{ padding: 18, color: '#64748b' }}>No accounts yet. Use + New Account to create a clean account profile.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    
          <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5ECE5' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} accounts
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)} style={smallButton}>Prev</button>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Page {page} / {totalPages}</div>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={smallButton}>Next</button>
            </div>
          </div>
</AccountsV2Shell>

  );
}

function AccountsV2Shell({ children, onNew, title = 'Account Directory', subtitle = 'Portfolio-level customer records, service fit, ownership, and account linkage.' }) {
  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gap: 16, color: '#18342a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#54745D' }}>Accounts</div>
          <h1 style={{ margin: '6px 0 0 0', fontSize: 26 }}>{title}</h1>
          <div style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>{subtitle}</div>
        </div>

      </div>
      {children}
    </div>
  );
}

const td = {
  padding: '9px 10px',
  verticalAlign: 'top',
  color: '#18342a',
};
