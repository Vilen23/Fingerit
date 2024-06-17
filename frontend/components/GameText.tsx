"use client";
import { useEffect, useState } from "react";

interface LetterProps {
  letter: string;
  color: string;
}

export default function TypingComponent() {
  const [textstring, setTextstring] = useState(
    "The quick fox jump over the fence"
  );
  const [letterarray, setLetterarray] = useState<LetterProps[]>([]);
  const [speed, setSpeed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [correctInput, setCorrectInput] = useState(0);
  const [arraySize, setArraySize] = useState(0);
  const [cursorIndex, setCursorIndex] = useState(0);

  useEffect(() => {
    let temparray = Array.from(textstring).map((char) => ({
      letter: char,
      color: "text-gray-500",
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
            return { ...item, color: "text-white" };
          } else {
            setCursorIndex(index+1);
            return { ...item, color: "text-red-500" };
          }
        } else {
          return { ...item, color: "text-gray-500" };
        }
      }
    );
    setCorrectInput(newCorrectInput);
    calculateWPM(newCorrectInput);
    setLetterarray(newarray);
  };

  console.log(cursorIndex);


  return (
    <div className="flex justify-center items-center flex-col h-[70vh]">
      <div className="text-[40px] relative">
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
        onChange={handleInputChange}
        className="mt-4 p-2 border rounded opacity-0 absolute"
        style={{ width: "80%" }}
      />
      <div className="text-white">{speed}</div>
    </div>
  );
}
