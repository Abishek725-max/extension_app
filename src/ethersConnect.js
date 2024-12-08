import { ethers } from "ethers";

export const ethersConnect = async (
  jobData,
  checksum,
  checksumCreateTime,
  privateKey
) => {
  console.log("uploadMInio Pgae", privateKey);

  // Ensure ethers is imported and available
  if (!ethers || !ethers.utils) {
    console.error(
      "ethers.utils is undefined. Make sure ethers is imported correctly."
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
  let JobReference = jobData.ID;
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
    if (!ethers.utils.solidityKeccak256) {
      console.error("solidityKeccak256 method is unavailable.");
      return;
    }

    // Call `solidityKeccak256` with the correct types
    let hash = ethers.utils.solidityKeccak256(
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
    let signature = await wallet.signMessage(ethers.utils.arrayify(hash));
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
      chrome.runtime.sendMessage(
        {
          type: "sent_completion",
          data: JSON.stringify({
            workerID: `chrome-extension://${chrome.runtime.id}`,
            msgType: "JOB_COMPLETION",
            message: message,
          }),
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Message sending failed:", chrome.runtime.lastError);
          } else {
            console.log("Response from content script:", response);
          }
        }
      );
    } else {
      console.warn("No valid data to send.");
    }
    return jobWithSign;
  } catch (error) {
    console.error("Error in ethersConnect:", error);
    return null;
  }
};
