export const accountEntryUiContract = {
  page: 'accounts',

  requiredActions: [
    'createAccount',
    'editAccount',
    'viewAccount'
  ],

  requiredFields: [
    'name',
    'accountNumber',
    'industry',
    'status',
    'ownerUserId'
  ],

  createFlow: {
    inlineCreateSupported: false,
    primaryEntryPoint: 'accounts-page'
  }
};
