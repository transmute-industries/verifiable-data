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