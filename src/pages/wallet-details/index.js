import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { FaHeadphonesAlt } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { LiaTelegramPlane } from "react-icons/lia";
import { RiDiscordLine } from "react-icons/ri";
import { GrCircleInformation } from "react-icons/gr";
import {
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import { Avatar, Link } from "@nextui-org/react";

import Profile from "../../assets/images/profile.png";

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCopy = () => {
    setChangeCopy(true);
    setTimeout(() => setChangeCopy(false), 2000); // Reset after 2 seconds
  };

  const provider = new ethers.JsonRpcProvider(
    "https://opt-sepolia.g.alchemy.com/v2/UvYPphRRxAVJDNPhlJTXeATqMx8xpUjj"
  );
  const [walletData, setwalletData] = useState();

  const [balanceInEther, setBalanceInEther] = useState(0);

  useEffect(() => {
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
      const balanceJson = await Promise.all([
        provider.getBalance(wallet?.address),
      ]);
      const balance = JSON.parse(balanceJson[0]);
      setBalanceInEther(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error initializing ", error);
    }
  };

  const naviagate = () => {
    // window.history.pushState({}, "", "/home.html");
    // window.location.reload();
    // router.back();
    router.push(`/home?redirect="wallet"`);
  };

  const handleLogout = async () => {
    try {
      const isConnected = await web3auth.connected;
      console.log("isConnected", isConnected);
      if (isConnected) {
        await web3auth.logout();
        clearLocalStorage();
        // window.history.pushState({}, "", "/welcome.html");
        // window.location.reload();
        router?.push("/web-login");
      } else {
        console.log("User is already logged out or not connected");
      }
    } catch (error) {}
  };
  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="flex items-center gap-2.5 p-4 border-b">
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
          Profile
        </h6>
      </div>
      <section className="p-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="icon w-14 h-14 flex items-center justify-center">
                  <Avatar
                    isBordered
                    src={userInfo?.profileImage}
                    classNames={{ base: "ring-[#ff6600] w-12 h-12" }}
                  />
                </div>
                <div className="w-[calc(100%-4.25rem)] flex flex-col">
                  <h6 className="text-base text-black m-0 leading-6 font-medium break-words">
                    {userInfo?.name}
                  </h6>
                  <p className="text-sm text-[#68686F] m-0 leading-6 font-medium break-words">
                    {userInfo?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center mx-auto w-fit justify-center gap-2 border border-[#E7E7E9] rounded-lg">
                <div className="flex items-center gap-2 px-2 py-2">
                  <p className="m-0 text-base text-black leading-6">
                    {truncateAddress(walletData?.address, 22)}
                  </p>
                  <CopyToClipboard
                    text={walletData?.address}
                    onCopy={handleCopy}
                  >
                    <div className="cursor-pointer">
                      {changeCopy ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#000"
                          className="size-4 stroke-black dark:stroke-white"
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
                            className="fill-black dark:fill-white"
                            d="M16.875 2.5H6.875C6.70924 2.5 6.55027 2.56585 6.43306 2.68306C6.31585 2.80027 6.25 2.95924 6.25 3.125V6.25H3.125C2.95924 6.25 2.80027 6.31585 2.68306 6.43306C2.56585 6.55027 2.5 6.70924 2.5 6.875V16.875C2.5 17.0408 2.56585 17.1997 2.68306 17.3169C2.80027 17.4342 2.95924 17.5 3.125 17.5H13.125C13.2908 17.5 13.4497 17.4342 13.5669 17.3169C13.6842 17.1997 13.75 17.0408 13.75 16.875V13.75H16.875C17.0408 13.75 17.1997 13.6842 17.3169 13.5669C17.4342 13.4497 17.5 13.2908 17.5 13.125V3.125C17.5 2.95924 17.4342 2.80027 17.3169 2.68306C17.1997 2.56585 17.0408 2.5 16.875 2.5ZM12.5 16.25H3.75V7.5H12.5V16.25ZM16.25 12.5H13.75V6.875C13.75 6.70924 13.6842 6.55027 13.5669 6.43306C13.4497 6.31585 13.2908 6.25 13.125 6.25H7.5V3.75H16.25V12.5Z"
                            fill="#000"
                          />
                        </svg>
                      )}
                    </div>
                  </CopyToClipboard>
                </div>
                {/* <button
                  type="button"
                  className="flex w-fit justify-center items-center gap-1 rounded-lg bg-[#000] border border-[#000] px-3 py-2 text-base font-normal text-white"
                >
                  {balanceInEther} ETH
                </button> */}
              </div>
            </div>
          </div>

          <div className="bg-[#F9F9F9] border border-[#E7E7E9] px-3 py-4 rounded-xl flex flex-col gap-4">
            <div className="menu-title">
              <h2 className="text-sm m-0 text-[#68686F] leading-6">Settings</h2>
            </div>
            <div className="menu-wrapper flex flex-col">
              <div className="menu-items-wrapper flex flex-col gap-2">
                <Link
                  href="https://discord.com/invite/EPqu5eHB"
                  target="_blank"
                  className="text-black"
                >
                  <div className="menu-item flex gap-3 items-center py-2.5">
                    <div className="icon">
                      <FiHelpCircle fontSize={"1.5rem"} />
                    </div>
                    <div className="content flex items-center gap-4">
                      <p className="m-0 text-[#000000] text-base font-medium leading-6">
                        Help Center
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="mailto:Support@openledger.xyz"
                  target="_blank"
                  className="text-black"
                >
                  <div className="menu-item flex gap-3 items-center py-2.5">
                    <div className="icon">
                      <FaHeadphonesAlt fontSize={"1.5rem"} />
                    </div>
                    <div className="content flex items-center gap-4">
                      <p className="m-0 text-[#000000] text-base font-medium leading-6">
                        Support
                      </p>
                    </div>
                  </div>
                </Link>
                {/* <Link href="/" target="_blank" className="text-black">
                  <div className="menu-item flex gap-3 items-center py-2.5">
                    <div className="icon">
                      <GrCircleInformation fontSize={"1.5rem"} />
                    </div>
                    <div className="content flex items-center gap-4">
                      <p className="m-0 text-[#000000] text-base font-medium leading-6">
                        About
                      </p>
                    </div>
                  </div>
                </Link> */}
                {/* </div> */}
                {/* <div className="menu-items-wrapper flex flex-col gap-2"> */}
                <Link
                  href="https://x.com/OpenledgerHQ"
                  target="_blank"
                  className="text-black"
                >
                  <div className="menu-item flex gap-3 items-center py-2.5">
                    <div className="icon">
                      <BsTwitterX fontSize={"1.5rem"} />
                    </div>
                    <div className="content flex items-center gap-4">
                      <p className="m-0 text-[#000000] text-base font-medium leading-6">
                        X
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="https://t.me/openledgerofficial"
                  target="_blank"
                  className="text-black"
                >
                  <div className="menu-item flex gap-3 items-center py-2.5">
                    <div className="icon">
                      <LiaTelegramPlane fontSize={"1.5rem"} />
                    </div>
                    <div className="content flex items-center gap-4">
                      <p className="m-0 text-[#000000] text-base font-medium leading-6">
                        Telegram
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="https://discord.com/invite/OpenLedger"
                  target="_blank"
                  className="text-black"
                >
                  <div className="menu-item flex gap-3 items-center py-2.5">
                    <div className="icon">
                      <RiDiscordLine fontSize={"1.5rem"} />
                    </div>
                    <div className="content flex items-center gap-4">
                      <p className="m-0 text-[#000000] text-base font-medium leading-6">
                        Discord
                      </p>
                    </div>
                  </div>
                </Link>
                <div
                  className="menu-item flex gap-3 items-center py-2.5 cursor-pointer"
                  onClick={() => setIsModalVisible(true)}
                >
                  <div className="icon">
                    <FiLogOut fontSize={"1.5rem"} />
                  </div>
                  <div className="content flex items-center gap-4">
                    <p className="m-0 text-[#000000] text-base font-medium leading-6">
                      Log Out
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal
        onClose={hideModal}
        hideCloseButton
        isOpen={isModalVisible}
        isDismissable={false}
        placement="center"
        classNames={{
          base: "!max-w-[320px]",
        }}
      >
        <ModalContent>
          <>
            <ModalBody>
              <div className="flex flex-col my-3 items-center justify-center text-center">
                <p className="m-0 text-lg font-semibold text-[#000] mb-1">
                  Logout Confirmation
                </p>
                <p className="m-0 text-[#68686F] dark:text-[#9F9FA5] text-sm leading-6 mb-4">
                  Do you want to proceed with logging out?
                </p>
                <p className="m-0 text-[#68686F] dark:text-[#9F9FA5] text-sm leading-6 mb-4">
                  Keep the app running to earn more rewards. Logging out will
                  stop your earnings from this node.
                </p>
                <div className="text-center flex items-center justify-between gap-4">
                  <Button
                    color="primary"
                    className="bg-[#FF6600] w-[calc(50%-0.5rem)]"
                    onPress={() => {
                      handleLogout();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    color="primary"
                    className="bg-[#ffffff] border border-[#FF6600] text-[#FF6600] w-[calc(50%-0.5rem)]"
                    onPress={() => {
                      hideModal();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WalletDetails;
