import React from "react";
import Image from "next/image";


const Profile = () => {
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
          src="/assets/logo.svg"
          alt="Profile Picture"
          width={200}
          height={200}
          className="rounded-full object-cover"
        />
      </div>
        
      <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
      <p className="text-gray-600 mt-2">{userData.bio}</p>

      <div className="mt-4 flex gap-8 text-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {userData.followers}
          </h2>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {userData.posts}
          </h2>
          <p className="text-sm text-gray-500">Posts</p>
        </div>
      </div>

      <div className="mt-6 w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">About </h3>
          <p className="mt-1 text-gray-600">{userData.about}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">Email Address</h3>
          <p className="mt-1 text-gray-600">{userData.email}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Gender</h3>
          <p className="mt-1 text-gray-600">{userData.gender}</p>
        </div>

        <button
          type="button"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default Profile;
