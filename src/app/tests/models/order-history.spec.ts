import { OrderHistory } from '../../models/order-history';

describe('OrderHistory', () => {
  it('should create an instance', () => {
    expect(new OrderHistory( "9e04eb8b-3d62-49bd-8479-e33c1a6cf63f",
        50, 10, new Date("2024-04-14T19:56:11.702+00:00"))).toBeTruthy();
  });
});
