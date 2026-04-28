export default function SectionCard({ title, subtitle, children, actions = null }) {
  return (
    <section className="naes-card p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--naes-text)' }}>
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions}
      </div>

      {children}
    </section>
  );
}
