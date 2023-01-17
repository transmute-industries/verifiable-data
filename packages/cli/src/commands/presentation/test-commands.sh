# Create a Verifiable Presentation
npm run transmute -- \
presentation create \
--input  "./data/templates/b.json"  \
--output "./data/presentations/c.json" \
--key "./data/keys/a.json" \
--domain "ontology.example" \
--challenge "123" \
--format "vp" \
--debug

# Create a Verifiable Presentation via BIP 39 and BIP 44
npm run transmute -- \
presentation create \
--input  "./data/templates/b.json"  \
--output "./data/presentations/c.json" \
--mnemonic "correct horse battery staple" \
--hdpath "m/44'/0'/0'/0" \
--type "ed25519" \
--domain "ontology.example" \
--challenge "123" \
--format "vp" \
--debug

# Create a Verifiable Presentation via https://github.com/w3c-ccg/vc-api
presentation create \
--input  "./data/templates/b1.json"  \
--output "./data/presentations/c1.json" \
--endpoint "https://api.did.actor/api/presentations/prove" \
--domain "ontology.example" \
--challenge "123" \
--debug

# Verify a Verifiable Presentation via https://github.com/w3c-ccg/vc-api
npm run transmute -- \
presentation verify \
--input  "./data/presentations/b.json"  \
--output "./data/verifications/b.json" \
--endpoint "https://api.did.actor/api/presentations/verify" \
--debug