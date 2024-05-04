"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.getAllImagePreSignedUrls = exports.uploadImage = void 0;
const awsConfig_1 = require("../config/awsConfig");
const fs_1 = __importDefault(require("fs"));
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const fileName = Date.now() + "_" + file.originalname;
        const fileContent = fs_1.default.readFileSync(file.path);
        const putObjectRequest = {
            Bucket: process.env.BUCKET_NAME ? process.env.BUCKET_NAME : "",
            Key: `images/${fileName}`,
            Body: fileContent,
            ContentType: file.mimetype,
        };
        const upload = yield awsConfig_1.s3.upload(putObjectRequest).promise();
        return res.json({
            message: "Image uploaded successfully",
            data: upload.Location,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.uploadImage = uploadImage;
const getAllImagePreSignedUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const listObjectRequest = {
            Bucket: process.env.BUCKET_NAME ? process.env.BUCKET_NAME : "",
            Prefix: "images/",
        };
        const data = yield awsConfig_1.s3.listObjectsV2(listObjectRequest).promise();
        const urls = (_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map((item) => {
            var _a;
            return ({
                url: awsConfig_1.s3.getSignedUrl("getObject", {
                    Bucket: process.env.BUCKET_NAME,
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
});
exports.getAllImagePreSignedUrls = getAllImagePreSignedUrls;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName } = req.params;
        const deleteObjectRequest = {
            Bucket: process.env.BUCKET_NAME ? process.env.BUCKET_NAME : "",
            Key: `images/${fileName}`,
        };
        yield awsConfig_1.s3.deleteObject(deleteObjectRequest).promise();
        return res.json({ message: "Image deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteImage = deleteImage;
