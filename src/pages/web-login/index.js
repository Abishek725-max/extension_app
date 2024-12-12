import { useRouter } from "next/router";
import logo from "../../assets/images/icon.png";

import React, { useEffect, useState } from "react";

import { Image } from "@nextui-org/react";
import { clearLocalStorage, setLocalStorage } from "@/utils/common";

import { Spinner } from "@nextui-org/react";

// Correct import

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { web3auth } from "@/utils/wallet-connect";

const WebLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [w3aPrivatekey, setw3aPrivatekey] = useState();
  const redirectUrl = `chrome-extension://${chrome?.runtime.id}/web-login.html`;

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
          const user = await web3auth.getUserInfo();
          console.log("User Info", user);
          setLocalStorage("userInfo", user);
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
      setLocalStorage("userInfo", JSON.stringify(user));

      if (web3authProvider) {
        const privateKey = await getPrivateKey(web3authProvider);
        console.log("privateKey", privateKey);
        if (validatePrivateKey(privateKey)) {
          setLocalStorage("privateKey", privateKey);
          console.log("Private Key retrieved successfully");
          setLoading(true);
          setTimeout(() => {
            router.push("/home");
            setLoading(false);
          }, 2000);
        } else {
          throw new Error("Invalid Private Key Format");
        }
      }

      // Store user info
    } catch (error) {
      console.error("Web3Auth login error:", error);
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

  const handleLogout = async () => {
    await web3auth.logout();
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
    <section className="max-w-[360px] gap-3 w-full mx-auto bg-[#eef8ff] h-[100vh] flex flex-col items-center justify-center">
      {loading ? (
        <>
          <div className="content-loader h-dvh flex flex-col justify-center items-center gap-4 p-4 w-full">
            <Spinner size="lg" />
          </div>
        </>
      ) : (
        <>
          <Image
            alt="logo"
            src={logo.src}
            className="h-12 w-12 object-contain"
          />
          <div className="flex flex-col gap-2 text-center">
            <h4 className="font-bold text-2xl text-[#3b3b3d] m-0">
              Set up Your Wallet
            </h4>
          </div>
          <button
            type="button"
            onClick={handleweb3Auth}
            className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] text-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#010101] dark:bg-[#161618] text-[#fff] dark:text-white md:ml-4 lg:ml-6`}
          >
            Login With Google
          </button>
          {/* <button
            type="button"
            onClick={handleLogout}
            className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] text-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#010101] dark:bg-[#161618] text-[#fff] dark:text-white md:ml-4 lg:ml-6`}
          >
            Log Out
          </button> */}
        </>
      )}
    </section>
  );
};

export default WebLogin;
