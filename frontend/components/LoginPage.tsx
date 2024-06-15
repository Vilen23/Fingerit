import React from "react";
import { FaGoogle, FaUserCheck } from "react-icons/fa";

const register = ["username", "email", "password"];
const login = ["username", "password"];
export default function () {
  return (
    <div className="flex justify-between px-[22vw] h-[60vh] items-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl">
          register to <span className="text-[#39FF14]">f</span>ingerIt
        </h1>
        {register.map((item) => {
          return (
            <input
              type={item}
              placeholder={item}
              className="bg-white/10 px-2 rounded-lg border-[1px] border-white/50 focus:outline-none py-1"
            />
          );
        })}
        <button className="flex gap-2 justify-center bg-white/10 py-2 rounded-lg items-center">
          <FaUserCheck className="text-[#39FF14]" />
          <p>sign up</p>
        </button>
      </div>
      <div className="flex flex-col gap-3 ">
        <h1 className="text-xl">
          <span className="text-[#39FF14]">l</span>ogin
        </h1>
        {login.map((item) => {
          return (
            <input
              type={item}
              placeholder={item}
              className="bg-white/10 px-2 rounded-lg border-[1px] border-white/50 focus:outline-none py-1"
            />
          );
        })}
        <button className="flex gap-2 justify-center bg-white/10 py-1 rounded-lg items-center">
          <FaUserCheck className="text-[#39FF14]" />
          <p>sign up</p>
        </button>
        <button className="flex gap-2 justify-center bg-white/10 py-1 rounded-lg items-center">
          <FaGoogle className="text-[#39FF14]" />
          <p>google</p>
        </button>
      </div>
    </div>
  );
}
