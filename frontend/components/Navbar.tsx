"use client";
import React from "react";
import { FaKeyboard } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { signOut, useSession } from "next-auth/react";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export default function () {
  const session = useSession();
  const router = useRouter();

  if (!session) return <div>Loading....</div>;

  const handlePractise = () => {
    if (session.data) {
      window.location.href = "/practise";
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-[15vh] justify-between px-[20vw] items-center gap-5 flex">
      <div className="flex gap-5 items-center">
        <div className="text-3xl">
          <span className="text-[#CD4E28]">f</span>inger<span>It</span>
        </div>
        <div className="relative group">
          <FaKeyboard
            onClick={handlePractise}
            size={25}
            className="text-[#CD4E28] hover:text-[#B8BA36] cursor-pointer transition-all duration-200"
          />
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Practise
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#EBDAB4]/50 hover:text-[#EBDAB4] cursor-pointer transition-all duration-200">
        {!session.data && <CiUser size={25} />}
        <p>
          {session.data && (
            <div className="flex items-center ">
              <span className="text-[#CD4E28]">
                {session.data?.user?.name?.slice(0, 1)}
              </span>
              <p>{session.data?.user?.name?.slice(1)}</p>
            </div>
          )}
        </p>
        {session.data && (
          <MdLogout
            size={25}
            onClick={() => {
              signOut({
                redirect: true,
                callbackUrl: "/",
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
