"use client";

import React from "react";
import Logo from "../../assets/images/logo.png";
import Profile from "../../assets/images/profile.png";
import { Image } from "@nextui-org/react";

import { useRouter } from "next/router";

const Header = ({ setHomepage = () => {} }) => {
  const router = useRouter();

  const handle = async () => {
    router.push("/wallet-details");
    // setHomepage();
  };

  return (
    <header className="p-4">
      <div className="flex justify-between items-center">
        <div className="logo-wrapper">
          <Image alt="logo" src={Logo.src} className="h-auto w-[62px]" />
        </div>
        <div className="menu-wrapper">
          <div className="flex items-center gap-3">
            <div className="profile cursor-pointer" onClick={handle}>
              <Image
                alt="logo"
                src={Profile.src}
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
