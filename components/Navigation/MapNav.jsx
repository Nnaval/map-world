"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { BsShop } from "react-icons/bs";
import { FaRegEnvelope } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";

const MapNav = () => {

  return (
    <div>
      <div className="flex bg-dark-1 fixed py-1 w-full z-20 bottom-0 ">


        <div className="flex w-full items-center gap-5 justify-center text-3xl text-white">
          <div className="flex flex-col ">
            <BsShop />
            {/* <p className="text-sm">Shop</p> */}
          </div>
          <div className="flex flex-col ">
            <FaRegEnvelope />
            {/* <p className="text-sm">Chat</p> */}
          </div>
          <div className="flex flex-col ">
            <IoIosNotificationsOutline />

            {/* <p className="text-sm">Notification</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapNav;
