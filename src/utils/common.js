import dayjs from "dayjs";

import Router from "next/router";

export const formatWalletAddress = (walletAddress) => {
  if (walletAddress) {
    const firstPart = walletAddress.slice(0, 4); // First 4 characters
    const lastPart = walletAddress.slice(-4); // Last 4 characters

    return `${firstPart}........${lastPart}`;
  }
};

export const calculateTimeAgo = (lastUpdate) => {
  const diffInMs = Date.now() - new Date(lastUpdate).getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hrs ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
};

export const validatePrivateKey = (key) => {
  const regex = /^[a-fA-F0-9]{64}$/;
  if (key.startsWith("0x")) {
    key = key.replace(/0x/, "");
  }
  return regex.test(key);
};

export const sortJobsByDate = (jobs = []) => {
  return jobs.sort((a, b) => {
    const dateA = new Date(
      typeof a.Dataset === "string"
        ? JSON.parse(a.Dataset).createdAt
        : a.Dataset?.createdAt
    );
    const dateB = new Date(
      typeof b.Dataset === "string"
        ? JSON.parse(b.Dataset).createdAt
        : b.Dataset?.createdAt
    );
    return dateB - dateA;
  });
};

// Wallet address Truncate
export const truncateAddress = (address, maxLength) => {
  if (!address) return "";
  if (address.length <= maxLength) {
    return address;
  }
  const startLength = Math.ceil((maxLength - 10) / 2);
  const endLength = Math.floor((maxLength - 9) / 2);
  return (
    address.substr(0, startLength) +
    " ... " +
    address.substr(address.length - endLength)
  );
};

// Function to calculate the percentage
export const calculatePercentage = (value, total, chartHeight) =>
  (value / total) * (chartHeight - 1);

// Step 1: Find the maximum total value
export const maxTotal = (rewardsHistoryData) => {
  return Math.max(...rewardsHistoryData.map((point) => point.points));
};

// Step 2: Calculate rem values based on the ratio to the maximum total
export const epochPointsWithHeight = (rewardsHistoryData, maxTotalPoint) => {
  const newData = rewardsHistoryData.map((point) => {
    const chartHeight = (point.points / maxTotalPoint) * 10;

    return {
      ...point,
      chartHeight, // Add the calculated rem value to the object
    };
  });
  return newData;
};
const sortData = (data, order = "asc") => {
  return data.sort((a, b) => {
    const diff = dayjs(a.date).diff(dayjs(b.date));
    return order === "asc" ? diff : -diff;
  });
};

export const checkRealtimeEntry = (rewardsHistoryData) => {
  if (rewardsHistoryData.length === 0) return null; // Return null if data is empty
  const sortedDataVal = sortData(rewardsHistoryData, "desc");
  // rewardsHistoryData.sort((a, b) =>
  //   dayjs(a.date).diff(dayjs(b.date)),
  // );
  return sortedDataVal[0].date;
  // return rewardsHistoryData.reduce((latest, current) => {
  //   return new Date(current.created) > new Date(latest.created)
  //     ? current
  //     : latest;
  // });
};
// Step 1: Find the most recent entry by comparing dates
export const latestEntry = (rewardsHistoryData) => {
  if (rewardsHistoryData.length === 0) return null; // Return null if data is empty
  return rewardsHistoryData.reduce((latest, current) => {
    return new Date(current.created) > new Date(latest.created)
      ? current
      : latest;
  });
};

export const formatNumber = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

const parseValue = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export function getLocalStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local
      .get([key])
      .then((data) => {
        resolve(parseValue(data[key]));
        console.log("Data get successfully! in chrome storage");
      })
      .catch(reject);
  });
}

export function setLocalStorage(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local
      .set({ [key]: JSON.stringify(value) })
      .then(() => {
        resolve();
        console.log("Data saved successfully! in chrome storage", value);
      })
      .catch(reject);
  });
}
export function clearLocalStorage() {
  chrome.storage.local.clear(function () {
    if (chrome.runtime.lastError) {
      console.error("Error clearing storage:", chrome.runtime.lastError);
    } else {
      console.log("Storage cleared successfully!");
    }
  });
}

export const handleCopytoClipboard = (keydata, valuedata, setChangeCopy) => {
  navigator.clipboard.writeText(valuedata).then(() => {
    setChangeCopy(keydata);
    setTimeout(() => {
      setChangeCopy(null);
    }, 3000);
  });
};

export async function getAvailableMemoryPercentage() {
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

export async function getAvailableStoragePercentage() {
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

export const navigate = (target, redirect = "") => {
  if (window.location.href && window.location.href.includes(".html"))
    Router.push(`${target}.html${redirect}`);
  else Router.push(`${target}${redirect}`);
};

export const checkLogin = async () => {
  const result = await getLocalStorage("auth_token");
  console.log("Result:", result);
  if (!result) {
    Router.push("/web-login.html");
  }
};
