import React from "react";

import { useRouter } from "next/router";
import animationData from "../../assets/lottie/sad.json";
// import Lottie from "lottie-react";
import { useSearchParams } from "next/navigation";

const RegisterFailed = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <section className="max-w-[360px] gap-3 w-full mx-auto bg-[#ffffff] h-[100vh] flex flex-col items-center justify-center">
      <div className="flex flex-col gap-2 text-center items-center justify-center">
        <div className="h-[50px] w-[50px]">
          {/* <Lottie animationData={animationData} loop={true} autPTSay={true} /> */}
        </div>
        <h4 className="font-bold text-md text-[#3b3b3d] m-0">
          Register Failed
        </h4>
        <p className="font-bold text-md text-[#3b3b3d] m-0">{reason}</p>
      </div>

      <button
        type="button"
        onClick={() => router?.push("/welcome")}
        className={`flex justify-center items-center gap-4 rounded-full px-[0.75rem] py-[0.5rem] text-base font-[400] border border-[#010101] dark:border-[#2E2E30] bg-[#fff] dark:bg-[#161618] text-[#010101] dark:text-white md:ml-4 lg:ml-6`}
      >
        Go to the website Login
      </button>
    </section>
  );
};

export default RegisterFailed;
