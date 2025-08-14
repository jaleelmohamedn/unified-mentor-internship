import { expect } from 'https://cdn.skypack.dev/chai@4.3.7';
describe('patientsService', () => {
  it('validates basic patient shape (illustrative)', () => {
    const pat = { id:'pat_x', fullName:'Test', phone:'9999999999', age:30, gender:'Other', history:[] };
    expect(pat).to.have.keys(['id','fullName','phone','age','gender','history']);
  });
});
