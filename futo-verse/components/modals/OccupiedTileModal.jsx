"use client";

import React from "react";
import Modal from "./Modal";
import Link from "next/link";
import Button from "../Button";
import { useCesiumViewer } from "../providers/CesiumViewerProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

const OccupiedTile = ({
  showModal,
  setShowModal,
  tileInfo,
  tileDetails,
  onRelocate,
}) => {
  const { viewer, viewerReady, setMapVisible } = useCesiumViewer();
  const router = useRouter();

  console.log("tileuser =", tileDetails.user.username);

  const handleViewProfile = () => {
    setMapVisible(false);
    router.push(`/profile/${tileDetails.name}`);
  };

  const handleEnterShop = () => {
    setMapVisible(false);
    router.push(`/shops/${tileDetails.name}`);
  };

  const handleRelocate = () => {
    setIsRelocating(true);
    setShowModal(false); // Close the modal on relocate button click
    onRelocate(); // Trigger the parent function to start relocation mode
  };
  return (
    <div>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        width="400px"
        height="fit"
      >
        <div className="flex flex-col gap-3">
          {tileInfo.id && <p className="text-center">Tile No: {tileInfo.id}</p>}
          <Link
            href={`/profile/${tileDetails.user?.username}`}
            className="flex gap-2 items-center"
          >
            <div className="w-7 h-7 rounded-full ">
              <Image
                src={
                  tileDetails.user.picture ||
                  `https://randomuser.me/api/portraits/men/1.jpg`
                }
                alt="profile_image"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <p className="text-slate-400">{tileDetails.user.username}</p>
          </Link>

          <div className="flex gap-2">
            <Image
              src={
                tileDetails.image ||
                "https://randomuser.me/api/portraits/men/1.jpg"
              }
              alt={tileDetails.name}
              width={100}
              height={100}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm">Store Name : {tileDetails.name}</p>
              <p className="text-sm">Category: {tileDetails.category}</p>
              <p className="text-sm">Description: {tileDetails.description}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 ">
            {/* <div className=""> */}
            <button
              className="bg-primary-500 text-sm text-white p-1 rounded-lg px-4 "
              onClick={handleEnterShop}
            >
              Enter Shop
            </button>
            {/* </div> */}
            <div className="flex gap-2 ">
              <Button Label="View Profile" handleClick={handleViewProfile} />
              <button className="bg-primary-500 text-sm text-white p-1 rounded-lg px-4 w-1/2">
                Bookmark
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center text-[10px]">
          <p className="text-sm">Location: Opposite Munalux Hotel</p>
          {tileInfo.longitude && (
            <div className="flex gap-3">
              <p>
                <strong>X:</strong> {tileInfo.longitude}
              </p>
              <p>
                <strong>Y:</strong> {tileInfo.latitude}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default OccupiedTile;
