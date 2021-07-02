import * as Factory from 'factory.ts';
import * as Wallet from '../index';

const walletFactory: Factory.Factory<any> = Factory.Sync.makeFactory<any>({
  ...Wallet.walletDefaults,
}).combine(Wallet.walletFactory);

const wallet = walletFactory.build();

const encryptedContent = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'http://w3id.org/wallet/v1',
  ],
  id:
    'did:key:z6LSmR86uQjkRATQSJFxwimXG61iJY94faxR1QUZJ6NcKJTq#encrypted-wallet',
  type: ['VerifiableCredential', 'EncryptedWallet'],
  issuer: 'did:key:z6LSmR86uQjkRATQSJFxwimXG61iJY94faxR1QUZJ6NcKJTq',
  issuanceDate: '2021-07-02T15:57:30.267Z',
  credentialSubject: {
    id: 'did:key:z6LSmR86uQjkRATQSJFxwimXG61iJY94faxR1QUZJ6NcKJTq',
    encryptedWalletContents: {
      protected: 'eyJlbmMiOiJYQzIwUCJ9',
      recipients: [
        {
          header: {
            kid:
              'did:key:z6LSmR86uQjkRATQSJFxwimXG61iJY94faxR1QUZJ6NcKJTq#z6LSmR86uQjkRATQSJFxwimXG61iJY94faxR1QUZJ6NcKJTq',
            alg: 'ECDH-ES+A256KW',
            epk: {
              kty: 'OKP',
              crv: 'X25519',
              x: 'tnYcRGAH1bR1pcKZvi64Tk7aOpCYdphoaXTCpg-IGXI',
            },
            apu: 'tnYcRGAH1bR1pcKZvi64Tk7aOpCYdphoaXTCpg-IGXI',
            apv:
              'ZGlkOmtleTp6NkxTbVI4NnVRamtSQVRRU0pGeHdpbVhHNjFpSlk5NGZheFIxUVVaSjZOY0tKVHEjejZMU21SODZ1UWprUkFUUVNKRnh3aW1YRzYxaUpZOTRmYXhSMVFVWko2TmNLSlRx',
          },
          encrypted_key:
            'EyUZ0KN3KMp3TNGidD2NK0djAzEEW4lNnZTWUv_BisBjyv40f_s9sA',
        },
      ],
      iv: 'Ml2Bje1-2Netyu5SozlP6p1qGJd85fpI',
      ciphertext:
        'tMeTCvSgC_BgGpAa3UDO-Pd-hpKkMPKyBkBwbDRbzG9em9irxiU2nUoQ2xJM-66ROOUUQLRlLS1feqmgd-w5tkZQ8Oo37fTYP8sz51oxRca4H69zQHhuQQaeqpZonqFm-7oj15bjnm8ZkLWnJFrefvcs7wjt7YZ0cTSoIoL5VnW6-53ImdF09Lxz-dQyk-YSKqNuqWN_4tBiDYKq9W1QozZmVNbk9WZ3JwAnITE0fwAiN1saRIcB6l2aZ2hkeS5NgsSuzJl6hdwvDMKQU5MHsAIFofLPz4Knscur-98qALq7BAawCb0p2NjpvmM1vz9mW-UFFXPtD_6uvpyaZRcdicYs1lhwTO4w1EmUEs96bYjNlhf5ouERNkqbRe7V_TQzLWR8Vhh_1BMAPCjF4sQq5mhIgS43UVRwoY7mZdlDPI5EO9ownpdfvxUsaCt8FptNJi1TpfJ1ikcH7HQXEmL34ZKJNHpGupperHmoAKSG_L4zs9kYhcn10VgJZKl7HrdlgwonsBLeEncJBbzEuxckJNmvIA4H-zlT8o4yTp4v0kXzmkVUiIEuhFwNDaSGVnNSnf8tj_B2htjvUo9JZfYBAfWq0zCZ-joHhLCKlsYRRhHKCIKyvgGsECh7ScRuXyEp_HlGcdyePpVajy1hEafcyHnixAyxs8JH_egLTiot7X9zJvvBCk-TU4xhlveiHAse-D1MqaPb9w2HroxDREomy-IJx_49PPH5OxxHrp1SItFgKczyz_6yi5c947tqrPNrKCRcIevRUhtmuE-Phv4lrFku_EImpdYXDbkLO9KfONN7dINszFT39pDzHWekS0VIaE8-IFpXmYB-tCoOsPpjtSmXMlgq48VfVGzYuZzWSAaTUEvM67JwdrvXXJpSZn6zDvrCVjJG_Bto82iSyUU07ReQMXlYKiL_D9jAGwJ__qXrY16E3CaE8mUCyHOu6SN8vjbygKRdRtBw48TbIb950V1gMVCK4JcROfAJopEaHtM9KS6HJy16MFp3TnTBVYi5Or971KQG5BvkE4oDjMDuED7ZPwXaOo4DypRXVIgVdZ5pEMo1tULURWI-lOs9-3m2kTUibcmOxEPuQ9fHw5Neu76SYqnHBJPUI2yWIEw8dugIMqC-LqhEcmvb8qC-zmF-19DeyL7OpCWOASRjDuAWrO0HUm7AdxW8EZAgwLV6utDTiipKlNaR1egTghecfAFGR7bds2Ltz2epAbVH1O7w_KNSBj10EHABY-AR3wPGaWykfgkCCdWs2nCYqvvk7iVBeQODwR75SCJ8Z-ep77lSSFzPaVwKftjQDNR0-ZhHbyN0ijtgkWOb4OrX9DqeqHUdY-tIRrH_FLlRjCOKZz17dEWo95Q_I_ZJ5At1V7ol-zhT1bw__fF19f1tgwx1Sf4G7T0o78XvOnOXsRPqwexzjqD5fVNjDD0Yt1qe-CECbJ8qjblzhHSJiVl5i3_ys_68Wi_4npgZoHZnLoIJWaahoZ00sBrLIaL31nOPgzXxzUU1FZJ8gbxRZaKuAysuv4gDWqfSUvWuY3UCN2ecZLelYtnYc6OmcOOPCZG7flpuMw3bOiso8ihfggWOsSIAanmOTldXm4ktWUtpwDlvkIogUjJS9bEx8g-kTquSjnHcelhu7ssHWyENGkbHbhemSb6ZaPWd6w-jh4zoNNBMRs6LZU9OYKAe68EWi_fu1vP-GEvpKo3_hGmtqckMD5eBg8xFr5ouXl9GQnna_W5_Bm6OZl-Zgslcndp9celDMwZ7m0IYuuHJ7KBrnH6vx7_QVNRd_k_pc7kZgH_s040TDbNfEPAwUU4IcfyxZMvB2aqiVLnA9skxILj9EeqM90N2jIScTkn-rEmbfladc2ltGyF8Dab3_E-XS2Rpo1CtTZB0mQK52CHm_kd5WMF_0ntZGnZlUhT21S5hfICc4yurrNQ-a7JVqB3tOf7YaHXQE_mw7XpKU5KOV3awkL0QJO8EYEMAPTokHy6BH_KsKR7z_JVcCdoScleqtw67TG6gBAd3EkREfeO1WL6gfwcJQ3U5OY9PCdDE3yTUuqeMikRPYyLbWSbTCc4k4LBB0nWTzzlKfp4_Y516B-JolVpxYOVr3twVOf9JmDiHXKpT1cDR-dPaPi93TLfA91_xEZyKo0SPdSNixQpi5SQJbMkhLNuzIGM--EBbESaloXQCSJ7faBJZDLEOlhsLmJzAh_JvvUZfnIMhQ34GthnCS6HFXsz2U4aFxw_EeAEIWvfk_rYpExIvCCvU1ePefFJ8EVrOQJ6q-vEbc9LdVQHdFtoxmiRFtJVgR3FD7PU3-GjA_05wTW0Z16Ax64a7sBSjAIfOuG85asGc0uXDTvf2u8SKL4Ux50zKCnsMyyieEUikjz8r47rykknCGjdRtu_1wRDIIIUtgBClATCgHjNTEu9TTVDfBa9y4gdN5ZLF3HUiyWiOqaX2h5nFTBlBKTHCp5mqrzrKcBuUn4fyn9ZbK-9ts9yMwutWXnztojHWNKnyhOID3ketojavqkUtgnO4NHfymufXPEF62snA5g3O0CtN1OyGY56YxyNIjzkmZHeiIGLrIMCgKzLdRPRgTqUNSTAasG3-IQT4F119ASk0nIkTQu9p_16a_MdasU_Sjyn8Cdkso-T7vLAS_a-D4PeIpld2nvp6b8i-3U56pZsO',
      tag: '5u1PoZ7yJI_9cMVys4iSxQ',
    },
  },
};

describe('Reproduce wallet import bug', () => {
  it('wallet.import errors', async () => {
    const hexSecret =
      'efbfbd6fefbfbd154cefbfbd385505efbfbd244cefbfbd703aefbfbdefbfbd2e21d793efbfbd625f3eefbfbdefbfbd163e115771';
    const secret = Buffer.from(hexSecret, 'hex');
    await wallet.import(encryptedContent, secret);
  });
});
