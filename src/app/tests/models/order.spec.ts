import { Order } from '../../models/order';

describe('Order', () => {
  it('should create an instance', () => {
    expect(new Order(36, 3)).toBeTruthy();
  });
});
