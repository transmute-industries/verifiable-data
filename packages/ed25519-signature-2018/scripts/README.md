# Digital Bazaar scripts
This is run as a script before the tests are run since Digital Bazaar libraries work in Node.js and not in Jest.
## Generate Fixture
script creates a set of proofs that Digital Bazaar makes based on the set of credentials.  See credentials readme for the details of each credential used.
## Term Test
Testing variations on tampered credentials we would expect not to pass.
Also expecting malformed credentials to not pass.

Cases
1. This is the baseline, it passes
1. Drops level 1 term in credential subject and fails
1. Similar but different field and fails
1. Level 2 drop failure
1. Level 3 drop failure
1. Level 1 add failure
1. Another credential baseline
1. Remove issuance date and fails
1. Change issuance date and fails
1. Add new field outside credential subject to pass since not in context