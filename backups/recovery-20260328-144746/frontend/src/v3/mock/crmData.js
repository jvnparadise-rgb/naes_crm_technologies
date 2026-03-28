export const accounts = [
  {
    id: 'acct-onyx',
    name: 'Onyx Renewables',
    segment: 'Renewables',
    region: 'National',
    owner: 'Ashley',
    arr: 1400000,
    annualRevenue: 1910000,
    ctsPercent: 68,
    marginPercent: 32,
    openOpportunityIds: ['opp-onyx-dg', 'opp-onyx-monitoring'],
    contactIds: ['contact-megan', 'contact-cathy'],
  },
  {
    id: 'acct-mn8',
    name: 'MN8 Energy',
    segment: 'Renewables',
    region: 'West',
    owner: 'Jeff',
    arr: 940000,
    annualRevenue: 1260000,
    ctsPercent: 66,
    marginPercent: 34,
    openOpportunityIds: ['opp-sunrise'],
    contactIds: ['contact-amy'],
  },
];

export const contacts = [
  {
    id: 'contact-megan',
    name: 'Megan Smethurst',
    title: 'Sales Manager',
    email: 'megan@example.com',
    accountId: 'acct-onyx',
  },
  {
    id: 'contact-cathy',
    name: 'Cathy Example',
    title: 'HR',
    email: 'cathy@example.com',
    accountId: 'acct-onyx',
  },
  {
    id: 'contact-amy',
    name: 'Amy Example',
    title: 'Director, Asset Management',
    email: 'amy@example.com',
    accountId: 'acct-mn8',
  },
];

export const opportunities = [
  {
    id: 'opp-onyx-dg',
    name: 'Onyx DG Portfolio',
    accountId: 'acct-onyx',
    owner: 'Ashley',
    stage: 'Commercials',
    forecastCategory: 'Best Case',
    arr: 620000,
    annualRevenue: 910000,
    ctsPercent: 69,
    marginPercent: 31,
    expectedClose: '2026-06-30',
  },
  {
    id: 'opp-onyx-monitoring',
    name: 'Onyx Monitoring Expansion',
    accountId: 'acct-onyx',
    owner: 'Ashley',
    stage: 'Discovery',
    forecastCategory: 'Pipeline',
    arr: 180000,
    annualRevenue: 240000,
    ctsPercent: 70,
    marginPercent: 30,
    expectedClose: '2026-08-15',
  },
  {
    id: 'opp-sunrise',
    name: 'Project Sunrise',
    accountId: 'acct-mn8',
    owner: 'Jeff',
    stage: 'Solution Fit',
    forecastCategory: 'Commit',
    arr: 1800000,
    annualRevenue: 2400000,
    ctsPercent: 66,
    marginPercent: 34,
    expectedClose: '2026-07-20',
  },
];

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function getAccountById(id) {
  return accounts.find((item) => item.id === id) || null;
}

export function getContactById(id) {
  return contacts.find((item) => item.id === id) || null;
}

export function getOpportunityById(id) {
  return opportunities.find((item) => item.id === id) || null;
}

export function getContactsForAccount(accountId) {
  return contacts.filter((item) => item.accountId === accountId);
}

export function getOpportunitiesForAccount(accountId) {
  return opportunities.filter((item) => item.accountId === accountId);
}

export function getAccountForContact(contactId) {
  const contact = getContactById(contactId);
  return contact ? getAccountById(contact.accountId) : null;
}

export function getAccountForOpportunity(opportunityId) {
  const opportunity = getOpportunityById(opportunityId);
  return opportunity ? getAccountById(opportunity.accountId) : null;
}
