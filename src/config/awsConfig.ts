import * as AWS from "aws-sdk";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "my-web-deploy-secret";

const client = new SecretsManagerClient({
  region: "us-east-1",
});

let s3: AWS.S3;
let jsonSecret: {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  BUCKET_NAME: string;
};
(async () => {
  try {
    const secret = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );

    jsonSecret = JSON.parse(secret.SecretString as string);

    s3 = new AWS.S3({
      accessKeyId: jsonSecret.AWS_ACCESS_KEY_ID,
      secretAccessKey: jsonSecret.AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
    });
  } catch (error) {
    throw error;
  }
})();

export { s3, jsonSecret };
