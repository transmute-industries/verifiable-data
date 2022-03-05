This api aligns with the command line interface used in [decentralized-identity/JWS-Test-Suitedecentralized-identity/JWS-Test-Suite](https://github.com/decentralized-identity/JWS-Test-Suite).

### Present Credentials

#### From a Key

```
npm run transmute -- \
presentation create \
--input  "./data/templates/b.json"  \
--output "./data/presentations/c.json" \
--key "./data/keys/a.json" \
--domain "ontology.example" \
--challenge "123" \
--format "vp" \
--debug
```

#### From a Mnemonic

```
npm run transmute -- \
presentation create \
--input  "./data/templates/b.json"  \
--output "./data/presentations/c.json" \
--mnemonic "correct horse battery staple" \
--hdpath "m/44’/0’/0’/0" \
--type "ed25519" \
--domain "ontology.example" \
--challenge "123" \
--format "vp" \
--debug
```

### From vc api

```
npm run transmute -- \
presentation create \
--input  "./data/templates/b1.json"  \
--output "./data/presentations/c1.json" \
--endpoint "http://localhost:3000/api/presentations/prove" \
--domain "ontology.example" \
--challenge "123" \
--debug
```

### Verify Presentation

```
npm run transmute -- \
presentation verify \
--input  "./data/presentations/b.json"  \
--output "./data/verifications/b.json" \
--endpoint "https://api.did.actor/api/presentations/verify" \
--debug
```
