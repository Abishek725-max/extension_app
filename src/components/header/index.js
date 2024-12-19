"use client";

import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/logo.png";
import Profile from "../../assets/images/profile.png";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import { getLocalStorage } from "@/utils/common";
import { navigate } from "../../utils/common";
import { RiRefreshLine } from "react-icons/ri";

const Header = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  const handle = () => {
    navigate("/wallet-details");
    // router.push("/wallet-details");
  };

  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getLocalStorage("userInfo");
        setUserInfo(JSON.parse(userInfo));
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <header className="p-4 border-b">
      <div className="flex justify-between items-center">
        <div className="logo-wrapper">
          <Image
            alt="logo"
            src={Logo.src || "/assets/images/logo.png"}
            className="h-auto w-[5rem] object-contain"
          />
        </div>
        <div className="menu-wrapper flex items-center gap-4">
          <RiRefreshLine onClick={reload} className="w-8 h-8" />
          <div className="flex items-center gap-3">
            <div className="profile cursor-pointer" onClick={handle}>
              <Image
                alt="profile"
                src={userInfo?.profileImage || Profile.src} // Fallback image
                className="h-8 w-8 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
