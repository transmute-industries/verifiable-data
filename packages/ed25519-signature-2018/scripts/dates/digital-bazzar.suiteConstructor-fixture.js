const moment = require("moment");

const {
  createdConditions,
  ISSUED_ON,
  createCredential,
  createSuite,
  signCredential,
  writeResult,
} = require("./date-utils");
const folderName = "suiteConstructor";
const issuanceDate = moment(ISSUED_ON).toJSON();

createdConditions.forEach(async (createdDate, index) => {
  const credential = createCredential(issuanceDate);
  const { suite, suiteError } = await createSuite(createdDate);
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
