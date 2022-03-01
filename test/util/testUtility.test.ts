import { isTesting } from '../../src/util/testUtility';

describe('Testing utility test', () => {
  it('isTesting', () => {
    expect(isTesting()).toBeTruthy();
  });
});
