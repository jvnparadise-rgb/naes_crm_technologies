import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
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

function getRawAmount(opp) {
  return Number(opp?.calculated_revenue ?? opp?.amount_total ?? opp?.amount_estimated ?? opp?.weighted_revenue ?? 0);
}

function getWeightedAmount(opp) {
  const raw = getRawAmount(opp);
  return Number(opp?.weighted_revenue ?? 0) || raw * (Number(opp?.probability || 35) / 100);
}

function getStage(opp) {
  return String(opp?.stage || 'Unstaged');
}

const stageOrder = [
  'Prospecting',
  'Qualified',
  'Discovery',
  'Solution Fit',
  'Proposal',
  'Commercial Review',
  'Commit',
  'Closed Won',
  'Closed Lost',
  'Unstaged',
];

function orderIndex(stage) {
  const normalized = String(stage || '').toLowerCase();
  const idx = stageOrder.findIndex((s) => normalized.includes(s.toLowerCase()));
  return idx === -1 ? 99 : idx;
}

function buildRows(opportunities = []) {
  const map = new Map();

  opportunities.forEach((opp) => {
    const stage = getStage(opp);
    const row = map.get(stage) || { name: stage, weighted: 0, raw: 0, deals: 0 };
    row.weighted += getWeightedAmount(opp);
    row.raw += getRawAmount(opp);
    row.deals += 1;
    map.set(stage, row);
  });

  return Array.from(map.values()).sort((a, b) => orderIndex(a.name) - orderIndex(b.name));
}

export default function StageRiskFunnelChart({ opportunities = [] }) {
  const rows = buildRows(opportunities);

  if (!rows.length) {
    return (
      <div style={{ height: 280, display: 'grid', placeItems: 'center', color: '#64748b', fontSize: 13 }}>
        No opportunities available for stage risk view.
      </div>
    );
  }

  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 10, right: 18, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 4" opacity={0.3} />
          <XAxis dataKey="name" angle={-20} textAnchor="end" height={70} interval={0} />
          <YAxis tick={{
  fontSize: 10,
  fill: '#475569'
}} yAxisId="left" tickFormatter={compactMoney} />
          <YAxis tick={{
  fontSize: 10,
  fill: '#475569'
}} yAxisId="right" orientation="right" allowDecimals={false} />
          <Tooltip wrapperStyle={{ fontSize: 11 }} formatter={(value, name) => name === 'Deal Count' ? value : compactMoney(value)} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="left" dataKey="weighted" name="Weighted Pipeline" fill="#0B6771" radius={[8, 8, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="deals" name="Deal Count" stroke="#E8A63C" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
