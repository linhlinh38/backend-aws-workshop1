"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonSecret = exports.s3 = void 0;
const AWS = __importStar(require("aws-sdk"));
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const secret_name = "my-web-deploy-secret";
const client = new client_secrets_manager_1.SecretsManagerClient({
    region: "us-east-1",
});
let s3;
let jsonSecret;
(async () => {
    try {
        const secret = await client.send(new client_secrets_manager_1.GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT",
        }));
        exports.jsonSecret = jsonSecret = JSON.parse(secret.SecretString);
        exports.s3 = s3 = new AWS.S3({
            accessKeyId: jsonSecret.AWS_ACCESS_KEY_ID,
            secretAccessKey: jsonSecret.AWS_SECRET_ACCESS_KEY,
            region: "us-east-1",
        });
    }
    catch (error) {
        throw error;
    }
})();
