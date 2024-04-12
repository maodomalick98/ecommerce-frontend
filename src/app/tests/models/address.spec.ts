import { Address } from '../../models/address';

describe('Address', () => {
  it('should create an instance', () => {
    expect(new Address("14 rue sagnet", "Toulouse", "France", "France", "33300")).toBeTruthy();
  });
});
