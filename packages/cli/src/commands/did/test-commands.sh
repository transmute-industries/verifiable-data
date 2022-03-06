

# generate did web from github data and mnemonic
npm run transmute -- \
did generate \
--username "transmute-industries" \
--repository "public-credential-registry-template" \
--mnemonic "sell antenna drama rule twenty cement mad deliver you push derive hybrid" \
--hdpath "m/44'/0'/0'/0" \
--type "ed25519" \
--output "./data/public/did.json" \
--debug


