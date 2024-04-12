import {Product} from '../../models/product';

describe('Product', () => {
  it('should create an instance', () => {
    expect(new Product(2, "sku", "name", "description", 20.9,
      "url", true, true,
      new Date("2024-02-03"), new Date("2024-02-05"))).toBeTruthy();
  });
});
