# notes

this bug was caused by invalid key conversion.

The private key needs the public key appended before import to stable lib,
and stripped before export ot JWK.
