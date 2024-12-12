// contentScript.js

console.log("content Script loaded");

// Get GPU information using WebGL
function sendGPUInfoToBackground() {
  try {
    chrome.runtime.sendMessage({ type: "GET_GPU_INFO" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending GPU info:", chrome.runtime.lastError);
        return;
      }
      console.log("GPU Info Response:", response);
    });
  } catch (error) {
    console.error("Exception in sending GPU info:", error);
  }
}

// Send the GPU info back to the background script

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded, attempting to send GPU info");
  sendGPUInfoToBackground();
});

// Fallback method
setTimeout(sendGPUInfoToBackground, 1000);
