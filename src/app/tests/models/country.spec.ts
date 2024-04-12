import { Country } from '../../models/country';

describe('Country', () => {
  it('should create an instance', () => {
    expect(new Country(1, "FR", "France")).toBeTruthy();
  });
});
