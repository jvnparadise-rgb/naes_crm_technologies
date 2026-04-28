import { Link, useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import SectionCard from '../components/layout/SectionCard';
import StatCard from '../components/layout/StatCard';
import {
  getAccountById,
  getContactsForAccount,
  getOpportunitiesForAccount,
  formatCurrency,
} from '../mock/crmData';

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const account = getAccountById(accountId);
  const relatedContacts = getContactsForAccount(accountId);
  const relatedOpps = getOpportunitiesForAccount(accountId);

  if (!account) {
    return (
      <AppShell title="Accounts" subtitle="Dedicated account detail page.">
        <PageHeader
          eyebrow="Account Detail"
          title="Account not found"
          subtitle="The requested account record does not exist in the current V3 data set."
          backTo="/accounts"
          backLabel="Back to Accounts"
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Accounts" subtitle="Dedicated account detail page.">
      <PageHeader
        eyebrow="Account Detail"
        title={account.name}
        subtitle="Commercial summary, linked contacts, linked opportunities, and relationship detail."
        backTo="/accounts"
        backLabel="Back to Accounts"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open Opportunities" value={String(relatedOpps.length)} />
        <StatCard label="Contacts" value={String(relatedContacts.length)} />
        <StatCard label="ARR" value={formatCurrency(account.arr)} tone="success" />
        <StatCard label="Annual Revenue" value={formatCurrency(account.annualRevenue)} tone="success" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <SectionCard title="Commercial Summary" subtitle="Primary relationship and revenue context for this account.">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['Account Name', account.name],
              ['Segment', account.segment],
              ['Region', account.region],
              ['Owner', account.owner],
              ['CTS %', `${account.ctsPercent}%`],
              ['Margin %', `${account.marginPercent}%`],
              ['ARR', formatCurrency(account.arr)],
              ['Annual Revenue', formatCurrency(account.annualRevenue)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--naes-border)' }}>
                <div className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--naes-text-soft)' }}>
                  {label}
                </div>
                <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--naes-text)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Quick Navigation" subtitle="Direct links into related CRM records.">
          <div className="space-y-3">
            <Link to="/dashboard" className="naes-card block p-3">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>Dashboard</div>
              <div className="mt-1 text-xs" style={{ color: 'var(--naes-text-muted)' }}>
                Return to executive roll-up.
              </div>
            </Link>

            <Link to="/contacts" className="naes-card block p-3">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>Contacts</div>
              <div className="mt-1 text-xs" style={{ color: 'var(--naes-text-muted)' }}>
                View all relationship records.
              </div>
            </Link>

            <Link to="/opportunities" className="naes-card block p-3">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>Opportunities</div>
              <div className="mt-1 text-xs" style={{ color: 'var(--naes-text-muted)' }}>
                View all deal records.
              </div>
            </Link>
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Linked Contacts" subtitle="Contacts tied directly to this account.">
          <div className="space-y-3">
            {relatedContacts.map((contact) => (
              <Link
                key={contact.id}
                to={`/contacts/${contact.id}`}
                className="block rounded-2xl border p-4"
                style={{ borderColor: 'var(--naes-border)' }}
              >
                <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>
                  {contact.name}
                </div>
                <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                  {contact.title}, {contact.email}
                </div>
              </Link>
            ))}

            {relatedContacts.length === 0 ? (
              <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--naes-border)', color: 'var(--naes-text-muted)' }}>
                No contacts linked yet.
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="Linked Opportunities" subtitle="Open or relevant deal records tied to this account.">
          <div className="space-y-3">
            {relatedOpps.map((opp) => (
              <Link
                key={opp.id}
                to={`/opportunities/${opp.id}`}
                className="block rounded-2xl border p-4"
                style={{ borderColor: 'var(--naes-border)' }}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>
                      {opp.name}
                    </div>
                    <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                      {opp.stage}, {opp.forecastCategory}, Close {opp.expectedClose}
                    </div>
                  </div>

                  <div className="text-sm font-black" style={{ color: 'var(--naes-primary-strong)' }}>
                    {formatCurrency(opp.annualRevenue)}
                  </div>
                </div>
              </Link>
            ))}

            {relatedOpps.length === 0 ? (
              <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: 'var(--naes-border)', color: 'var(--naes-text-muted)' }}>
                No opportunities linked yet.
              </div>
            ) : null}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
