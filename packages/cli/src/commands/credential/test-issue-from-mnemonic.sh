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




# Create a Verifiable Credential via BIP 39 and BIP 44 for a public credential registry 
npm run transmute -- \
credential create \
--input  "./data/templates/a.json"  \
--username "transmute-industries" \
--repository "public-credential-registry-template" \
--output "./data/public-credential-registry/example-credential.json" \
--mnemonic "correct horse battery staple" \
--hdpath "m/44'/0'/0'/0" \
--type "ed25519" \
--format "vc" \
--debug

# Refresh a public credential registry index
npm run transmute -- \
credential registryIndexRefresh \
--input  "./data/public-credential-registry"  \
--debug
