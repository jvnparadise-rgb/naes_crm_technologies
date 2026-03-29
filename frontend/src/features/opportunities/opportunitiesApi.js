const STORAGE_KEY = 'naes-crm-opportunities';

export async function loadOpportunities(seed = []) {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

export async function saveAllOpportunities(opportunities) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
  return opportunities;
}
