import { State } from '../../models/state';

describe('State', () => {
  it('should create an instance', () => {
    expect(new State(1, "bordeaux")).toBeTruthy();
  });
});
