# Cases
1. A MTR testing traceability, has related links, no issuer
2. A simple credential, no issuer
3. A nested credential with any context, has issuer
4. Same but has issuer as id attribute
5. Simple with issuer
6. A MTR with a revocation list context and credential status
7. MTR with ISO string issuanceDate 
8. MTR with XML Datetime issuanceDate 
9. MTR with a null issuanceDate 
10. MTR where issues date term does not exist 
11. MTR with unix timestamp for issuanceDate 
12. MTR with -1 for issuanceDate 
13. MTR with empty string for issuanceDate

# Removed Cases

Removed cases are cases where data was created, but
throws an error when generating a fixture and is thus
untestable. While not actively included in the tests
these cases show conditions that might still need to
be tested under different conditions, and are retained.  

In the case of the first three. These were intended for
`issuanceDate.test.ts`, however `new Date` is called,
and thus only valid `Date` constructor arguments can
be included in that test.

1. MTR with an Object issue date // untestable
2. MTR with "yesterday" for issue date // untestable
3. MTR with "foobar" for issue date // untestable