import { useState } from "react";

import { Image } from "@nextui-org/react";

// import Lottie from "lottie-react";

import seasonEarnBg from "../../assets/images/season-earn-bg.png";
import { formatNumber, truncateAddress } from "../../utils/common";
import { CopyToClipboard } from "react-copy-to-clipboard";

const SeasonEarnings = ({
  realTimeData,
  totalData,
  rewardsRealtimeHistoryData,
  walletData,
}) => {
  const [changeCopy, setChangeCopy] = useState(false);
  const totalPoint = Number(totalData?.point) + Number(realTimeData);

  return (
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
            {formatNumber(totalPoint ? totalPoint : 0)} PTS{" "}
          </h4>
          <div className="flex flex-row gap-2 items-center">
            <p className="text-xs font-medium text-[#FFFFFF99]">
              Current Epoch Earnings
            </p>
            {/* <Tooltip
      closeDelay={0}
      content={
        <>
          <h4>
            {rewardsTotal} <br />
            Current Epoch Earnings
          </h4>
        </>
      }
      delay={0}
      motionProps={{
        variants: {
          exit: {
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          },
          enter: {
            opacity: 1,
            transition: {
              duration: 0.15,
              ease: "easeOut",
            },
          },
        },
      }}
      // placement={"bottom"}
    >
      <IoMdInformationCircleOutline size="20" />
    </Tooltip> */}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <h4 className="font-bold text-2xl text-white text-right">
            {isNaN(rewardsRealtimeHistoryData) || isNaN(realTimeData)
              ? 0
              : realTimeData !== undefined
              ? Number(realTimeData) + Number(rewardsRealtimeHistoryData)
              : rewardsRealtimeHistoryData !== undefined ||
                rewardsRealtimeHistoryData !== null ||
                isNaN(rewardsRealtimeHistoryData)
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
  );
};

export default SeasonEarnings;
