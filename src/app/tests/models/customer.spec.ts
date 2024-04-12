import { Customer } from '../../models/customer';

describe('Customer', () => {
  it('should create an instance', () => {
    expect(new Customer("John", "Doe", "johnDoe@gmail.com")).toBeTruthy();
  });
});
