import React from "react";
import seasonEarnBg from "../../../assets/images/season-earn-bg.png";
import { Image } from "@nextui-org/react";
const SeasonEarnings = () => {
  return (
    <div className="season-card relative h-full rounded-lg overflow-hidden">
      <Image
        src={seasonEarnBg.src}
        alt="seasonEarnBg"
        classNames={{ wrapper: "w-full h-full" }}
        className="w-full h-full object-cover"
      />
      <div className="absolute z-10 inset-0 p-4 flex flex-col justify-between">
        <h1 className="m-0 text-[1.3rem] font-semibold text-white">
          Total Earnings
        </h1>
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-3xl text-white font-extrabold">
              524.67K PTS
            </h2>
            <p className="m-0 text-[#9F9FA5] text-[1rem] font-[400]">
              Current Epoch Points
            </p>
          </div>
          <div className="uptime-box">
            <h6 className="m-0 text-[0.9rem] text-[#9F9FA5] font-[400]">
              Uptime <br /> 1d: 21h :6m
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonEarnings;
