# Cases
1. A MTR testing traceability, has related links, no issuer
2. A simple credential, no issuer
3. A nested credential with any context, has issuer
4. Same but has issuer as id attribute
5. Simple with issuer
6. A MTR with a revocation list context and credential status
7. MTR with ISO string issue date // 1
8. MTR with XML Datetime issue date // 2
9. MTR with an Object issue date // untestable
10. MTR with a null issue date // 3
11. MTR where issues date term does not exist // 4
12. MTR with unix timestamp for issue date // 5
13. MTR with "yesterday" for issue date // untestable
14. MTR with -1 for issue date // 6
15. MTR with empty string for issue date // 7
16. MTR with "foobar" for issue date // untestable