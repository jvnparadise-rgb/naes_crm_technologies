import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
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

export default function RawVsWeightedChart({ opportunities = [] }) {
  const raw = opportunities.reduce((sum, opp) => sum + getRawAmount(opp), 0);
  const weighted = opportunities.reduce((sum, opp) => sum + getWeightedAmount(opp), 0);
  const realism = raw ? Math.round((weighted / raw) * 100) : 0;

  const rows = [
    { name: 'Raw Pipeline', value: raw },
    { name: 'Weighted Pipeline', value: weighted },
    { name: 'Risk Removed', value: Math.max(0, raw - weighted) },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 14, alignItems: 'center', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 10, right: 34, left: 24, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 4" opacity={0.25} />
          <XAxis type="number" tickFormatter={compactMoney} tick={{ fontSize: 9, fill: '#475569' }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} width={110} />
          <Tooltip wrapperStyle={{ fontSize: 10 }} formatter={(value) => compactMoney(value)} />
          <Bar dataKey="value" fill="#0B6771" radius={[0, 8, 8, 0]}>
            <LabelList dataKey="value" position="right" formatter={compactMoney} style={{ fontSize: 10, fontWeight: 800, fill: '#334155' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        border: '1px solid #DCE7DD',
        borderRadius: 18,
        background: '#FBFCFB',
        padding: 14,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b' }}>
          Forecast Realism
        </div>
        <div style={{ marginTop: 10, fontSize: 34, fontWeight: 950, color: '#0B6771' }}>
          {realism}%
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
          Weighted pipeline as a percentage of raw pipeline.
        </div>
      </div>
    </div>
  );
}
