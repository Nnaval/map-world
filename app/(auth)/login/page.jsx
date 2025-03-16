"use client";
import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { object } from "zod";

const LogIn = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateEmail = (Email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(Email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {};

    if (!form.email.trim()) {
      newError.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newError.email = "Invalid email format";
    }

    if (!form.password.trim()) {
      newError.password = "Input your Password";
    }

    if (Object.keys(newError).length > 0) {
      setErrors(newError);
    }

    console.log("Login form submitted", form);
    const success = await signIn("credentials", {
      redirectTo: "/profile",
      email: form.email,
      password: form.password,
    });
    console.log("suc", success);
  };

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
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : ""
              }  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : ""
              }  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="font-extrabold text-2xl mt-6" />
              ) : (
                <AiOutlineEye className="font-extrabold text-2xl mt-6" />
              )}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-end mb-6">
            <Link
              href="#"
              className="text-blue-500 flex items-center space-x-1 text-sm"
            >
              <CgDanger className="text-xl" />
              <span>Forgot Password?</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-primary mt- text-white py-2 px-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign-In
          </button>
        </form>
        <div className="flex text-sm gap-2 mt-3">
          <p className="">Don't have an account ? </p>
          <Link
            href={"/sign-up"}
            className="text-primary font-semibold underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
