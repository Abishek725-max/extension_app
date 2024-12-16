import React, { useEffect } from "react";
// import ChromeExtentionPage from "@/components/chrome_extension/chrome_extention_page";
import { Image, Input } from "@nextui-org/react";
import Logo from "../../assets/images/logo.png";
import { useRouter } from "next/router";
import rewardBg from "../../assets/images/reward-bg.png";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { getDataWithId } from "@/utils/indexed-db";
import { getLocalStorage, setLocalStorage } from "@/utils/common";

import TurndownService from "turndown"; // This is the correct import for Node.js

const cheerio = require("cheerio");
const htmlToMarkdownUpdate = require("html-to-markdown");
const showdown = require("showdown");
const { convert } = require("html-to-markdown");

const Testing = () => {
  useEffect(() => {
    getScrape("https://www.jump.trade/");
  }, []);
  const getScrape = async (url) => {
    if (!url) return;

    try {
      const response = await fetch(url);
      const htmlText = await response.text();

      // Create Turndown service with some custom options
      const turndownService = new TurndownService({
        headingStyle: "atx",
        bulletListMarker: "-",
        codeBlockStyle: "fenced",
      });

      // Add custom rules if needed
      turndownService.addRule("removeComments", {
        filter: function (node) {
          return node.nodeType === Node.COMMENT_NODE;
        },
        replacement: function () {
          return "";
        },
      });

      // Remove unwanted elements before conversion
      const $ = cheerio.load(htmlText);
      $("script, style, iframe, meta, footer, noscript").remove();

      // Convert to markdown
      const markdown = turndownService.turndown($("body").html());

      console.log("markdown", markdown);

      return {
        success: true,
        data: { markdown },
      };
    } catch (error) {
      console.error("Error fetching or parsing HTML:", error);
    }
  };

  return (
    <section className="max-w-[360px] w-full mx-auto bg-[#fff] h-[100vh] flex flex-col justify-around">
      <div className="flex flex-col gap-3 items-center justify-center p-4">
        <h4 className="font-bold text-xl text-[#3c3a3b]">
          Welcome to the OpenLedger
        </h4>
        <p className="text-sm font-medium text-[#757a81] text-center">
          Get started by registering your wallet and exploring the features
        </p>
      </div>
      <div className="flex items-center justify-center">
        <Image alt="logo" src={Logo.src} className="h-auto w-[10rem]" />
      </div>
      <div className="mb-24"></div>
    </section>
  );
};

export default Testing;
