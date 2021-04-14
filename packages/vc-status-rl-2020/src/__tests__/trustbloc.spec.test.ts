import { ld as vc } from '@transmute/vc.js';
import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';
import { BbsBlsSignature2020 } from '@mattrglobal/jsonld-signatures-bbs';
import { checkStatus } from '..';
import { documentLoader } from '../__fixtures__';

it('can verify trustbloc vc', async () => {
  const wrapInVp = (credential: any) => {
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/bbs/v1',
      ],
      type: ['VerifiablePresentation'],
      verifiableCredential: [credential],
    };
  };

  const suiteMap = {
    Ed25519Signature2018: Ed25519Signature2018,
    BbsBlsSignature2020: BbsBlsSignature2020,
  };
  const result = await vc.verify({
    unsignedPresentation: wrapInVp({
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/vaccination/v1',
        'https://w3id.org/vc-revocation-list-2020/v1',
        'https://w3id.org/security/bbs/v1',
      ],
      credentialStatus: {
        id: 'https://issuer.sandbox.trustbloc.dev/status/1#111',
        revocationListCredential:
          'https://issuer.sandbox.trustbloc.dev/status/1',
        revocationListIndex: '111',
        type: 'RevocationList2020Status',
      },
      credentialSubject: {
        administeringCentre: 'MoH',
        batchNumber: '1183738569',
        countryOfVaccination: 'NZ',
        healthProfessional: 'MoH',
        id:
          'did:key:zUC7LaHFbYB7eYU4uXPPMGJTj3ZrFFmgheZRwCDhJGmYQHnUD3zgSWYARgji6qLq2o395DveJMg6LkGmVohB2sGQefCcpYxtG84M33oxo2cdAUHvboeJrhf9dbCdkxvdtsLPGh9',
        recipient: {
          birthDate: '1958-07-17',
          familyName: 'Pasteur',
          gender: 'Male',
          givenName: 'Louis',
          type: 'VaccineRecipient',
        },
        type: 'VaccinationEvent',
        vaccine: {
          atcCode: 'J07BX03',
          disease: 'COVID-19',
          marketingAuthorizationHolder: 'Moderna Biotech',
          medicinalProductName: 'COVID-19 Vaccine Moderna',
          type: 'Vaccine',
        },
      },
      description: 'COVID-19 Vaccination Certificate for Mr.Louis Pasteur',
      id: 'http://example.com/5a65f5a0-66a7-4be7-98fe-0eaa3c7e2794',
      issuanceDate: '2021-03-12T22:41:43.752622339Z',
      issuer: {
        id:
          'did:key:zUC72c7u4BYVmfYinDceXkNAwzPEyuEE23kUmJDjLy8495KH3pjLwFhae1Fww9qxxRdLnS2VNNwni6W3KbYZKsicDtiNNEp76fYWR6HCD8jAz6ihwmLRjcHH6kB294Xfg1SL1qQ',
        name: 'didkey-bbsblssignature2020-bls12381g2',
      },
      name: 'COVID-19 Vaccination Certificate',
      proof: {
        created: '2021-03-12T22:41:58.378826082Z',
        proofPurpose: 'assertionMethod',
        proofValue:
          'kXE4-2z5klTZ19okANLf03GOxMxEH2c09hIoMkX4Yybz3oR59XjSTQZ5oXLS1NfVDODiBWpGiDTpvnwSmOruecvVU3TTWj8_xVDN4ODbBGULjMw4Oxb73UxQOrE2aO3U5NblrU619n8MyEiM8BofWA',
        type: 'BbsBlsSignature2020',
        verificationMethod:
          'did:key:zUC72c7u4BYVmfYinDceXkNAwzPEyuEE23kUmJDjLy8495KH3pjLwFhae1Fww9qxxRdLnS2VNNwni6W3KbYZKsicDtiNNEp76fYWR6HCD8jAz6ihwmLRjcHH6kB294Xfg1SL1qQ#zUC72c7u4BYVmfYinDceXkNAwzPEyuEE23kUmJDjLy8495KH3pjLwFhae1Fww9qxxRdLnS2VNNwni6W3KbYZKsicDtiNNEp76fYWR6HCD8jAz6ihwmLRjcHH6kB294Xfg1SL1qQ',
      },
      type: ['VerifiableCredential', 'VaccinationCertificate'],
    }),
    documentLoader: (iri: string) => {
      if (
        iri.startsWith(
          'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA'
        )
      ) {
        return {
          documentUrl: iri,
          document: {
            '@context': [
              'https://www.w3.org/ns/did/v1',
              'https://ns.did.ai/transmute/v1',
            ],
            id:
              'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA',
            verificationMethod: [
              {
                controller:
                  'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA',
                id:
                  'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#9b0aeZejuz3IFsDekhICFlGCBuN1HPsvYAVc-Yytw1s',
                publicKeyBase58: 'Hied5GXHnKjfxRKWpjegtvwckdcW4dWYNiQKpEHKwbat',
                type: 'Ed25519VerificationKey2018',
              },
              {
                controller:
                  'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA',
                id:
                  'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#qMfK3W_fw-zRHacYNl8MlxLWjOKB-ra06tFTIizZcyA',
                publicKeyJwk: {
                  kty: 'OKP',
                  crv: 'Ed25519',
                  x: 'L57eORjfwFy9xAAIK47ECWlg6WxJZzMWZFAzcls6w3E',
                },
                type: 'JwsVerificationKey2020',
              },
              {
                controller:
                  'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA',
                id:
                  'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#GDwZhuDhRKqpQjKdJ_QG4b2KGMWdGIwb_fmDhHjsXZ4',
                publicKeyJwk: {
                  kty: 'EC',
                  crv: 'P-256',
                  x: 'NCp3kgWqZrOcemREvLJiZTBprUTv4UiJkFmumnBVMvI',
                  y: 'c4qTso0RVBHFsA5MOKV7o_3hpLd2piqAFDb-dEPTZf0',
                },
                type: 'JwsVerificationKey2020',
              },
            ],
            authentication: [
              'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#9b0aeZejuz3IFsDekhICFlGCBuN1HPsvYAVc-Yytw1s',
              'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#qMfK3W_fw-zRHacYNl8MlxLWjOKB-ra06tFTIizZcyA',
              'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#GDwZhuDhRKqpQjKdJ_QG4b2KGMWdGIwb_fmDhHjsXZ4',
            ],
            assertionMethod: [
              'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#9b0aeZejuz3IFsDekhICFlGCBuN1HPsvYAVc-Yytw1s',
              'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#qMfK3W_fw-zRHacYNl8MlxLWjOKB-ra06tFTIizZcyA',
              'did:trustbloc:testnet.trustbloc.dev:EiA93NYbmVnRB0vdlwYMijSoHDQL21QRo8bWCJ_h7rglGA#GDwZhuDhRKqpQjKdJ_QG4b2KGMWdGIwb_fmDhHjsXZ4',
            ],
          },
        };
      }

      return documentLoader(iri);
    },
    suiteMap,
    checkStatus: (args: any) => {
      return checkStatus({ ...args, suiteMap });
    }, // required
  });
  // console.log(JSON.stringify(result, null, 2));
  expect(result.verified).toBe(true);
});
