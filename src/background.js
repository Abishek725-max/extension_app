import * as tf from "@tensorflow/tfjs";
let socket = null;
let reconnectTimeout = null;
// const url = "wss://orchestrator.openledger.dev/ws/v1/orch";
const url = process.env.NEXT_PUBLIC_WS_URL;

import { ethers } from "ethers";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import SHA256 from "crypto-js/sha256";
import TurndownService from "turndown";
import getScrape from "./getScrape.js";
import { headers } from "next/headers.js";
import { hashAuthorization } from "viem/experimental";

chrome?.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
  // connectWebSocket(url);
});

// chrome.alarms.create("keepAlive", {
//   periodInMinutes: 0.25, // Periodic check to prevent deactivation
// });

// function keepAlive() {
//   chrome.storage.local.set({ keepAlive: Date.now() });
// }

// // Call this periodically
// setInterval(keepAlive, 20000);

console.log("process.env.NEXT_PUBLIC_WS_URL", process.env.NEXT_PUBLIC_WS_URL);

// connectWebSocket(url);

function connectWebSocket(url, authToken) {
  // Function to handle WebSocket connection

  function createWebSocket() {
    console.log("Connecting to WebSocket:", url, authToken);

    const wsUrl = `${url}?authToken=${authToken}`;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established.");
      clearTimeout(reconnectTimeout); // Clear any pending reconnect attempts
      sendHeartbeat(); // Start sending heartbeats
    };

    socket.onmessage = (event) => {
      console.log("Message received from WebSocket:", event);
      loadJobData(event);
    };

    socket.onerror = (error) => {
      console.error("WebSocket encountered an error:", error);
    };

    socket.onclose = (event) => {
      console.warn("WebSocket connection closed:", event);
      reconnectWebSocket(); // Attempt reconnection
    };
  }

  function reconnectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already open, no need to reconnect.");
      return;
    }

    console.log("Reconnecting to WebSocket...");
    reconnectTimeout = setTimeout(() => {
      createWebSocket();
    }, 5000); // Retry after 5 seconds
  }

  async function sendHeartbeat() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Cannot send heartbeat, WebSocket is not open.");
      return;
    }

    try {
      const extensionId = chrome?.runtime.id;
      const privateKey = await getLocalStorage("privateKey");
      const wallet = new ethers.Wallet(privateKey);

      const memoryInfo = await getAvailableMemoryPercentage();
      const storageInfo = await getAvailableStoragePercentage();
      const models = await tf.io.listModels();

      const heartbeatMessage = {
        message: {
          Worker: {
            Identity: extensionId,
            ownerAddress: wallet?.address,
            type: "LWEXT",
            Host: `chrome-extension://${extensionId}`,
          },
          Capacity: {
            AvailableMemory: memoryInfo?.availableMemoryPercentage,
            AvailableStorage: storageInfo,
            AvailableGPU: "",
            AvailableModels: Object.keys(models),
          },
        },
        msgType: "HEARTBEAT",
        workerType: "LWEXT",
        workerID: extensionId,
      };

      socket.send(JSON.stringify(heartbeatMessage));
      console.log("Heartbeat sent:", heartbeatMessage);
    } catch (error) {
      console.error("Error sending heartbeat:", error);
    }
  }

  // Start the WebSocket connection
  createWebSocket();

  // Periodically send heartbeat messages
  setInterval(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      sendHeartbeat();
    } else {
      console.warn("Skipping heartbeat, WebSocket not open.");
    }
  }, 30000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("receiveMesaage", message);
  if (message.type === "send_websocket_message" && socket) {
    socket.send(message.data);

    socket.onmessage = async (event) => {
      console.log("ReceivedJoBDataNew", event);
      sendResponse(event?.data);
      loadJobData(event);
    };
    return true;
  }
  if (message.type === "connect_socket") {
    console.log("receivedWebSocket", message);
    connectWebSocket(url, message?.data?.authToken);
    socket.onopen = () => {
      sendResponse({ type: "Connected" });
    };
    return true;
  }
  // return true;
});

const loadJobData = async (event) => {
  const message = JSON.parse(event.data);
  console.log("message", message);
  if (message?.MsgType == "JOB") {
    socket?.send({
      workerID: chrome?.runtime?.id,
      msgType: "JOB_ASSIGNED",
      workerType: "LWEXT",
      message: {
        Status: true,
        Ref: message?.UUID,
      },
    });
    const privateKey = await getLocalStorage("privateKey");
    if (privateKey) {
      await getMarkdown(message, privateKey);
    }
  }
};

