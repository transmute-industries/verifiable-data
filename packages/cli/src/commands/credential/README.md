This api aligns with the command line interface used in [decentralized-identity/JWS-Test-Suitedecentralized-identity/JWS-Test-Suite](https://github.com/decentralized-identity/JWS-Test-Suite).

### Issue Credentials

```
npm run transmute -- credential create --help
```

#### From a Key

```
npm run transmute -- \
credential create \
--input  "./data/templates/a.json"  \
--output "./data/credentials/c.json" \
--key "./data/keys/a.json" \
--format "vc" \
--debug
```

#### From a Mnemonic

```
npm run transmute -- \
credential create \
--input  "./data/templates/a.json"  \
--output "./data/credentials/c.json" \
--mnemonic "correct horse battery staple" \
--hdpath "m/44’/0’/0’/0" \
--type "ed25519" \
--format "vc" \
--debug
```
