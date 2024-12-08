import { useState, useEffect } from "react";

import TurndownService from "turndown";
import { JSDOM } from "jsdom";

// Replace the JSDOM logic with native DOM manipulation and fetch
export const fetchHtmlToMarkdown = async (url) => {
  try {
    // Fetch the HTML content of the URL
    const response = await fetch(url);
    const htmlText = await response.text();

    // Parse the HTML content using the browser's DOMParser (works in the browser)
    const dom = new JSDOM(htmlText);
    const doc = dom.window.document;
    // const doc = parser.parseFromString(htmlText, "text/html");

    // Process images: Convert relative URLs to absolute ones
    const base = new URL(url);
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("http")) {
        img.setAttribute("src", new URL(src, base).href);
      }
    });

    // Remove inline styles
    doc.querySelectorAll("[style]").forEach((element) => {
      element.removeAttribute("style");
    });

    // Remove unwanted elements
    doc
      .querySelectorAll("script, style, iframe, noscript, meta, head, footer")
      .forEach((element) => {
        element.remove();
      });

    // Convert the cleaned HTML to Markdown
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(doc.body.innerHTML);

    // Collect metadata
    const metadata = {
      title: doc.querySelector("title")?.innerText || "",
      language: doc.documentElement.lang || "en",
      robots:
        doc.querySelector('meta[name="robots"]')?.getAttribute("content") || "",
      ogTitle:
        doc
          .querySelector('meta[property="og:title"]')
          ?.getAttribute("content") || "",
      ogDescription:
        doc
          .querySelector('meta[property="og:description"]')
          ?.getAttribute("content") || "",
      ogImage:
        doc
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content") || "",
      ogLocaleAlternate:
        Array.from(
          doc.querySelectorAll('meta[property="og:locale:alternate"]')
        ).map((el) => el.getAttribute("content")) || [],
      sourceURL: url,
    };
    const jsonResult = {
      success: true,
      data: {
        markdown,
        metadata,
      },
    };

    return jsonResult;
  } catch (error) {
    console.error("Error fetching or processing HTML:", error);
    throw error; // Re-throw to handle it at the calling level
  }
};
