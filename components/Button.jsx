"use client";

import React from "react";

const Button = ({ Label, handleClick }) => {
  return (
    <button
      className="bg-primary-500 text-sm text-white p-1 rounded-lg px-4 w-1/2"
      onClick={handleClick}
    >
      {Label}
    </button>
  );
};

export default Button;
