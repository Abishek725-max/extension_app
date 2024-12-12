import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import Profile from "../../assets/images/profile.png";
import { Image } from "@nextui-org/react";
import {
  clearLocalStorage,
  getLocalStorage,
  truncateAddress,
} from "@/utils/common";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { web3auth } from "@/utils/wallet-connect";

const WalletDetails = () => {
  const router = useRouter();
  const [changeCopy, setChangeCopy] = useState(false);
  const [privateKey, setPrivateKey] = useState(false);
  const [userInfo, setUserInfo] = useState();

  const handleCopy = () => {
    setChangeCopy(true);
    setTimeout(() => setChangeCopy(false), 2000); // Reset after 2 seconds
  };

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://opt-sepolia.g.alchemy.com/v2/UvYPphRRxAVJDNPhlJTXeATqMx8xpUjj"
  // );
  const [walletData, setwalletData] = useState();

  const [balanceInEther, setBalanceInEther] = useState(0);

  useEffect(async () => {
    walletDetailGet();
    web3auth?.init();
  }, []);

  const walletDetailGet = async () => {
    try {
      const privateKey = await getLocalStorage("privateKey");
      const userInfo = await getLocalStorage("userInfo");
      setPrivateKey(privateKey);
      setUserInfo(JSON.parse(userInfo));
      console.log("userInfo", userInfo);

      const wallet = new ethers.Wallet(privateKey);
      setwalletData(wallet);
      // const balanceJson = await Promise.all([
      //   provider.getBalance(wallet?.address),
      // ]);
      // const balance = JSON.parse(balanceJson[0]);
      // setBalanceInEther(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error initializing ", error);
    }
  };

  const naviagate = () => {
    window.history.pushState({}, "", "/home.html");
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      const isConnected = await web3auth.connected;
      console.log("isConnected", isConnected);
      if (isConnected) {
        await web3auth.logout();
        clearLocalStorage();
        window.history.pushState({}, "", "/welcome.html");
        window.location.reload();
      } else {
        console.log("User is already logged out or not connected");
      }
    } catch (error) {}
  };

  return (
    <section className="max-w-[360px] bg-[#eef8ff] mx-auto min-h-dvh">
      <div className="header bg-white px-4 py-3 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="icon cursor-pointer" onClick={naviagate}>
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
            Wallet
          </h6>
        </div>
      </div>
      <div className="p-4">
        <div className="wallet-details flex gap-4">
          <div className="profile-image w-14 h-14 rounded-full overflow-hidden">
            <Image src={userInfo?.profileImage} className="w-full h-full" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col">
              <h2 className="m-0 text-black font-bold text-xl">
                {userInfo?.name}
              </h2>
              <p>{userInfo?.email} </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <p>{truncateAddress(walletData?.address, 22)} </p>

          <CopyToClipboard text={walletData?.address} onCopy={handleCopy}>
            {changeCopy ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#000000"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.875 2.5H6.875C6.70924 2.5 6.55027 2.56585 6.43306 2.68306C6.31585 2.80027 6.25 2.95924 6.25 3.125V6.25H3.125C2.95924 6.25 2.80027 6.31585 2.68306 6.43306C2.56585 6.55027 2.5 6.70924 2.5 6.875V16.875C2.5 17.0408 2.56585 17.1997 2.68306 17.3169C2.80027 17.4342 2.95924 17.5 3.125 17.5H13.125C13.2908 17.5 13.4497 17.4342 13.5669 17.3169C13.6842 17.1997 13.75 17.0408 13.75 16.875V13.75H16.875C17.0408 13.75 17.1997 13.6842 17.3169 13.5669C17.4342 13.4497 17.5 13.2908 17.5 13.125V3.125C17.5 2.95924 17.4342 2.80027 17.3169 2.68306C17.1997 2.56585 17.0408 2.5 16.875 2.5ZM12.5 16.25H3.75V7.5H12.5V16.25ZM16.25 12.5H13.75V6.875C13.75 6.70924 13.6842 6.55027 13.5669 6.43306C13.4497 6.31585 13.2908 6.25 13.125 6.25H7.5V3.75H16.25V12.5Z"
                  fill="#000000"
                />
              </svg>
            )}
          </CopyToClipboard>
          <h2 className="m-0 ml-2 text-black font-bold text-xl">
            {balanceInEther} ETH
          </h2>
        </div>
        {/* <div className="content py-6">
          <h2 className="m-0 text-black font-semibold text-xl mb-3">
            Keep your private key safe
          </h2>
          <p className="m-0 text-base text-black mb-1.5">
            Your Private Key provides full access to your wallet and funds.
          </p>
          <p className="m-0 text-base text-black">
            Do not share this with anyone.
          </p>
          <div className="bg-red-100 p-4 rounded-lg border-l-4 border-red-600 mt-4">
            <p className="m-0 text-base text-red-600">
              Never disclose this key. Anyone with your private key can fully
              control your account, including transferring away any of your
              funds.
            </p>
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-white border border-gray-300 gap-4 mt-4">
            <p className="m-0 text-base text-black max-w-[calc(100%-5rem)] break-words">
              {privateKey}
            </p>
            <button
              type="button"
              className="flex w-fit justify-center items-center gap-1 rounded-lg bg-[#000000] border border-[#000000] px-2 py-2 text-xs font-medium text-white"
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
              Copy
            </button>
          </div>
         
        </div> */}
        <button
          type="button"
          onClick={() => handleLogout()}
          className="mt-4 flex w-full justify-center items-center gap-1 rounded-lg bg-[#000000] border border-[#000000] p-3 text-xs font-medium text-white"
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default WalletDetails;
