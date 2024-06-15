import React from "react";
import { FaKeyboard } from "react-icons/fa";
import { CiUser } from "react-icons/ci";

export default function () {
  return (
    <div className="w-full h-[15vh] justify-between px-[20vw] items-center gap-5 flex">
      <div className="flex gap-5 items-center">
        <div className="text-3xl">
          <span className="text-[#39FF14]">f</span>inger<span>It</span>
        </div>
        <div>
          <FaKeyboard
            size={25}
            className="text-[#39FF14] hover:text-gray-700 cursor-pointer transition-all duration-200"
          />
        </div>
      </div>
      <div>
        <CiUser
          size={25}
          className="text-white hover:text-white/60 cursor-pointer transition-all duration-200"
        />
      </div>
    </div>
  );
}
