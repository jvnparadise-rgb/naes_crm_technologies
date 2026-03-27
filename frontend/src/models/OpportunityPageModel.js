import { opportunityDomainContract } from '../../../src/domain/opportunityDomainContract.js';
import { opportunityWorkflowContract } from '../../../src/domain/opportunityWorkflowContract.js';
import { quoteDomainContract } from '../../../src/domain/quoteDomainContract.js';
import { pricingSchemaRegistry } from '../../../src/pricing/pricingSchemaRegistry.js';
import { opportunityQuoteUiContract } from '../../../src/ui-contracts/opportunityQuoteUiContract.js';

export function createOpportunityPageModel() {
  return {
    type: 'OpportunityPageModel',

    header: {
      title: 'Opportunities',
      entity: opportunityDomainContract.entity
    },

    relationships: {
      accountRequired: opportunityDomainContract.requiredRelationships.account,
      primaryContactOptional: opportunityDomainContract.requiredRelationships.primaryContact,
      additionalContactsSupported: opportunityDomainContract.requiredRelationships.additionalContacts
    },

    serviceToggle: {
      options: opportunityDomainContract.serviceToggles
    },

    pricingArea: {
      supportedToggles: pricingSchemaRegistry.toggles,
      renewables: pricingSchemaRegistry.renewables,
      stratosight: pricingSchemaRegistry.stratosight,
      otherOM: pricingSchemaRegistry.otherOM,
      both: pricingSchemaRegistry.both
    },

    workflow: {
      stages: opportunityWorkflowContract.stages,
      statuses: opportunityWorkflowContract.statuses,
      rules: opportunityWorkflowContract.rules
    },

    quotes: {
      brandingProfiles: quoteDomainContract.brandingProfiles,
      statusModel: quoteDomainContract.statusModel,
      retentionRequirements: quoteDomainContract.retentionRequirements,
      requiredActions: opportunityQuoteUiContract.quotePanel.requiredActions
    },

    audit: {
      required: opportunityQuoteUiContract.auditPanel.required,
      trackedEntityTypes: opportunityQuoteUiContract.auditPanel.trackedEntityTypes
    },

    requiredSections: opportunityQuoteUiContract.requiredSections
  };
}
