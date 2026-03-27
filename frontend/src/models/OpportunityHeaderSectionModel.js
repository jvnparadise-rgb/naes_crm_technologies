import { opportunityDomainContract } from '../../../src/domain/opportunityDomainContract.js';

export function createOpportunityHeaderSectionModel() {
  return {
    type: 'OpportunityHeaderSectionModel',
    sectionId: 'opportunityHeader',
    title: 'Opportunity Header',
    entity: opportunityDomainContract.entity,
    summaryFields: [
      'name',
      'serviceLine',
      'stage',
      'owner',
      'expectedCloseDate'
    ],
    showsQuoteEntryPoint: true,
    showsAuditStatus: true
  };
}
