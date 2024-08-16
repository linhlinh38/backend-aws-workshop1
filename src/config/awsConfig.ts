import { S3, S3Client } from "@aws-sdk/client-s3";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "upload-image-to-s3-secret";

const client = new SecretsManagerClient({
  region: "us-east-1",
});

let s3: S3Client;
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

    s3 = new S3Client({
      credentials: {
        accessKeyId: jsonSecret.AWS_ACCESS_KEY_ID,
        secretAccessKey: jsonSecret.AWS_SECRET_ACCESS_KEY,
      },

      region: "us-east-1",
    });
  } catch (error) {
    throw error;
  }
})();
export { s3, jsonSecret };
