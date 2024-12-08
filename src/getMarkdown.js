import { ethers } from "ethers";

import { uploadMinio } from "./uploadMinio.js";

const { convert } = require("html-to-markdown");
const showdown = require("showdown");
const cheerio = require("cheerio");

// import fetchHtmlToMarkdown from "fetch-html-to-markdown";
// import { fetchHtmlToJson } from "markdown-lite-worker";
import TurndownService from "turndown";
import getScrape from "./getScrape.js";

function getLocalStorage(key) {
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

const parseValue = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const getMarkdown = async (value, privateKey) => {
  console.log("jobData", value?.data);
  const JobData = value?.data;

  // Ensure the Dataset is valid before parsing
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
    console.log("Dataset is missing or invalid.");
  }

  const bucketName = parsedData?.name;
  if (!bucketName) {
    console.error("No bucket name found in parsed dataset.");
    return;
  }

  // Ensure the Payload is valid before parsing
  let payload;
  try {
    payload = JobData?.Payload ? JSON.parse(JobData?.Payload) : null;
  } catch (err) {
    console.error("Error parsing Payload:", err);
    return; // Exit the function if Payload is invalid
  }

  const urls = payload?.urls || [];
  if (urls.length === 0) {
    console.error("No URLs found in Payload.");
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
};

const fetchHtmlToJson = async (url) => {
  try {
    const response = await fetch(url);
    console.log("🚀 ~ handler ~ response:", response);
    const htmlText = await response.text();
    // console.log("🚀 ~ handler ~ htmlText:", htmlText);

    // const markdown = convert(htmlText);

    // const jsonResult = {
    //   success: true,
    //   data: {
    //     markdown: markdown,
    //     sourceURL: url,
    //     statusCode: response.status,
    //   },
    // };
    const $ = cheerio.load(htmlText); // Load the HTML into cheerio

    const base = new URL(url); // Base URL for resolving relative URLs

    // Normalize image URLs
    $("img").each((index, img) => {
      const src = $(img).attr("src");
      if (src && !src.startsWith("http")) {
        $(img).attr("src", new URL(src, base).href);
      }
    });

    // Remove inline styles
    $("[style]").removeAttr("style");

    // Remove unwanted tags
    $("script, style, iframe, noscript, meta, head, footer").remove();

    // Get cleaned HTML
    const cleanedHtml = $("body").html();
    const converter = new showdown.Converter();

    // Convert to Markdown (using TurndownService or similar)
    console.log("cleanedHtml", converter.makeMarkdown(cleanedHtml));

    const turndownService = new TurndownService();
    const finalText = turndownService.turndown(cleanedHtml);
    console.log(finalText, "finalText");

    return jsonResult;
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error);
  }
};

export default getMarkdown;
