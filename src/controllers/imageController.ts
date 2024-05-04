import { Request, Response } from "express";
import { s3, jsonSecret } from "../config/awsConfig";
import fs from "fs";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = Date.now() + "_" + file.originalname;
    const fileContent = fs.readFileSync(file!.path);
    const putObjectRequest: AWS.S3.PutObjectRequest = {
      Bucket: jsonSecret.BUCKET_NAME ? jsonSecret.BUCKET_NAME : "",
      Key: `images/${fileName}`,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    const upload = await s3.upload(putObjectRequest).promise();

    return res.json({
      message: "Image uploaded successfully",
      data: upload.Location,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllImagePreSignedUrls = async (req: Request, res: Response) => {
  try {
    const listObjectRequest: AWS.S3.ListObjectsV2Request = {
      Bucket: jsonSecret.BUCKET_NAME ? jsonSecret.BUCKET_NAME : "",
      Prefix: "images/",
    };

    const data = await s3.listObjectsV2(listObjectRequest).promise();
    const urls = data.Contents?.map((item) => ({
      url: s3.getSignedUrl("getObject", {
        Bucket: jsonSecret.BUCKET_NAME,
        Key: item.Key,
        ResponseContentDisposition: "inline",
      }),
      fileName: item.Key?.split("/")[1],
    }));

    return res.json(urls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;

    const deleteObjectRequest: AWS.S3.DeleteObjectRequest = {
      Bucket: jsonSecret.BUCKET_NAME ? jsonSecret.BUCKET_NAME : "",
      Key: `images/${fileName}`,
    };

    await s3.deleteObject(deleteObjectRequest).promise();

    return res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
