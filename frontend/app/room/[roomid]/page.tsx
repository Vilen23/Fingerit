"use client";
import GameText from "@/components/GameText";
import { challengeStartAtom, challengeUsers } from "@/states/atoms/challenge";
import { roomownerAtom } from "@/states/atoms/roomowner";
import { socketAtom } from "@/states/atoms/socket";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

//TODO : undefined on first login or router push to practise

export default function ChallengeRoom() {
  const session = useSession();
  const [timer, setTimer] = useState(5);
  const [timerStart, setTimerStart] = useState(false);
  const socket = useRecoilValue(socketAtom);
  const [users, setUsers] = useRecoilState(challengeUsers);
  const [roomOwner, setRoomOwner] = useRecoilState(roomownerAtom);
  const setChallengeStart = useSetRecoilState(challengeStartAtom);
  const intervalRef = useRef<number | undefined>(undefined);

  const startTimer = () => {
    intervalRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (
      socket?.OPEN &&
      socket.readyState === 1 &&
      session?.data?.user.id === roomOwner &&
      timerStart
    ) {
      console.log("jara hai bro");
      socket.send(JSON.stringify({ action: "start" }));
    }
  }, [timerStart]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("ara hai bro");
        console.log(data);
        if (data.action === "start") {
          setTimerStart(true);
          clearInterval(intervalRef.current); // Clear any existing interval
          setTimer(5); // Reset timer to 5 seconds
          startTimer();
          setTimeout(() => {
            setChallengeStart(true);
          }, 5000);
        } else if (data.action === "reload") {
          console.log("sadff")
          window.location.reload();
        }
      };
    }
  }, [socket]);

  if (!session?.data?.user) return <div>Loading...</div>;
  return (
    <div className="flex justify-center flex-col items-center">
      <div className="flex items-center gap-4">
        <div className="bg-[#1C2022] flex gap-10 rounded-lg items-center w-fit h-[40px] px-10">
          {users.map((user: any) => {
            return (
              <p
                key={user.id}
                className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                {user.username}
                {roomOwner === user.id && <FaCrown />}
              </p>
            );
          })}
        </div>
        {session?.data?.user.id === roomOwner && !timerStart && (
          <button
            className="bg-[#1C2022] px-3 py-2 rounded-lg font-semibold shadow-3xl"
            onClick={() => {
              setTimerStart(true);
              clearInterval(intervalRef.current); // Clear any existing interval
              setTimer(5); // Reset timer to 5 seconds
              startTimer();
            }}
          >
            Start
          </button>
        )}
        {!timerStart && session.data.user.id !== roomOwner && (
          <button className="bg-[#1C2022] px-3 py-2 rounded-lg font-semibold shadow-3xl">
            Wait for owner
          </button>
        )}
        {timerStart && <p className="text-white">{timer}s</p>}
      </div>
      <GameText />
    </div>
  );
}
