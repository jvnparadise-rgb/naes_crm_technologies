import React, { useMemo, useState } from 'react';

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

function getName(contact) {
  return contact?.fullName || [contact?.firstName, contact?.lastName].filter(Boolean).join(' ') || contact?.name || 'Contact';
}

function getTitle(contact) {
  return contact?.jobTitle || contact?.title || '—';
}

function getAccountName(contact, accounts = []) {
  const account = accounts.find((item) => item.id === contact.accountId);
  return account?.name || contact?.accountName || '—';
}

function getRole(contact) {
  if (contact?.decisionMaker) return 'Decision Maker';
  if (contact?.champion) return 'Champion';
  if (contact?.primaryContact) return 'Primary';
  return contact?.roleInBuyingProcess || '—';
}

function csvEscape(value) {
  const raw = String(value ?? '');
  return `"${raw.replaceAll('"', '""')}"`;
}

function exportContactsCSV(rows = [], accounts = []) {
  const headers = ['Name', 'Title', 'Account', 'Email', 'Mobile', 'Office', 'Preferred Contact', 'Role'];

  const data = rows.map((contact) => [
    getName(contact),
    getTitle(contact),
    getAccountName(contact, accounts),
    contact?.email || '',
    contact?.mobilePhone || '',
    contact?.officePhone || '',
    contact?.preferredContactMethod || '',
    getRole(contact),
  ]);

  const csv = [headers, ...data].map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `contacts_export_${new Date().toISOString().slice(0, 10)}.csv`;
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

export default function ContactsV2({ contacts = [], accounts = [], onOpenContact, onStartNewContact }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [accountFilter, setAccountFilter] = useState('All');

  const roles = ['All', ...Array.from(new Set((contacts || []).map(getRole))).sort()];
  const accountNames = ['All', ...Array.from(new Set((contacts || []).map((c) => getAccountName(c, accounts)))).sort()];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (contacts || []).filter((contact) => {
      const accountName = getAccountName(contact, accounts);
      const role = getRole(contact);
      const text = `${getName(contact)} ${getTitle(contact)} ${accountName} ${contact?.email || ''} ${contact?.mobilePhone || ''} ${role}`.toLowerCase();

      if (q && !text.includes(q)) return false;
      if (roleFilter !== 'All' && role !== roleFilter) return false;
      if (accountFilter !== 'All' && accountName !== accountFilter) return false;
      return true;
    });
  }, [contacts, accounts, search, roleFilter, accountFilter]);

  const decisionMakers = filtered.filter((item) => item.decisionMaker).length;
  const champions = filtered.filter((item) => item.champion).length;
  const primaryContacts = filtered.filter((item) => item.primaryContact).length;
  const linkedAccounts = new Set(filtered.map((item) => item.accountId).filter(Boolean)).size;

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gap: 16, color: '#18342a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#54745D' }}>Contacts</div>
          <h1 style={{ margin: '6px 0 0 0', fontSize: 26 }}>Relationship Directory</h1>
          <div style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>Decision makers, champions, primary contacts, and account relationships.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={onStartNewContact} style={{ border: 0, borderRadius: 14, background: '#0B6771', color: '#fff', padding: '11px 14px', fontWeight: 900, cursor: 'pointer' }}>
            + New Contact
          </button>
          <button type="button" onClick={() => exportContactsCSV(filtered, accounts)} style={smallButton}>Export CSV / Excel</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        <Metric label="Contacts" value={filtered.length} sub="Current filtered view" />
        <Metric label="Decision Makers" value={decisionMakers} sub="Buying authority" />
        <Metric label="Champions" value={champions} sub="Internal advocates" />
        <Metric label="Linked Accounts" value={linkedAccounts} sub="Companies represented" />
      </div>

      <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 220px 260px', gap: 10 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts, title, account, email..." style={inputStyle} />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={inputStyle}>
            {roles.map((role) => <option key={role}>{role}</option>)}
          </select>
          <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} style={inputStyle}>
            {accountNames.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>
      </section>

      <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', overflow: 'hidden' }}>
        <div style={{ padding: 14, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900 }}>Contact Directory</h3>
            <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>Compact, searchable contact control with account linkage and relationship flags.</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead style={{ background: '#F8FBF8' }}>
              <tr>
                {['Contact', 'Title', 'Account', 'Email', 'Mobile', 'Preferred', 'Role', 'Action'].map((head) => (
                  <th key={head} style={{ textAlign: 'left', padding: '9px 10px', borderTop: '1px solid #E5ECE5', borderBottom: '1px solid #E5ECE5', color: '#64748b', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr
                  key={contact.id || getName(contact)}
                  onClick={() => contact.id && onOpenContact?.(contact.id)}
                  style={{ borderBottom: '1px solid #EEF2F7', cursor: 'pointer' }}
                >
                  <td style={td}><strong>{getName(contact)}</strong></td>
                  <td style={td}>{getTitle(contact)}</td>
                  <td style={td}>{getAccountName(contact, accounts)}</td>
                  <td style={td}>{contact?.email || '—'}</td>
                  <td style={td}>{contact?.mobilePhone || '—'}</td>
                  <td style={td}>{contact?.preferredContactMethod || '—'}</td>
                  <td style={td}>{getRole(contact)}</td>
                  <td style={td}>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        contact.id && onOpenContact?.(contact.id);
                      }}
                      style={smallButton}
                    >
                      Edit</button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm('Delete this contact?')) return;
                          await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' });
                          alert('Contact deleted.');
                          window.location.reload();
                        }}
                        style={{
  ...smallButton,
  color: '#B11226',
  borderColor: '#F1B8C0',
  marginLeft: 6
}}
                      >
                        Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={8} style={{ padding: 18, color: '#64748b' }}>No contacts found. Use + New Contact to create a relationship record.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const td = {
  padding: '9px 10px',
  verticalAlign: 'top',
  color: '#18342a',
};
