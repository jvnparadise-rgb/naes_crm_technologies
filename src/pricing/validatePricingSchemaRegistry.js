import { pricingSchemaRegistry } from './pricingSchemaRegistry.js';

export function validatePricingSchemaRegistry() {
  const requiredToggles = ['Renewables', 'StratoSight', 'Both', 'Other O&M'];

  for (const toggle of requiredToggles) {
    if (!pricingSchemaRegistry.toggles.includes(toggle)) {
      throw new Error(`Missing pricing toggle: ${toggle}`);
    }
  }

  const dg = pricingSchemaRegistry.renewables?.dg;
  const uss = pricingSchemaRegistry.renewables?.uss;
  const stratosight = pricingSchemaRegistry.stratosight;

  if (!dg || dg.range.low !== 14 || dg.range.high !== 23) {
    throw new Error('DG pricing range is invalid.');
  }

  if (!uss || uss.range.low !== 8 || uss.range.high !== 16) {
    throw new Error('USS stated pricing range is invalid.');
  }

  if (!uss.workingAnchors || uss.workingAnchors.low !== 10 || uss.workingAnchors.high !== 17) {
    throw new Error('USS working anchors are invalid.');
  }

  if (!stratosight || stratosight.range.low !== 0.04 || stratosight.range.high !== 0.11) {
    throw new Error('StratoSight pricing range is invalid.');
  }

  return {
    ok: true,
    toggleCount: pricingSchemaRegistry.toggles.length,
    renewablesSizingModes: pricingSchemaRegistry.renewables.sizingModes.length,
    ussNormalizationRequired: pricingSchemaRegistry.renewables.uss.normalizationRequired
  };
}
