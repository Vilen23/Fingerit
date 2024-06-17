"use client";
import React from "react";
import { FaKeyboard } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { useSession } from "next-auth/react";

export default function () {
  const session = useSession();

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
      <div className="flex items-center gap-2 text-white/60 hover:text-white cursor-pointer transition-all duration-200">
        <CiUser
          size={25}
        />

        <p>
          {session.data ? (
            <>
              <span className="text-[#39FF14]">
                {session.data?.user?.name?.slice(0, 1)}
              </span>
              {session.data?.user?.name?.slice(1)}
            </>
          ) : (
            ""
          )}
        </p>
      </div>
    </div>
  );
}
