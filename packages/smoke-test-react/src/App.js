import React from "react";

import { generate } from "@transmute/web-crypto-key-pair";
function App() {
  const [state, setState] = React.useState({ kp: {} });
  React.useEffect(() => {
    (async () => {
      const kp = await generate({ kty: "EC", crvOrSize: "P-384" });
      setState({
        kp,
      });
    })();
  }, []);
  return (
    <div className="App">
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
