"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { fetchUserByUsername } from "@lib/actions/user.prisma";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import { FaRegEnvelope } from "react-icons/fa6";

const Profile = ({ params }) => {
  const [user, setUser] = useState(null);
  const id = params.id.replace(/%20/g, " ");
  const [status, setStatus] = useState("");

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
      if (id) {
        try {
          setStatus("loading");
          const fetchedUser = await fetchUserByUsername(id);
          setUser(fetchedUser);
        } catch (error) {
        } finally {
          setStatus("");
        }
      }
    };

    fetchUserData();
  }, [id]);

  if (status === "loading") {
    // Show a loading spinner or placeholder while the session is loading
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-primary-500">Loading...</p>
      </div>
    );
  }

  const userData = {
    // profilePicture: "/profile.jpg",
    name: "John Doe",
    bio: "Web developer and tech enthusiast",
    followers: 120,
    posts: 45,
    email: "johndoe@example.com",
    about: "I am a passionate developer who loves creating web applications.",
    gender: "Male",
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="w-32 h-32 mb-4">
        <Image
          src={user?.picture || "/assets/logo.svg"}
          alt="Profile Picture"
          width={200}
          height={200}
          className="rounded-full w-32 h-32 object-cover"
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-800">{user?.name || ""}</h1>
      <h6 className="text-sm font-light text-gray-500">{user?.username}</h6>
      <p className="text-gray-600 mt-2">
        {" "}
        {user?.bio || (
          <span className="text-slate-300">
            Edit your Profile to add a bio.
          </span>
        )}
      </p>

      <div className="mt-4 flex gap-8 text-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.connections || 0}
          </h2>
          <p className="text-sm text-gray-500">Connections</p>
        </div>
      </div>
      <div className="flex gap-3 items-center mt-2">
        <button
          type="button"
          className="w- bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Connect
        </button>
        <FaRegEnvelope className="text-3xl" />
      </div>

      <div className="mt-6 w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">About </h3>
          <p className="mt-1 text-gray-600">{user?.about}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">Email Address</h3>
          <p className="mt-1 text-gray-600">{user?.email}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">Gender</h3>
          <p className="mt-1 text-gray-600">{userData.gender}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">Department</h3>
          <p className="mt-1 text-gray-600">{user?.department?.name}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">Level</h3>
          <p className="mt-1 text-gray-600">{user?.level?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
