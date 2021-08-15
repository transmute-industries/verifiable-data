import { BbsBlsSignatureProof2020 } from "@transmute/bbs-bls12381-signature-2020";

import { verifiable } from "../..";
import * as fixtures from "./__fixtures__";

it("can derive credentials", async () => {
  const result = await verifiable.credential.derive({
    credential: fixtures.verifiableCredential,
    frame: fixtures.frame,
    format: ["vc"],
    documentLoader: (iri: string) => {
      if (iri.startsWith("did:key:z5TcCKfym9h8Vr6dmA")) {
        return {
          document: {
            "@context": [
              "https://www.w3.org/ns/did/v1",
              "https://w3id.org/security/suites/bls12381-2020/v1"
            ],
            id:
              "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P",
            verificationMethod: [
              {
                id:
                  "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P#zUC75GQp8DFusgffgEyvGiSoXL7UztujwGyjHXdJP9PcAz74dgGCrFSNyhKFPCsuxXeKLko5H19M2sL8RA45f7SMc2pKx3uvfn1KSB7nSh7GqX59kxWksVTSicghfFLGZBNK9ah",
                type: "Bls12381G2Key2020",
                controller:
                  "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P",
                publicKeyBase58:
                  "qRrw4XbgX4oTGJK56mkbE2kZkcbXuJRoR93UuHvoS6kGE5Ja9b3EBFMaEDXfSE6gCYPCEbHXeynAUHKxVr6dn5Hc9i1pi8sqAXRPYUUQMZwHQ4B9nZHLYpGjC4bNydDSeyP"
              }
            ],
            assertionMethod: [
              "did:key:z5TcCKfym9h8Vr6dmAgaebq4DBwxKM5Lm9pvt4E8JBqQz43HvtC3zGLrcyC3233fQz8h1T6w8kDzFepmAHA9cCYxTB2Gv3oSn5iazjj8wvYBweH8CQ5VnMoVnHS6Gqnchu5YBUnhRsUAfNymtG9CRfkC97TpbBQ6b1A2AfDvmC8tdYcLkDDA2Ehti5cY27PzG6DLGKF3P#zUC75GQp8DFusgffgEyvGiSoXL7UztujwGyjHXdJP9PcAz74dgGCrFSNyhKFPCsuxXeKLko5H19M2sL8RA45f7SMc2pKx3uvfn1KSB7nSh7GqX59kxWksVTSicghfFLGZBNK9ah"
            ]
          }
        } as any;
      }
      return fixtures.documentLoader(iri);
    },
    suite: new BbsBlsSignatureProof2020()
  });
  expect(result.items[0].proof.type).toBe("BbsBlsSignatureProof2020");
});
