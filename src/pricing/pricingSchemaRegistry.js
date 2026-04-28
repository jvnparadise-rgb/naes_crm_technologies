export const pricingSchemaRegistry = {
  toggles: ['Renewables', 'StratoSight', 'Both', 'Other O&M'],

  renewables: {
    sizingModes: ['MWDC', 'MWAC'],
    thresholdRule: {
      metric: 'MWDC',
      dgMaxExclusiveUpperBound: 20,
      dgLabel: 'DG',
      ussLabel: 'USS'
    },
    dg: {
      basis: 'price_per_mw',
      appliesWhen: 'under_20_mwdc',
      range: {
        low: 14,
        high: 23
      }
    },
    uss: {
      basis: 'price_per_mw',
      appliesWhen: 'over_20_mwdc',
      range: {
        low: 8,
        high: 16
      },
      workingAnchors: {
        low: 10,
        high: 17
      },
      normalizationRequired: true,
      note: 'Preserve stated range conflict until pricing normalization is explicitly approved.'
    },
    mwacAdjustment: {
      rule: 'MWAC should evaluate a bit lower than MWDC based on calculation method.',
      explicitFormulaRequiredLater: true
    }
  },

  stratosight: {
    basis: 'price_per_sqft',
    range: {
      low: 0.04,
      high: 0.11
    }
  },

  otherOM: {
    pricingMode: ['per_unit', 'overall_price'],
    manualEntry: true,
    note: 'Pricing is based on sales-associate judgment.'
  },

  both: {
    composition: ['renewables', 'stratosight'],
    note: 'Combined presentation must support both Renewables and StratoSight pricing in the same opportunity context.'
  }
};
