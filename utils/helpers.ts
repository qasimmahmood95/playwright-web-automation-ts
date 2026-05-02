export const Products = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltTShirt: 'sauce-labs-bolt-t-shirt',
  fleeceJacket: 'sauce-labs-fleece-jacket',
  onesie: 'sauce-labs-onesie',
  redTShirt: 'test.allthethings()-t-shirt-(red)',
} as const;

export type ProductId = (typeof Products)[keyof typeof Products];
