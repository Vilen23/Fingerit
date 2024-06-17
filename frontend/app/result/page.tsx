"use client";
import { resultAtom } from "@/states/atoms/result";
import React from "react";
import { useRecoilValue } from "recoil";

export default function page() {
  const result = useRecoilValue(resultAtom);

  return (
    <div>
      <h1>Result</h1>
      <h2>Accuracy: {result.accuracy}</h2>
      <h2>Speed: {result.speed}</h2>
      <h2>Raw Speed: {result.rawspeed}</h2>
    </div>
  );
}
