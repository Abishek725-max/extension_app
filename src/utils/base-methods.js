import { Slide, toast } from "react-toastify";
import baseAxios from "./axios-utils";
// console.log('🚀 ~ baseAxios:', baseAxios);

export const generateToken = async (address) => {
  try {
    const response = await baseAxios.post(
      "/auth/generate_token",
      {
        address: address,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating token:", error);
  }
};

export const claimReward = async () => {
  try {
    const response = await baseAxios.put("/users/reward_permit");
    console.log("🚀 ~ claimReward ~ response:", response);
    return response.data;
  } catch (error) {
    console.error("Error claiming reward:", error);
    throw error;
  }
};

export const getRewardsHistory = async () => {
  try {
    const response = await baseAxios.get("/users/reward_history");
    return response.data;
  } catch (error) {
    console.error("Error reward_history:", error);
    throw error;
  }
};

export const getRewardsRealTime = async () => {
  try {
    const response = await baseAxios.get("/users/reward_realtime");
    return response.data;
  } catch (error) {
    console.error("Error reward_realtime:", error);
    throw error;
  }
};

export const getRewardsTotal = async () => {
  try {
    const response = await baseAxios.get("/users/reward");

    return response.data;
  } catch (error) {
    console.error("Error reward Total:", error);
    throw error;
  }
};

export const getDailyRewardStatus = async () => {
  try {
    const response = await baseAxios.get("/users/reward_permit_status");
    return response.data;
  } catch (error) {
    console.log("Error reward Total:", error);
    toast?.error(error?.response?.data?.message, {
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
  }
};
