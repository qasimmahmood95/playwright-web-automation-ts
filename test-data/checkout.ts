export const CheckoutData = {
  valid: {
    firstName: 'Testing',
    lastName: 'Tester',
    postalCode: 'TE5',
  },
  missingFirstName: {
    firstName: '',
    lastName: 'Tester',
    postalCode: 'TE5',
  },
  missingLastName: {
    firstName: 'Testing',
    lastName: '',
    postalCode: 'TE5',
  },
  missingPostalCode: {
    firstName: 'Testing',
    lastName: 'Tester',
    postalCode: '',
  },
} as const;
