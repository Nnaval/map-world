"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { BsShop } from "react-icons/bs";
import { FaRegEnvelope } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";

const MapNav = () => {
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex bg-dark-1 fixed py-1 w-full z-20 bottom-0 ">
        <div className=" bg-dark-1  w-24 h-24 rounded-full bottom-0 z-20 flex items-center justify-center fixed">
          <Image
            src={
              session?.user?.image ||
              `https://randomuser.me/api/portraits/men/1.jpg`
            }
            alt="profile_image"
            width={100}
            height={90}
            className="w-24 h-24 rounded-full border-2 border-primary-500"
          />
        </div>

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
