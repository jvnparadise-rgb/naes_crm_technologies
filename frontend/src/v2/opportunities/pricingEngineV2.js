
export const ENGINE_GROUPS = {

  labor: {
    prevailingWage: 1.14,
    highCostRegion: 1.12,
    unionLabor: 1.08
  },

  complexity: {
    stringInverters: 1.07,
    highVoltage: 1.08,
    multiOEM: 1.09,
    agingAssets: 1.10
  },

  scope: {
    fullOM: 1.20,
    partsIncluded: 1.14,
    vegetation: 1.10,
    advancedReporting: 1.07
  },

  logistics: {
    distributedSites: 1.12,
    difficultAccess: 1.09,
    harshClimate: 1.06
  },

  risk: {
    performanceGuarantee: 1.18,
    noEscalation: 1.07,
    extendedPayment: 1.05
  },

  workforce: {
    dedicatedTech: 1.25,
    shiftCoverage247: 1.20,
    specializedTraining: 1.12
  },

  sla: {
    response2hr: 1.25,
    response4hr: 1.15,
    penaltyBacked: 1.18
  },

  data: {
    heavyIntegration: 1.10,
    customDashboard: 1.07,
    cybersecurity: 1.05
  },

  transition: {
    takeover: 1.20,
    poorDocs: 1.15,
    backlog: 1.18
  },

  customer: {
    difficultCustomer: 1.10,
    manyStakeholders: 1.05,
    changeHeavy: 1.08
  },

  financial: {
    performanceBased: 1.20,
    deferredCash: 1.08
  },

  competition: {
    highCompetition: 0.90,
    incumbent: 0.92,
    strategicWin: 0.85
  }
};

export const TIMELINE_MODEL = {
  immediate: { factor: 1.08, probability: 90, stage: 'Commit' },
  short: { factor: 1.03, probability: 70, stage: 'Commercial Review' },
  mid: { factor: 1.00, probability: 50, stage: 'Proposal' },
  long: { factor: 0.97, probability: 25, stage: 'Discovery' },
  exploratory: { factor: 0.95, probability: 10, stage: 'Qualified' }
};

export function calculateBase({ type, mw, sqft, pricePerSqft }) {
  if (type === 'StratoSight') {
    return Number(sqft || 0) * Number(pricePerSqft || 0);
  }

  const mwdc = Number(mw || 0);
  const isUSS = mwdc >= 20;

  const rate = isUSS
    ? 12000
    : 18500;

  return mwdc * rate;
}

export function applyAdjustments(base, flags) {
  let factor = 1;
  const breakdown = [];

  Object.entries(flags).forEach(([group, items]) => {
    items.forEach((key) => {
      const value = ENGINE_GROUPS[group]?.[key];
      if (value) {
        factor *= value;
        breakdown.push({ label: key, factor: value });
      }
    });
  });

  return { factor, breakdown };
}

export function calculateDeal({
  type,
  mw,
  sqft,
  pricePerSqft,
  flags,
  timeline,
  termYears = 5
}) {

  const base = calculateBase({ type, mw, sqft, pricePerSqft });

  const { factor, breakdown } = applyAdjustments(base, flags);

  const timelineModel = TIMELINE_MODEL[timeline] || TIMELINE_MODEL.mid;

  const finalAnnual = base * factor * timelineModel.factor;

  const tcv = finalAnnual * termYears;
  const weightedTCV = tcv * (timelineModel.probability / 100);

  return {
    base,
    factor,
    breakdown,
    finalAnnual,
    tcv,
    weightedTCV,
    probability: timelineModel.probability,
    stage: timelineModel.stage
  };
}


export const AERIAL_ENGINE_GROUPS = {
  airspace: {
    classE: 1.05,
    classD: 1.10,
    classC: 1.15,
    classB: 1.28,
    restrictedSensitive: 1.40,
    laancRequired: 1.07,
    waiverRequired: 1.25,
    nightOps: 1.15,
    opsOverPeople: 1.18
  },

  accessSafety: {
    roofAccessRequired: 1.08,
    liftOrSpecialAccess: 1.12,
    escortRequired: 1.06,
    securityClearance: 1.08,
    activeFacility: 1.10,
    fallProtection: 1.12,
    publicExposure: 1.15
  },

  flightComplexity: {
    urbanDense: 1.18,
    highObstacleDensity: 1.15,
    launchLandingConstraints: 1.10,
    limitedLineOfSight: 1.15,
    highWindExposure: 1.08,
    gpsInterference: 1.10,
    multiBuildingCampus: 1.12
  },

  dataProduct: {
    thermalRequired: 1.15,
    radiometricThermal: 1.12,
    photogrammetry3d: 1.25,
    orthomosaic: 1.12,
    polygonSqftMapping: 1.15,
    engineeringReport: 1.22,
    aiAnomalyDetection: 1.10,
    gisKmlExport: 1.08,
    customerPortalUpload: 1.07
  },

  portfolioLogistics: {
    multiSite: 1.10,
    multiRegion: 1.15,
    travelHeavy: 1.12,
    weatherWindowTight: 1.10,
    sameDayDelivery: 1.18,
    repeatProgramEfficiency: 0.90,
    largeSqftEfficiency: 0.88
  },

  aerialCommercialRisk: {
    highInsuranceLimits: 1.10,
    criticalInfrastructure: 1.18,
    highValueProperty: 1.12,
    strictAcceptanceCriteria: 1.10,
    deadlinePenalties: 1.15,
    noEscalation: 1.07,
    extendedPaymentTerms: 1.05
  }
};

export function calculateAerialBase({
  sqft = 0,
  baseRatePerSqft = 0.07,
  minimumFee = 2500
}) {
  const calculated = Number(sqft || 0) * Number(baseRatePerSqft || 0);
  return Math.max(calculated, Number(minimumFee || 0));
}

export function applyAerialAdjustments(flags = {}) {
  let factor = 1;
  const breakdown = [];

  Object.entries(flags || {}).forEach(([group, items]) => {
    (items || []).forEach((key) => {
      const value = AERIAL_ENGINE_GROUPS[group]?.[key];
      if (value) {
        factor *= value;
        breakdown.push({
          group,
          key,
          label: key,
          factor: value,
          impactPct: Number(((value - 1) * 100).toFixed(1))
        });
      }
    });
  });

  return { factor, breakdown };
}

export function calculateAerialInspectionDeal({
  sqft = 0,
  baseRatePerSqft = 0.07,
  minimumFee = 2500,
  flags = {},
  timeline = 'mid',
  termYears = 1
}) {
  const base = calculateAerialBase({ sqft, baseRatePerSqft, minimumFee });
  const { factor, breakdown } = applyAerialAdjustments(flags);
  const timelineModel = TIMELINE_MODEL[timeline] || TIMELINE_MODEL.mid;

  const finalAnnual = base * factor * timelineModel.factor;
  const tcv = finalAnnual * Number(termYears || 1);
  const weightedTCV = tcv * (timelineModel.probability / 100);

  return {
    base,
    factor,
    breakdown,
    finalAnnual,
    tcv,
    weightedTCV,
    probability: timelineModel.probability,
    stage: timelineModel.stage
  };
}
