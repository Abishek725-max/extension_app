import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Image } from "@nextui-org/react";
import logo from "../../assets/images/icon.png";

const ChooseWallet = () => {
  const router = useRouter();

  return (
    <section className="max-w-[360px] gap-3 w-full mx-auto bg-[#ffffff] h-[100vh] flex flex-col items-center justify-center">
      <Image alt="logo" src={logo.src} className="h-12 w-12 object-contain" />
      <div className="flex flex-col gap-2 text-center">
        <h4 className="font-bold text-2xl text-[#3b3b3d] m-0">
          Set up Your Wallet
        </h4>
      </div>
      {/* <button
        type="button"
        onClick={() => router?.push("/create-wallet")}
        className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] text-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#010101] dark:bg-[#161618] text-[#fff] dark:text-white md:ml-4 lg:ml-6`}
      >
        Create Wallet
      </button> */}
      <button
        type="button"
        onClick={() => router?.push("/import-wallet")}
        className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] text-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#010101] dark:bg-[#161618] text-[#fff] dark:text-white md:ml-4 lg:ml-6`}
      >
        Import Wallet
      </button>
    </section>
  );
};

export default ChooseWallet;
