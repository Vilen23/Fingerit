import Image from "next/image";
import React from "react";
interface ResultProps {
  accuracy: string;
  speed: string;
  rawspeed: string;
}
export const ResultCard = ({ accuracy, speed, rawspeed }: ResultProps) => {
  return (
    <div className="w-[600px] rounded-lg h-[200px] bg-[#F6D99A] flex items-center gap-4">
      <Image
        src="/resultImage.jpg"
        width={200}
        height={100}
        alt="resultImage"
        className=" rounded-l-lg"
      />
      <div className="flex flex-col text-2xl font-bold text-[#282828] justify-center">
        <p>Speed: {speed} WPM</p>
        <p>Raw Speed: {rawspeed} WPM</p>
        <p>Accuracy: {accuracy}%</p>
      </div>
    </div>
  );
};
