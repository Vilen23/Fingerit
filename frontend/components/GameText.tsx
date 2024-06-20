"use client";
import { resultAtom } from "@/states/atoms/result";
import { isDataAtom, wordDataAtom, wordsAtom } from "@/states/atoms/words";
import { useEffect, useRef, useState } from "react";
import { selector, useRecoilState, useRecoilValue } from "recoil";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  charCustomAtom,
  customReadyAtom,
  preferenceAtom,
} from "@/states/atoms/preference";
import "./cursorblink.css";
import ResultCard from "./ResultCard";
interface LetterProps {
  letter: string;
  color: string;
}

export default function TypingComponent() {
  const session = useSession();
  const [fetch, setFetch] = useState(false);
  const [maxWrong, setMaxWrong] = useState(0);
  const [totaltype, setTotaltype] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [wrongInputs, setwrongInputs] = useState(0);
  const preference = useRecoilValue(preferenceAtom);
  const [correctInput, setCorrectInput] = useState(0);
  const [isgameOver, setIsgameOver] = useState(false);
  const [result, setResult] = useRecoilState(resultAtom);
  const [isData, setIsData] = useRecoilState(isDataAtom);
  const [textstring, setTextstring] = useRecoilState(wordsAtom);
  const [wordsData, setWordsData] = useRecoilState(wordDataAtom);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [letterarray, setLetterarray] = useState<LetterProps[]>([]);
  const [charCustom, setCharCustom] = useRecoilState(charCustomAtom);
  const [customReady, setCustomReady] = useRecoilState(customReadyAtom);

  //Fetching the words from the backend and setting them into recoil state and persisting it into local storage
  useEffect(() => {
    if (session.data && !isData) {
      const getData = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getData`
        );
        if (response.status === 200) {
          setWordsData(response.data.words);
          setIsData(true);
        }
      };
      getData();
    }
  }, [session, isData]);

  //Generating the words for the test
  useEffect(() => {
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
    } else if (preference.mode === "time") {
      for (let i = 0; i < common_words.length; i++) {
        let randomIndex = Math.floor(Math.random() * common_words.length);
        stringtemp += common_words[randomIndex] + " ";
      }
    } else if (preference.mode === "custom" && customReady) {
      let char = charCustom;
      let characters = char.split("");
      const filteredWords = common_words.filter((word:any) =>
        characters.some((char) => word.includes(char))
      );
    
      // Shuffle the filteredWords array
      for (let i = filteredWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredWords[i], filteredWords[j]] = [filteredWords[j], filteredWords[i]];
      }
    
      const maxWords = Math.min(filteredWords.length, characters.length * 10);
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
  }, [session.data, preference, fetch, customReady]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [preference]);

  const handleInputChange = (event: any) => {
    let ans = event.target.value;
    let lengthofinput = event.target.value.length;
    if (lengthofinput === 1 && !startTime) {
      setStartTime(new Date().getTime());
    }
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
      }
    );
    setCorrectInput(newCorrectInput);
    setLetterarray(newarray);
    setwrongInputs(newWrongInput);

    if (cursorIndex === textstring.length - 1) {
      if (!startTime) return;
      const curr = new Date().getTime();
      const accuracy =
        ((textstring.length - maxWrong - 1) / (textstring.length - 1)) * 100;
      const timeElapsed = (curr - startTime) / 1000 / 60;
      const rawspeed = Math.max(0, Math.round(totaltype / 5 / timeElapsed));
      const wordsTyped = correctInput / 5;
      const wpm = wordsTyped / timeElapsed;
      const speed = Math.max(0, Math.round(wpm));

      setResult({
        accuracy: accuracy.toFixed(2),
        speed: speed.toString(),
        rawspeed: rawspeed.toString(),
      });
      setIsgameOver(true);
    }
  };

  const handleKeyPresses = (event: any) => {
    if (event.key === "Tab") {
      event.preventDefault();
    }
    if (event.key === "Enter") {
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

  if(!session || !session.data) return <div>Loading....</div>

  return (
    <div className="flex justify-center items-center flex-col h-[60vh]">
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
        type="text"
        placeholder=""
        onKeyDown={handleKeyPresses}
        onChange={handleInputChange}
        className="mt-4 p-2 border-0 rounded absolute opacity-0 h-[60vh] w-[80vw] "
      />
      {isgameOver && (
        <div className="absolute bottom-[200px]">
          <ResultCard
            accuracy={result.accuracy}
            speed={result.speed}
            rawspeed={result.rawspeed}
          />
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
}
