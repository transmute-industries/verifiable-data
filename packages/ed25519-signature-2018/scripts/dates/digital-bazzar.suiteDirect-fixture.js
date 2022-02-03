const {
  createdConditions,
  ISSUED_ON,
  createCredential,
  createSuite,
  signCredential,
  writeResult,
} = require("./date-utils");
const folderName = "suiteDirect";

createdConditions.forEach(async (createdDate, index) => {
  const credential = createCredential(ISSUED_ON);
  const { suite, suiteError } = await createSuite(undefined);
  if (suiteError) {
    return writeResult(folderName, index, suiteError);
  }
  suite.date = createdDate;
  const { signedCredential, signedError } = await signCredential(
    suite,
    credential
  );
  if (signedError) {
    return writeResult(folderName, index, signedError);
  }
  return writeResult(folderName, index, signedCredential);
});
