import React, { useEffect, useState } from "react";
import { Image, Input } from "@nextui-org/react";
import Logo from "../../assets/images/logo.png";
import Profile from "../../assets/images/profile.png";
import trophy from "../../assets/images/trophy.png";
import { useRouter } from "next/router";
import ChromeExtentionHeader from "../../components/chrome_extension/chrome_extention_header";
import seasonEarnBg from "../../assets/images/season-earn-bg.png";

import {
  getRewardsHistory,
  getRewardsRealTime,
  getRewardsTotal,
} from "@/utils/base-methods";
import PointsStatistics from "@/components/dashboard/PointsStatistics ";
import {
  formatNumber,
  getLocalStorage,
  setLocalStorage,
  truncateAddress,
} from "@/utils/common";
import { CopyToClipboard } from "react-copy-to-clipboard";

import TimeCounter from "@/components/time-counter";
import ClaimRewards from "@/components/claim-rewards";
import { v4 as uuidv4 } from "uuid";
import { validatePrivateKey } from "@/utils/common";
import { ethers } from "ethers";
import { generateToken } from "@/utils/base-methods";
import ReferToReward from "@/components/ReferToReward";
import { get } from "axios";

const Home = () => {
  const router = useRouter();
  const [jobDataValues, setJobDataValues] = useState(null);
  const [privateKey, setPrivateKey] = useState();
  const [walletData, setWalletData] = useState(null);

  const [changeCopy, setChangeCopy] = useState(false);

  useEffect(() => {
    getJobsValue();
    getPrivateKeyValue();
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
    const extensionID = await getLocalStorage("extensionID");
    console.log("privateKeyValue in Home", result, extensionID);
    setPrivateKey(result);
  };

  useEffect(() => {
    getRewardsData();
    privateKey && initialize();
  }, [privateKey]);

  const [data, setData] = useState(null);
  const [rewardsHistoryData, setRewardsHistoryData] = useState([]);
  const [rewardsRealtimeData, setRewardsRealtimeData] = useState([]);
  const [rewardsTotal, setRewardsTotal] = useState([]);
  const [allJobData, setAllJobData] = useState([]);

  // React useEffect in your app

  useEffect(() => {
    getJobData();
  }, []);

  const getJobData = async () => {
    const jobResult = await getLocalStorage("jobData");
    setAllJobData(jobResult);
  };

  const initialize = async () => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      setWalletData(wallet);
      let extensionID = await getLocalStorage("extensionID");
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
                ownerAddress: wallet?.address ?? "",
                type: "Extension",
              },
            },
          }),
        },
        async (response) => {
          console.log("Response:", response);
          let message = JSON?.parse(response);
          if (message?.status === false) {
            router?.push(`/register-failed?reason=${message?.message}`);
          } else if (message?.status === true) {
            const authToken = await getLocalStorage("auth_token");
            if (!authToken) {
              handleGenerateToken(wallet?.address);
            }
          }
        }
      );
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleGenerateToken = async (address) => {
    try {
      const tokenData = await generateToken(address);
      localStorage.setItem("auth_token", tokenData.data.token);
      router?.push("/home");
    } catch (error) {
      console.error("Failed to generate token", error);
    }
  };

  const getRewardsData = () => {
    handleGetRewardsHistory();
    handleGetRewardRealtime();
  };

  const handleGetRewardsHistory = async () => {
    try {
      const response = await getRewardsHistory();
      if (response) {
        setRewardsHistoryData(response?.data);
      }
    } catch (error) {
      console.log("🚀 ~ handleGetRewardsHistory ~ error:", error);
    }
  };

  const handleGetRewardRealtime = async () => {
    try {
      const response = await getRewardsRealTime();
      if (response) {
        setRewardsRealtimeData(response.data);
        await handleGetRewardTotal(response.data.total_heartbeats);
      }
    } catch (error) {
      console.log("🚀 ~ handleGetRewardRealtime ~ error:", error);
    }
  };
  const handleGetRewardTotal = async (realtimeRewardVal) => {
    try {
      const response = await getRewardsTotal();
      console.log("🚀 ~ handleGetRewardTotal ~ response:", response);

      const rewardTotalValue = response.data.agg_points + realtimeRewardVal;
      if (response) {
        setRewardsTotal(rewardTotalValue);
      }
    } catch (error) {
      console.log("🚀 ~ handleGetRewardRealtime ~ error:", error);
    }
  };

  return (
    <section className="max-w-[360px] w-full mx-auto bg-[#eef8ff] min-h-[100vh] flex flex-col">
      <ChromeExtentionHeader />

      <div className="flex p-4 flex-col">
        <ClaimRewards />
        <div className="flex w-full flex-col relative z-[1] p-4 mt-4">
          <div className="absolute z-[-1] inset-0">
            <Image
              src={seasonEarnBg.src}
              alt="seasonEarnBg"
              classNames={{ wrapper: "w-full h-full !max-w-full rounded-xl" }}
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
                {rewardsTotal ? rewardsTotal : 0} PTS {/* */}
              </h4>
              <p className="text-xs font-medium text-[#FFFFFF99]">
                Current Epoch Earnings
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-2xl text-white text-right">
                {rewardsRealtimeData?.total ? rewardsRealtimeData?.total : 0}{" "}
                PTS {/* */}
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
          />
        </div>
        <div className="mt-4">
          <ReferToReward />
        </div>

        <div className="flex bg-[#fff] w-full mt-5 p-4 flex-col gap-4 rounded-md overflow-y-auto">
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
              <h2 className="mt-2 mb-0 text-lg text-center">No data found</h2>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
