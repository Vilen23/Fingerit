"use client";
import { TypingComponent } from "@/components/GameText";
import { MakeRoom } from "@/components/MakeRoom";
import { preferenceAtom } from "@/states/atoms/preference";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

export default function Page() {
  const preference = useRecoilValue(preferenceAtom);
  const session = useSession();
  return (
    <div>
      {preference.mode === "challenge" ? <MakeRoom /> : <TypingComponent />}
    </div>
  );
}
