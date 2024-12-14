import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { Image } from "@nextui-org/react";

import IconLogo from "@/assets/images/icon.png";

import { ethers } from "ethers";
import { setLocalStorage } from "@/utils/common";

// import { WebSocketClient } from "@/utils/WebSocketClient";

const CreateWallet = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [privateKey, setPrivateKey] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [mnemonic, setMnemonic] = useState("");

  useEffect(() => {
    // Use the blink animation utility

    const generatePrivateKey = () => {
      const wallet = ethers.Wallet.createRandom();
      setPrivateKey(wallet.privateKey);
      setWalletAddress(wallet.address);
      setMnemonic(wallet.mnemonic.phrase);
      setLoading(false);
    };
    setTimeout(() => {
      generatePrivateKey();
    }, 1000);
  }, []);

  // const copyToClipboard = (p) => {
  //   Clipboard.setString(p);
  //   showToast("Copied to clipboard!");
  // };

  const handleWalletSetup = () => {
    // localStorage.setItem("privateKey", privateKey);
    setLocalStorage("privateKey", privateKey);
    router?.push("/home");
  };

  return (
    <>
      <section className="max-w-[360px] gap-3 w-full mx-auto bg-[#ffffff] h-[100vh] flex flex-col items-center justify-center">
        {loading ? (
          <>
            <div className="flex flex-col gap-2 text-center">
              <Image src={IconLogo} />
              <p>Generating Wallet...</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2 text-center">
              <Image src={IconLogo?.src} />
              <h4>Your Generated Wallet</h4>
              <p>
                Please copy save and secure this Private key. Your Private Key
                provides full access to your wallet and funds. Do not share this
                with anyone.
              </p>

              <p>
                <p> Private Key </p>
                {privateKey}
              </p>
              <div>
                <p> Mnemonic </p>
                <p> {mnemonic}</p>
              </div>
              {"\n"}

              <button
                type="button"
                onClick={handleWalletSetup}
                className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] p-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#010101] dark:bg-[#161618] p-[#fff] dark:p-white md:ml-4 lg:ml-6`}
              >
                Continue
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default CreateWallet;
