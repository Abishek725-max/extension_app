"use client";
import React, { useEffect, useState } from "react";

import Logo from "../../assets/images/logo.png";

import trophy from "../../assets/images/trophy.png";
import { useRouter } from "next/router";
import seasonEarnBg from "../../assets/images/season-earn-bg.png";

import {
  getRewardsHistory,
  getRewardsRealTime,
  getRewardsTotal,
} from "@/utils/base-methods";
import PointsStatistics from "@/components/dashboard/PointsStatistics ";
import {
  checkRealtimeEntry,
  formatNumber,
  getAvailableStoragePercentage,
  getLocalStorage,
  setLocalStorage,
  truncateAddress,
} from "@/utils/common";
import { CopyToClipboard } from "react-copy-to-clipboard";

import TimeCounter from "@/components/time-counter";
import ClaimRewards from "@/components/claim-rewards";
import { v4 as uuidv4 } from "uuid";

import { ethers } from "ethers";
import { generateToken } from "@/utils/base-methods";
import ReferToReward from "@/components/ReferToReward";
import Header from "@/components/header";

import Profile from "../../assets/images/profile.png";
import { Image } from "@nextui-org/react";
import dayjs from "dayjs";
import { Slide, toast } from "react-toastify";

const Home = () => {
  const router = useRouter();
  const [jobDataValues, setJobDataValues] = useState(null);
  const [privateKey, setPrivateKey] = useState();
  const [walletData, setWalletData] = useState(null);
  const [homepage, setHomepage] = useState(true);

  const [changeCopy, setChangeCopy] = useState(false);
  const [authToken, setAuthToken] = useState();

  const [data, setData] = useState(null);
  const [rewardsHistoryData, setRewardsHistoryData] = useState([]);
  const [rewardsRealtimeData, setRewardsRealtimeData] = useState();
  const [rewardsTotal, setRewardsTotal] = useState([]);
  const [allJobData, setAllJobData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [w3aPrivatekey, setw3aPrivatekey] = useState();
  const redirectUrl = `chrome-extension://${chrome?.runtime.id}/web-login.html`;

  const [rewardsRealtimeHistoryData, setRewardsRealtimeHistoryData] =
    useState(0);

  const [rewardsRealTimeDataArray, setRewardsRealTimeDataArray] = useState([]);

  useEffect(() => {
    getPrivateKeyValue();
    // getJobsValue();
  }, []);

  const getJobsValue = async () => {
    // const result = await getDataWithId("jobData");
    const result = await getLocalStorage("jobData");
    setJobDataValues(result);
    console.log("Jobs Result:", result);
  };

  const getPrivateKeyValue = async () => {
    // const result = await getDataWithId("privateKey");
    const result = await getLocalStorage("privateKey");
    const authToken = await getLocalStorage("auth_token");
    setPrivateKey(result);
    setAuthToken(authToken);
    // const extensionID = await getLocalStorage("extensionID");
  };

  useEffect(() => {
    // getRewardsData();
    privateKey && authToken && connectWebsocket(authToken);
  }, [privateKey, authToken]);

  const sendRegister = async (address) => {
    getRewardsData();
    let extensionID = chrome.runtime.id;
    console.log("sendAddress", address);

    chrome.runtime.sendMessage(
      {
        type: "send_websocket_message",
        data: JSON.stringify({
          workerID: `chrome-extension://${extensionID}`,
          msgType: "REGISTER",
          message: {
            id: uuidv4(),
            type: "REGISTER",
            worker: {
              host: `chrome-extension://${extensionID}`,
              identity: extensionID,
              ownerAddress: address ?? "",
              type: "Extension",
            },
          },
        }),
      },
      async (response) => {
        console.log("Response:", response);
        let message = JSON?.parse(response);
        if (message?.status === false) {
          // router?.push(`/register-failed?reason=${message?.message}`);
          toast.error(message?.message, {
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
        } else if (message?.status === true) {
          // const authToken = await getLocalStorage("auth_token");
          // if (!authToken) {
          //   handleGenerateToken(wallet?.address);
          // }
        }
      }
    );
  };

  // React useEffect in your app

  const connectWebsocket = async (authToken) => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      setWalletData(wallet);
      chrome.runtime.sendMessage(
        {
          type: "connect_socket",
          data: { authToken: authToken },
        },
        (response) => {
          console.log("response in WEbsocket", response);

          sendRegister(wallet?.address);
        }
      );
      // router?.push("/home");
    } catch (error) {
      console.error("Failed to generate token", error);
    }
  };

  const getRewardsData = () => {
    handleGetRewardRealtime();
    // handleGetRewardsHistory();
  };

  const handleGetRewardsHistory = async (rewardsRealtimeDataBeats) => {
    try {
      const response = await getRewardsHistory();
      // if (response) {
      //   setRewardsHistoryData(response?.data);
      // }
      if (response) {
        const checkRealtimeDateinHistory = await checkRealtimeEntry(
          response.data
        );

        const realtimeDataCheck =
          checkRealtimeDateinHistory === rewardsRealtimeDataBeats[0]?.date
            ? response?.data
            : rewardsRealtimeDataBeats;
        // Call a separate function to find today's date data
        const foundTodaysdate = await findTodaysDateData(
          realtimeDataCheck,
          checkRealtimeDateinHistory
        );

        setRewardsHistoryData(response?.data);
        // Delay updating `setRewardsRealtimeHistoryData` if necessary
        setTimeout(() => {
          setRewardsRealtimeHistoryData(
            foundTodaysdate ? foundTodaysdate.total_points : 0
          );
        }, 5);
      }
    } catch (error) {
      console.log("🚀 ~ handleGetRewardsHistory ~ error:", error);
    }
  };

  const handleGetRewardRealtime = async () => {
    try {
      const response = await getRewardsRealTime();
      console.log("response Realtime", response);

      if (response) {
        setRewardsRealtimeData(
          response?.data?.length > 0 ? response?.data[0] : 0
        );
        setRewardsRealTimeDataArray(
          response?.data?.length > 0 ? response?.data : []
        );

        await handleGetRewardTotal(
          response?.data?.length > 0 ? response?.data[0] : 0
        );
        await handleGetRewardsHistory(response?.data);
      }
    } catch (error) {
      console.log("🚀 ~ handleGetRewardRealtime ~ error:", error);
    }
  };

  const handleGetRewardTotal = async (realtimeRewardVal) => {
    try {
      const response = await getRewardsTotal();
      console.log("🚀 ~ handleGetRewardTotal ~ response:", response);

      if (response) {
        const rewardTotalValue = realtimeRewardVal
          ? Number(response?.data?.point) +
            Number(realtimeRewardVal?.total_heartbeats)
          : Number(response?.data?.point);

        setRewardsTotal(rewardTotalValue);
      }
    } catch (error) {
      console.log("🚀 ~ handleGetRewardRealtime ~ error:", error);
    }
  };

  const findTodaysDateData = async (data, realtimeDate) => {
    // Simulate an async operation if necessary
    return data.find((item) =>
      dayjs(item.date).isSame(dayjs(realtimeDate), "day")
    );
  };

  // async function sendHeartbeat() {
  //   try {
  //     const extensionId = chrome?.runtime.id;
  //     let privateKey = await getLocalStorage("privateKey");
  //     const wallet = new ethers.Wallet(privateKey);

  //     // Retrieve available TensorFlow models (assuming you're using TensorFlow.js)
  //     const models = await tf.io.listModels();
  //     console.log("Available models:", models);

  //     const memoryInfo = await getAvailableMemoryPercentage();
  //     if (memoryInfo) {
  //       console.log(
  //         `Available Memory: ${memoryInfo.availableMemoryPercentage}%`
  //       );
  //     }

  //     console.log("Storage stats:", await getAvailableStoragePercentage());

  //     // chrome.runtime.sendMessage({ type: "GET_GPU_INFO" }, (response) => {
  //     //   console.log("GPU Info:", response);
  //     // });

  //     // Get GPU info by sending a message to the content script

  //     const heartbeatMessage = {
  //       Worker: {
  //         Identity: extensionId,
  //         Address: wallet?.address,
  //         Type: "HEARTBEAT",
  //         Host: `chrome-extension://${extensionId}`,
  //       },
  //       Capacity: {
  //         AvailableMemory: memoryInfo?.availableMemoryPercentage,
  //         AvailableStorage: await getAvailableStoragePercentage(),
  //         AvailableGPU: "",
  //         AvailableModels: models ? Object.keys(models) : [],
  //       },
  //       msgType: "HEARTBEAT",
  //       workerID: extensionId,
  //     };

  //     // Send the heartbeat message (WebSocket, etc.)
  //     if (socket) {
  //       socket.send(JSON.stringify(heartbeatMessage));
  //       console.log("Heartbeat sent:", heartbeatMessage);
  //     } else {
  //       console.error("WebSocket is not open, unable to send heartbeat.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending health check response:", error);
  //     if (error.response) {
  //       console.error("Error response:", error.response);
  //     }
  //     if (error.message) {
  //       console.error("Error message:", error.message);
  //     }
  //   }
  // }

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://opt-sepolia.g.alchemy.com/v2/UvYPphRRxAVJDNPhlJTXeATqMx8xpUjj"
  // );

  const [balanceInEther, setBalanceInEther] = useState(0);

  return (
    <>
      <>
        <section className="max-w-[360px] w-full mx-auto bg-[#eef8ff] min-h-[100vh] flex flex-col">
          <Header setHomepage={() => setHomepage(false)} />

          <div className="flex p-4 flex-col">
            <ClaimRewards
              authToken={authToken}
              handleGetRewardRealtime={handleGetRewardRealtime}
            />
            <div className="flex w-full flex-col relative z-[1] p-4 mt-4">
              <div className="absolute z-[-1] inset-0">
                <Image
                  src={seasonEarnBg.src}
                  alt="seasonEarnBg"
                  classNames={{
                    wrapper: "w-full h-full !max-w-full rounded-xl",
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-end items-center gap-2">
                <h1 className="m-0 text-[1.3rem] font-semibold text-white">
                  Earnings{" "}
                </h1>
                <p className="ml-auto text-xs font-medium text-white">
                  {truncateAddress(walletData?.address, 20)}
                </p>
                <CopyToClipboard
                  text={walletData?.address}
                  onCopy={() => setChangeCopy(true)}
                >
                  {changeCopy ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#ffffff"
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
                        fill="#ffffff"
                      />
                    </svg>
                  )}
                </CopyToClipboard>
              </div>

              <div className="flex items-center justify-between mt-[3rem]">
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-2xl text-white">
                    {" "}
                    {rewardsTotal ? rewardsTotal : 0} PTS
                  </h4>
                  <p className="text-xs font-medium text-[#FFFFFF99]">
                    Current Epoch Earnings
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-2xl text-white text-right">
                    {rewardsRealtimeData?.total_heartbeats !== undefined
                      ? Number(rewardsRealtimeData?.total_heartbeats) +
                        Number(rewardsRealtimeHistoryData)
                      : rewardsRealtimeHistoryData !== undefined ||
                        rewardsRealtimeHistoryData !== null
                      ? Number(rewardsRealtimeHistoryData)
                      : 0}{" "}
                    PTS
                  </h4>
                  <p className="text-xs font-medium text-[#FFFFFF99] text-right">
                    Today&apos;s Earnings
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <PointsStatistics
                data={rewardsHistoryData}
                realTimeData={rewardsRealtimeData}
                rewardsRealTimeDataArray={rewardsRealTimeDataArray}
              />
            </div>
            <div className="mt-4">
              <ReferToReward authToken={authToken} />
            </div>

            {/* <div className="flex bg-[#fff] w-full mt-5 p-4 flex-col gap-4 rounded-md overflow-y-auto">
              <h4 className="text-lg font-bold text-black">
                Received All Job Data
              </h4>

              {allJobData?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {console.log("allJobData", allJobData)}
                  {JSON.parse(allJobData)?.map((items, index) => {
                    const dataset =
                      typeof items.Dataset === "string"
                        ? JSON.parse(items.Dataset)
                        : items.Dataset;
                    return (
                      <>
                        {" "}
                        <div className="flex items-center border border-[#eaeaea] rounded-lg p-2 gap-2">
                          <Image
                            alt="logo"
                            src={Profile.src}
                            className="h-8 w-8 object-contain"
                          />
                          <div className="flex flex-col flex-1 gap-2">
                            <h4 className="font-bold text-sm text-black">
                              {" "}
                              {truncateAddress(items?.UUID, 23)}
                            </h4>
                            <p className="text-xs font-medium text-black">
                              {`${dataset?.name ?? "N/A"}`}
                            </p>
                            <p className="text-xs font-medium text-black">
                              {items?.jobReceviedresponse?.completed_at
                                ? format(
                                    new Date(
                                      items?.jobReceviedresponse?.completed_at
                                    ),
                                    "PPpp"
                                  )
                                : "N/A"}
                            </p>
                          </div>
                          <p className="ml-auto text-xs font-medium text-[#deab56] bg-[#fcecd0] rounded-[20px] px-2 py-1">
                            {`${
                              items?.jobReceviedresponse?.status === true
                                ? "Completed"
                                : "Failed"
                            }`}
                          </p>
                        </div>
                      </>
                    );
                  })}
                </div>
              ) : (
                <>
                  <h2 className="mt-2 mb-0 text-lg text-center">
                    No data found
                  </h2>
                </>
              )}
            </div> */}
          </div>
        </section>
      </>
    </>
  );
};

export default Home;
