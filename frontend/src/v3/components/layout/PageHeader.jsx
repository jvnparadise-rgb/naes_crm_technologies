import { Link } from 'react-router-dom';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  actions = null,
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {backTo ? (
            <Link
              to={backTo}
              className="mb-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                color: 'var(--naes-primary-strong)',
                background: 'var(--naes-primary-soft)',
                border: '1px solid var(--naes-border)',
              }}
            >
              ← {backLabel}
            </Link>
          ) : null}

          {eyebrow ? (
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--naes-text-soft)' }}
            >
              {eyebrow}
            </div>
          ) : null}

          <h2 className="mt-1 text-2xl font-black tracking-tight" style={{ color: 'var(--naes-text)' }}>
            {title}
          </h2>

          {subtitle ? (
            <p className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
              {subtitle}
            </p>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
