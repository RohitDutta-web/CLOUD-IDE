import AWS from "aws-sdk";

import dotenv from "dotenv";
dotenv.config()

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

const BUCKET = process.env.AWS_BUCKET_NAME


export const uploadFile = async (key, content) => {
  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: content,
    ContentType: "text/plain"
  }

  await s3.upload(params).promise();
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export const deleteCodeFile = async (key) => {
  const params = {
    Bucket: BUCKET,
    Key: key

  }

  await s3.deleteObject(params).promise();
}