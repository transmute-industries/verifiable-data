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
