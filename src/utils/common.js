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
        chrome.runtime.sendMessage({
          type: "storageUpdated",
          key: key,
          value: value,
        });
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
