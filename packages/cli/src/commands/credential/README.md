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

#### From a VC API

```
npm run transmute -- \
credential create \
--input  "./data/templates/a1.json"  \
--output "./data/credentials/c1.json" \
--endpoint "https://api.did.actor/api/credentials/issue" \
--debug
```

### Verify a Credential

```
npm run transmute -- \
credential verify \
--input  "./data/credentials/c.json"  \
--output "./data/verifications/a.json" \
--endpoint "https://api.did.actor/api/credentials/verify" \
--debug
```
