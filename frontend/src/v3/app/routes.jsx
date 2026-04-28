import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import AccountsPage from '../pages/AccountsPage';
import AccountDetailPage from '../pages/AccountDetailPage';
import ContactsPage from '../pages/ContactsPage';
import ContactDetailPage from '../pages/ContactDetailPage';
import OpportunitiesOverviewPage from '../pages/OpportunitiesOverviewPage';
import OpportunityDetailPage from '../pages/OpportunityDetailPage';
import SimplePlaceholderPage from '../pages/SimplePlaceholderPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/accounts/:accountId" element={<AccountDetailPage />} />

      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/contacts/:contactId" element={<ContactDetailPage />} />

      <Route path="/opportunities" element={<OpportunitiesOverviewPage />} />
      <Route path="/opportunities/:opportunityId" element={<OpportunityDetailPage />} />

      <Route
        path="/pipeline/my"
        element={<SimplePlaceholderPage title="My Pipeline" subtitle="Reserved for user-scoped pipeline view." />}
      />
      <Route
        path="/pipeline/rollup"
        element={<SimplePlaceholderPage title="Pipeline Rollup" subtitle="Reserved for team and executive pipeline aggregation." />}
      />
      <Route
        path="/revenue-command-center"
        element={<SimplePlaceholderPage title="Revenue Command Center" subtitle="Reserved for commercial performance and weighted outlook." />}
      />
      <Route
        path="/forecast/dashboard"
        element={<SimplePlaceholderPage title="Forecast Dashboard" subtitle="Reserved for forecast roll-up and close-period readiness." />}
      />
      <Route
        path="/forecast/integrity"
        element={<SimplePlaceholderPage title="Forecast Integrity" subtitle="Reserved for aging, commit risk, and confidence scoring." />}
      />
      <Route
        path="/forecast/period-control"
        element={<SimplePlaceholderPage title="Period Control" subtitle="Reserved for period governance and forecast lock logic." />}
      />
      <Route
        path="/tasks"
        element={<SimplePlaceholderPage title="Tasks" subtitle="Reserved for task management." />}
      />
      <Route
        path="/activities"
        element={<SimplePlaceholderPage title="Activities" subtitle="Reserved for activity history." />}
      />
      <Route
        path="/settings"
        element={<SimplePlaceholderPage title="Settings" subtitle="Reserved for user and system settings." />}
      />
    </Routes>
  );
}
