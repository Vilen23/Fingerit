"use client"
import { useEffect, useState } from 'react'

interface LetterProps {
  letter: string;
  color: string;
}

export default function TypingComponent() {
  const [textstring, setTextstring] = useState("The quick fox jump over the fence")
  const [letterarray, setLetterarray] = useState<LetterProps[]>([])

  useEffect(() => {
    const temparray = Array.from(textstring).map(char => ({ letter: char, color: "text-gray-500" }));
    setLetterarray(temparray);
  }, [textstring])

  const handleInputChange = (event: any) => {
    let ans = event.target.value;
    let lengthofinput = event.target.value.length;

    const newarray = letterarray.map((item: LetterProps, index: number): LetterProps => {
      if (index < lengthofinput) {
        if (textstring[index] === ans[index]) {
          return { ...item, color: "text-white" };
        } else {
          return { ...item, color: "text-red-500" };
        }
      } else {
        return { ...item, color: "text-gray-500" };
      }
    });

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
    </div>
  )
}

