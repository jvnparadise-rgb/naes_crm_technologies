import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SectionCard from '../components/layout/SectionCard';
import { contacts, getAccountById } from '../mock/crmData';

export default function ContactsPage() {
  return (
    <AppShell
      title="Contacts"
      subtitle="Relationship roll-up view across customer, partner, and internal stakeholder records."
    >
      <SectionCard title="Contact Roll-up" subtitle="Click a contact to open the dedicated detail page.">
        <div className="grid gap-3">
          {contacts.map((contact) => {
            const account = getAccountById(contact.accountId);

            return (
              <Link
                key={contact.id}
                to={`/contacts/${contact.id}`}
                className="naes-card flex items-center justify-between p-4 transition hover:shadow-md"
              >
                <div>
                  <div className="font-semibold" style={{ color: 'var(--naes-text)' }}>
                    {contact.name}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: 'var(--naes-text-muted)' }}>
                    {contact.title}, {account?.name || 'No Account'}
                  </div>
                </div>

                <div className="text-sm font-medium" style={{ color: 'var(--naes-primary-strong)' }}>
                  Open →
                </div>
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </AppShell>
  );
}
