/**
 * Checkout form test data.
 * Covers the happy path and common validation error scenarios.
 */
export interface CustomerData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const CheckoutData = {
  VALID: { firstName: 'Test', lastName: 'User', postalCode: 'EC1A 1BB' },
  EMPTY_FIRST_NAME: { firstName: '', lastName: 'User', postalCode: 'EC1A 1BB' },
  EMPTY_LAST_NAME: { firstName: 'Test', lastName: '', postalCode: 'EC1A 1BB' },
  EMPTY_POSTAL_CODE: { firstName: 'Test', lastName: 'User', postalCode: '' },
} as const satisfies Record<string, CustomerData>;
