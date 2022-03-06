# Create a Verifiable Credential in JSON-LD Data Integrity Format.

npm run transmute -- \
credential create \
--input  "./data/templates/a.json"  \
--output "./data/credentials/c.json" \
--key "./data/keys/a.json" \
--format "vc" \
--debug


# Create a Verifiable Credential via BIP 39 and BIP 44

npm run transmute -- \
credential create \
--input  "./data/templates/a.json"  \
--output "./data/credentials/c.json" \
--mnemonic "correct horse battery staple" \
--hdpath "m/44'/0'/0'/0" \
--type "ed25519" \
--format "vc" \
--debug


# Create a Verifiable Credential via https://github.com/w3c-ccg/vc-api
npm run transmute -- \
credential create \
--input  "./data/templates/a1.json"  \
--output "./data/credentials/c1.json" \
--endpoint "https://api.did.actor/api/credentials/issue" \
--debug

# Verify a Verifiable Credential via https://github.com/w3c-ccg/vc-api

npm run transmute -- \
credential verify \
--input  "./data/credentials/c.json"  \
--output "./data/verifications/a.json" \
--endpoint "https://api.did.actor/api/credentials/verify" \
--debug

# Create a Revocation List Verifiable Credential via https://github.com/w3c-ccg/vc-api
npm run transmute -- \
credential create \
--input  "./data/templates/rl-vc-0.json"  \
--output "./data/credentials/rl-vc-0.json" \
--endpoint "https://api.did.actor/api/credentials/issue" \
--debug

# Set the status for an index in a Revocation List Verifiable Credential
npm run transmute -- \
credential setStatusListIndex \
--input  "./data/credentials/rl-vc-0.json"  \
--output "./data/credentials/rl-vc-0.json" \
--mnemonic "sell antenna drama rule twenty cement mad deliver you push derive hybrid" \
--hdpath "m/44'/0'/0'/0" \
--type "ed25519" \
--credentialIndex "100" \
--status false \
--debug

# Check the status of an index in a Revocation List Verifiable Credential
npm run transmute -- \
credential isStatusListIndexSet \
--input  "./data/credentials/rl-vc-0.json"  \
--output "./data/credentials/rl-vc-0.s0.json" \
--credentialIndex "100" \
--debug