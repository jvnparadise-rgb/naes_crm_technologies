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

function getService(opp) {
  return String(opp?.service_line || opp?.market_segment || 'Other');
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildRows(opportunities = []) {
  const map = new Map();
  const services = new Set();

  opportunities.forEach((opp) => {
    const d = new Date(opp?.expected_close_date || opp?.close_date || '');
    if (Number.isNaN(d.getTime())) return;

    const key = monthKey(d);
    const service = getService(opp);
    services.add(service);

    const row = map.get(key) || { name: key };
    row[service] = (row[service] || 0) + getWeightedAmount(opp);
    map.set(key, row);
  });

  return {
    rows: Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name)),
    services: Array.from(services).slice(0, 8),
  };
}

const palette = ['#0B6771', '#7FB3D5', '#2F7552', '#E8A63C', '#8B5CF6', '#64748B', '#D96B5F', '#14B8A6'];

export default function ServiceMixOverTimeChart({ opportunities = [] }) {
  const { rows, services } = buildRows(opportunities);

  if (!rows.length || !services.length) {
    return (
      <div style={{ height: 280, display: 'grid', placeItems: 'center', color: '#64748b', fontSize: 13 }}>
        No dated opportunities available for service-line mix.
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
          {services.map((service, index) => (
            <Area
              key={service}
              type="monotone"
              dataKey={service}
              name={service}
              stackId="service"
              stroke={palette[index % palette.length]}
              fill={palette[index % palette.length]}
              fillOpacity={0.48}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
