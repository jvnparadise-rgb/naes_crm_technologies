export const contactEntryUiContract = {
  page: 'contacts',

  requiredActions: [
    'createContact',
    'editContact',
    'viewContact'
  ],

  requiredFields: [
    'accountId',
    'firstName',
    'lastName',
    'email',
    'phone',
    'title',
    'status'
  ],

  createFlow: {
    inlineCreateSupported: false,
    primaryEntryPoint: 'contacts-page'
  }
};
