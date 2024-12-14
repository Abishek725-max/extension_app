"use client";

import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/logo.png";
import Profile from "../../assets/images/profile.png";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import { getLocalStorage } from "@/utils/common";

const Header = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  const handle = () => {
    router.push("/wallet-details");
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
    <header className="p-4">
      <div className="flex justify-between items-center">
        <div className="logo-wrapper">
          <Image
            alt="logo"
            src={Logo.src || "/assets/images/logo.png"}
            className="h-auto w-[62px]"
          />
        </div>
        <div className="menu-wrapper">
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
