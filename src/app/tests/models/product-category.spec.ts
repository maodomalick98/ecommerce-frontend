import { ProductCategory } from '../../models/product-category';

describe('ProductCategory', () => {
  it('should create an instance', () => {
    expect(new ProductCategory(1, "name")).toBeTruthy();
  });
});