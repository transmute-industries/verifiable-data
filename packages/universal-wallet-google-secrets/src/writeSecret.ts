const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();

export const writeSecret = async (
  projectId: string,
  secretId: string,
  value: string
) => {
  const [secret] = await client.createSecret({
    parent: `projects/${projectId}`,
    secret: {
      name: secretId,
      replication: {
        automatic: {}
      }
    },
    secretId
  });
  const [version] = await client.addSecretVersion({
    parent: secret.name,
    payload: {
      data: Buffer.from(value, "utf8")
    }
  });
  return {
    "@context": ["https://w3id.org/wallet/v1"],
    id: `urn:google:${version.name}`,
    type: "GoogleCloudSecret",
    tags: ["google"],
    value
  };
};
