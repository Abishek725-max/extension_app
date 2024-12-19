import { claimReward, getDailyRewardStatus } from "@/utils/base-methods";
import { useEffect, useState } from "react";
import rewardBg from "../../assets/reward-bg.png";
import Star from "../../assets/images/star.png";
import rewardsGif from "../../assets/rewards.gif";
import TimeCounter from "../time-counter";
import successAnimation from "../../assets/images/success-animation.json";
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
import Countdown from "react-countdown";
import dayjs from "dayjs";
// import Lottie from "lottie-react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const ClaimRewards = ({ authToken, handleGetRewardRealtime = () => {} }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingcanClaim, setLoadingcanClaim] = useState(false);
  const [canClaim, setCanClaim] = useState(true);
  const [time, setTime] = useState();
  const [nextDayTime, setnextDayTime] = useState();
  const [dailyRewardDataStatus, setDailyRewardDataStatus] = useState(null);

  const [nextClaimDateAtMidnight, setNextClaimDateAtMidnight] = useState(null);
  const [claimStatus, setClaimStatus] = useState(null);

  useEffect(() => {
    if (authToken) {
      handlegetDailyRewardStatus();
      // checkClaimStatus();
    }
  }, [authToken]);

  const checkClaimStatus = async () => {
    const storedDate = localStorage?.getItem("claimDateTime");
    const storedDateObj = new Date(storedDate);
    const currentDate = new Date();
    setTime(storedDateObj);

    const isNextDay =
      storedDateObj.getFullYear() !== currentDate.getFullYear() ||
      storedDateObj.getMonth() !== currentDate.getMonth() ||
      storedDateObj.getDate() !== currentDate.getDate();

    setCanClaim(isNextDay);

    const nextDayRemainingTime = localStorage?.getItem("nextdayRemTime");
    const nextDayRemainingTimeObj = new Date(nextDayRemainingTime);

    setnextDayTime(nextDayRemainingTimeObj);
  };

  const handleClaim = async () => {
    try {
      setLoadingcanClaim(true);
      const currentDateTime = new Date().toISOString();

      localStorage?.setItem("claimDateTime", currentDateTime);

      const now = new Date();
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);

      const nextDayRemainingTime = nextDay.toISOString();

      localStorage?.setItem("nextdayRemTime", nextDayRemainingTime);
      setnextDayTime(nextDayRemainingTime);

      const rewardResponse = await claimReward();
      console.log("🚀 ~ handleClaim ~ rewardResponse:", rewardResponse);
      // isOpen();

      setCanClaim(false);
      setLoadingcanClaim(false);
      setIsModalVisible(true);
    } catch (error) {
      // console.error('Error storing claim date and time:', error);
      setCanClaim(true);
      setLoadingcanClaim(false);
    }
  };

  const handleGetClaimReward = async () => {
    setLoadingcanClaim(true);
    try {
      const response = await claimReward();
      if (response) {
        setClaimStatus(response?.data);
        setLoadingcanClaim(false);
        setIsModalVisible(true);
        handlegetDailyRewardStatus();
      }
    } catch (error) {
      console.error("handleGetClaimRewardStatus:", error);
      // showToast(error?.message, "error");
      setLoadingcanClaim(false);
    }
  };

  const handlegetDailyRewardStatus = async () => {
    try {
      const response = await getDailyRewardStatus();
      if (response) {
        setClaimStatus(response.data);
      }
    } catch (error) {
      console.log("🚀 ~ handlegetDailyRewardStatus ~ error:", error);

      if (error !== undefined && error?.data?.status === 404) {
        setDailyRewardDataStatus(error?.data);
      }
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };
  // function calculateNextClaimTimeAtMidnight(timestamp) {
  //   if (!timestamp) {
  //     throw new Error(
  //       "Timestamp is required to calculate the next claim time."
  //     );
  //   }
  //   const lastClaimDate = new Date(timestamp);
  //   const nextClaimDate = new Date(lastClaimDate);
  //   nextClaimDate.setDate(lastClaimDate.getDate() + 1); // Add one day
  //   nextClaimDate.setHours(0, 0, 0, 0); // Set time to midnight
  //   return nextClaimDate;
  // }
  const defaultOptions = {
    loop: true, // or false
    autoplay: true, // or false
    animationData: successAnimation,
  };

  return (
    <>
      <div
        className="collector-card border border-[#91e8f8] !w-full relative rounded-lg w-full md:w-[48.5%] lg:w-[48.75%] xxl:w-full"
        style={{
          backgroundImage: `url(${rewardBg.src})`,
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="z-10 inset-0 flex px-4 py-3 justify-between h-full">
          <div className="info-wrapper flex justify-between w-full">
            <div className="flex flex-col justify-between gap-1.5">
              <div className="title-wrapper flex flex-col gap-1">
                <h5 className="text-base font-bold text-[#0C0C0D]">
                  Daily Rewards {claimStatus?.dailyPoint} PTS
                </h5>
              </div>
              <div className="flex flex-col gap-2 lg:gap-3">
                {/* {claimStatus?.claimed ? ( */}
                {claimStatus?.claimed ? (
                  <>
                    <TimeCounter targetDate={claimStatus?.nextClaim} />
                  </>
                ) : (
                  <span className="block text-md text-[#68686F] leading-4 m-0 font-medium">
                    Claim Your Daily Rewards
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between items-end mt-auto">
              {/* <Image
                src={Star.src}
                alt="seasonEarnBg"
                className="w-full h-auto max-w-[5.5rem] sm:max-w-[6rem] md:max-w-[8.5rem] lg:max-w-[9.5rem] xl:max-w-[11rem] xxl:max-w-[6.5rem] object-contain"
              /> */}
              {loadingcanClaim ? (
                <Button
                  className="bg-[#9B9CA1] rounded-[1.5rem] text-[#FFFFFF]"
                  disabled
                  onClick={handleGetClaimReward}
                >
                  Loading
                </Button>
              ) : (
                <Button
                  className={`rounded-[1.5rem] text-[#FFFFFF] ${
                    claimStatus?.claimed ? "bg-[#9B9CA1]" : "bg-[#000000]"
                  }`}
                  disabled={claimStatus?.claimed}
                  onClick={handleGetClaimReward}
                >
                  {claimStatus?.claimed ? "Claimed" : "claim"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <Modal onClose={hideModal} isOpen={isModalVisible}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Daily Earnings
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4 items-center justify-center">
              <Image
                alt="success"
                src={rewardsGif.src}
                className="dark:invert invert-0 dark:mix-blend-color-dodge"
              />
              <p>
                {" "}
                You&apos;ve Successfully claimed. Keep the app running to earn
                more rewards!
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => {
                hideModal();
                handleGetRewardRealtime();
              }}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
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
              <div className="flex flex-col gap-3 mt-3 items-center justify-center text-center">
                <div className="max-w-[10rem]">
                  <Lottie animationData={successAnimation} loop={true} />
                </div>
                <p className="m-0 text-base font-semibold text-[#FF6600]">
                  You got {claimStatus?.dailyPoint} PTS Points!
                </p>
                <p className="m-0 text-[#68686F] dark:text-[#9F9FA5] text-sm leading-6">
                  You have Successfully claimed. <br /> Keep the app running to
                  get more rewards.
                </p>
                <div className="text-center">
                  <Button
                    color="primary"
                    className="bg-[#FF6600] min-w-[9rem]"
                    onPress={() => {
                      hideModal();
                      handleGetRewardRealtime();
                    }}
                  >
                    Done
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

export default ClaimRewards;
