"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { fetchUserByUsername } from "@lib/actions/user.prisma";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { HiDotsVertical } from "react-icons/hi";
import { departments } from "@constants/arrays";
import Modal from "@components/modals/Modal";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [openLogOutModal, setOpenLogOutModal] = useState(false);
  // const [posts, setPosts] = useState([]);
  // const { viewer, viewerReady, setMapVisible } = useCesiumViewer();
  // const onlineUsers = useOnlineUsers();
  // const isOnline = Object.values(onlineUsers).some(
  //   (user) => user.username === session?.user?.username
  // );

  useEffect(() => {
    const fetchUserData = async () => {
      // socket.emit("set_user_online", session.user.username);
      // console.log({ isOnline });
      if (session?.user) {
        const fetchedUser = await fetchUserByUsername(session.user.username);
        setUser(fetchedUser);
      }
    };

    fetchUserData();
  }, [session?.user]);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();
  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  if (status === "loading") {
    // Show a loading spinner or placeholder while the session is loading
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-primary-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    // Handle unauthenticated state
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">
          You must be logged in to view this page.
        </p>
        <Link href="/login" className="btn btn-primary ml-2">
          Sign In
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 mb-10 flex flex-col items-center">
      <div className="flex fixed top-5 right-5 ">
        <HiDotsVertical
          className="rounded-full text-3xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        />

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-5 top-3 mt-2 w-40 bg-white shadow-md rounded-md "
          >
            <Link
              href="/profile/edit"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Edit Profile
            </Link>
            <Link
              href="/profile/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Settings
            </Link>
            <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
              Share Profile
            </button>
            <button className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left">
              Report User
            </button>
            <button
              className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
              onClick={() => setOpenLogOutModal(true)}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="w-32 h-32 mb-4">
        <Image
          src={user?.picture || "/assets/logo.svg"}
          alt="Profile Picture"
          width={200}
          height={200}
          className="rounded-full w-32 h-32 object-cover"
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-800">
        {session?.user?.name || ""}
      </h1>
      <h6 className="text-sm font-light text-gray-500">
        {session?.user?.username}
      </h6>
      {/* <p className="text-gray-600 mt-2 text-center">
        {" "}
        {user?.bio || (
          <p className="text-slate-300">Edit your Profile to add a bio.</p>
        )}
      </p> */}

      <div className="mt-4 flex gap-8 text-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.connections || 0}
          </h2>
          <p className="text-sm text-gray-500">Connections</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.connections || 0}
          </h2>
          <p className="text-sm text-gray-500">Stores</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.connections || 0}
          </h2>
          <p className="text-sm text-gray-500">Products</p>
        </div>
      </div>

      {user && !user?.department ? (
        <Link
          href="/profile/edit"
          className="flex gap-2 bg-blue-500 text-white p-1 rounded-3xl mt-5"
        >
          Complete Setting Up Your Profile <CiEdit className="text-2xl" />
        </Link>
      ) : (
        <div className="mt-6 w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">About </h3>
            <p className="mt-1 text-gray-600">{user?.about}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Email Address</h3>
            <p className="mt-1 text-gray-600">{user?.email}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Gender</h3>
            <p className="mt-1 text-gray-600">{user?.gender}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Department</h3>
            <p className="mt-1 text-gray-600">{user?.department?.name}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Level</h3>
            <p className="mt-1 text-gray-600">{user?.level?.name}</p>
          </div>
        </div>
      )}

      {openLogOutModal && (
        <Modal
          open={openLogOutModal}
          onClose={() => setOpenLogOutModal(false)}
          width="300px"
          height="fit"
          className="border"
        >
          <div className=""></div>
          <h6 className="text-lg font-semibold text-center">Log Out</h6>
          <div className="flex flex-col gap-4 items-center justify-center">
            <p className="text-sm text-slate-700 text-center">
              Are you sure you want to complete this action?
            </p>
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => handleSignOut()}
                className="bg-blue-600 p-1 rounded-lg px-4"
              >
                Confirm
              </button>
              <button
                className="bg-transparent border border-primary text-black p-1 rounded-lg px-4"
                onClick={() => setOpenLogOutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
