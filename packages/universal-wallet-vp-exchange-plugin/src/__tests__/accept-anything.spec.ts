import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018
} from "@transmute/ed25519-signature-2018";
import {
  walletFactory,
  FixtureWalletFactory
} from "../__fixtures__/walletFactory";

import { makeVc } from "../__fixtures__/makeVc";

import { documentLoader } from "../__fixtures__/documentLoader";

let aliceWallet: FixtureWalletFactory;
let bobWallet: FixtureWalletFactory;

const getVp = async (m1: any) => {
  const vc = await makeVc(aliceWallet, "IntentToSell");
  // this stuff feels like it should be abstracted...
  const key = await Ed25519VerificationKey2018.from(aliceWallet.contents[0]);
  const suite = new Ed25519Signature2018({
    key,
    date: "2020-03-10T04:24:12.164Z"
  });
  const m2 = {
    verifiablePresentation: await aliceWallet.createVerifiablePresentation({
      verifiableCredential: [vc],
      options: {
        holder: aliceWallet.contents[0].controller,
        challenge: m1.challenge,
        domain: m1.domain,
        suite,
        documentLoader: documentLoader
      }
    })
  };
  return m2;
};

beforeAll(async () => {
  let k0 = await Ed25519VerificationKey2018.generate({
    secureRandom: () => {
      return Buffer.from(
        "7052adea8f9823817065456ecad5bf24dcd31a698f7bc9a0b5fc170849af4226",
        "hex"
      );
    }
  });

  const k1 = await Ed25519VerificationKey2018.generate({
    secureRandom: () => {
      return Buffer.from(
        "8052adea8f9823817065456ecad5bf24dcd31a698f7bc9a0b5fc170849af4226",
        "hex"
      );
    }
  });
  aliceWallet = walletFactory
    .build()
    .add(
      await k0.export({ type: "JsonWebKey2020", privateKey: true })
    ) as FixtureWalletFactory;

  bobWallet = walletFactory
    .build()
    .add(
      await k1.export({ type: "JsonWebKey2020", privateKey: true })
    ) as FixtureWalletFactory;
});

let m0: any;
let m1: any;
let m2: any;

it("alice notifies bob of intent to present", async () => {
  // request
  m0 = aliceWallet.createNotificationQueryRequest(
    "IntentToSellProductCategory"
  );
  // alice.send(m0, bob)

  // response
  m1 = bobWallet.createNotificationQueryResponse("bob.example.com", m0);
  // bob.send(m1, alice)
});

it("alice responds to bobs challenge and query with a vp", async () => {
  // normally alice might have this vc, in this case
  // for testing here, we create it on the fly
  m2 = await getVp(m1);
  // alice.send(m2, bob)
});

it("bob verifies and stores alice's vp", async () => {
  await bobWallet.verifyAndAddPresentation(m2, {
    suite: new Ed25519Signature2018(),
    documentLoader: documentLoader
  });
  expect(bobWallet.contents[2].type).toBe("Submission");
});
