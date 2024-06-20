"use client";
import {
  charCustomAtom,
  customReadyAtom,
  preferenceAtom,
} from "@/states/atoms/preference";
import React, { useState } from "react";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { IoIosTime } from "react-icons/io";
import { TiSortAlphabetically } from "react-icons/ti";
import { useRecoilState } from "recoil";
import { FaCheckCircle } from "react-icons/fa";
export interface ModesProps {
  time: boolean;
  words: boolean;
  custom: boolean;
}
const modeValue = [10, 15, 30];

export default function Navbar2() {
  const [preference, setPreference] = useRecoilState(preferenceAtom);
  const [charCustom, setCharCustom] = useRecoilState(charCustomAtom);
  const [error, setError] = useState("");
  const [customReady, setCustomReady] = useRecoilState(customReadyAtom);

  const handleCharValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) {
      setError("Cannot exceed 4 cgharacters");
      return;
    }
    setCustomReady(false)
    setCharCustom(e.target.value);
  };

  const handlePreferenceValue = (value: number) => {
    setPreference({ ...preference, value: value });
  };

  const handleCustomText = () => {
    if (charCustom.length <= 0) {
      setError("Cannot be empty");
      return;
    }
    if (charCustom.length > 4) {
      setError("Cannot exceed 4 characters");
      return;
    }
    console.log("ready");
    setCustomReady(true);
  };

  if (!preference) return <div>Loading...</div>;

  return (
    <div className="w-full flex justify-center ">
      <div className="bg-[#1D2021] h-[40px] flex items-center gap-4 px-10 rounded-lg">
        <div
          onClick={() => {
            setPreference({ ...preference, mode: "time" });
          }}
          className={`${
            preference.mode === "time" ? "text-[#F99B32]" : "opacity-50"
          } flex items-center text-xs gap-1 0 hover:opacity-100 cursor-pointer transition-all duration-200`}
        >
          <IoIosTime size={20} />
          time
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
        {!(preference.mode === "custom") ? (
          <>
            <div className="flex gap-2 text-xs">
              {modeValue.map((item, index) => {
                return (
                  <p
                    key={index}
                    onClick={() => {
                      handlePreferenceValue(item);
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
        ) : (
          <div className="flex items-center gap-2">
            <div>|</div>
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
        )}
      </div>
    </div>
  );
}
