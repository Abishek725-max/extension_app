// Correct import

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";

// const redirectUrl = `chrome-extension://${chrome?.runtime.id}/web-login.html`;
const redirectUrl = `chrome-extension://$/web-login.html`;

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

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

export const web3auth = new Web3AuthNoModal({
  clientId,
  chainConfig,
  web3AuthNetwork: "sapphire_devnet",
  privateKeyProvider: privateKeyProvider,
  authMode: "POPUP",
  allowedOrigins: [
    "https://auth.web3auth.io",
    "https://web3auth.io",
    // `chrome-extension://${chrome?.runtime.id}/web-login.html`,
  ],
  //   redirectUrl: `chrome-extension://${chrome?.runtime.id}/web-login.html`,
  extensionType: "popup",
});

const authAdapter = new AuthAdapter({ privateKeyProvider });

web3auth.configureAdapter(authAdapter);
