import React, { useMemo, useState } from 'react';
import PipelineOverTimeChart from './charts/PipelineOverTimeChart.jsx';
import QuarterlyForecastChart from './charts/QuarterlyForecastChart.jsx';
import ServiceMixOverTimeChart from './charts/ServiceMixOverTimeChart.jsx';
import StageRiskFunnelChart from './charts/StageRiskFunnelChart.jsx';
import DealAgingChart from './charts/DealAgingChart.jsx';
import RawVsWeightedChart from './charts/RawVsWeightedChart.jsx';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function getAmount(opp) {
  return Number(opp?.weighted_revenue ?? opp?.calculated_revenue ?? opp?.amount_total ?? opp?.amount_estimated ?? 0);
}

function getRawAmount(opp) {
  return Number(opp?.calculated_revenue ?? opp?.amount_total ?? opp?.amount_estimated ?? 0);
}

function getStage(opp) {
  return String(opp?.stage || 'Unstaged');
}

function getService(opp) {
  return String(opp?.service_line || opp?.market_segment || 'Other');
}

function getOwner(opp) {
  return String(opp?.owner_full_name || opp?.ownerName || opp?.owner || 'Unassigned');
}

function getQuarter(dateString) {
  if (!dateString) return 'No Date';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return 'No Date';
  return `${d.getFullYear()} Q${Math.floor(d.getMonth() / 3) + 1}`;
}

function groupSum(rows, keyFn, valueFn = getAmount) {
  const map = new Map();
  rows.forEach((row) => {
    const key = keyFn(row);
    map.set(key, (map.get(key) || 0) + valueFn(row));
  });
  return Array.from(map.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}


function csvEscape(value) {
  const raw = String(value ?? '');
  return `"${raw.replaceAll('"', '""')}"`;
}

function downloadOpportunitiesCsv(rows = []) {
  const headers = [
    'Deal',
    'Account',
    'Service',
    'Stage',
    'Owner',
    'Expected Close Date',
    'Raw Amount',
    'Weighted Amount'
  ];

  const data = rows.map((opp) => [
    opp?.name || '',
    opp?.account_name || opp?.accountName || opp?.account || '',
    getService(opp),
    getStage(opp),
    getOwner(opp),
    opp?.expected_close_date || '',
    getRawAmount(opp),
    getAmount(opp)
  ]);

  const csv = [headers, ...data]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `opportunities_export_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


function ChartCard({ title, subtitle, children }) {
  return (
    <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#18342a' }}>{title}</h3>
          {subtitle ? <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>{subtitle}</div> : null}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          
          
        </div>
      </div>
      {children}
    </section>
  );
}

const smallButton = {
  border: '1px solid #DCE7DD',
  borderRadius: 999,
  background: '#FBFCFB',
  color: '#334155',
  padding: '6px 9px',
  fontSize: 10,
  fontWeight: 800,
  cursor: 'pointer',
};

function Metric({ label, value, sub }) {
  return (
    <div style={{ border: '1px solid #E5ECE5', borderRadius: 16, padding: 14, background: '#FBFCFB' }}>
      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
      <div style={{ marginTop: 7, fontSize: 22, fontWeight: 950, color: '#111827' }}>{value}</div>
      {sub ? <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>{sub}</div> : null}
    </div>
  );
}

function SimpleBarChart({ rows, valueFormatter = money }) {
  const max = Math.max(...rows.map((r) => Number(r.value || 0)), 1);
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {rows.slice(0, 8).map((row) => (
        <div key={row.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12, fontWeight: 800, color: '#334155' }}>
            <span>{row.label}</span>
            <span>{valueFormatter(row.value)}</span>
          </div>
          <div style={{ marginTop: 5, height: 10, borderRadius: 999, background: '#EEF4EF', overflow: 'hidden' }}>
            <div style={{ width: `${Math.max(4, (Number(row.value || 0) / max) * 100)}%`, height: '100%', borderRadius: 999, background: '#0B6771' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FunnelChart({ rows }) {
  const max = Math.max(...rows.map((r) => Number(r.value || 0)), 1);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {rows.slice(0, 7).map((row, idx) => (
        <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 110px', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#334155' }}>{row.label}</div>
          <div style={{ height: 24, borderRadius: 999, background: '#EEF4EF', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.max(8, (Number(row.value || 0) / max) * 100)}%`,
              height: '100%',
              background: idx < 2 ? '#7FB3D5' : idx < 5 ? '#0B6771' : '#2F7552',
              borderRadius: 999,
            }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#111827', textAlign: 'right' }}>{money(row.value)}</div>
        </div>
      ))}
    </div>
  );
}

