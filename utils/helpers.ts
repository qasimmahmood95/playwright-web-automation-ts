/**
 * SauceDemo product slugs — the strings used in data-test attributes.
 * Used with ProductsPage.addToCart() and ProductsPage.removeFromCart().
 *
 * Example:
 *   await productsPage.addToCart(Products.ONESIE).click();
 */
export const Products = {
  BACKPACK: 'sauce-labs-backpack',
  BIKE_LIGHT: 'sauce-labs-bike-light',
  BOLT_T_SHIRT: 'sauce-labs-bolt-t-shirt',
  FLEECE_JACKET: 'sauce-labs-fleece-jacket',
  ONESIE: 'sauce-labs-onesie',
  RED_T_SHIRT: 'test.allthethings()-t-shirt-(red)',
} as const;

export type Product = (typeof Products)[keyof typeof Products];
