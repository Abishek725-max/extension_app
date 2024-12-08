// File: pages/api/fetchHtmlToJson.js

import TurndownService from "turndown"; // This is the correct import for Node.js

const cheerio = require("cheerio");
const htmlToMarkdownUpdate = require("html-to-markdown");
const showdown = require("showdown");
const { convert } = require("html-to-markdown");

export default async function getScrape(url) {
  if (!url) {
    return;
  }

  try {
    const response = await fetch(url);
    console.log("🚀 ~ handler ~ response:", response);
    const htmlText = await response.text();

    // // Parse the HTML content
    // // const doc = parseDOM(htmlText);
    // // const base = new URL(url);

    // // console.log("doc", doc);

    // // // Convert the cleaned DOM back to HTML
    // // const cleanedHtml = DomUtils.getInnerHTML(doc[1]);

    // // console.log("cleanedHtml", cleanedHtml);
    // let doc = new DOMParser()?.parseFromString(htmlContent, "text/html");

    // // Remove unwanted elements like <script>, <style>, <iframe>, <meta>, <footer>, etc.
    // let unwantedTags = [
    //   "script",
    //   "style",
    //   "iframe",
    //   "meta",
    //   "footer",
    //   "noscript",
    // ];
    // unwantedTags.forEach((tag) => {
    //   let elements = doc.querySelectorAll(tag);
    //   elements.forEach((el) => el.remove());
    // });

    // // Extract the inner HTML

    // const turndownService = new TurndownService();
    const $ = cheerio.load(htmlText);

    // Remove unwanted elements like <script>, <style>, <iframe>, <meta>, <footer>, etc.
    $("script, style, iframe, meta, footer, noscript").remove();

    // Convert the cleaned HTML to markdown (basic conversion)
    function htmlToMarkdown(node) {
      const tagName = node.name;
      switch (tagName) {
        case "h1":
          return `# ${$(node).text()}\n`;
        case "h2":
          return `## ${$(node).text()}\n`;
        case "h3":
          return `### ${$(node).text()}\n`;
        case "p":
          return `${$(node).text()}\n`;
        case "ul":
          return (
            $(node)
              .children()
              .map((i, li) => `- ${$(li).text()}`)
              .get()
              .join("\n") + "\n"
          );
        case "li":
          return `- ${$(node).text()}\n`;
        case "a":
          return `[${$(node).text()}](${$(node).attr("href")})`;
        case "img":
          return `![${$(node).attr("alt")}](${$(node).attr("src")})`;
        default:
          return $(node).text() || "";
      }
    }

    // Traverse the body and convert to markdown
    let markdownContent = "";
    $("body")
      .children()
      .each((i, el) => {
        markdownContent += htmlToMarkdown(el);
      });

    const cleanedHtml = $("body").html();

    const jsonResult = {
      success: true,
      data: {
        markdown: convert(cleanedHtml),
      },
    };

    return jsonResult;
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error);
  }
}
