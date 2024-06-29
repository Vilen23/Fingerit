"use client";
import { resultAtom } from "@/states/atoms/result";
import {
  isDataAtom,
  letterArrayAtom,
  wordDataAtom,
  wordsAtom,
} from "@/states/atoms/words";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  charCustomAtom,
  customReadyAtom,
  preferenceAtom,
} from "@/states/atoms/preference";
import "./cursorblink.css";
import { ResultCard } from "./ResultCard";
import { roomownerAtom } from "@/states/atoms/roomowner";
import {
  challengeStartAtom,
  challengeUsers,
  fetchAtom,
  userSpeedChallenge,
} from "@/states/atoms/challenge";
import { socketAtom } from "@/states/atoms/socket";
import Image from "next/image";
interface LetterProps {
  letter: string;
  color: string;
}
interface userSpeedProps {
  speed: number;
  user: {
    id: string;
    username: string;
  };
}

export const TypingComponent = () => {
  const session = useSession();
  const [fetch, setFetch] = useRecoilState(fetchAtom);
  const [maxWrong, setMaxWrong] = useState(0);
  const [totaltype, setTotaltype] = useState(0);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [wrongInputs, setwrongInputs] = useState(0);
  const [correctInput, setCorrectInput] = useState(0);
  const [isgameOver, setIsgameOver] = useState(false);
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [result, setResult] = useRecoilState(resultAtom);
  const [isData, setIsData] = useRecoilState(isDataAtom);
  const [roomOwner, setRoomOwner] = useRecoilState(roomownerAtom);
  const [textstring, setTextstring] = useRecoilState(wordsAtom);
  const [wordsData, setWordsData] = useRecoilState(wordDataAtom);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [letterarray, setLetterarray] = useRecoilState(letterArrayAtom);
  const challengeStart = useRecoilValue(challengeStartAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const preference = useRecoilValue(preferenceAtom);
  const charCustom = useRecoilValue(charCustomAtom);
  const [users, setUsers] = useRecoilState(challengeUsers);
  const customReady = useRecoilValue(customReadyAtom);
  const [usersSpeed, setUsersSpeed] = useRecoilState(userSpeedChallenge);

  //Fetching the words from the backend and setting them into recoil state and persisting it into local storage
  useEffect(() => {
    if (!isData) {
      const getData = async () => {
        const response = await axios.get(`
          ${process.env.NEXT_PUBLIC_API_URL}/getData`);
        if (response.status === 200) {
          setWordsData(response.data.words);
          setIsData(true);
        }
      };
      getData();
    }
  }, [session, isData, setWordsData, setIsData]);

  useEffect(() => {
    if (preference.mode === "challenge" && challengeStart) {
      inputRef.current?.focus();
    }
  }, [challengeStart, preference.mode]);

  //Setting of words to display
  useEffect(() => {
    if (preference.mode === "challenge") return;
    setCursorIndex(0);
    setStartTime(0);
    setIsgameOver(false);
    setCorrectInput(0);
    setwrongInputs(0);
    setMaxWrong(0);
    setResult({ accuracy: "0", speed: "0", rawspeed: "0" });
    setTotaltype(0);

    if (inputRef.current) inputRef.current.value = "";
    let stringtemp = "";
    let common_words = wordsData.common_words;
    if (preference.mode === "words") {
      for (let i = 0; i < preference.value; i++) {
        let randomIndex = Math.floor(Math.random() * common_words.length);
        stringtemp += common_words[randomIndex] + " ";
      }
    } else if (preference.mode === "custom" && customReady) {
      let char = charCustom;
      let characters = char.split("");
      const filteredWords = common_words.filter((word: any) =>
        characters.some((char) => word.includes(char)),
      );
      for (let i = filteredWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredWords[i], filteredWords[j]] = [
          filteredWords[j],
          filteredWords[i],
        ];
      }
      const maxWords = Math.min(filteredWords.length, preference.value);
      const selectedWords = filteredWords.slice(0, maxWords);
      stringtemp = selectedWords.join(" ") + " ";
    }
    let wordsstring = stringtemp.trim();
    setTextstring(wordsstring);
    let temparray = Array.from(wordsstring).map((char) => ({
      letter: char,
      color: "text-[#EBDAB4]/50",
    }));
    setLetterarray(temparray);
    setFetch(true);
  }, [
    session.data,
    preference,
    fetch,
    customReady,
    charCustom,
    wordsData.common_words,
    setLetterarray,
    setTextstring,
    setResult,
  ]);

  useEffect(() => {
    if (inputRef.current && (customReady || preference.mode !== "challenge")) {
      inputRef.current.focus();
    }
  }, [preference, customReady]);

  const handleInputChange = (event: any) => {
    let ans = event.target.value;
    let lengthofinput = event.target.value.length;
    let newCorrectInput = 0;
    let newWrongInput = 0;
    const newarray = letterarray.map(
      (item: LetterProps, index: number): LetterProps => {
        if (index < lengthofinput) {
          if (textstring[index] === ans[index] && wrongInputs === 0) {
            newCorrectInput++;
            setCursorIndex(index + 1);
            setTotaltype(totaltype + 1);
            return { ...item, color: "text-[#EBDAB4]" };
          } else {
            newWrongInput++;
            setMaxWrong(maxWrong + 1);
            setCursorIndex(index);
            setTotaltype(totaltype + 1);

            return { ...item, color: "text-red-500" };
          }
        } else {
          return { ...item, color: "text-[#EBDAB4]/50" };
        }
      },
    );

    setCorrectInput(newCorrectInput);
    setwrongInputs(newWrongInput);
    setLetterarray(newarray);
    if (lengthofinput === 1 && !startTime) {
      setStartTime(new Date().getTime());
    }

    if (!startTime) return;
    const curr = new Date().getTime();
    const accuracy =
      ((textstring.length - maxWrong - 1) / (textstring.length - 1)) * 100;
    const timeElapsed = (curr - startTime) / 1000 / 60;
    const rawspeed = Math.max(0, Math.round(totaltype / 5 / timeElapsed));
    const wordsTyped = correctInput / 5;
    const wpm = wordsTyped / timeElapsed;
    const speed = Math.max(0, Math.round(wpm));

    //Sending live speed to the websocket in challenge mode
    if (socket?.OPEN && preference.mode === "challenge") {
      socket.send(
        JSON.stringify({
          action: "speed",
          payload: { speed: speed, user: session?.data?.user },
        }),
      );
    }
    if (cursorIndex === textstring.length - 1) {
      setIsgameOver(true);
      setResult({
        accuracy: accuracy.toFixed(2),
        speed: speed.toString(),
        rawspeed: rawspeed.toString(),
      });
    }
  };

  const handleKeyPresses = (event: any) => {
    if (event.key === "Tab" || event.key === "Escape") {
      event.preventDefault();
    }
    if (event.key === "Enter" && preference.mode !== "challenge") {
      setFetch(!fetch);
      setCursorIndex(0);
      setStartTime(0);
      setIsgameOver(false);
      setCorrectInput(0);
      setwrongInputs(0);
      setMaxWrong(0);
      setResult({ accuracy: "0", speed: "0", rawspeed: "0" });
      setTotaltype(0);
      if (inputRef.current) inputRef.current.value = "";
    }

    if (
      event.key === "Enter" &&
      preference.mode === "challenge" &&
      roomOwner === session?.data?.user.id
    ) {
      if (socket?.readyState === 1) {
        socket.send(JSON.stringify({ action: "reload" }));
      }
    }

    //To make backspace only work when wrong input and not let any other input come
    if (event.key === "Backspace" && wrongInputs === 0) {
      event.preventDefault();
    }
    if (isgameOver) event.preventDefault();
    if (event.key === "Backspace" && wrongInputs > 0) {
      setwrongInputs(wrongInputs - 1);
    }
    if (wrongInputs > 0 && event.key !== "Backspace") event.preventDefault();
  };

  if (!letterarray) return <div>Loading...</div>;
  return (
    <div
      className={`flex justify-center items-center flex-col ${
        preference.mode === "challenge" ? "h-[40vh]" : "h-[60vh]"
      } `}
    >
      <div className="text-[30px] relative w-[80vw] text-center">
        {letterarray.map((word, index) => (
          <span
            key={index}
            className={`${word.color} transition-all duration-200 relative`}
          >
            {index === cursorIndex && (
              <span className="absolute top-2 cursor-blink">_</span>
            )}
            {word.letter}
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        autoFocus
        disabled={!challengeStart && preference.mode === "challenge"}
        type="text"
        placeholder=""
        onKeyDown={handleKeyPresses}
        onChange={handleInputChange}
        className="mt-4 p-2 border-0 rounded absolute opacity-0  w-[80vw] text-[30px] text-center"
      />
      {isgameOver && preference.mode !== "challenge" && (
        <div className="absolute bottom-[12vh]">
          <ResultCard
            accuracy={result.accuracy}
            speed={result.speed}
            rawspeed={result.rawspeed}
          />
        </div>
      )}
      {preference.mode === "challenge" && !isgameOver && (
        <div className="absolute bottom-[12vh] flex  gap-10 items-center">
          <Image
            src="/resultImage.jpg"
            width={200}
            height={100}
            alt="resultImage"
            className=" rounded-l-lg"
          />
          <div className="flex flex-col gap-2">
            {users.map((users: any) => {
              return (
                <div key={users.id} className="flex gap-4">
                  <p className="font-semibold">{users.username}</p>
                  {usersSpeed ? (
                    usersSpeed
                      .filter((user: userSpeedProps) => {
                        return users.id === user.user.id && user.speed > 0;
                      })
                      .sort(
                        (a: userSpeedProps, b: userSpeedProps) =>
                          b.speed - a.speed,
                      )
                      .map((user: userSpeedProps) => (
                        <p key={user.speed}>{user.speed}</p>
                      ))
                  ) : (
                    <p>0</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isgameOver && preference.mode === "challenge" && (
        <div className="w-[600px] rounded-lg h-[200px] bg-[#F6D99A] flex gap-4 absolute bottom-[12vh]">
          <Image
            src="/resultImage.jpg"
            width={200}
            height={100}
            alt="resultImage"
            className="rounded-l-lg"
          />
          <div className="w-full flex flex-col items-center text-[#282828]">
            <h1 className="font-bold text-3xl">Results</h1>
            {usersSpeed
              .filter((userSpeed: userSpeedProps) => userSpeed.speed > 0)
              .sort((a: userSpeedProps, b: userSpeedProps) => b.speed - a.speed)
              .map((userSpeed: userSpeedProps) => {
                const user = users.find(
                  (user: any) => user.id === userSpeed.user.id,
                );
                return (
                  <div className="flex gap-4" key={userSpeed.user.id}>
                    <p className="font-semibold">{userSpeed.user.username}</p>
                    <p>{userSpeed.speed}WPM</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="flex absolute items-center gap-2 bottom-10">
        <span className="bg-[#F6D99A] text-[#282828] text-[13px] p-[2px] px-[5px] font-semibold">
          Enter
        </span>
        <span className="text-[13px]">-</span>
        <span className="text-[13px]">Change the test</span>
      </div>
    </div>
  );
};
