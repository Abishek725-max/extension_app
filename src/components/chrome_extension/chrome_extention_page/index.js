import React, { useEffect, useState } from "react";
import ConnectGif from "../../../assets/images/connect.gif";
import Network from "../../../components/Network";
import TodayRewards from "../../../components/chrome_extension/chrome_extention_page/TodayRewards";
import CompletedTask from "../../../components/chrome_extension/chrome_extention_page/CompletedTask";
import ChromeExtentionHeader from "../../../components/chrome_extension/chrome_extention_header";
import { Image } from "@nextui-org/react";
// import { fetchHtmlToJson } from "openledger-markdown-html-dev";

import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import { getCookie } from "cookies-next";
import WebSocketClient from "../../../utils/websocket";
// import { fetchHtmlToJson } from "../../../utils/lib/openledger-markdown";

import { fetchHtmlToJson } from "markdown-lite-worker";

// const s3Client = new S3Client({
//   endpoint: "http://35.207.253.185:9090", // MinIO server URL
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: "EoMBPbyFd31575A8REwC", // Access Key ID
//     secretAccessKey: "MtXHNvAjmY07n4B1Qgh72MQn1xvxm7BWS5ceq1Cs", // Secret Access Key
//   },
//   forcePathStyle: true,
//   tls: true,
//   maxAttempts: 3,
//   requestHandlerOptions: {
//     timeout: 30000, // 30 seconds
//   },
// });

const ChromeExtentionPage = () => {
  return (
    <section className="max-w-[360px] w-full mx-auto bg-[#EEF8FF]">
      <ChromeExtentionHeader />
      <div className="chrome-extention-container">
        <div className="connecter-wrapper">
          {/* <Lottie animationData={ConnectionAnimation} loop={true} /> */}
          <Image src={ConnectGif.src} alt="Graph" className="w-full h-auto" />
        </div>
        <div className="bg-white rounded-t-3xl p-4 mt-4">
          <Network />
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1">
              <TodayRewards />
            </div>
            <div className="flex-1">
              <CompletedTask />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <button
              type="button"
              className="flex w-full justify-center items-center gap-1 rounded-lg bg-[#356FF5] border border-[#356FF5] px-3 py-2 text-xs font-medium text-white"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.801 3.5H8.80102C8.60211 3.5 8.41135 3.57902 8.2707 3.71967C8.13004 3.86032 8.05102 4.05109 8.05102 4.25V8H4.30103C4.10211 8 3.91135 8.07902 3.7707 8.21967C3.63004 8.36032 3.55103 8.55109 3.55103 8.75V20.75C3.55103 20.9489 3.63004 21.1397 3.7707 21.2803C3.91135 21.421 4.10211 21.5 4.30103 21.5H16.301C16.4999 21.5 16.6907 21.421 16.8314 21.2803C16.972 21.1397 17.051 20.9489 17.051 20.75V17H20.801C20.9999 17 21.1907 16.921 21.3314 16.7803C21.472 16.6397 21.551 16.4489 21.551 16.25V4.25C21.551 4.05109 21.472 3.86032 21.3314 3.71967C21.1907 3.57902 20.9999 3.5 20.801 3.5ZM15.551 20H5.05103V9.5H15.551V20ZM20.051 15.5H17.051V8.75C17.051 8.55109 16.972 8.36032 16.8314 8.21967C16.6907 8.07902 16.4999 8 16.301 8H9.55102V5H20.051V15.5Z"
                  fill="white"
                />
              </svg>
              Copy Referral link
            </button>
            <button
              type="button"
              className="flex w-full justify-center items-center gap-1 rounded-lg bg-white border border-[#356FF5] px-3 py-2 text-xs font-medium text-[#356FF5]"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.551 10.25C21.551 10.4489 21.472 10.6397 21.3314 10.7803C21.1907 10.921 20.9999 11 20.801 11C20.6021 11 20.4113 10.921 20.2707 10.7803C20.13 10.6397 20.051 10.4489 20.051 10.25V6.06125L13.8326 12.2806C13.6919 12.4214 13.501 12.5004 13.302 12.5004C13.1029 12.5004 12.9121 12.4214 12.7713 12.2806C12.6306 12.1399 12.5515 11.949 12.5515 11.75C12.5515 11.551 12.6306 11.3601 12.7713 11.2194L18.9898 5H14.801C14.6021 5 14.4113 4.92098 14.2707 4.78033C14.13 4.63968 14.051 4.44891 14.051 4.25C14.051 4.05109 14.13 3.86032 14.2707 3.71967C14.4113 3.57902 14.6021 3.5 14.801 3.5H20.801C20.9999 3.5 21.1907 3.57902 21.3314 3.71967C21.472 3.86032 21.551 4.05109 21.551 4.25V10.25ZM17.801 12.5C17.6021 12.5 17.4113 12.579 17.2707 12.7197C17.13 12.8603 17.051 13.0511 17.051 13.25V20H5.05103V8H11.801C11.9999 8 12.1907 7.92098 12.3314 7.78033C12.472 7.63968 12.551 7.44891 12.551 7.25C12.551 7.05109 12.472 6.86032 12.3314 6.71967C12.1907 6.57902 11.9999 6.5 11.801 6.5H5.05103C4.6532 6.5 4.27167 6.65804 3.99037 6.93934C3.70906 7.22064 3.55103 7.60217 3.55103 8V20C3.55103 20.3978 3.70906 20.7794 3.99037 21.0607C4.27167 21.342 4.6532 21.5 5.05103 21.5H17.051C17.4488 21.5 17.8304 21.342 18.1117 21.0607C18.393 20.7794 18.551 20.3978 18.551 20V13.25C18.551 13.0511 18.472 12.8603 18.3314 12.7197C18.1907 12.579 17.9999 12.5 17.801 12.5Z"
                  fill="#356FF5"
                />
              </svg>
              Copy Referral link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChromeExtentionPage;
