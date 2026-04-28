import { useEffect, useMemo, useState } from 'react';
import { initialOpportunities } from './opportunitySeed';
import { loadOpportunities, saveAllOpportunities } from './opportunitiesApi';
import { applyDerivedFields, diffMaterialFields } from './opportunityLogic';

function withDerived(list) {
  return list.map(applyDerivedFields);
}

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    loadOpportunities(initialOpportunities).then((data) => {
      if (!active) return;
      setOpportunities(withDerived(data));
      setIsLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  async function persist(next) {
    const withComputed = withDerived(next);
    setOpportunities(withComputed);
    await saveAllOpportunities(withComputed);
    return withComputed;
  }

  async function createOpportunity(payload, actingUser = 'System User') {
    const newRecord = applyDerivedFields({
      ...payload,
      id: `opp-${Date.now()}`,
      auditHistory: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actingUser,
          saveReason: 'Initial opportunity creation',
          summary: 'Created opportunity record.',
          changedFields: ['initial-create'],
        },
      ],
    });

    const next = [newRecord, ...opportunities];
    await persist(next);
    return newRecord;
  }

  async function updateOpportunity(updatedRecord, saveReason, actingUser = 'System User') {
    const existing = opportunities.find((item) => item.id === updatedRecord.id);
    if (!existing) throw new Error('Opportunity not found.');

    const changedFields = diffMaterialFields(existing, updatedRecord);
    const requiresReason = changedFields.length > 0;

    if (requiresReason && !String(saveReason || '').trim()) {
      throw new Error('Save reason is required for material commercial or forecast changes.');
    }

    const nextRecord = applyDerivedFields({
      ...updatedRecord,
      auditHistory: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actingUser,
          saveReason: saveReason || 'Saved record',
          summary: changedFields.length
            ? `Updated material fields: ${changedFields.join(', ')}`
            : 'Saved non-material updates.',
          changedFields,
        },
        ...(existing.auditHistory || []),
      ],
    });

    const next = opportunities.map((item) => (item.id === updatedRecord.id ? nextRecord : item));
    await persist(next);
    return nextRecord;
  }

  const byId = useMemo(() => {
    const map = new Map();
    opportunities.forEach((item) => map.set(item.id, item));
    return map;
  }, [opportunities]);

  return {
    opportunities,
    isLoaded,
    byId,
    createOpportunity,
    updateOpportunity,
  };
}
