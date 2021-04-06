import { Ed25519KeyPair } from "@transmute/did-key-ed25519";
// import { Ed25519Signature2018 } from "@transmute/ed25519-signature-2018";
import { walletFactory, WalletFactory } from "../__fixtures__/walletFactory";

let aliceWallet: WalletFactory;
let bobWallet: WalletFactory;

beforeAll(async () => {
  aliceWallet = walletFactory.build().add(
    await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(
          "7052adea8f9823817065456ecad5bf24dcd31a698f7bc9a0b5fc170849af4226",
          "hex"
        );
      },
    }).then((k) => {
      let k0 = k.toJsonWebKeyPair(true);
      k0.id = k0.controller + k0.id;
      return k0;
    })
  ) as WalletFactory;

  bobWallet = walletFactory.build().add(
    await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(
          "8052adea8f9823817065456ecad5bf24dcd31a698f7bc9a0b5fc170849af4226",
          "hex"
        );
      },
    }).then((k) => {
      let k0 = k.toJsonWebKeyPair(true);
      k0.id = k0.controller + k0.id;
      return k0;
    })
  ) as WalletFactory;
});

it("bob configures his wallet to support a new credential flow", async () => {
  bobWallet.authorizeCredentialFlow("IntentToSellProductCategory", [
    "IntentToSell",
  ]);
  expect(bobWallet.contents[1].type).toBe("FlowRequirements");
});

it("bob configures his wallet to accept a flow from alice", async () => {
  bobWallet.authorizePresentationFlow(aliceWallet.contents[0].controller, [
    "IntentToSellProductCategory",
  ]);
  expect(bobWallet.contents[2].type).toBe("AuthorizedFlows");
});

it("alice notifies bob of intent to present", async () => {
  const m0 = aliceWallet.createNotificationQueryRequest(
    "IntentToSellProductCategory"
  );
  // alice.send(m0, bob)
  const m1 = bobWallet.createNotificationQueryResponse("bob.example.com", m0);
  // bob.send(m1, alice)
  console.log(m1);
});
