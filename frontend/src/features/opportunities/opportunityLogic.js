function numberOrZero(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function getProbabilityFromStage(stage) {
  const map = {
    Prospecting: 10,
    Qualified: 20,
    Discovery: 30,
    'Solution Fit': 50,
    Commercials: 70,
    'Security Legal': 80,
    Commit: 90,
    'Closed Won': 100,
    'Closed Lost': 0,
  };
  return map[stage] ?? 0;
}

export function getForecastPeriod(expectedCloseDate) {
  if (!expectedCloseDate) return '';
  const date = new Date(`${expectedCloseDate}T12:00:00`);
  const month = date.getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  return `${date.getFullYear()}-Q${quarter}`;
}

export function computeRenewablesValue(renewables, selectedPricingBand) {
  const portfolioType = renewables?.portfolioType || 'DG';
  const mwdc = numberOrZero(renewables?.mwdc);
  const mwac = numberOrZero(renewables?.mwac);
  const basisMw = mwdc || mwac;

  const anchors = {
    DG: { Low: 14, Median: 18.5, High: 23 },
    USS: { Low: 10, Median: 13, High: 17 },
    Mixed: { Low: 14, Median: 17.5, High: 23 },
  };

  const rate = anchors[portfolioType]?.[selectedPricingBand] ?? 0;
  return Math.round(basisMw * rate * 1000);
}

export function computeStratoSightValue(stratoSight, selectedPricingBand) {
  const sqft = numberOrZero(stratoSight?.squareFootage);
  const rateMap = { Low: 0.04, Median: 0.075, High: 0.11 };
  return Math.round(sqft * (rateMap[selectedPricingBand] ?? 0));
}

export function computeOtherOmValue(otherOM) {
  return Math.round(numberOrZero(otherOM?.enteredAmount));
}

export function computeCommercialSummary(opportunity) {
  const band = opportunity.selectedPricingBand || 'Median';

  let totalDealValue = 0;
  const serviceLine = opportunity.serviceLine;

  if (serviceLine === 'Renewables') {
    totalDealValue = computeRenewablesValue(opportunity.renewables, band);
  } else if (serviceLine === 'StratoSight') {
    totalDealValue = computeStratoSightValue(opportunity.stratoSight, band);
  } else if (serviceLine === 'Other O&M') {
    totalDealValue = computeOtherOmValue(opportunity.otherOM);
  } else if (serviceLine === 'Both') {
    totalDealValue =
      computeRenewablesValue(opportunity.renewables, band) +
      computeStratoSightValue(opportunity.stratoSight, band);
  }

  const estimatedCtsPct = totalDealValue > 0 ? 62 : 0;
  const estimatedEarningsPct = totalDealValue > 0 ? 38 : 0;

  let burdenProfile = 'Low';
  if (estimatedCtsPct >= 70) burdenProfile = 'High';
  else if (estimatedCtsPct >= 55) burdenProfile = 'Moderate';

  const driverSummaryParts = [];
  if (serviceLine === 'Renewables' || serviceLine === 'Both') {
    if (opportunity.renewables?.portfolioType) driverSummaryParts.push(opportunity.renewables.portfolioType);
    if (opportunity.renewables?.scopeType) driverSummaryParts.push(opportunity.renewables.scopeType);
  }
  if (serviceLine === 'StratoSight' || serviceLine === 'Both') {
    if (opportunity.stratoSight?.inspectionType) driverSummaryParts.push(opportunity.stratoSight.inspectionType);
    if (opportunity.stratoSight?.frequency) driverSummaryParts.push(opportunity.stratoSight.frequency);
  }
  if (serviceLine === 'Other O&M' && opportunity.otherOM?.pricingBasis) {
    driverSummaryParts.push(opportunity.otherOM.pricingBasis);
  }

  return {
    totalDealValue,
    estimatedCtsPct,
    estimatedEarningsPct,
    burdenProfile,
    driverSummary: driverSummaryParts.join(', '),
  };
}

export function computeGovernance(opportunity) {
  const forecastPeriod = getForecastPeriod(opportunity.expectedCloseDate);
  const probability = getProbabilityFromStage(opportunity.stage);

  const daysSinceLastActivity = Number(opportunity.daysSinceLastActivity || 0);
  const daysInStage = Number(opportunity.daysInStage || 0);

  let hygieneStatus = 'Healthy';
  if (daysSinceLastActivity > 14 || daysInStage > 30) hygieneStatus = 'At Risk';
  else if (daysSinceLastActivity > 7 || daysInStage > 21) hygieneStatus = 'Warning';

  let followUpStatus = 'Current';
  if (daysSinceLastActivity > 14) followUpStatus = 'Overdue';
  else if (daysSinceLastActivity > 7) followUpStatus = 'Due Soon';

  const riskFlags = [];
  const commitRiskWarnings = [];

  if (!opportunity.expectedCloseDate) riskFlags.push('Missing expected close date');
  if (daysSinceLastActivity > 14) riskFlags.push('No recent activity');
  if (daysInStage > 30) riskFlags.push('Stage aging');

  if (opportunity.forecastCategory === 'Commit') {
    if (!opportunity.expectedCloseDate) commitRiskWarnings.push('Commit without expected close date');
    if (daysSinceLastActivity > 14) commitRiskWarnings.push('Commit is stale');
  }

  const forecastConfidence =
    hygieneStatus === 'Healthy' ? 80 : hygieneStatus === 'Warning' ? 60 : 35;

  const stalenessReason = riskFlags.join(', ');

  return {
    probability,
    forecastPeriod,
    forecastConfidence,
    hygieneStatus,
    followUpStatus,
    riskFlags,
    commitRiskWarnings,
    stalenessReason,
  };
}

export function applyDerivedFields(opportunity) {
  const commercial = computeCommercialSummary(opportunity);
  const governance = computeGovernance(opportunity);

  return {
    ...opportunity,
    ...commercial,
    ...governance,
    probability: governance.probability,
    forecastPeriod: governance.forecastPeriod,
  };
}

export const MATERIAL_FIELDS = new Set([
  'serviceLine',
  'stage',
  'forecastCategory',
  'expectedCloseDate',
  'selectedPricingBand',
  'renewables.mwac',
  'renewables.mwdc',
  'renewables.siteCount',
  'renewables.scopeType',
  'renewables.region',
  'renewables.portfolioType',
  'stratoSight.squareFootage',
  'stratoSight.buildingCount',
  'stratoSight.inspectionType',
  'stratoSight.environment',
  'stratoSight.deliverables',
  'stratoSight.frequency',
  'stratoSight.complexity',
  'otherOM.pricingBasis',
  'otherOM.enteredAmount',
]);

export function diffMaterialFields(original, updated) {
  const changed = [];

  for (const field of MATERIAL_FIELDS) {
    const path = field.split('.');
    const getValue = (obj) => path.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    const before = getValue(original);
    const after = getValue(updated);
    if (String(before ?? '') !== String(after ?? '')) changed.push(field);
  }

  return changed;
}
