"use client";
import { resultAtom } from "@/states/atoms/result";
import { wordsAtom } from "@/states/atoms/words";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

interface LetterProps {
  letter: string;
  color: string;
}

export default function TypingComponent() {
  const router = useRouter();
  const [speed, setSpeed] = useState(0);
  const [arraySize, setArraySize] = useState(0);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [correctInput, setCorrectInput] = useState(0);
  const [result, setResult] = useRecoilState(resultAtom);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [letterarray, setLetterarray] = useState<LetterProps[]>([]);
  const textstring = useRecoilValue(wordsAtom);
  const [rawspeed, setRawSpeed] = useState(0);
  useEffect(() => {
    let temparray = Array.from(textstring).map((char) => ({
      letter: char,
      color: "text-[#EBDAB4]/30",
    }));
    setLetterarray(temparray);
    let temparray2 = textstring.split(" ");
    setArraySize(temparray2.length);
  }, [textstring]);

  const calculateWPM = (inputLength: number) => {
    if (startTime) {
      const currentTime = new Date().getTime();
      const timeElapsed = (currentTime - startTime) / 1000 / 60;
      const wordsTyped = inputLength / 5;
      const wpm = wordsTyped / timeElapsed;
      setSpeed(Math.max(0, Math.round(wpm)));
    }
  };

  useEffect(() => {
    if (cursorIndex === textstring.length) {
      let accuracy = (correctInput / textstring.length) * 100;
      const curr = new Date().getTime();
      if (!startTime) return;
      const timeElapsed = (curr - startTime) / 1000 / 60;
      const rawspeed = Math.max(
        0,
        Math.round(textstring.length / 5 / timeElapsed)
      );
      setResult({
        accuracy: accuracy.toFixed(2),
        speed: speed.toString(),
        rawspeed: rawspeed.toString(),
      });
      router.push("/result");
    }
  }, [cursorIndex]);

  const handleInputChange = (event: any) => {
    let ans = event.target.value;
    let lengthofinput = event.target.value.length;
    if (lengthofinput === 1 && !startTime) {
      setStartTime(new Date().getTime());
    }
    let newCorrectInput = 0;
    const newarray = letterarray.map(
      (item: LetterProps, index: number): LetterProps => {
        if (index < lengthofinput) {
          if (textstring[index] === ans[index]) {
            newCorrectInput++;
            setCursorIndex(index + 1);
            return { ...item, color: "text-[#EBDAB4]" };
          } else {
            setCursorIndex(index + 1);
            return { ...item, color: "text-red-500" };
          }
        } else {
          return { ...item, color: "text-[#EBDAB4]/30" };
        }
      }
    );
    setCorrectInput(newCorrectInput);
    calculateWPM(newCorrectInput);
    setLetterarray(newarray);
  };

  const handleKeyPresses = (event: any) => {
    if (event.key === "Backspace") {
      event.preventDefault(); 
    }
  };

  return (
    <div className="flex justify-center items-center flex-col h-[60vh]">
      <div className="text-[40px] relative w-[80vw]">
        {letterarray.map((word, index) => (
          <span key={index} className={`${word.color} relative`}>
            <span className="absolute top-2">
              {index === cursorIndex && "_"}
            </span>
            {word.letter}
          </span>
        ))}
      </div>
      <input
        autoFocus
        type="text"
        placeholder=""
        onKeyDown={handleKeyPresses}
        onChange={handleInputChange} 
        className="mt-4 p-2 border-0 bg-[#1D2021] rounded opacity-100 w-[80vw]"
      />
      <div className="text-2xl mt-5">{speed} - WPM</div>
    </div>
  );
}
