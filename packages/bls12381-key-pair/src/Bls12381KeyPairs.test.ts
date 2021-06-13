import { Bls12381KeyPairs } from './Bls12381KeyPairs';

it('generate', async () => {
  const kn = await Bls12381KeyPairs.generate({
    secureRandom: () => {
      return Uint8Array.from(
        Buffer.from(
          '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
          'hex'
        )
      );
    },
  });
  expect(kn.id).toBe(
    'did:key:z5TcEUwEFkVuVhRpBinQrCgAtSmtQxyajQvpjma5TnWedYqJNXKYvS3UA4rrAkqfMm9VnhiZAf9gpqj7DJDsUJTAJkisUNbenUy64kitTduKihxQb4ScGb1XfRHzMMJWBQa7o7ar46ACzdfW4oqzpnj8gqLH2fjQF82LQACATNc3pXem8chkM7vEQKHKcK2HHK8tbVdfP#z5TcEUwEFkVuVhRpBinQrCgAtSmtQxyajQvpjma5TnWedYqJNXKYvS3UA4rrAkqfMm9VnhiZAf9gpqj7DJDsUJTAJkisUNbenUy64kitTduKihxQb4ScGb1XfRHzMMJWBQa7o7ar46ACzdfW4oqzpnj8gqLH2fjQF82LQACATNc3pXem8chkM7vEQKHKcK2HHK8tbVdfP'
  );
});
