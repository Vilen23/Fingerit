"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FaGoogle, FaUserCheck } from "react-icons/fa";

const register = ["username", "email", "password"];
const login = ["username", "password"];
interface SignupProps {
  username: string;
  email?: string;
  password: string;
}

interface SigninProps {
  username: string;
  password: string;
}

export const LoginPage = () => {
  const [signup, setSignup] = useState<SignupProps>({
    username: "",
    email: "",
    password: "",
  });
  const [signin, setSignin] = useState<SigninProps>({
    username: "",
    password: "",
  });

  const signupMutation = useMutation({
    mutationFn: async (signup: SignupProps) => {
      if (!signup.username || !signup.email || !signup.password) return;
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        signup
      );
    },
  });

  const singinMutation = useMutation({
    mutationFn: async () => {
      if (!signin.username || !signin.password) return;
      await signIn("credentials", {
        username: signin.username,
        password: signin.password,
        redirect: true,
        callbackUrl: "/practise",
      });
      return;
    },
  });

  return (
    <div className="flex md:flex-row flex-col justify-between px-[22vw] h-[60vh] items-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl">
          register to <span className="text-[#CD4E28]">f</span>ingerIt
        </h1>
        {register.map((item) => {
          return (
            <input
              autoFocus
              key={item}
              autoComplete="off"
              onChange={(e) => setSignup({ ...signup, [item]: e.target.value })}
              type={item}
              placeholder={item}
              className="bg-white/10 px-2 rounded-lg border-[1px] border-[#EBDAB4]/50 focus:outline-none py-1"
            />
          );
        })}
        {
          //@ts-ignore
          signupMutation.error?.response?.data.error && (
            <p className="text-red-500 text-xs text-center">
              {
                //@ts-ignore
                signupMutation.error?.response?.data.error
              }
            </p>
          )
        }
        <button
          onClick={() => {
            signupMutation.mutate(signup);
          }}
          className="flex gap-2 justify-center bg-white/10 py-2 rounded-lg items-center"
        >
          {signupMutation.isPending ? (
            <p>loading...</p>
          ) : (
            <>
              <FaUserCheck className="text-[#CD4E28]" />
              <p>sign up</p>
            </>
          )}
        </button>
      </div>
      <div className="flex flex-col gap-3 ">
        <h1 className="text-xl">
          <span className="text-[#CD4E28]">l</span>ogin
        </h1>
        {login.map((item) => {
          return (
            <input
              key={item}
              onChange={(e) => setSignin({ ...signin, [item]: e.target.value })}
              type={item}
              placeholder={item}
              className="bg-white/10 px-2 rounded-lg border-[1px] border-[#EBDAB4]/50 focus:outline-none py-1"
            />
          );
        })}
        <button
          onClick={() => {
            singinMutation.mutate();
          }}
          className="flex gap-2 justify-center bg-white/10 py-1 rounded-lg items-center"
        >
          {singinMutation.isPending ? (
            "loading..."
          ) : (
            <>
              <FaUserCheck className="text-[#CD4E28]" />
              <p>sign in</p>
            </>
          )}
        </button>
        <button
          onClick={async () => {
            await signIn("google", { callbackUrl: "/practise" });
          }}
          className="flex gap-2 justify-center bg-white/10 py-1 rounded-lg items-center"
        >
          <FaGoogle className="text-[#CD4E28]" />
          <p>google</p>
        </button>
      </div>
    </div>
  );
};
