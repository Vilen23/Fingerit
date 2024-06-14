"use client"
import { useEffect, useState } from 'react'

interface LetterProps {
  letter: string;
  color: string;
}

export default function TypingComponent() {
  const [textstring, setTextstring] = useState("The quick fox jump over the fence")
  const [letterarray, setLetterarray] = useState<LetterProps[]>([])
  const [speed, setSpeed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [correctInput, setCorrectInput] = useState(0);
  const [arraySize, setArraySize] = useState(0);



  useEffect(() => {
    let temparray = Array.from(textstring).map(char => ({ letter: char, color: "text-gray-500" }));
    setLetterarray(temparray);
    let temparray2 = textstring.split(" ");
    setArraySize(temparray2.length);
  }, [textstring])


  const calculateWPM = (inputLength: number) => {
    if (startTime) {
      const currentTime = new Date().getTime();
      const timeElapsed = (currentTime - startTime) / 1000 / 60;
      const wordsTyped = inputLength / arraySize;
      const wpm = wordsTyped / timeElapsed;
      setSpeed(Math.max(0, Math.round(wpm)));
    }
  }


  const handleInputChange = (event: any) => {
    let ans = event.target.value;
    let lengthofinput = event.target.value.length;

    if (lengthofinput === 1 && !startTime) {
      setStartTime(new Date().getTime());
    }

    const newarray = letterarray.map((item: LetterProps, index: number): LetterProps => {
      if (index < lengthofinput) {
        if (textstring[index] === ans[index]) {
          setCorrectInput(correctInput + 1);
          return { ...item, color: "text-white" };

        } else {
          setCorrectInput(correctInput - 1);
          return { ...item, color: "text-red-500" };
        }
      } else {
        return { ...item, color: "text-gray-500" };
      }
    });
    calculateWPM(correctInput);
    setLetterarray(newarray);
  }

  return (
    <div className='flex justify-center items-center flex-col'>
      <div className='text-3xl font-bold relative'>
        {letterarray.map((word, index) => (
          <span key={index} className={word.color}>
            {word.letter}
          </span>
        ))}

      </div>
      <input
        type='text'
        placeholder=''
        onChange={(e) => handleInputChange(e)}
        className="mt-4 p-2 border rounded opacity-0 absolute"
        style={{ width: '80%' }}
      />
      <div className='text-white'>
        {speed}
      </div>
    </div>
  )
}

