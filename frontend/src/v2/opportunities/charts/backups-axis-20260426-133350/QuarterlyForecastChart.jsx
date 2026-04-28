import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function compactMoney(value) {
  const n = Number(value || 0);
  if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function getRawAmount(opp) {
  return Number(opp?.calculated_revenue ?? opp?.amount_total ?? opp?.amount_estimated ?? opp?.weighted_revenue ?? 0);
}

function getWeightedAmount(opp) {
  const raw = getRawAmount(opp);
  return Number(opp?.weighted_revenue ?? 0) || raw * (Number(opp?.probability || 35) / 100);
}

function getQuarter(dateString) {
  const d = new Date(dateString || '');
  if (Number.isNaN(d.getTime())) return 'No Date';
  return `${d.getFullYear()} Q${Math.floor(d.getMonth() / 3) + 1}`;
}

function buildRows(opportunities = []) {
  const map = new Map();

  opportunities.forEach((opp) => {
    const quarter = getQuarter(opp?.expected_close_date || opp?.close_date);
    const row = map.get(quarter) || {
      name: quarter,
      pipeline: 0,
      bestCase: 0,
      commit: 0,
      closed: 0,
      weighted: 0,
    };

    const weighted = getWeightedAmount(opp);
    const raw = getRawAmount(opp);
    const forecast = String(opp?.forecast_category || 'Pipeline').toLowerCase();

    row.weighted += weighted;

    if (forecast.includes('closed')) row.closed += raw;
    else if (forecast.includes('commit')) row.commit += weighted;
    else if (forecast.includes('best')) row.bestCase += weighted;
    else row.pipeline += weighted;

    map.set(quarter, row);
  });

  return Array.from(map.values()).sort((a, b) => {
    if (a.name === 'No Date') return 1;
    if (b.name === 'No Date') return -1;
    return a.name.localeCompare(b.name);
  });
}

export default function QuarterlyForecastChart({ opportunities = [] }) {
  const rows = buildRows(opportunities);

  if (!rows.length) {
    return (
      <div style={{ height: 280, display: 'grid', placeItems: 'center', color: '#64748b', fontSize: 13 }}>
        No forecast dates available for quarterly forecast.
      </div>
    );
  }

  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 10, right: 18, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 4" opacity={0.3} />
          <XAxis dataKey="name" tick={{
  fontSize: 10,
  fill: '#475569'
}} />
          <YAxis tick={{
  fontSize: 10,
  fill: '#475569'
}} tickFormatter={compactMoney} />
          <Tooltip wrapperStyle={{ fontSize: 11 }} formatter={(value) => compactMoney(value)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="pipeline" name="Pipeline" stackId="1" stroke="#7FB3D5" fill="#7FB3D5" fillOpacity={0.45} />
          <Area type="monotone" dataKey="bestCase" name="Best Case" stackId="1" stroke="#E8A63C" fill="#E8A63C" fillOpacity={0.45} />
          <Area type="monotone" dataKey="commit" name="Commit" stackId="1" stroke="#0B6771" fill="#0B6771" fillOpacity={0.55} />
          <Area type="monotone" dataKey="closed" name="Closed" stackId="1" stroke="#2F7552" fill="#2F7552" fillOpacity={0.55} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
