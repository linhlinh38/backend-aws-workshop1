import { Request, Response } from "express";
import { s3, jsonSecret } from "../config/awsConfig";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = Date.now() + "_" + file.originalname;
    const fileContent = file.buffer;
    const putObjectRequest = new PutObjectCommand({
      Bucket: jsonSecret.BUCKET_NAME ? jsonSecret.BUCKET_NAME : "",
      Key: `images/${fileName}`,
      Body: fileContent,
      ContentType: file.mimetype,
    });

    await s3.send(putObjectRequest);

    const getObjectCommand = new GetObjectCommand({
      Bucket: jsonSecret.BUCKET_NAME,
      Key: `images/${fileName}`,
      ResponseContentDisposition: "inline",
    });
    const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });

    return res.json({
      message: "Image uploaded successfully",
      data: url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllImagePreSignedUrls = async (req: Request, res: Response) => {
  try {
    const listObjectRequest = new ListObjectsV2Command({
      Bucket: jsonSecret.BUCKET_NAME ? jsonSecret.BUCKET_NAME : "",
      Prefix: "images/",
    });

    const data = await s3.send(listObjectRequest);
    const urls = data.Contents?.map(async (item) => {
      const getObjectCommand = new GetObjectCommand({
        Bucket: jsonSecret.BUCKET_NAME,
        Key: item.Key,
        ResponseContentDisposition: "inline",
      });
      const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });
      return {
        url,
        fileName: item.Key?.split("/")[1],
      };
    });

    let resolvedUrls;
    if (urls) {
      resolvedUrls = await Promise.all(urls);
    }

    return res.json(resolvedUrls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;

    const deleteObjectRequest = new DeleteObjectCommand({
      Bucket: jsonSecret.BUCKET_NAME ? jsonSecret.BUCKET_NAME : "",
      Key: `images/${fileName}`,
    });

    await // The `.promise()` call might be on an JS SDK v2 client API.
    // If yes, please remove .promise(). If not, remove this comment.
    s3.send(deleteObjectRequest);

    return res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
