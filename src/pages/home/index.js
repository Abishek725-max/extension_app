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
import PointsStatistics from "@/components/PointsStatistics ";
import {
  checkRealtimeEntry,
  formatNumber,
  getAvailableStoragePercentage,
  getLocalStorage,
  setLocalStorage,
  truncateAddress,
} from "@/utils/common";

import { IoMdInformationCircleOutline } from "react-icons/io";

import TimeCounter from "@/components/time-counter";
import ClaimRewards from "@/components/claim-rewards";
import { v4 as uuidv4 } from "uuid";

import { ethers } from "ethers";
import { generateToken } from "@/utils/base-methods";
import ReferToReward from "@/components/ReferToReward";
import Header from "@/components/header";

import Profile from "../../assets/images/profile.png";
import { Image, Tooltip } from "@nextui-org/react";
import dayjs from "dayjs";
import { Slide, toast } from "react-toastify";
import loader from "../../assets/lottie/loader-theme.json";
import dynamic from "next/dynamic.js";
import { useSearchParams } from "next/navigation";
import SeasonEarnings from "../../components/season-earnings";
import { checkLogin } from "../../utils/common";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [jobDataValues, setJobDataValues] = useState(null);
  const [privateKey, setPrivateKey] = useState();
  const [walletData, setWalletData] = useState(null);
  const [homepage, setHomepage] = useState(true);

  const [changeCopy, setChangeCopy] = useState(false);
  const [authToken, setAuthToken] = useState();

  const [rewardsHistoryData, setRewardsHistoryData] = useState([]);
  const [rewardsRealtimeData, setRewardsRealtimeData] = useState();
  const [rewardsTotal, setRewardsTotal] = useState([]);

  const [loading, setLoading] = useState(true);
  const redirectUrl = `chrome-extension://${chrome?.runtime.id}/web-login.html`;

  const [rewardsRealtimeHistoryData, setRewardsRealtimeHistoryData] =
    useState(0);

  const [rewardsRealTimeDataArray, setRewardsRealTimeDataArray] = useState([]);

  useEffect(() => {
    checkLogin();
    getPrivateKeyValue();

    console.log("Current URL:", window.location.href);
  }, []);

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
    console.log("redirect", redirect);

    if (privateKey && authToken && redirect === '"wallet"') {
      const wallet = new ethers.Wallet(privateKey);
      setWalletData(wallet);
      console.log("redirectInside", redirect);
      getRewardsData();
    } else if (privateKey && authToken) connectWebsocket(authToken);
  }, [privateKey, authToken]);

  const base64Encode = (input) => {
    return btoa(input);
  };

  const sendRegister = async (address) => {
    getRewardsData();
    let extensionID = chrome.runtime.id;
    console.log("sendAddress", address);

    chrome.runtime.sendMessage(
      {
        type: "send_websocket_message",
        data: JSON.stringify({
          workerID: base64Encode(address),
          msgType: "REGISTER",
          workerType: "LWEXT",
          message: {
            id: uuidv4(),
            type: "REGISTER",
            worker: {
              host: `chrome-extension://${extensionID}`,
              identity: base64Encode(address),
              ownerAddress: address ?? "",
              type: "LWEXT",
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
          const url = `chrome-extension://${chrome.runtime.id}/web-login.html`;

          // Open the URL in a new tab
          chrome.tabs.create({ url: url });
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

  const connectWebsocket = async (authToken, redirectValue) => {
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
      setLoading(false);
      if (response) {
        const checkRealtimeDateinHistory = await checkRealtimeEntry(
          response?.data
        );
        let foundTodaysdate;
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
        const day = String(today.getDate()).padStart(2, "0");
        const todayDate = `${year}-${month}-${day}`;
        const todayDateCheck =
          rewardsRealtimeDataBeats?.length > 0
            ? checkRealtimeDateinHistory === rewardsRealtimeDataBeats[0]?.date
            : checkRealtimeDateinHistory === todayDate;
        if (todayDateCheck) {
          // Call a separate function to find today's date data
          foundTodaysdate = await findTodaysDateData(
            response?.data,
            checkRealtimeDateinHistory
          );
        }
        setRewardsRealtimeHistoryData(
          foundTodaysdate ? foundTodaysdate?.total_points : 0
        );
        return response?.data;
      }
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ handleGetRewardsHistory ~ error:", error);
    }
  };

  const epochPointsWithHeightFun = async (historyData, realtimeData) => {
    let finalData = [];
    const checkRealtimeDateinHistory = await checkRealtimeEntry(historyData);
    if (realtimeData.length > 0) {
      const found = realtimeData?.find((item) =>
        dayjs(item.date).isSame(dayjs(checkRealtimeDateinHistory), "day")
      );

      const todayHeartBeats = {
        date: realtimeData[0]?.date,
        details: [
          {
            claim_type: 3,
            points: Number(realtimeData[0]?.total_heartbeats),
          },
        ],
        total_points: Number(realtimeData[0]?.total_heartbeats),
      };

      const lastIndex = historyData.findIndex(
        (entry) => entry.date === realtimeData[0].date
      );

      if (!found) {
        historyData.push(todayHeartBeats); // Modify historyData directly
        finalData = [...historyData];
      } else {
        if (lastIndex !== -1) {
          const todayHeartBeatsExisting = {
            date: realtimeData[0]?.date,
            details: [
              {
                claim_type: 3,
                points: Number(realtimeData[0]?.total_heartbeats),
              },
            ],
          };
          historyData[lastIndex].total_points =
            (Number(historyData[lastIndex]?.total_points) || 0) +
            (Number(realtimeData[0]?.total_heartbeats) || 0);

          historyData[lastIndex].details = historyData[
            lastIndex
          ].details.concat(todayHeartBeatsExisting.details);

          finalData = [...historyData];
        } else {
          finalData = [...historyData];
        }
      }
    } else {
      finalData = [...historyData];
    }

    setRewardsHistoryData(finalData);
    await handleGetRewardTotal();
  };

  const handleGetRewardRealtime = async () => {
    try {
      const response = await getRewardsRealTime();
      console.log("response Realtime", response);

      if (response) {
        setRewardsRealtimeData(
          response?.data?.length > 0 ? response?.data[0]?.total_heartbeats : 0
        );
        setRewardsRealTimeDataArray(
          response?.data?.length > 0 ? response?.data : []
        );

        // await handleGetRewardTotal(
        //   response?.data?.length > 0 ? response?.data[0] : 0
        // );

        const realtimeData = response?.data?.length > 0 ? response?.data : [];
        const historyData = await handleGetRewardsHistory(response?.data);
        await epochPointsWithHeightFun(historyData, realtimeData);
      }
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ handleGetRewardRealtime ~ error:", error);
    }
  };

  const handleGetRewardTotal = async (realtimeRewardVal) => {
    try {
      const response = await getRewardsTotal();
      console.log("🚀 ~ handleGetRewardTotal ~ response:", response);

      if (response) {
        // const rewardTotalValue = realtimeRewardVal
        //   ? Number(response?.data?.point) +
        //     Number(realtimeRewardVal?.total_heartbeats)
        //   : Number(response?.data?.point);

        setRewardsTotal(response?.data);
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

  const [balanceInEther, setBalanceInEther] = useState(0);

  return (
    <>
      <>
        <section className="hide-vertical-scrollbar max-w-[360px] w-full h-[100vh] mx-auto bg-[#ffffff] min-h-[100vh] flex flex-col">
          {loading ? (
            <>
              <div className="content-loader h-dvh flex flex-col justify-center items-center gap-4 p-4 w-full">
                <div className="max-w-[150px] mx-auto">
                  <Lottie animationData={loader} loop={true} />
                </div>
              </div>
            </>
          ) : (
            <>
              <Header setHomepage={() => setHomepage(false)} />

              <div className="flex p-4 flex-col">
                <ClaimRewards
                  authToken={authToken}
                  handleGetRewardRealtime={handleGetRewardRealtime}
                />
                <SeasonEarnings
                  realTimeData={rewardsRealtimeData}
                  rewardsRealtimeHistoryData={rewardsRealtimeHistoryData}
                  totalData={rewardsTotal}
                  walletData={walletData}
                />

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
              </div>
            </>
          )}
        </section>
      </>
    </>
  );
};

export default Home;
