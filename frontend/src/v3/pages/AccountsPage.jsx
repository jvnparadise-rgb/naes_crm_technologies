import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SectionCard from '../components/layout/SectionCard';
import StatCard from '../components/layout/StatCard';
import { accounts, getContactsForAccount, getOpportunitiesForAccount, formatCurrency } from '../mock/crmData';

export default function AccountsPage() {
  const totalArr = accounts.reduce((acc, item) => acc + item.arr, 0);
  const totalAnnual = accounts.reduce((acc, item) => acc + item.annualRevenue, 0);
  const avgCts = Math.round(accounts.reduce((acc, item) => acc + item.ctsPercent, 0) / accounts.length);
  const avgMargin = Math.round(accounts.reduce((acc, item) => acc + item.marginPercent, 0) / accounts.length);

  return (
    <AppShell
      title="Accounts"
      subtitle="Portfolio-level roll-up of customers, owners, opportunity exposure, contacts, and revenue footprint."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total ARR" value={formatCurrency(totalArr)} footnote={`${accounts.length} accounts`} tone="success" />
        <StatCard label="Annual Revenue" value={formatCurrency(totalAnnual)} footnote="Roll-up total" tone="success" />
        <StatCard label="Average CTS %" value={`${avgCts}%`} footnote="Account average" />
        <StatCard label="Average Margin %" value={`${avgMargin}%`} footnote="Commercial average" tone="success" />
      </div>

      <div className="mt-4">
        <SectionCard
          title="Account Roll-up"
          subtitle="This is the main page. Click an account to open its dedicated detail page."
        >
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--naes-border)' }}>
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--naes-border)' }}>
              <thead style={{ background: 'var(--naes-surface-alt)' }}>
                <tr>
                  {['Account', 'Segment', 'Owner', 'Contacts', 'Open Opps', 'ARR', 'Annual', 'CTS %', 'Margin %'].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em]"
                      style={{ color: 'var(--naes-text-soft)' }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const relatedContacts = getContactsForAccount(account.id);
                  const relatedOpps = getOpportunitiesForAccount(account.id);

                  return (
                    <tr key={account.id} className="border-t" style={{ borderColor: 'var(--naes-border)' }}>
                      <td className="px-4 py-4">
                        <Link to={`/accounts/${account.id}`} className="font-semibold" style={{ color: 'var(--naes-primary-strong)' }}>
                          {account.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                        {account.segment}
                      </td>
                      <td className="px-4 py-4 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                        {account.owner}
                      </td>
                      <td className="px-4 py-4 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                        {relatedContacts.length}
                      </td>
                      <td className="px-4 py-4 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                        {relatedOpps.length}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold" style={{ color: 'var(--naes-text)' }}>
                        {formatCurrency(account.arr)}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold" style={{ color: 'var(--naes-text)' }}>
                        {formatCurrency(account.annualRevenue)}
                      </td>
                      <td className="px-4 py-4 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                        {account.ctsPercent}%
                      </td>
                      <td className="px-4 py-4 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                        {account.marginPercent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
