
# Create a JWT via BIP 39 and BIP 44

npm run transmute -- \
jose sign \
--input  "./data/payload/a.json"  \
--output "./data/jwt/c1.json" \
--key '{"id":"did:key:z6MkojCaWkownNqcHBUCb3bT3WToeE6BjiFsEQpnhZaeC3Ce#z6MkojCaWkownNqcHBUCb3bT3WToeE6BjiFsEQpnhZaeC3Ce","type":"JsonWebKey2020","controller":"did:key:z6MkojCaWkownNqcHBUCb3bT3WToeE6BjiFsEQpnhZaeC3Ce","publicKeyJwk":{"kty":"OKP","crv":"Ed25519","x":"ic6OKCg2acdx3rvsWub9VCpSU93M1lVAT8lvAl05zJM"},"privateKeyJwk":{"kty":"OKP","crv":"Ed25519","x":"ic6OKCg2acdx3rvsWub9VCpSU93M1lVAT8lvAl05zJM","d":"72zj79imvVPhvw4VXFENUpUPDWzQypIjYDauokybmao"}}' \
--debug


npm run transmute -- \
jose verify \
--input "./data/jwt/c1.json" \
--output "./data/jwt/c1.v.json" \
--kid "did:key:z6MkojCaWkownNqcHBUCb3bT3WToeE6BjiFsEQpnhZaeC3Ce#z6MkojCaWkownNqcHBUCb3bT3WToeE6BjiFsEQpnhZaeC3Ce" \
--debug
