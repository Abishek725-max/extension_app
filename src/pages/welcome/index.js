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
import { getLocalStorage, navigate, setLocalStorage } from "@/utils/common";

const Welcome = () => {
  const router = useRouter();

  useEffect(() => {
    handleCallback();
    setLocalStorage("extensionID", chrome.runtime.id);
  }, []);

  const handleCallback = async () => {
    // const result = await getDataWithId("privateKey");
    const result = await getLocalStorage("auth_token");
    console.log("Result:", result);

    setTimeout(async () => {
      if (result) {
        // router?.push(`/home`);
        navigate("/home");
      } else {
        // router?.push("/web-login");
        const url = `chrome-extension://${chrome.runtime.id}/web-login.html`;

        // Open the URL in a new tab
        chrome.tabs.create({ url: url });
      }
    }, 2000);
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

export default Welcome;
