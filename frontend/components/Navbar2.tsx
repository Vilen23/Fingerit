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

interface ModesProps {
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
  const [string, setString] = useRecoilState(wordsAtom);
  const [isData, setIsData] = useRecoilState(isDataAtom);
  const [wordsData, setWordsData] = useRecoilState(wordDataAtom);
  const session = useSession();
  const [preference, setPreference] = useRecoilState(preferenceAtom);

  useEffect(() => {
    if (session.data && isData === false) {
      const getData = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getData`
        );
        console.log(response.data)
        if (response.status === 200) {
          setWordsData(response.data.words);
          setIsData(true);
        }
      };
      getData();
    }
  }, [session]);

  useEffect(() => {
    if (session.data && mode.words) {
      let stringtemp = "";
      let common_words = wordsData.common_words;
      for (let i = 0; i < preference.value; i++) {
        let randomIndex = Math.floor(Math.random() * common_words.length);
        stringtemp += common_words[randomIndex] + " ";
      }
      setString(stringtemp.trim());
    }
  }, [mode, preference, session.data, setString]);

  if (!session.data) return <div>Loading...</div>;
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
                    onClick={() =>
                      setPreference({ ...preference, value: item })
                    }
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
