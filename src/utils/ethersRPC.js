const { ethers } = require("ethers");

export const EthersRpc = ({ provider }) => {
  const getChainId = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId.toString();
    } catch (err) {
      setError(err);
      return err;
    }
  };

  const getAccounts = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      return address;
    } catch (err) {
      setError(err);
      return err;
    }
  };

  const getBalance = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const balance = ethers.formatEther(
        await ethersProvider.getBalance(address)
      );
      return balance;
    } catch (err) {
      setError(err);
      return err;
    }
  };

  const sendTransaction = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
      const amount = ethers.parseEther("0.001");

      const tx = await signer.sendTransaction({
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000",
        maxFeePerGas: "6000000000000",
      });

      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      setError(err);
      return err;
    }
  };

  const signMessage = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const originalMessage = "YOUR_MESSAGE";
      const signedMessage = await signer.signMessage(originalMessage);
      return signedMessage;
    } catch (err) {
      setError(err);
      return err;
    }
  };

  const readContract = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      const contractABI = [
        {
          inputs: [
            { internalType: "string", name: "initMessage", type: "string" },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "message",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "string", name: "newMessage", type: "string" },
          ],
          name: "update",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const contractAddress = "0x04cA407965D60C2B39d892a1DFB1d1d9C30d0334";
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const message = await contract.message();
      return message;
    } catch (err) {
      setError(err);
      return err;
    }
  };

  const writeContract = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      const contractABI = [
        {
          inputs: [
            { internalType: "string", name: "initMessage", type: "string" },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "message",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "string", name: "newMessage", type: "string" },
          ],
          name: "update",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const contractAddress = "0x04cA407965D60C2B39d892a1DFB1d1d9C30d0334";
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const number = Math.floor(Math.random() * 9000) + 1000;
      const tx = await contract.update(`Web3Auth is awesome ${number} times!`);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      setError(err);
      return err;
    }
  };

  const getPrivateKey = async () => {
    try {
      const privateKey = await provider.request({
        method: "eth_private_key",
      });
      return privateKey;
    } catch (err) {
      setError(err);
      return err;
    }
  };
};
