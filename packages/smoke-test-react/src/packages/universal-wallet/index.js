import React from "react";

import { seed } from "@transmute/universal-wallet-test-vectors";
import { customWalletFactory } from "./customWalletFactory";
import { issue } from "./issue";
import { present } from "./present";
import { verify } from "./verify";

const testDidKey = async (wallet) => {
  // generate and add keys from seed (did-key)
  const c0 = await wallet.generateContentFromSeed(Buffer.from(seed, "hex"));
  c0.forEach((c) => {
    wallet.add(c);
  });
};

const testDidWeb = async (wallet) => {
  await wallet.generate("https://example.com/organizations/123/did.json");
};

const testEdv = async (wallet) => {
  const client = await wallet.vaultClientFromPassord(
    "https://staging.data-vault.transmute.industries/edvs",
    "123"
  );
  wallet.vault = { endpoint: client.vault_endpoint };
};

const testVc = async (wallet) => {
  // issue credential from generated keys
  const c1 = await issue(wallet);
  c1.forEach((c) => {
    wallet.add(c);
  });
  // present credentials
  const c2 = await present(wallet);
  c2.forEach((c) => {
    wallet.add(c);
  });
  const c3 = await verify(wallet);
  c3.forEach((c) => {
    wallet.add(c);
  });
};

function App() {
  const [state, setState] = React.useState({});
  React.useEffect(() => {
    (async () => {
      const wallet = customWalletFactory.build({ contents: [] });
      await testDidKey(wallet);
      await testDidWeb(wallet);
      await testVc(wallet);
      await testEdv(wallet);

      setState({
        wallet,
      });
    })();
  }, []);
  return (
    <div className="Package">
      <h4>@transmute/universal-wallet</h4>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
