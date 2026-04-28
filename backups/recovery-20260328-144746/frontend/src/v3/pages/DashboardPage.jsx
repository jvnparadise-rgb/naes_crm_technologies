import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SectionCard from '../components/layout/SectionCard';
import StatCard from '../components/layout/StatCard';
import { accounts, opportunities, formatCurrency } from '../mock/crmData';

const attentionItems = [
  '4 commit deals missing current expected close dates',
  '3 opportunities have no activity in 15+ days',
  '2 accounts show declining revenue confidence',
];

function sum(values) {
  return values.reduce((acc, value) => acc + value, 0);
}

export default function DashboardPage() {
  const arrPipeline = sum(opportunities.map((item) => item.arr));
  const year1Revenue = sum(opportunities.map((item) => item.annualRevenue));
  const averageMargin = Math.round(sum(opportunities.map((item) => item.marginPercent)) / opportunities.length);

  const kpis = [
    { label: 'ARR Pipeline', value: formatCurrency(arrPipeline), footnote: `${opportunities.length} active deals`, tone: 'success' },
    { label: 'Year 1 Revenue', value: formatCurrency(year1Revenue), footnote: `${accounts.length} active accounts`, tone: 'success' },
    { label: 'Weighted Pipeline', value: formatCurrency(Math.round(year1Revenue * 0.61)), footnote: 'Commit + Best Case blend', tone: 'neutral' },
    { label: 'Avg Margin %', value: `${averageMargin}%`, footnote: 'Commercial summary', tone: 'warning' },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle="Executive CRM operating view across pipeline, forecasting, accounts, contacts, and revenue performance."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} footnote={item.footnote} tone={item.tone} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <SectionCard
          title="Connected CRM Areas"
          subtitle="Entry points into the recovered V3 shell."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Link to="/accounts" className="naes-card p-4 transition hover:shadow-md">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>Accounts</div>
              <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                Roll-up view of customers, owners, ARR, CTS, and margin.
              </div>
            </Link>

            <Link to="/contacts" className="naes-card p-4 transition hover:shadow-md">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>Contacts</div>
              <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                Relationship records tied back to accounts.
              </div>
            </Link>

            <Link to="/opportunities" className="naes-card p-4 transition hover:shadow-md">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>Opportunities</div>
              <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                Overview page first, dedicated deal page on click.
              </div>
            </Link>

            <Link to="/pipeline/rollup" className="naes-card p-4 transition hover:shadow-md">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>Pipeline Rollup</div>
              <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                Reserved for team and executive pipeline views.
              </div>
            </Link>
          </div>
        </SectionCard>

        <SectionCard
          title="Attention Items"
          subtitle="Forecast integrity, stale opportunities, and overdue follow-up."
        >
          <div className="space-y-3">
            {attentionItems.map((item) => (
              <div
                key={item}
                className="rounded-2xl border p-3 text-sm"
                style={{ borderColor: 'var(--naes-border)', color: 'var(--naes-text-muted)' }}
              >
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
