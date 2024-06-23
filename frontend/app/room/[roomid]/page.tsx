"use client";
import GameText from "@/components/GameText";
import { challengeUsers } from "@/states/atoms/challenge";
import { roomownerAtom } from "@/states/atoms/roomowner";
import { challengeAtom } from "@/states/atoms/words";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { useRecoilState } from "recoil";

export default function () {
  const session = useSession();
  const [users, setUsers] = useRecoilState(challengeUsers);
  const [roomOwner, setRoomOwner] = useRecoilState(roomownerAtom);


  return (
    <div className="flex justify-center flex-col items-center">
      <div className="bg-[#1C2022] flex gap-10 rounded-lg items-center w-fit h-[40px] px-10">
        {users.map((user: any) => {
          return (
            <p key={user.id} className="flex items-center gap-2">
              {user.username}
              {roomOwner === user.id && <FaCrown />}
            </p>
          );
        })}
      </div>
      <GameText />
    </div>
  );
}
