const {
  issueConditions,
  CREATED_ON,
  createSuite,
  createCredential,
  signCredential,
  writeResult,
} = require("./date-utils");
const folderName = "issuanceDate";

issueConditions.forEach(async (issuanceDate, index) => {
  const credential = createCredential(issuanceDate);
  const { suite, suiteError } = await createSuite(CREATED_ON);
  if (suiteError) {
    return writeResult(folderName, index, suiteError);
  }

  const { signedCredential, signedError } = await signCredential(
    suite,
    credential
  );
  if (signedError) {
    return writeResult(folderName, index, signedError);
  }
  return writeResult(folderName, index, signedCredential);
});
