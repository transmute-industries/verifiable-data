
# generate key from seed
npm run transmute -- \
key generate \
--type "ed25519" \
--seed "ed585a037d66e126a8fe2cce201c9e247368e6e74e890e852eb16493234b058d" \
--output "./data/keys/a.json" \
--debug


# generate key from mnemonic (uses generate key from seed internally)
npm run transmute -- \
key generate \
--type "ed25519" \
--mnemonic "correct horse battery staple" \
--hdpath "m/44'/0'/0'/0" \
--output "./data/keys/a.json" \
--debug
