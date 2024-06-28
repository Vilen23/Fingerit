"use client";
import React, { useState } from "react";
import { FaKeyboard } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { signOut, useSession } from "next-auth/react";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const session = useSession();
  const router = useRouter();
  const [logoutHover, setLogoutHover] = useState(false);
  const [practiseHover, setPractiseHover] = useState(false);

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
        <div
          onMouseEnter={() => setPractiseHover(true)}
          onMouseLeave={() => setPractiseHover(false)}
          className="relative"
        >
          <FaKeyboard
            onClick={handlePractise}
            size={25}
            className="text-[#CD4E28] hover:text-[#CD4E28]/60 cursor-pointer transition-all duration-200"
          />
          {practiseHover && (
            <div className="absolute transition-all duration-200">Practise</div>
          )}
        </div>
      </div>
      <div className="group relative">
        <div
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          className={`flex items-center gap-2 text-[#EBDAB4]/50 hover:text-[#EBDAB4] cursor-pointer transition-all duration-200 }`}
        >
          {!session.data && <CiUser size={25} onClick={()=>window.location.href = "/login"}/>}
          <div>
            {session.data && (
              <div className="flex items-center ">
                <span className="text-[#CD4E28]">
                  {session.data?.user?.name?.slice(0, 1)}
                </span>
                <p>{session.data?.user?.name?.slice(1)}</p>
              </div>
            )}
          </div>
          {session.data && (
            <MdLogout
              size={25}
              onClick={() => {
                signOut({
                  redirect: true,
                  callbackUrl: "/",
                });
                localStorage.removeItem("recoil-persist");
              }}
            />
          )}
        </div>
        {session.data && logoutHover && (
          <div className="absolute left-10 transition-opacity duration-200 text-[#CD4E28]">
            <span className="text-[#ebdab4]">L</span>ogout
          </div>
        )}
        {!session.data && logoutHover && (
          <div className="absolute left-10 transition-opacity duration-200 text-[#CD4E28]">
            <span
              onClick={() => {
                window.location.href = "/login";
              }}
              className="text-[#ebdab4]"
            >
              L
            </span>
            ogin
          </div>
        )}
      </div>
    </div>
  );
};
