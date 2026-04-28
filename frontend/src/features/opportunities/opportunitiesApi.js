
function normalizeOpportunity(op) {
  if (!op) return op;

  if (op.serviceLine === 'Renewables O&M') {
    op.serviceLine = 'Renewables';
  }

  return op;
}

const STORAGE_KEY = 'naes-crm-opportunities';

export async function loadOpportunities(seed = []) {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed.map(normalizeOpportunity);
  }

  try {
    return JSON.parse(raw).map(normalizeOpportunity);
  } catch {
    return seed.map(normalizeOpportunity);
  }
}

export async function saveAllOpportunities(opportunities) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
  return opportunities;
}
