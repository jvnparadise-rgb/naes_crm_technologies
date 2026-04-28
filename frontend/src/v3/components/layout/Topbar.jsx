export default function Topbar({
  title = 'Dashboard',
  subtitle = 'Executive operating view',
  actions = null,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: 'var(--naes-text-soft)' }}
        >
          NAES Renewables & Technologies
        </div>

        <h1 className="mt-1 text-3xl font-black tracking-tight" style={{ color: 'var(--naes-text)' }}>
          {title}
        </h1>

        <p className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
          {subtitle}
        </p>
      </div>

      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
