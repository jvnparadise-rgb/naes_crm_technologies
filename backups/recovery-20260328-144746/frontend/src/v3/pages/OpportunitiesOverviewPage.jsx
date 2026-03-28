import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SectionCard from '../components/layout/SectionCard';
import StatCard from '../components/layout/StatCard';
import { opportunities, getAccountById, formatCurrency } from '../mock/crmData';

export default function OpportunitiesOverviewPage() {
  const totalArr = opportunities.reduce((acc, item) => acc + item.arr, 0);
  const totalAnnual = opportunities.reduce((acc, item) => acc + item.annualRevenue, 0);
  const avgCts = Math.round(opportunities.reduce((acc, item) => acc + item.ctsPercent, 0) / opportunities.length);
  const avgMargin = Math.round(opportunities.reduce((acc, item) => acc + item.marginPercent, 0) / opportunities.length);

  return (
    <AppShell
      title="Opportunities"
      subtitle="Commercial roll-up across active deals, stage progression, forecast confidence, and revenue quality."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="ARR" value={formatCurrency(totalArr)} tone="success" />
        <StatCard label="Annual Revenue" value={formatCurrency(totalAnnual)} />
        <StatCard label="CTS %" value={`${avgCts}%`} />
        <StatCard label="Margin %" value={`${avgMargin}%`} tone="success" />
      </div>

      <div className="mt-4">
        <SectionCard title="Opportunity Roll-up" subtitle="Main page is the roll-up. Click any deal to enter its dedicated page.">
          <div className="grid gap-3">
            {opportunities.map((opp) => {
              const account = getAccountById(opp.accountId);

              return (
                <Link
                  key={opp.id}
                  to={`/opportunities/${opp.id}`}
                  className="naes-card p-4 transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <div className="text-lg font-bold" style={{ color: 'var(--naes-text)' }}>
                        {opp.name}
                      </div>
                      <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                        {account?.name || 'No Account'}, Owner: {opp.owner}, Stage: {opp.stage}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--naes-text-soft)' }}>
                          ARR
                        </div>
                        <div className="font-bold">{formatCurrency(opp.arr)}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--naes-text-soft)' }}>
                          Annual
                        </div>
                        <div className="font-bold">{formatCurrency(opp.annualRevenue)}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--naes-text-soft)' }}>
                          CTS
                        </div>
                        <div className="font-bold">{opp.ctsPercent}%</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--naes-text-soft)' }}>
                          Margin
                        </div>
                        <div className="font-bold">{opp.marginPercent}%</div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
