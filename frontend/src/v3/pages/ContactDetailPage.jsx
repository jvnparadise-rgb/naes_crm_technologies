import { Link, useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import SectionCard from '../components/layout/SectionCard';
import { getContactById, getAccountForContact } from '../mock/crmData';

export default function ContactDetailPage() {
  const { contactId } = useParams();
  const contact = getContactById(contactId);
  const account = getAccountForContact(contactId);

  if (!contact) {
    return (
      <AppShell title="Contacts" subtitle="Dedicated contact detail page.">
        <PageHeader
          eyebrow="Contact Detail"
          title="Contact not found"
          subtitle="The requested contact record does not exist in the current V3 data set."
          backTo="/contacts"
          backLabel="Back to Contacts"
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Contacts" subtitle="Dedicated contact detail page.">
      <PageHeader
        eyebrow="Contact Detail"
        title={contact.name}
        subtitle="Person-level relationship detail, ownership, activity, and account linkage."
        backTo="/contacts"
        backLabel="Back to Contacts"
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <SectionCard title="Profile">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['Name', contact.name],
              ['Title', contact.title],
              ['Email', contact.email],
              ['Account', account?.name || 'No Account'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--naes-border)' }}>
                <div className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--naes-text-soft)' }}>
                  {label}
                </div>
                <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--naes-text)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Connected Records">
          <div className="space-y-3">
            {account ? (
              <Link to={`/accounts/${account.id}`} className="naes-card block p-4">
                <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>
                  View Account
                </div>
                <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                  {account.name}
                </div>
              </Link>
            ) : null}

            <Link to="/opportunities" className="naes-card block p-4">
              <div className="text-sm font-bold" style={{ color: 'var(--naes-text)' }}>
                View Opportunities
              </div>
              <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                Return to deal roll-up.
              </div>
            </Link>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
