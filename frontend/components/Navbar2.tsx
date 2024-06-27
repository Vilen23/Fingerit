"use client";
import {
  charCustomAtom,
  customReadyAtom,
  preferenceAtom,
} from "@/states/atoms/preference";
import React, { useEffect, useState } from "react";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { TiSortAlphabetically } from "react-icons/ti";
import { useRecoilState } from "recoil";
import { FaCheckCircle, FaCrown } from "react-icons/fa";
import { easeInOut, motion } from "framer-motion";
import { RxDividerVertical } from "react-icons/rx";
import { socketAtom } from "@/states/atoms/socket";
import { letterArrayAtom, wordDataAtom, wordsAtom } from "@/states/atoms/words";
import { useSession } from "next-auth/react";
import {
  challengeUsers,
  fetchAtom,
  userSpeedChallenge,
} from "@/states/atoms/challenge";
import { roomownerAtom } from "@/states/atoms/roomowner";

export interface ModesProps {
  time: boolean;
  words: boolean;
  custom: boolean;
}
const modeValue = [10, 15, 30];

export const Navbar2 = () => {
  const session = useSession();
  const [error, setError] = useState("");
  const [preference, setPreference] = useRecoilState(preferenceAtom);
  const [charCustom, setCharCustom] = useRecoilState(charCustomAtom);
  const [customReady, setCustomReady] = useRecoilState(customReadyAtom);
  const [fetch, setFetch] = useRecoilState(fetchAtom);
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [users, setUsers] = useRecoilState(challengeUsers);
  const [wordsData, setWordsData] = useRecoilState(wordDataAtom);
  const [roomOwner, setRoomOwner] = useRecoilState(roomownerAtom);
  const [textstring, setTextstring] = useRecoilState(wordsAtom);
  const [letterarray, setLetterarray] = useRecoilState(letterArrayAtom);
  const [usersSpeed, setUsersSpeed] = useRecoilState(userSpeedChallenge);

  const handleCharValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.value.length > 4) {
      setError("Cannot exceed 4 cgharacters");
      return;
    }
    setCustomReady(false);
    setCharCustom(e.target.value);
  };

  const handlePreferenceValue = (value: number) => {
    setPreference({ ...preference, value: value });
  };

  const handleCustomText = () => {
    setError("");
    if (charCustom.length <= 0) {
      setError("Cannot be empty");
      return;
    }
    if (charCustom.length > 4) {
      setError("Cannot exceed 4 characters");
      return;
    }
    setCustomReady(true);
  };


  if (!preference) return <div>Loading...</div>;

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-[#1D2021] h-[40px] flex items-center gap-4 px-10 rounded-lg z-20">
        <div
          onClick={() => {
            setPreference({ ...preference, mode: "challenge" });
          }}
          className={`${
            preference.mode === "challenge" ? "text-[#F99B32]" : "opacity-50"
          } flex items-center text-xs gap-1 0 hover:opacity-100 cursor-pointer transition-all duration-200`}
        >
          <FaCrown size={20} />
          challenge
        </div>
        <div
          onClick={() => {
            setPreference({ ...preference, mode: "words" });
          }}
          className={`${
            preference.mode === "words" ? "text-[#F99B32]" : "opacity-50"
          } flex items-center text-xs gap-1  hover:opacity-100 cursor-pointer transition-all duration-200`}
        >
          <TiSortAlphabetically size={30} />
          words
        </div>
        <div
          onClick={() => {
            setPreference({ ...preference, mode: "custom" });
          }}
          className={`${
            preference.mode === "custom" ? "text-[#F99B32]" : "opacity-50"
          } flex items-center text-xs gap-1  hover:opacity-100 cursor-pointer transition-all duration-200`}
        >
          <HiMiniWrenchScrewdriver size={20} />
          custom
        </div>
      </div>
      {preference.mode !== "challenge" && (
        <motion.div
          initial={{ x: "-100px", opacity: "0" }}
          animate={{ x: "0", opacity: "100" }}
          transition={{ duration: 0.5, type: easeInOut }}
          exit={{ x: "-100px", opacity: "0" }}
          className="flex z-10"
        >
          <RxDividerVertical size={40} />
          <motion.div className="flex bg-[#1D2021] h-[40px] items-center px-4 rounded-lg gap-2 text-xs">
            {modeValue.map((item, index) => {
              return (
                <p
                  key={index}
                  onClick={() => {
                    handlePreferenceValue(item);
                  }}
                  className={`${
                    preference.value === item ? "text-[#F99B32]" : "opacity-50"
                  } transition-all duration-200 cursor-pointer hover:opacity-100`}
                >
                  {item}
                </p>
              );
            })}
          </motion.div>
        </motion.div>
      )}
      {preference.mode === "custom" && (
        <motion.div
          initial={{ x: "-100px", opacity: "0" }}
          animate={{ x: "0px", opacity: "100" }}
          transition={{ duration: 0.5, type: easeInOut }}
          className="flex items-center gap-2 z-[0]"
        >
          <RxDividerVertical size={40} />
          <div className="rounded-lg flex gap-2 items-center h-[40px] px-8 bg-[#1D2021] ">
            <input
              value={charCustom}
              onChange={(e) => handleCharValue(e)}
              type="text"
              placeholder="Max 4 chars"
              className="bg-[#1C2022] border-b-[1px] border-[#F6D99A]/40 transition-all duration-200 focus:border-[#F6D99A] px-2 py-[1px] text-xs outline-none w-[150px] "
            />
            <FaCheckCircle
              className={` ${
                customReady ? "opacity-100 text-[#FF8F00]" : "opacity-50"
              } hover:opacity-100 transition-all duration-200 cursor-pointer`}
              onClick={handleCustomText}
            />
          </div>
        </motion.div>
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
