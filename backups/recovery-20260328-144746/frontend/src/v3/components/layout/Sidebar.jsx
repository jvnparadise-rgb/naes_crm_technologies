import UserPlacard from './UserPlacard';
import SidebarSection from './SidebarSection';
import { primaryNav } from '../../app/navigation';

export default function Sidebar() {
  return (
    <aside
      className="flex h-screen w-[290px] flex-col border-r px-4 py-4"
      style={{ borderColor: 'var(--naes-border)' }}
    >
      <div className="mb-4 px-2">
        <div className="text-lg font-black tracking-tight" style={{ color: 'var(--naes-primary-strong)' }}>
          NAES CRM
        </div>
        <div className="text-xs" style={{ color: 'var(--naes-text-muted)' }}>
          V3 Frontend
        </div>
      </div>

      <UserPlacard />

      <div className="naes-scrollbar mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
        {primaryNav.map((group) => (
          <SidebarSection key={group.section} title={group.section} items={group.items} />
        ))}
      </div>
    </aside>
  );
}
