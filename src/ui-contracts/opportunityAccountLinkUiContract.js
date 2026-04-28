export const opportunityAccountLinkUiContract = {
  page: 'opportunities',

  relationshipArea: {
    accountRequired: true,
    existingAccountSelectionSupported: true,
    inlineAccountCreateSupported: true,
    immediateAssociationRequired: true
  },

  requiredActions: [
    'selectExistingAccount',
    'createNewAccount',
    'bindAccountToOpportunity'
  ]
};
