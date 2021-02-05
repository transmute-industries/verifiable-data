import { stringToUint8Array } from './util';

it('stringToUint8Array', () => {
  const data = '123';
  const result = stringToUint8Array(data);
  expect(Buffer.from(result).toString('hex')).toBe('313233');
});
