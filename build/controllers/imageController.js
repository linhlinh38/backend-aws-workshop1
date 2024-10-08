"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.getAllImagePreSignedUrls = exports.uploadImage = void 0;
const awsConfig_1 = require("../config/awsConfig");
const fs_1 = __importDefault(require("fs"));
const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const fileName = Date.now() + "_" + file.originalname;
        const fileContent = fs_1.default.readFileSync(file.path);
        const putObjectRequest = {
            Bucket: awsConfig_1.jsonSecret.BUCKET_NAME ? awsConfig_1.jsonSecret.BUCKET_NAME : "",
            Key: `images/${fileName}`,
            Body: fileContent,
            ContentType: file.mimetype,
        };
        const upload = await awsConfig_1.s3.upload(putObjectRequest).promise();
        return res.json({
            message: "Image uploaded successfully",
            data: upload.Location,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.uploadImage = uploadImage;
const getAllImagePreSignedUrls = async (req, res) => {
    var _a;
    try {
        const listObjectRequest = {
            Bucket: awsConfig_1.jsonSecret.BUCKET_NAME ? awsConfig_1.jsonSecret.BUCKET_NAME : "",
            Prefix: "images/",
        };
        const data = await awsConfig_1.s3.listObjectsV2(listObjectRequest).promise();
        const urls = (_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map((item) => {
            var _a;
            return ({
                url: awsConfig_1.s3.getSignedUrl("getObject", {
                    Bucket: awsConfig_1.jsonSecret.BUCKET_NAME,
                    Key: item.Key,
                    ResponseContentDisposition: "inline",
                }),
                fileName: (_a = item.Key) === null || _a === void 0 ? void 0 : _a.split("/")[1],
            });
        });
        return res.json(urls);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllImagePreSignedUrls = getAllImagePreSignedUrls;
const deleteImage = async (req, res) => {
    try {
        const { fileName } = req.params;
        const deleteObjectRequest = {
            Bucket: awsConfig_1.jsonSecret.BUCKET_NAME ? awsConfig_1.jsonSecret.BUCKET_NAME : "",
            Key: `images/${fileName}`,
        };
        await awsConfig_1.s3.deleteObject(deleteObjectRequest).promise();
        return res.json({ message: "Image deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteImage = deleteImage;
