import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getRawAmount(opp) {
  return Number(opp?.calculated_revenue ?? opp?.amount_total ?? opp?.amount_estimated ?? opp?.weighted_revenue ?? 0);
}

function getWeightedAmount(opp) {
  const raw = getRawAmount(opp);
  return Number(opp?.weighted_revenue ?? 0) || raw * (Number(opp?.probability || 35) / 100);
}

function buildRows(opportunities = []) {
  const map = new Map();

  opportunities.forEach((opp) => {
    const d = new Date(opp?.expected_close_date || opp?.close_date || '');
    if (Number.isNaN(d.getTime())) return;

    const key = monthKey(d);
    const row = map.get(key) || { name: key, raw: 0, weighted: 0, commit: 0 };

    const raw = getRawAmount(opp);
    const weighted = getWeightedAmount(opp);
    const forecast = String(opp?.forecast_category || '').toLowerCase();

    row.raw += raw;
    row.weighted += weighted;
    if (forecast.includes('commit')) row.commit += weighted;

    map.set(key, row);
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default function PipelineOverTimeChart({ opportunities = [] }) {
  const rows = buildRows(opportunities);

  if (!rows.length) {
    return (
      <div style={{ height: 280, display: 'grid', placeItems: 'center', color: '#64748b', fontSize: 13 }}>
        No dated opportunities available for time-series chart.
      </div>
    );
  }

  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 10, right: 18, left: 8, bottom: 8 }}>
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
          <Line type="monotone" dataKey="raw" name="Raw Pipeline" stroke="#7FB3D5" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="weighted" name="Weighted Pipeline" stroke="#0B6771" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="commit" name="Commit" stroke="#2F7552" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
