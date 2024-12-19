import React from "react";

import { useRouter } from "next/router";
import animationData from "../../assets/lottie/sad.json";
import Logo from "../../assets/images/icon.png";
// import Lottie from "lottie-react";
import { useSearchParams } from "next/navigation";
import { Image } from "@nextui-org/react";

const About = () => {
  const router = useRouter();
  const manifest = chrome.runtime.getManifest();

  // Access the version dynamically
  const extensionVersion = manifest?.version;

  return (
    <>
      <div className="flex items-center gap-2.5 p-4 border-b">
        <div className="icon cursor-pointer " onClick={() => router?.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </div>

        <h6 className="text-lg m-0 text-black leading-6 font-semibold">
          About
        </h6>
      </div>
      <section className="p-4 flex items-center justify-center mx-auto my-auto w-full h-full">
        <div className="flex flex-col w-full h-full gap-3 items-center mx-auto my-auto">
          <div className="">
            <Image
              alt="logo"
              src={Logo.src || "/assets/images/logo.png"}
              className="h-auto w-[90px]"
            />
          </div>
          <h4 className="text-lg m-0 text-black leading-6 font-medium">
            Version : {extensionVersion}
          </h4>
          <h4 className="text-lg m-0 text-black leading-6 font-medium">
            Node ID : {chrome?.runtime?.id}
          </h4>
        </div>
      </section>
    </>
  );
};

export default About;
