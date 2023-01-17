
# Create a JWT via BIP 39 and BIP 44

npm run transmute -- \
jose sign \
--input  "./data/payload/a.json"  \
--output "./data/jwt/c.json" \
--kid "did:web:transmute-industries.github.io:public-credential-registry-template:issuers:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn" \
--mnemonic "sell antenna drama rule twenty cement mad deliver you push derive hybrid" \
--hdpath "m/44'/0'/0'/0/0" \
--type "ed25519" \
--debug


npm run transmute -- \
jose verify \
--input "./data/jwt/c.json" \
--output "./data/jwt/c.v.json" \
--kid "did:web:transmute-industries.github.io:public-credential-registry-template:issuers:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn#z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn" \
--debug
