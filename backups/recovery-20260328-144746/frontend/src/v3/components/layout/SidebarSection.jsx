import { NavLink } from 'react-router-dom';

export default function SidebarSection({ title, items = [] }) {
  return (
    <div className="space-y-2">
      <div
        className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: 'var(--naes-text-soft)' }}
      >
        {title}
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              ['block rounded-2xl px-3 py-2.5 text-sm font-medium transition', isActive ? 'shadow-sm' : ''].join(' ')
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--naes-primary-strong)' : 'var(--naes-text-muted)',
              background: isActive ? 'var(--naes-primary-soft)' : 'transparent',
              border: isActive ? '1px solid var(--naes-border)' : '1px solid transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
