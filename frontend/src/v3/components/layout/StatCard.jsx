export default function StatCard({ label, value, footnote, tone = 'neutral' }) {
  const toneMap = {
    neutral: {
      bg: '#ffffff',
      badgeBg: '#eef3ef',
      badgeColor: 'var(--naes-text-muted)',
    },
    success: {
      bg: '#ffffff',
      badgeBg: 'var(--naes-success-soft)',
      badgeColor: 'var(--naes-success)',
    },
    warning: {
      bg: '#ffffff',
      badgeBg: 'var(--naes-warning-soft)',
      badgeColor: '#9a6700',
    },
    danger: {
      bg: '#ffffff',
      badgeBg: 'var(--naes-danger-soft)',
      badgeColor: '#b42318',
    },
  };

  const selected = toneMap[tone] || toneMap.neutral;

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        background: selected.bg,
        borderColor: 'var(--naes-border)',
      }}
    >
      <div
        className="text-xs font-semibold uppercase tracking-[0.14em]"
        style={{ color: 'var(--naes-text-soft)' }}
      >
        {label}
      </div>

      <div className="mt-3 text-3xl font-black tracking-tight" style={{ color: 'var(--naes-text)' }}>
        {value}
      </div>

      {footnote ? (
        <div
          className="mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            background: selected.badgeBg,
            color: selected.badgeColor,
          }}
        >
          {footnote}
        </div>
      ) : null}
    </div>
  );
}
