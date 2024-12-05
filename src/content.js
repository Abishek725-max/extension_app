// const value = "privatekeyVAlueesetup";

const { getLocalStorage, setLocalStorage } = require("./utils/common");

console.log("Content script loaded");

// chrome.runtime.sendMessage(
//   { type: "send_privatekey", value: value },
//   function (response) {
//     console.log("Response from background:", response);
//   }
// );

const extensionId = chrome.runtime.id;
console.log("Extension ID:", extensionId);
setLocalStorage("Extension ID", extensionId);

const currentHost = window.location.hostname;
console.log("Current Host:", currentHost);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received data in backgroundScript", message);
  if (message?.type === "send_jobdata") {
    // Process the job data
    sendResponse({ status: "Received job data" });
  }
});

window.addEventListener("message", async (event) => {
  console.log("Received data in content script: Extension", event);

  if (event?.data?.type === "send_privatekey") {
    let { value } = event?.data;
    chrome.runtime.sendMessage(
      { type: "send_privatekey", value: value },
      function (response) {
        console.log("Response from background:", response);
      }
    );
  }
  if (event?.data?.type === "getExtensionID") {
    window.postMessage(
      { type: "sendExtensionId", value: chrome.runtime.id },
      "*"
    );
  }

  if (event?.data?.type === "send_jobdata") {
    let jobData = await getLocalStorage("allJobData");
    console.log("valueinStorage", jobData);

    window.postMessage({ type: "getJobData", value: jobData }, "*"),
      console.log("Received data in jobData", event);
  }
});

// setTimeout(
//   () => window.postMessage({ type: "SendDataTOExtension" }, "*"),
//   4000
// );
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("merssagagae", message);

//   if (message.action === "sendDataToBackground") {
//     // Forward the data to the background script
//     chrome.runtime.sendMessage({
//       action: "receiveData",
//       data: message.data,
//     });
//   }
// });
