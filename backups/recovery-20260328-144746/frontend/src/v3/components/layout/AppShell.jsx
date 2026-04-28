import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({
  title,
  subtitle,
  actions = null,
  children,
}) {
  return (
    <div className="naes-shell flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1600px] px-6 py-6 xl:px-8">
          <Topbar title={title} subtitle={subtitle} actions={actions} />
          {children}
        </div>
      </main>
    </div>
  );
}
