export default function UserPlacard({
  name = 'Jeff Yarbrough',
  title = 'VP of Operations',
  role = 'Admin',
  avatarUrl = '',
}) {
  return (
    <div
      className="naes-card-elevated p-4"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: 'var(--naes-text-soft)' }}
          >
            User Profile
          </div>

          <div className="mt-1 text-sm font-bold" style={{ color: 'var(--naes-text)' }}>
            {name}
          </div>

          <div className="mt-0.5 text-xs" style={{ color: 'var(--naes-text-muted)' }}>
            {title}
          </div>

          <div className="mt-2">
            <span className="naes-pill naes-pill-success">{role}</span>
          </div>
        </div>

        <div
          className="h-14 w-14 overflow-hidden rounded-2xl border"
          style={{ borderColor: 'var(--naes-border)' }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-sm font-bold"
              style={{ background: 'var(--naes-primary-soft)', color: 'var(--naes-primary)' }}
            >
              JY
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
