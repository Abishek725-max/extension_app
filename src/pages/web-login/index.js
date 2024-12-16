import { useRouter } from "next/router";
import logo from "../../assets/images/logo.png";
import loginimg from "../../assets/loginimg.png";
import loginPopupImg from "../../assets/login-popup.png";

import React, { useEffect, useState } from "react";

import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { clearLocalStorage, setLocalStorage } from "@/utils/common";

import { Spinner } from "@nextui-org/react";
import loader from "../../assets/lottie/loader-theme.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

// Correct import

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { web3auth } from "@/utils/wallet-connect";
import { ethers } from "ethers";
import { generateToken } from "@/utils/base-methods";
import { Slide, toast } from "react-toastify";
import dynamic from "next/dynamic";

const WebLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [w3aPrivatekey, setw3aPrivatekey] = useState();
  const redirectUrl = `chrome-extension://${chrome?.runtime.id}/web-login.html`;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const clientId =
    "BNt9Lig2_Mv4Bn1UBNGZ9CaNeFRt8XZ7wU_e7jcmvI0AoNYO4HDh3BJZIIIb2X45T9MrNE3sxUNsMjNK9G6X3f4"; // get from https://dashboard.web3auth.io

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    decimals: 18,
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  // const clientId =
  //   "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
  // const chainConfig = {
  //   chainNamespace: CHAIN_NAMESPACES.EIP155,
  //   chainId: "0x1",
  //   rpcTarget: "https://rpc.ankr.com/eth",
  //   displayName: "Ethereum Mainnet",
  //   blockExplorerUrl: "https://etherscan.io",
  //   ticker: "ETH",
  //   tickerName: "Ethereum",
  // };
  // const privateKeyProvider = new EthereumPrivateKeyProvider({
  //   config: { chainConfig: chainConfig },
  // });

  // const web3auth = new Web3AuthNoModal({
  //   clientId,
  //   chainConfig,
  //   web3AuthNetwork: "sapphire_devnet",
  //   privateKeyProvider: privateKeyProvider,
  //   authMode: "POPUP",
  //   allowedOrigins: [
  //     "https://auth.web3auth.io",
  //     "https://web3auth.io",
  //     redirectUrl,
  //   ],
  //   redirectUrl: redirectUrl,
  //   extensionType: "popup",
  // });

  // const authAdapter = new AuthAdapter({ privateKeyProvider });

  // web3auth.configureAdapter(authAdapter);

  // const web3auth = new Web3AuthNoModal({
  //   clientId,
  //   redirectUrl,
  //   network: "sepolia", // Use a valid Ethereum testnet like Sepolia
  //   chainConfig,
  //   web3AuthNetwork: "sepolia",
  // });

  //const authState = useSelector((state) => state.auth);
  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        await web3auth.init();

        if (web3auth.provider) {
          const user = await web3auth?.getUserInfo();
          console.log("User Info", user);
          setLocalStorage("userInfo", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      }
    };

    initWeb3Auth();
  }, []); // Empty dependency array to run only once

  // Function to validate the private key
  const validatePrivateKey = (key) => {
    const regex = /^[a-fA-F0-9]{64}$/;

    if (key.startsWith("0x")) {
      key = key.replace(/0x/, "");
    }

    return regex.test(key);
  };
  const hideModal = () => {
    setIsModalVisible(false);
  };
  const handleweb3Auth = async () => {
    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: "google",
        redirectUrl,
        crossOriginIsolated: false,
      });
      // Ensure initialization

      // Get user info
      const user = await web3auth.getUserInfo();
      setLoading(true);
      setLocalStorage("userInfo", JSON.stringify(user));

      if (web3authProvider) {
        const privateKey = await getPrivateKey(web3authProvider);
        initialize(privateKey);
        console.log("privateKey", privateKey);
        if (validatePrivateKey(privateKey)) {
          setLocalStorage("privateKey", privateKey);
          console.log("Private Key retrieved successfully");

          // setTimeout(() => {
          //   router.push("/home");
          //   setLoading(false);
          // }, 2000);
        } else {
          throw new Error("Invalid Private Key Format");
        }
      }

      // Store user info
    } catch (error) {
      console.error("Web3Auth login error:", error);
      toast.error("Wallet is not ready yet, Already connecting", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    }
  };

  const getPrivateKey = async (provider) => {
    try {
      // Request private key from Web3Auth
      const privateKey = await web3auth.provider.request({
        method: "private_key",
      });

      return privateKey;
    } catch (error) {
      console.error("Error extracting private key:", error);
      throw error;
    }
  };

  const initialize = async (privateKey) => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      handleGenerateToken(wallet?.address);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleGenerateToken = async (address) => {
    try {
      console.log("address", address);
      const tokenData = await generateToken(address);
      setLocalStorage("auth_token", tokenData.data.token);
      router?.push("/home");
      setLoading(false);
    } catch (error) {
      handleLogout();
      // router?.push(`/register-failed?reason=unable to connect genarate token`);
      toast.error("Account not recognized. Signup on the web and try again", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
      setLoading(false);
      console.error("Failed to generate token", error, error?.status);
    }
  };

  const handleLogout = async () => {
    await web3auth.logout();
  };

  const openWebsite = () => {
    chrome.tabs.create({ url: "https://devnet.openledger.dev/dashboard" });
  };

  const hanldeClick = (target) => {
    if (target === "terms")
      chrome.tabs.create({
        url: "https://www.openledger.xyz/terms-and-conditions.html",
      });
    else
      chrome.tabs.create({
        url: "https://www.openledger.xyz/privacy-policy.html",
      });
  };

  // const clientId =
  //   "BNt9Lig2_Mv4Bn1UBNGZ9CaNeFRt8XZ7wU_e7jcmvI0AoNYO4HDh3BJZIIIb2X45T9MrNE3sxUNsMjNK9G6X3f4";

  // const chainConfig = {
  //   chainNamespace: "eip155",
  //   decimals: 18,
  //   chainId: "0xaa37dc",
  //   displayName: "OP Sepolia",
  //   rpcTarget: "https://sepolia.optimism.io",
  //   blockExplorerUrl: "https://sepolia-optimism.etherscan.io/",
  //   ticker: "ETH",
  //   tickerName: "Ethereum",
  //   logo: "https://web3auth.io/images/web3authlog.png",
  // };

  return (
    <>
      <main className="max-w-[360px] gap-3 w-full mx-auto bg-[#FFFFFF] h-[100vh] flex flex-col">
        {loading ? (
          <>
            <div className="content-loader h-dvh flex flex-col justify-center items-center gap-4 p-4 w-full">
              <div className="max-w-[150px] mx-auto">
                <Lottie animationData={loader} loop={true} />
              </div>
            </div>
          </>
        ) : (
          // <>
          //   <Image
          //     alt="logo"
          //     src={logo.src}
          //     className="h-12 w-12 object-contain"
          //   />
          //   <div className="flex flex-col gap-2 text-center">
          //     <h4 className="font-bold text-2xl text-[#3b3b3d] m-0">
          //       Set up Your Wallet
          //     </h4>
          //   </div>
          //   <button
          //     type="button"
          //     onClick={handleweb3Auth}
          //     className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] text-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#010101] dark:bg-[#161618] text-[#fff] dark:text-white md:ml-4 lg:ml-6`}
          //   >
          //     Login With Google
          //   </button>
          //   {/* <button
          //     type="button"
          //     onClick={handleLogout}
          //     className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] text-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#010101] dark:bg-[#161618] text-[#fff] dark:text-white md:ml-4 lg:ml-6`}
          //   >
          //     Log Out
          //   </button> */}
          // </>
          <>
            <div className="header">
              <div className="p-4 flex items-center">
                <Image
                  alt="logo"
                  src={logo.src}
                  className="h-auto w-[6.5rem] object-contain"
                />
              </div>
            </div>

            <section>
              <div className="p-4">
                <div className="login-image">
                  <Image
                    alt="loginimg"
                    src={loginimg.src}
                    className="h-auto w-full object-contain"
                    classNames={{
                      wrapper: "!max-w-[250px] mx-auto",
                    }}
                  />
                </div>
                <div className="content flex flex-col">
                  <h2 className="text-lg font-semibold text-center">
                    Your Node setup is only a few minutes away
                  </h2>
                  <button
                    onClick={() => setIsModalVisible(true)}
                    type="button"
                    className="mt-4 flex w-full justify-center items-center gap-2 rounded-lg bg-[#ff6600] border border-[#FF6600] px-3 py-2 max-w-[290px] mx-auto text-base font-bold text-white"
                  >
                    <svg
                      width="29"
                      height="28"
                      className="w-6 h-6"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2349_3125)">
                        <path
                          d="M14.4998 11.4545V16.8763H22.0343C21.7034 18.62 20.7106 20.0964 19.2215 21.0891L23.7651 24.6146C26.4124 22.171 27.9397 18.5819 27.9397 14.3183C27.9397 13.3256 27.8506 12.3709 27.6851 11.4547L14.4998 11.4545Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M6.6538 16.6647L5.62904 17.4491L2.00171 20.2746C4.30534 24.8436 9.02681 28 14.4995 28C18.2794 28 21.4484 26.7527 23.7649 24.6146L19.2212 21.0891C17.974 21.9291 16.383 22.4383 14.4995 22.4383C10.8595 22.4383 7.76687 19.9819 6.65952 16.6728L6.6538 16.6647Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M2.00171 7.72546C1.04722 9.60902 0.5 11.7345 0.5 13.9999C0.5 16.2653 1.04722 18.3908 2.00171 20.2744C2.00171 20.287 6.65997 16.6598 6.65997 16.6598C6.37997 15.8198 6.21447 14.929 6.21447 13.9998C6.21447 13.0706 6.37997 12.1797 6.65997 11.3397L2.00171 7.72546Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M14.4998 5.57454C16.5616 5.57454 18.3943 6.28725 19.858 7.66181L23.867 3.65277C21.4361 1.38736 18.2798 0 14.4998 0C9.02709 0 4.30534 3.14363 2.00171 7.72546L6.65983 11.34C7.76703 8.03089 10.8598 5.57454 14.4998 5.57454Z"
                          fill="#ffffff"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2349_3125">
                          <rect
                            width="28"
                            height="28"
                            fill="white"
                            transform="translate(0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    Create an Account
                  </button>
                  <button
                    onClick={handleweb3Auth}
                    type="button"
                    className="mt-4 flex w-full justify-center items-center gap-2 rounded-lg bg-[#fff] border border-[#FF6600] px-3 py-2 max-w-[290px] mx-auto text-base font-bold text-black"
                  >
                    Login Node
                  </button>

                  <p className="m-0 text-xs leading-6 text-[#52525B] mt-6 text-center">
                    By continuing, you are indicating that you accept our{" "}
                    <span
                      className="underline cursor-pointer text-[#FF6600]"
                      onClick={() => hanldeClick("terms")}
                    >
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span
                      className="underline cursor-pointer text-[#FF6600]"
                      onClick={() => hanldeClick("privacy")}
                    >
                      Privacy Policy
                    </span>
                    .
                  </p>
                </div>
              </div>
            </section>

            <Modal
              onClose={hideModal}
              isOpen={isModalVisible}
              size="sm"
              placement="center"
            >
              <ModalContent>
                <ModalBody>
                  <div className="flex flex-col gap-4 items-center justify-center py-2">
                    <Image
                      alt="loginPopupImg"
                      src={loginPopupImg.src}
                      className="w-full h-auto max-w-[96px]"
                      classNames={{
                        base: "!max-w-[320px]",
                      }}
                    />
                    <div className="'content flex flex-col gap-1.5 text-center">
                      <h2 className="m-0 text-black text-base font-bold">
                        Create New Account
                      </h2>
                      <p className="m-0 text-xs text-[#68686F] leading-6">
                        <span className="text-[#ff6600]">Step 1:</span> Create
                        an account on the Web App
                      </p>
                      <p className="m-0 text-xs text-[#68686F] leading-6">
                        <span className="text-[#ff6600]">Step 2:</span> Return
                        here to log in to Node
                      </p>
                    </div>
                    <div className="flex flex-col w-full">
                      <button
                        onClick={() => openWebsite()}
                        type="button"
                        className="flex w-fit mx-auto justify-center items-center gap-2 rounded-lg bg-[#FF6600] border border-[#FF6600] px-3 py-2 text-base font-bold text-white"
                      >
                        continue
                      </button>
                      <p
                        className="mt-2 m-0 text-center underline text-xs text-[#82838A] cursor-pointer"
                        onClick={() => setIsModalVisible(false)}
                      >
                        Sorry, Not Now.
                      </p>
                    </div>
                  </div>
                </ModalBody>
                {/* <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() => {
                      hideModal();
                    }}
                  >
                    Done
                  </Button>
                </ModalFooter> */}
              </ModalContent>
            </Modal>
          </>
        )}
      </main>
    </>
  );
};

export default WebLogin;
