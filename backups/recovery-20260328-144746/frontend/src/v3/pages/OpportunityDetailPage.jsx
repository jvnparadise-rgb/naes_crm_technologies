import { Link, useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import SectionCard from '../components/layout/SectionCard';
import StatCard from '../components/layout/StatCard';
import { getOpportunityById, getAccountForOpportunity, formatCurrency } from '../mock/crmData';

export default function OpportunityDetailPage() {
  const { opportunityId } = useParams();
  const opportunity = getOpportunityById(opportunityId);
  const account = getAccountForOpportunity(opportunityId);

  if (!opportunity) {
    return (
      <AppShell title="Opportunities" subtitle="Dedicated opportunity detail page.">
        <PageHeader
          eyebrow="Opportunity Detail"
          title="Opportunity not found"
          subtitle="The requested opportunity record does not exist in the current V3 data set."
          backTo="/opportunities"
          backLabel="Back to Opportunities"
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Opportunities" subtitle="Dedicated opportunity detail page.">
      <PageHeader
        eyebrow="Opportunity Detail"
        title={opportunity.name}
        subtitle="Commercial summary, stage governance, forecast hygiene, and linked account."
        backTo="/opportunities"
        backLabel="Back to Opportunities"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="ARR" value={formatCurrency(opportunity.arr)} tone="success" />
        <StatCard label="Annual Revenue" value={formatCurrency(opportunity.annualRevenue)} />
        <StatCard label="CTS %" value={`${opportunity.ctsPercent}%`} />
        <StatCard label="Margin %" value={`${opportunity.marginPercent}%`} tone="success" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <SectionCard title="Commercial Summary">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['Account', account?.name || 'No Account'],
              ['Owner', opportunity.owner],
              ['Stage', opportunity.stage],
              ['Forecast Category', opportunity.forecastCategory],
              ['Expected Close', opportunity.expectedClose],
              ['ARR', formatCurrency(opportunity.arr)],
              ['Annual Revenue', formatCurrency(opportunity.annualRevenue)],
              ['Margin %', `${opportunity.marginPercent}%`],
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

        <SectionCard title="Connected Records">
          <div className="space-y-3">
            {account ? (
              <Link to={`/accounts/${account.id}`} className="naes-card block p-4">
                <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>
                  View Account
                </div>
                <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                  {account.name}
                </div>
              </Link>
            ) : null}

            <Link to="/contacts" className="naes-card block p-4">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>
                View Contacts
              </div>
              <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                Return to relationship roll-up.
              </div>
            </Link>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
