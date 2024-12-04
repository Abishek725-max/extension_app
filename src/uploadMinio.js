import { PutObjectCommand, S3Client, s3Client } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";

import SHA256 from "crypto-js/sha256";
import { ethersConnect } from "./ethersConnect";
import { getLocalStorage, setLocalStorage } from "./utils/common";

export const uploadMinio = async (
  bucketName,
  objectKey,
  data,
  jobData,
  privateKey,
  contentType = "text/markdown",
  maxRetries = 3
) => {
  console.log("uploadMInio Pgae", privateKey);

  const s3Client = new S3Client({
    endpoint: "https://minioapi.openledger.dev",
    region: "us-east-1",
    credentials: {
      accessKeyId: "FWF2K7x5zHGDHRRXvRkX",
      secretAccessKey: "SD39rzABNmiLlHH6CoLBXv3H836JQyFPKhnz0vqB",
    },
    forcePathStyle: true,
    tls: true,
    maxAttempts: 3,
    requestHandlerOptions: {
      timeout: 30000,
    },
  });
  const bodyBuffer = Buffer.from(data, "utf-8");
  const checksum = SHA256(bodyBuffer).toString();
  const checksumCreateTime = new Date().getTime();
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: bodyBuffer,
    ContentType: contentType,
  };

  let retries = 0;
  console.log("🚀 ~ params:", params);
  while (retries < maxRetries) {
    try {
      const commend = new PutObjectCommand(params);
      const response = await s3Client.send(commend);
      console.log("Successfully uploaded to MinIO:", response);

      console.log("🚀 ~ checksum:", checksum);
      storeJobData(jobData);
      console.log("🚀 ~ jobData:", jobData);
      ethersConnect(jobData, checksum, checksumCreateTime, privateKey);
    } catch (error) {
      retries++;
      console.error("Error uploading to MinIO:", error?.message, error);
      console.log(retries, maxRetries, "maxRetries test");
      if (retries === maxRetries) {
      } else {
        console.log(`Retrying upload... Attempt ${retries + 1}`);
      }
    }
  }
  return { checksum, checksumCreateTime };
};

export const storeJobData = async (jobData, jobReceviedresponse = "data") => {
  try {
    const existingData = await getLocalStorage("allJobData");
    console.log("🚀 ~ storeJobData ~ existingData:", existingData);
    console.log("🚀 ~ storeJobData ~ existingData:", jobData);

    const jobDataArray = existingData ? JSON.parse(existingData) : [];

    // Check  same UUID already exists
    const jobExists = jobDataArray?.some((job) => job?.UUID === jobData?.UUID);

    if (!jobExists) {
      const jobEntry = jobReceviedresponse
        ? { ...jobData, jobReceviedresponse }
        : jobData;
      jobDataArray.push(jobEntry);

      setLocalStorage("allJobData", JSON.stringify(jobDataArray));
      console.log(`Stored job data with UUID ${jobData?.UUID}`);
    } else {
      console.log(
        `Job with UUID ${jobData.UUID} already exists. Skipping storage.`
      );
    }
  } catch (error) {
    console.error("Error saving job data:", error);
  }
};
