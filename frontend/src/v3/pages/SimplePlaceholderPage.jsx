import AppShell from '../components/layout/AppShell';
import SectionCard from '../components/layout/SectionCard';

export default function SimplePlaceholderPage({ title, subtitle }) {
  return (
    <AppShell title={title} subtitle={subtitle || 'Recovered V3 placeholder page.'}>
      <SectionCard title={title} subtitle="This page has not been rebuilt yet in the recovered V3 shell.">
        <div
          className="min-h-[220px] rounded-2xl border border-dashed p-4 text-sm"
          style={{
            borderColor: 'var(--naes-border)',
            color: 'var(--naes-text-muted)',
            background: 'var(--naes-surface-alt)',
          }}
        >
          Placeholder content region.
        </div>
      </SectionCard>
    </AppShell>
  );
}
