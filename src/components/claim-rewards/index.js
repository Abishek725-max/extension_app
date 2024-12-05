import { claimReward, getDailyRewardStatus } from "@/utils/base-methods";
import { useEffect, useState } from "react";
import rewardBg from "../../assets/images/reward-bg.png";
import Star from "../../assets/images/star.png";
import TimeCounter from "../time-counter";
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

const ClaimRewards = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingcanClaim, setLoadingcanClaim] = useState(false);
  const [canClaim, setCanClaim] = useState(true);
  const [time, setTime] = useState();
  const [nextDayTime, setnextDayTime] = useState();
  const [dailyRewardDataStatus, setDailyRewardDataStatus] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nextClaimDateAtMidnight, setNextClaimDateAtMidnight] = useState(null);

  useEffect(() => {
    handlegetDailyRewardStatus();
    checkClaimStatus();
  }, []);

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
      isOpen();

      setCanClaim(false);
      setLoadingcanClaim(false);
      setIsModalVisible(true);
    } catch (error) {
      // console.error('Error storing claim date and time:', error);
      setCanClaim(true);
      setLoadingcanClaim(false);
    }
  };

  const handlegetDailyRewardStatus = async () => {
    try {
      const response = await getDailyRewardStatus();
      if (response) {
        setNextClaimDateAtMidnight(
          calculateNextClaimTimeAtMidnight(response?.timestamp)
        );

        setDailyRewardDataStatus(response);
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
  function calculateNextClaimTimeAtMidnight(timestamp) {
    if (!timestamp) {
      throw new Error(
        "Timestamp is required to calculate the next claim time."
      );
    }
    const lastClaimDate = new Date(timestamp);
    const nextClaimDate = new Date(lastClaimDate);
    nextClaimDate.setDate(lastClaimDate.getDate() + 1); // Add one day
    nextClaimDate.setHours(0, 0, 0, 0); // Set time to midnight
    return nextClaimDate;
  }

  return (
    <>
      <div
        className="collector-card relative rounded-lg w-full md:w-[48.5%] lg:w-[48.75%] xxl:w-full"
        style={{
          backgroundImage: `url(${rewardBg.src})`,
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="z-10 inset-0 flex px-4 py-3 justify-between h-full">
          <div className="info-wrapper flex justify-between w-full">
            <div className="flex flex-col justify-between">
              <div className="title-wrapper flex flex-col gap-1">
                <h4 className="text-2xl font-bold text-[#0C0C0D]">
                  Daily Earnings
                </h4>
              </div>
              <div className="flex flex-col gap-2 lg:gap-3 mt-8 sm:mt-6">
                {dailyRewardDataStatus?.message &&
                dailyRewardDataStatus?.status === 404 ? (
                  <p className="text-md	text-[#68686F] leading-4 m-0 mb-2 font-medium  capitalize">
                    {/* {dailyRewardDataStatus?.message} text-[#ff1744]*/}
                    Claim your daily earnings
                  </p>
                ) : !dailyRewardDataStatus?.data?.permit ? (
                  <>
                    <span className="block text-md	text-[#68686F] leading-4 m-0 mb-2 font-bold">
                      Claim your daily earnings{" "}
                      {dailyRewardDataStatus?.data?.permit}
                    </span>
                  </>
                ) : (
                  dailyRewardDataStatus?.data?.permit && (
                    <span className="block text-sm	text-[#68686F] leading-4 m-0 mb-2 font-bold">
                      {/* Next Claim in:{" "} */}
                      <TimeCounter targetDate={nextClaimDateAtMidnight} />
                      {/* <Countdown date={dayjs(nextClaimDateAtMidnight)} /> */}
                      {console.log(
                        "nextClaimDateAtMidnight",
                        nextClaimDateAtMidnight
                      )}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col mt-[-1rem] justify-between">
              <Image
                src={Star.src}
                alt="seasonEarnBg"
                className="w-full h-auto max-w-[5.5rem] sm:max-w-[6rem] md:max-w-[8.5rem] lg:max-w-[9.5rem] xl:max-w-[11rem] xxl:max-w-[6.5rem] object-contain"
              />
              {dailyRewardDataStatus?.message ? (
                <Button color="primary" onClick={handleClaim}>
                  Claim
                </Button>
              ) : (
                <>
                  {dailyRewardDataStatus?.data?.permit ? (
                    <Button color="primary" onClick={handleClaim}>
                      Claim
                    </Button>
                  ) : (
                    !dailyRewardDataStatus?.data?.permit && (
                      <Button color="default" isDisabled>
                        Claimed
                      </Button>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
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
                    You&apos;ve Successfully claimed. Keep the app running to
                    earn more rewards!
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClaimRewards;
