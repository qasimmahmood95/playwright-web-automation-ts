import { faker } from '@faker-js/faker';

// A fixed seed keeps the generated data realistic yet identical on every run,
// so CI never flakes on random input and any failure reproduces exactly.
faker.seed(20260712);

const validInformation = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  postalCode: faker.location.zipCode(),
};

export const CheckoutData = {
  valid: validInformation,
  // Each invalid scenario reuses the valid data with exactly one field blanked,
  // so the test isolates the effect of that single missing field.
  missingFirstName: { ...validInformation, firstName: '' },
  missingLastName: { ...validInformation, lastName: '' },
  missingPostalCode: { ...validInformation, postalCode: '' },
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
