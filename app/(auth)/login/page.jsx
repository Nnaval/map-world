import React from "react";
import { AiOutlineEye } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";
import Link from "next/link"

const LogIn = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back 👌
            </h2>
          </div>
          <p className="text-gray-600 mt-2">Sign in to access your account</p>
        </div>

        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-gray-500">
              <AiOutlineEye className="font-extrabold text-2xl mt-6" />
            </span>
          </div>

          <div className="flex justify-end mb-6">
            <Link href="#" className="text-blue-500 flex items-center space-x-1 text-sm">
              <CgDanger className="text-xl" />
              <span>Forgot Password?</span>
            </Link>
          </div>

          <button
            type="button"
            className="w-full bg-blue-700 mt- text-white py-2 px-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign-In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
