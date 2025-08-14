import { expect } from 'https://cdn.skypack.dev/chai@4.3.7';
describe('tokensService', () => {
  it('increments token logically (illustrative)', () => {
    let curr = 0;
    const next = () => ++curr;
    expect(next()).to.equal(1);
    expect(next()).to.equal(2);
  });
});
