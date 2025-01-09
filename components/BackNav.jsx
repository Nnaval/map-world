"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

const BackNav = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="text-3xl">
      <IoMdArrowRoundBack />
    </button>
  );
};

export default BackNav;