export default function OpportunitiesV2({ opportunities = [], onOpenOpportunity, onStartNewDeal, onDeleteOpportunity , titleOverride = null}) {
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [sortKey, setSortKey] = useState('weighted');
  const [sortDir, setSortDir] = useState('desc');

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (opportunities || []).filter((opp) => {
      const text = `${opp?.name || ''} ${opp?.account_name || ''} ${getOwner(opp)} ${getService(opp)} ${getStage(opp)}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (serviceFilter !== 'All' && getService(opp) !== serviceFilter) return false;
      if (stageFilter !== 'All' && getStage(opp) !== stageFilter) return false;
        if (ownerFilter !== 'All' && getOwner(opp) !== ownerFilter) return false;
      return true;
    });
  }, [opportunities, search, serviceFilter, stageFilter]);

  const services = ['All', ...Array.from(new Set((opportunities || []).map(getService))).sort()];
  const stages = ['All', ...Array.from(new Set((opportunities || []).map(getStage))).sort()];
  const owners = ['All', ...Array.from(new Set((opportunities || []).map(getOwner))).sort()];

  const rawTotal = filtered.reduce((sum, opp) => sum + Number(opp?.calculated_revenue ?? opp?.amount_total ?? opp?.amount_estimated ?? 0), 0);
  const weightedTotal = filtered.reduce((sum, opp) => sum + getAmount(opp), 0);
  const stageRows = groupSum(filtered, getStage);
  const quarterRows = groupSum(filtered, (opp) => getQuarter(opp?.expected_close_date));
  const serviceRows = groupSum(filtered, getService);
  const ownerRows = groupSum(filtered, getOwner);
  
  function isAtRisk(opp) {
    const flag = String(opp?.staleness_flag || '').toLowerCase();
    if (flag.includes('risk')) return true;

    const closeDate = new Date(opp?.expected_close_date || '');
    const now = new Date();

    if (closeDate && closeDate < now) return true;

    const prob = Number(opp?.probability || 0);
    const stage = String(getStage(opp)).toLowerCase();

    if (stage.includes('commit') && prob < 60) return true;

    return false;
  }

const sortedDeals = [...filtered].sort((a, b) => {
    if (isAtRisk(a) && !isAtRisk(b)) return -1;
    if (!isAtRisk(a) && isAtRisk(b)) return 1;
    const dir = sortDir === 'asc' ? 1 : -1;
    const getVal = (row) => {
      if (sortKey === 'deal') return String(row.name || '').toLowerCase();
      if (sortKey === 'service') return String(getService(row)).toLowerCase();
      if (sortKey === 'stage') return String(getStage(row)).toLowerCase();
      if (sortKey === 'owner') return String(getOwner(row)).toLowerCase();
      if (sortKey === 'close') return String(row.expected_close_date || '');
      if (sortKey === 'raw') return Number(getRawAmount(row) || 0);
      if (sortKey === 'weighted') return Number(getAmount(row) || 0);
      return Number(getAmount(row) || 0);
    };
    const aVal = getVal(a);
    const bVal = getVal(b);
    if (typeof aVal === 'string' || typeof bVal === 'string') return String(aVal).localeCompare(String(bVal)) * dir;
    return (Number(aVal || 0) - Number(bVal || 0)) * dir;
  });
  const totalPages = Math.max(1, Math.ceil(sortedDeals.length / pageSize));
  const paginatedDeals = sortedDeals.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gap: 16, color: '#18342a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#54745D' }}>Opportunities & Analytics</div>
          <h1 style={{ margin: '6px 0 0 0', fontSize: 26 }}>{titleOverride || 'BD Command Center'}</h1>
          <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>Graph-first pipeline view, compact deal table, and export-ready insights.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={onStartNewDeal} style={{ border: 0, borderRadius: 14, background: '#0B6771', color: '#fff', padding: '11px 14px', fontWeight: 900, cursor: 'pointer' }}>+ New Deal</button>
          
          
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        <Metric label="Raw Pipeline" value={money(rawTotal)} sub={`${filtered.length} deals`} />
        <Metric label="Weighted Pipeline" value={money(weightedTotal)} sub="Risk adjusted" />
        <Metric label="Compression" value={`${rawTotal ? Math.round((1 - weightedTotal / rawTotal) * 100) : 0}%`} sub="Risk removed from forecast" />
        <Metric label="Top Deal" value={sortedDeals[0]?.name || '—'} sub={sortedDeals[0] ? money(getAmount(sortedDeals[0])) : ''} />
      </div>

      <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 180px 180px 180px', gap: 10 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deals, accounts, owners..." style={inputStyle} />
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} style={inputStyle}>{services.map((s) => <option key={s}>{s}</option>)}</select>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} style={inputStyle}>{stages.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
        <ChartCard title="Pipeline Over Time" subtitle="Raw, weighted, and commit forecast by expected close month.">
          <PipelineOverTimeChart opportunities={filtered} />
        </ChartCard>

        <ChartCard title="Quarterly Forecast Curve" subtitle="Stacked forecast by quarter: pipeline, best case, commit, and closed.">
          <QuarterlyForecastChart opportunities={filtered} />
        </ChartCard>

        <ChartCard title="Stage Risk Funnel" subtitle="Weighted pipeline and deal count by sales stage.">
          <StageRiskFunnelChart opportunities={filtered} />
        </ChartCard>

        <ChartCard title="Service-Line Mix Over Time" subtitle="Weighted pipeline by service line and expected close month.">
          <ServiceMixOverTimeChart opportunities={filtered} />
        </ChartCard>

        <ChartCard title="Deal Aging / Stale Pipeline" subtitle="Weighted pipeline and deal count by age bucket.">
          <DealAgingChart opportunities={filtered} />
        </ChartCard>

        <ChartCard title="Raw vs Weighted Forecast Realism" subtitle="How much of the raw pipeline survives probability weighting.">
          <RawVsWeightedChart opportunities={filtered} />
        </ChartCard>
      </div>

      <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', overflow: 'hidden' }}>
        <div style={{ padding: 14, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900 }}>Compact Deal Table</h3>
            <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>No more scrolling cards. Sort/filter/search, then open the deal.</div>
          </div>
          <button onClick={() => downloadOpportunitiesCsv(sortedDeals)} style={smallButton}>Download CSV</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, background: '#F8FBF8' }}>
              <tr>
                  {[
                    { label: 'Deal', key: 'deal' },
                    { label: 'Service', key: 'service' },
                    { label: 'Stage', key: 'stage' },
                    { label: 'Owner', key: 'owner' },
                    { label: 'Close', key: 'close' },
                    { label: 'Raw', key: 'raw' },
                    { label: 'Weighted', key: 'weighted' },
                    { label: 'Action', key: null },
                  ].map((col) => (
                    <th
                      key={col.label}
                      onClick={() => col.key && handleSort(col.key)}
                      style={{ textAlign: 'left', padding: '8px 10px', borderTop: '1px solid #E5ECE5', borderBottom: '1px solid #E5ECE5', color: '#64748b', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: col.key ? 'pointer' : 'default', userSelect: 'none' }}
                    >
                      {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedDeals.map((opp) => (
                  <tr 
                    key={opp.id}
                    onClick={() => onOpenOpportunity?.(opp.id)}
                    style={{ 
                      borderBottom: '1px solid #EEF2F7',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F7FBF8'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={td}><strong>{opp.name || 'Untitled Deal'}</strong><div style={{ color: '#64748b', fontSize: 12 }}>{opp.account_name || opp.account || ''}</div></td>
                    <td style={td}>{getService(opp)}</td>
                    <td style={td}>{getStage(opp)}</td>
                    <td style={td}>{getOwner(opp)}</td>
                    <td style={td}>{opp.expected_close_date || '—'}</td>
                    <td style={td}>{money(getRawAmount(opp))}</td>
                    <td style={td}><strong>{money(getAmount(opp))}</strong></td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${opp.name || 'this deal'}?`)) {
                              onDeleteOpportunity?.(opp.id);
                            }
                          }}
                          style={{ ...smallButton, color: '#B11226', borderColor: '#F1B8C0' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
          <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5ECE5' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sortedDeals.length)} of {sortedDeals.length} deals
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)} style={smallButton}>Prev</button>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Page {page} / {totalPages}</div>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={smallButton}>Next</button>
            </div>
          </div>

      </section>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  border: '1px solid #D8E2D9',
  borderRadius: 12,
  background: '#fff',
  padding: '8px 10px',
  fontSize: 12,
  color: '#0f172a',
  boxSizing: 'border-box',
};

const td = {
  padding: '8px 10px',
  verticalAlign: 'top',
  color: '#18342a',
};