const parseValue = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

function getLocalStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local
      .get([key])
      .then((data) => {
        resolve(parseValue(data[key]));
        console.log("Data retrieved successfully from chrome storage");
      })
      .catch(reject);
  });
}

function setLocalStorage(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local
      .set({ [key]: JSON.stringify(value) })
      .then(() => {
        resolve();
        console.log("Data saved successfully to chrome storage", value);
      })
      .catch(reject);
  });
}

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    console.log("External message received:", message, "from", sender);
  }
);

// Connectivity check
chrome.runtime.onConnectExternal.addListener((port) => {
  console.log("External connection established:", port);
});

async function getMarkdown(JobData, privateKey) {
  console.log("jobData", JobData);
  // const JobData = value?.data;

  // Ensure the dataset is valid before parsing
  let parsedData;

  if (JobData?.Dataset) {
    try {
      // Try to parse the Dataset if it exists
      parsedData = JSON.parse(JobData?.Dataset);

      // Optionally log the parsed data for debugging
      console.log("Parsed Dataset:", parsedData);
    } catch (err) {
      console.error("Error parsing Dataset:", err);
      console.error("Invalid Dataset data:", JobData.Dataset);
      return; // Exit the function if Dataset is invalid
    }
  } else {
    console.log("dataset is missing or invalid.");
  }

  const bucketName = parsedData?.name;
  if (!bucketName) {
    console.error("No bucket name found in parsed dataset.");
    return;
  }

  // Ensure the payload is valid before parsing
  let payload;
  try {
    payload = JobData?.Payload ? JSON.parse(JobData?.Payload) : null;
  } catch (err) {
    console.error("Error parsing payload:", err);
    return; // Exit the function if payload is invalid
  }

  const urls = payload?.urls || [];
  if (urls.length === 0) {
    console.error("No URLs found in payload.");
    return;
  }

  const wallet = new ethers.Wallet(privateKey); // Using dynamic private key
  console.log("🚀 ~ fetchData ~ wallet:", wallet);

  // Loop through URLs and fetch data
  for (let i = 0; i < urls.length; i++) {
    console.log("response2", urls[i]);
    try {
      // const response = await fetch(`next/server/api/hello?url=${urls[i]}`);
      const response = await getScrape(urls[i]);

      console.log("response", response);

      if (response?.success) {
        const data = response;
        console.log("🚀 ~ fetchData ~ data:", data?.data?.markdown);

        const markdownData = JSON.stringify(data?.data?.markdown, null, 2);
        console.log("🚀 ~ fetchData ~ markdownData:", markdownData);

        const sequenceNumber = (i + 1).toString().padStart(4, "0");
        // const objectKey = `${wallet?.address}/${JobData?.Type}/${JobData?.UUID}/${sequenceNumber}.md`;
        const objectKey = `${wallet.address}/${JobData.Type}/${JobData.UUID}_${sequenceNumber}.md`;

        // Assuming uploadToMinIO is defined elsewhere
        await uploadMinio(
          bucketName,
          objectKey,
          markdownData,
          JobData,
          privateKey
        );
      } else {
        console.error("Failed to fetch data for URL:", urls[i]);
      }
    } catch (err) {
      console.error("Error fetching or uploading data:", err);
    }
  }
}

async function uploadMinio(
  bucketName,
  objectKey,
  data,
  jobData,
  privateKey,
  contentType = "text/markdown",
  maxRetries = 3
) {
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
      timeout: 10000,
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
      break;
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
}

