



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


