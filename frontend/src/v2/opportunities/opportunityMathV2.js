export const STAGE_MODEL = [
  { key: 'prospecting', label: 'Prospecting', probability: 5 },
  { key: 'qualified', label: 'Qualified', probability: 10 },
  { key: 'discovery', label: 'Discovery', probability: 20 },
  { key: 'solution_fit', label: 'Solution Fit', probability: 35 },
  { key: 'proposal', label: 'Proposal', probability: 50 },
  { key: 'commercial_review', label: 'Commercial Review', probability: 70 },
  { key: 'commit', label: 'Commit', probability: 90 },
  { key: 'closed_won', label: 'Closed Won', probability: 100 },
  { key: 'closed_lost', label: 'Closed Lost', probability: 0 },
];

export function getStageProbability(stage = '') {
  const normalized = String(stage).toLowerCase();
  const found = STAGE_MODEL.find((item) => normalized.includes(item.label.toLowerCase()) || normalized.includes(item.key));
  return found?.probability ?? 25;
}

export function calculateRenewables({ mw = 0, basis = 'MWDC', type = 'DG', termYears = 5, stage = '' }) {
  const mwNumber = Number(mw || 0);
  const mwdc = basis === 'MWAC' ? mwNumber * 1.25 : mwNumber;
  const classifiedType = type === 'Auto' ? (mwdc >= 20 ? 'USS' : 'DG') : type;
  const rate = classifiedType === 'USS'
    ? { low: 8000, target: 12000, high: 16000 }
    : { low: 14000, target: 18500, high: 23000 };

  const annual = {
    low: mwdc * rate.low,
    target: mwdc * rate.target,
    high: mwdc * rate.high,
  };

  const probability = getStageProbability(stage);

  return {
    type: classifiedType,
    mwdc,
    annual,
    tcv: {
      low: annual.low * termYears,
      target: annual.target * termYears,
      high: annual.high * termYears,
    },
    weightedTcv: annual.target * termYears * (probability / 100),
    weightedAcv: annual.target * (probability / 100),
    probability,
    rate,
  };
}

export function calculateStratoSight({ sqft = 0, pricePerSqft = 0.07, termYears = 5, stage = '' }) {
  const annual = Number(sqft || 0) * Number(pricePerSqft || 0);
  const probability = getStageProbability(stage);

  return {
    annual,
    tcv: annual * termYears,
    weightedTcv: annual * termYears * (probability / 100),
    weightedAcv: annual * (probability / 100),
    probability,
  };
}
