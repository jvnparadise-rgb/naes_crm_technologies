export const opportunityContactLinkUiContract = {
  page: 'opportunities',

  relationshipArea: {
    primaryContactOptional: true,
    additionalContactsSupported: true,
    existingContactSelectionSupported: true,
    inlineContactCreateSupported: true,
    immediateAssociationRequired: true
  },

  requiredActions: [
    'selectPrimaryContact',
    'createPrimaryContact',
    'addAdditionalContact',
    'createAdditionalContact',
    'bindContactToOpportunity'
  ]
};
