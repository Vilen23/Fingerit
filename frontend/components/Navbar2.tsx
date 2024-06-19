"use client";
import { preferenceAtom } from "@/states/atoms/preference";
import { isDataAtom, wordDataAtom, wordsAtom } from "@/states/atoms/words";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { IoIosTime } from "react-icons/io";
import { TiSortAlphabetically } from "react-icons/ti";
import { useRecoilState } from "recoil";

export interface ModesProps {
  time: boolean;
  words: boolean;
  custom: boolean;
}

const modeValue = [10, 15, 30];

export default function Navbar2() {
  const [mode, setMode] = useState<ModesProps>({
    time: false,
    words: true,
    custom: false,
  });
  const [preference, setPreference] = useRecoilState(preferenceAtom);
  console.log(preference.value);
  const handlePreference = (value: number) => {
    setPreference({ ...preference, value: value });
  };

  return (
    <div className="w-full flex justify-center ">
      <div className="bg-[#1D2021] h-[40px] flex items-center gap-4 px-10 rounded-lg">
        <div
          onClick={() => setMode({ time: true, words: false, custom: false })}
          className={`${
            mode.time === true ? "text-[#F99B32]" : "opacity-50"
          } flex items-center text-xs gap-1 0 hover:opacity-100 cursor-pointer transition-all duration-200`}
        >
          <IoIosTime size={20} />
          time
        </div>
        <div
          onClick={() => setMode({ time: false, words: true, custom: false })}
          className={`${
            mode.words === true ? "text-[#F99B32]" : "opacity-50"
          } flex items-center text-xs gap-1  hover:opacity-100 cursor-pointer transition-all duration-200`}
        >
          <TiSortAlphabetically size={30} />
          words
        </div>
        <div
          onClick={() => setMode({ time: false, words: false, custom: true })}
          className={`${
            mode.custom === true ? "text-[#F99B32]" : "opacity-50"
          } flex items-center text-xs gap-1  hover:opacity-100 cursor-pointer transition-all duration-200`}
        >
          <HiMiniWrenchScrewdriver size={20} />
          custom
        </div>
        {!mode.custom && (
          <>
            <div>|</div>
            <div className="flex gap-2 text-xs">
              {modeValue.map((item, index) => {
                return (
                  <p
                    key={index}
                    onClick={() => {
                      handlePreference(item);
                    }}
                    className={`${
                      preference.value === item
                        ? "text-[#F99B32]"
                        : "opacity-50"
                    } transition-all duration-200 cursor-pointer hover:opacity-100`}
                  >
                    {item}
                  </p>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
