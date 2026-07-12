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

export const CheckoutErrors = {
  firstName: 'Error: First Name is required',
  lastName: 'Error: Last Name is required',
  postalCode: 'Error: Postal Code is required',
} as const;

/** Invalid form scenarios paired with the exact error each must surface. */
export const InvalidCheckoutScenarios = [
  { missing: 'first name', data: CheckoutData.missingFirstName, error: CheckoutErrors.firstName },
  { missing: 'last name', data: CheckoutData.missingLastName, error: CheckoutErrors.lastName },
  {
    missing: 'postal code',
    data: CheckoutData.missingPostalCode,
    error: CheckoutErrors.postalCode,
  },
] as const;
