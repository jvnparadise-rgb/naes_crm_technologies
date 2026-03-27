import { opportunityDomainContract } from '../../../src/domain/opportunityDomainContract.js';
import { opportunityWorkflowContract } from '../../../src/domain/opportunityWorkflowContract.js';
import { quoteDomainContract } from '../../../src/domain/quoteDomainContract.js';
import { pricingSchemaRegistry } from '../../../src/pricing/pricingSchemaRegistry.js';
import { opportunityQuoteUiContract } from '../../../src/ui-contracts/opportunityQuoteUiContract.js';
import { createOpportunityHeaderSectionModel } from './OpportunityHeaderSectionModel.js';
import { createOpportunityRelationshipSectionModel } from './OpportunityRelationshipSectionModel.js';
import { createOpportunityHeaderSummaryModel } from './OpportunityHeaderSummaryModel.js';
import { createOpportunityRelationshipSummaryModel } from './OpportunityRelationshipSummaryModel.js';
import { createOpportunityServiceToggleSummaryModel } from './OpportunityServiceToggleSummaryModel.js';
import { createOpportunityWorkflowSummaryModel } from './OpportunityWorkflowSummaryModel.js';
import { createOpportunityQuotesSummaryModel } from './OpportunityQuotesSummaryModel.js';

export function createOpportunityPageModel() {
  return {
    type: 'OpportunityPageModel',

    header: {
      title: 'Opportunities',
      entity: opportunityDomainContract.entity
    },

    headerSection: createOpportunityHeaderSectionModel(),
    headerSummary: createOpportunityHeaderSummaryModel(),

    relationships: {
      accountRequired: opportunityDomainContract.requiredRelationships.account,
      primaryContactOptional: opportunityDomainContract.requiredRelationships.primaryContact,
      additionalContactsSupported: opportunityDomainContract.requiredRelationships.additionalContacts
    },

    relationshipSection: createOpportunityRelationshipSectionModel(),
    relationshipSummary: createOpportunityRelationshipSummaryModel(),

    serviceToggle: {
      options: opportunityDomainContract.serviceToggles
    },
    serviceToggleSummary: createOpportunityServiceToggleSummaryModel(),

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
    workflowSummary: createOpportunityWorkflowSummaryModel(),

    quotes: {
      brandingProfiles: quoteDomainContract.brandingProfiles,
      statusModel: quoteDomainContract.statusModel,
      retentionRequirements: quoteDomainContract.retentionRequirements,
      requiredActions: opportunityQuoteUiContract.quotePanel.requiredActions
    },
    quotesSummary: createOpportunityQuotesSummaryModel(),

    audit: {
      required: opportunityQuoteUiContract.auditPanel.required,
      trackedEntityTypes: opportunityQuoteUiContract.auditPanel.trackedEntityTypes
    },

    requiredSections: opportunityQuoteUiContract.requiredSections
  };
}
