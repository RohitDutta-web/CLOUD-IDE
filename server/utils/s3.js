import { S3Client, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { lookup as mimeLookup } from "mime-types";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET = process.env.AWS_BUCKET_NAME;

export const uploadFile = async (key, content) => {
  try {
    // Check if file exists
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    console.log(`File "${key}" already exists. It will be replaced.`);
  } catch (err) {
    if (err.name === 'NotFound') {
      console.log(`File "${key}" does not exist. Creating a new one.`);
    } else {
      console.error("Error checking file:", err);
      throw err;
    }
  }
const contentType = mimeLookup(key) || "application/octet-stream";
  // Upload or replace the file
const uploadParams = {
  Bucket: BUCKET,
  Key: key,
  Body: content,
  ContentType: contentType
};

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const deleteCodeFile = async (key) => {
  const deleteParams = {
    Bucket: BUCKET,
    Key: key
  };

  await s3.send(new DeleteObjectCommand(deleteParams));
};
