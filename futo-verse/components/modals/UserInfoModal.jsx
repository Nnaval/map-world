"use client";
import { fetchOnlyUserInfo } from "@lib/actions/user.prisma";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { FaRegEnvelope } from "react-icons/fa6";

const UserInfoModal = ({ showModal, setShowModal, userInfo }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = await fetchOnlyUserInfo(userInfo.username);
      setUser(user);
    };
    console.log("userinfo", userInfo);
    console.log("fetch info useEffect ran");
    fetchUserInfo();
  }, []);
  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      width="fit"
      height="fit"
    >
      <div className="flex flex-col items-center justify-center  px-3  w-full">
        <div className="rounded-full w-24 h-24 border ">
          <Image
            src={
              user?.picture || `https://randomuser.me/api/portraits/men/1.jpg`
            }
            alt="profile_image"
            width={100}
            height={100}
            className="rounded-full w-24 h-24"
          />
        </div>
        <p className="">{user?.name}</p>
        <p className="text-slate-300 text-sm">{user?.username}</p>
        <p className="">{user?.department?.name}</p>
        <p className="">{user?.level?.name} Level</p>
        <div className="flex gap-2">
          <button
            className="bg-primary-500 text-sm text-white p-1 rounded-lg px-4 "
            // onClick={handleEnterShop}
          >
            View Profile
          </button>
          <button
            className="bg-primary-500 text-sm text-white p-1 rounded-lg px-4 "
            // onClick={handleEnterShop}
          >
            <FaRegEnvelope />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserInfoModal;
