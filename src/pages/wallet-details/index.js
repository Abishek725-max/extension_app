import React, { useEffect, useState } from "react";

import { ethers } from "ethers";

import Profile from "../../assets/images/profile.png";
import { Image } from "@nextui-org/react";
import { getLocalStorage, truncateAddress } from "@/utils/common";
import { useRouter } from "next/router";

const WalletDetail = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_ETH_PROVIDER_URL
  );
  const [walletData, setwalletData] = useState();
  const [exportWallet, setExportWallet] = useState(false);
  const [balanceInEther, setBalanceInEther] = useState("0");
  const router = useRouter();

  useEffect(() => {
    walletDetailGet();
    setExportWallet(false);
  }, []);
  //   const copyToClipboard = (p) => {
  //     Clipboard.setString(p);
  //     showToast("Copied to clipboard!", "success");
  //   };
  // Handle wallet setup
  const handleExportWallet = async () => {
    setExportWallet(true);
  };
  const handleExportWalletClose = async () => {
    // setExportWallet(false);
    router.back();
  };

  const walletDetailGet = async () => {
    try {
      const privateKey = await getLocalStorage("privateKey");
      const wallet = new ethers.Wallet(privateKey);
      setwalletData(wallet);
      const balanceJson = await Promise.all([
        provider.getBalance(wallet?.address),
      ]);
      const balance = JSON.parse(balanceJson[0]);
      setBalanceInEther(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error initializing ", error);
    }
  };
  const getPrivateKey = async () => {
    let privateKey = await getLocalStorage("privateKey");
    return privateKey;
  };
  return (
    <div>
      <Image src={Profile?.src} />

      <p>{truncateAddress(walletData?.address, 22)} </p>

      <p>{`${balanceInEther} ETH`}</p>

      <>
        <p>Keep your private key safe</p>
        <p>Your Private Key provides full access to your wallet and funds.</p>
        <p>Do not share this with anyone.</p>
        <p>
          Never disclose this key. Anyone with your private key can fully
          control your account, including transferring away any of your funds.
        </p>
        <p>Scan Your Private Key</p>
        <p>or</p>
        <p> Private Key </p> {"\n"}
        <p> {getPrivateKey()}</p>
        <button
          type="button"
          onClick={handleExportWalletClose}
          className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] text-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#fff] dark:bg-[#161618] text-[#010101] dark:text-white md:ml-4 lg:ml-6`}
        >
          Done
        </button>
      </>
    </div>
  );
};

export default WalletDetail;
