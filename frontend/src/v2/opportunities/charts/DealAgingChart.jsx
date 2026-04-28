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

function getAgeDays(opp) {
  const sourceDate = opp?.updated_at || opp?.created_at || opp?.expected_close_date || opp?.close_date;
  const d = new Date(sourceDate || '');
  if (Number.isNaN(d.getTime())) return 999;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}

function bucketFor(days) {
  if (days <= 30) return '0-30';
  if (days <= 60) return '31-60';
  if (days <= 90) return '61-90';
  if (days <= 180) return '91-180';
  return '180+';
}

const order = ['0-30', '31-60', '61-90', '91-180', '180+'];

function buildRows(opportunities = []) {
  const map = new Map();

  opportunities.forEach((opp) => {
    const bucket = bucketFor(getAgeDays(opp));
    const row = map.get(bucket) || { name: bucket, weighted: 0, deals: 0 };
    row.weighted += getWeightedAmount(opp);
    row.deals += 1;
    map.set(bucket, row);
  });

  return order.map((name) => map.get(name) || { name, weighted: 0, deals: 0 });
}

export default function DealAgingChart({ opportunities = [] }) {
  const rows = buildRows(opportunities);

  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 10, right: 18, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 4" opacity={0.3} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={76}
            interval="preserveStartEnd"
            minTickGap={18}
            tick={{ fontSize: 9, fill: '#475569' }}
          />
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
          <Bar yAxisId="left" dataKey="weighted" name="Weighted Pipeline" fill="#D96B5F" radius={[8, 8, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="deals" name="Deal Count" stroke="#0B6771" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
