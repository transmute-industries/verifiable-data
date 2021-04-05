import { walletFactory } from "../index";

it("can use factory to build new wallet", () => {
  const wallet = walletFactory.build({
    contents: []
  });

  expect(wallet.status).toBe("UNLOCKED");
});