const storeJobData = async (jobData, jobReceviedresponse = "data") => {
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

async function ethersConnect(
  jobData,
  checksum,
  checksumCreateTime,
  privateKey
) {
  console.log("uploadMInio Pgae", privateKey);

  // Ensure ethers is imported and available
  if (!ethers) {
    console.error(
      "ethers is undefined. Make sure ethers is imported correctly."
    );
    return;
  }

  const wallet = new ethers.Wallet(privateKey);
  console.log("🚀 ~ ethersConnect ~ wallet:", wallet);

  let dataset =
    typeof jobData.Dataset === "string"
      ? JSON.parse(jobData.Dataset)
      : jobData.Dataset;

  let worker = wallet?.address;
  let dataNetAddress = dataset.contractAddress;
  let dataNetReference = dataset.name;
  let dataNetRequestAt = 1344537000;
  let JobReference = jobData?.UUID;
  let storageReference = `${wallet?.address}/${jobData.Type}`;
  let storageChecksum = checksum;
  let storagedAt = checksumCreateTime;

  let signedDataArray = [];

  // Check each parameter type to ensure everything is correct
  console.log("🚀 ~ ethersConnect ~ params before hashing:", {
    worker,
    dataNetAddress,
    dataNetReference,
    dataNetRequestAt,
    JobReference,
    storageReference,
    storageChecksum,
    storagedAt,
  });

  let params = [
    worker,
    dataNetAddress,
    dataNetReference,
    dataNetRequestAt,
    JobReference,
    storageReference,
    storageChecksum,
    storagedAt,
  ];

  // Validate the types and values of params
  params.forEach((param, index) => {
    console.log(`Type of param[${index}]:`, typeof param, "Value:", param);
  });

  try {
    // Check if `solidityKeccak256` is available before calling
    if (!ethers.solidityPackedKeccak256) {
      console.error("solidityKeccak256 method is unavailable.");
      return;
    }

    // Call `solidityKeccak256` with the correct types
    let hash = ethers.solidityPackedKeccak256(
      [
        "string", // worker
        "string", // dataNetAddress
        "string", // dataNetReference
        "uint256", // dataNetRequestAt (string format)
        "string", // JobReference
        "string", // storageReference
        "string", // storageChecksum
        "uint256", // storagedAt
      ],
      params
    );

    console.log("🚀 ~ ethersConnect ~ hash:", hash);

    // Handle null or invalid hash
    if (!hash) {
      console.error("Error: Hash calculation resulted in null.");
      return;
    }

    // Sign the message with the wallet's private key
    let signature = await wallet.signMessage(ethers.getBytes(hash));
    console.log("🚀 ~ ethersConnect ~ signature:", signature);

    const jobWithSign = {
      ref: JobReference,
      status: true,
      message: "",
      completed_at: storagedAt,
      output: "",
      job_details: {
        worker,
        dataNetAddress,
        dataNetReference,
        dataNetRequestAt,
        JobReference,
        storageReference,
        storageChecksum,
        storagedAt,
      },
      signature,
    };

    console.log(jobWithSign);

    // registerWebSocket(
    //   JSON?.stringify({
    //     workerID: "Extension_ID",
    //     msgType: "JOB_COMPLETION",
    //     message: jobWithSign,
    //   })
    // );

    signedDataArray.push({
      job_details: JSON.stringify(jobWithSign.job_details),
      signature: jobWithSign.signature,
    });

    console.log("signedDataArray", signedDataArray.length);

    if (signedDataArray.length > 0) {
      const message = {
        completed_at: new Date().toISOString(),
        message: "",
        output: "",
        ref: jobData?.UUID,
        status: true,
        tx_requests: signedDataArray,
      };

      if (socket) {
        socket.send(
          JSON.stringify({
            workerID: `chrome-extension://${chrome.runtime.id}`,
            msgType: "JOB_COMPLETION",
            workerType: "LWEXT",
            message,
          })
        );
      }
    } else {
      console.warn("No valid data to send.");
    }
  } catch (error) {
    console.error("Error in ethersConnect:", error);
    return null;
  }
}

async function getAvailableMemoryPercentage() {
  // Check if the Chrome memory API is available
  if (chrome.system && chrome.system.memory) {
    try {
      // Get memory info
      const memoryInfo = await new Promise((resolve, reject) => {
        chrome.system.memory.getInfo((info) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(info);
          }
        });
      });

      console.log("memoryInfo", memoryInfo);

      // Calculate available memory percentage
      const totalMemory = memoryInfo.capacity;
      const availableMemory = memoryInfo.availableCapacity;

      const availableMemoryPercentage = (
        (availableMemory / totalMemory) *
        100
      ).toFixed(2);

      return {
        totalMemory,
        availableMemory,
        availableMemoryPercentage: parseFloat(availableMemoryPercentage),
      };
    } catch (error) {
      console.error("Error getting memory information:", error);
      return null;
    }
  } else {
    console.warn("Chrome system memory API not available");
    return null;
  }
}

async function getAvailableStoragePercentage() {
  try {
    const { quota, usage } = await navigator.storage.estimate();

    const availableStorage = quota - usage;
    const availableStoragePercentage = (availableStorage / quota) * 100;

    return availableStoragePercentage.toFixed(2); // Percentage with 2 decimal points
  } catch (error) {
    console.error("Error calculating storage usage:", error);
    return null;
  }
}
