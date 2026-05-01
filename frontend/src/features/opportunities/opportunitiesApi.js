
function normalizeOpportunity(op) {
  if (!op) return op;

  if (op.serviceLine === 'Renewables O&M') {
    op.serviceLine = 'Renewables';
  }

  return op;
}

// REMOVED localStorage caching

export async function loadOpportunities(seed = []) {
  const raw = // REMOVED localStorage get(STORAGE_KEY);
  if (!raw) {
    // REMOVED localStorage set(STORAGE_KEY, JSON.stringify(seed));
    return [];
  }

  try {
    return JSON.parse(raw).map(normalizeOpportunity);
  } catch {
    return [];
  }
}

export async function saveAllOpportunities(opportunities) {
  // REMOVED localStorage set(STORAGE_KEY, JSON.stringify(opportunities));
  return opportunities;
}
