#### Warning

VC-JWT has a number of challenges, and has been interpretted differently by various implementers.

The biggest issues are:

1. Unix Timestamp equivalence for issuanceDate and expiration
2. No standard way to do key dereferncing, `kid` is not required.
3. Various optional, or in addition too language.
4. constant need to encode and decode.


