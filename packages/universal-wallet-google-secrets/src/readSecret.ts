const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();

export const readSecret = async (
  projectId: string,
  secretId: string,
  version: string = "1"
) => {
  const name = `projects/${projectId}/secrets/${secretId}/versions/${version}`;
  let [secret] = await client.accessSecretVersion({
    name
  });
  return {
    "@context": ["https://w3id.org/wallet/v1"],
    id: "urn:google:" + name,
    type: "GoogleCloudSecret",
    tags: ["google"],
    value: secret.payload.data.toString("utf8")
  };
};
