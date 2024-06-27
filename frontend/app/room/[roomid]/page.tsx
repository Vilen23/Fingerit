"use client";
import { TypingComponent } from "@/components/GameText";
import {
  challengeStartAtom,
  challengeUsers,
  fetchAtom,
  userSpeedChallenge,
} from "@/states/atoms/challenge";
import { roomownerAtom } from "@/states/atoms/roomowner";
import { socketAtom } from "@/states/atoms/socket";
import { letterArrayAtom, wordDataAtom, wordsAtom } from "@/states/atoms/words";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function ChallengeRoom() {
  const session = useSession();
  const [timer, setTimer] = useState(5);
  const [timerStart, setTimerStart] = useState(false);
  const setChallengeStart = useSetRecoilState(challengeStartAtom);
  const intervalRef = useRef<number | undefined>(undefined);
  const [fetch, setFetch] = useRecoilState(fetchAtom);
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [users, setUsers] = useRecoilState(challengeUsers);
  const [wordsData, setWordsData] = useRecoilState(wordDataAtom);
  const [roomOwner, setRoomOwner] = useRecoilState(roomownerAtom);
  const [textstring, setTextstring] = useRecoilState(wordsAtom);
  const [letterarray, setLetterarray] = useRecoilState(letterArrayAtom);
  const [usersSpeed, setUsersSpeed] = useRecoilState(userSpeedChallenge);

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
      socket.send(JSON.stringify({ action: "start" }));
    }
  }, [timerStart, roomOwner, session?.data?.user.id, socket]);

  useEffect(() => {
    let stringtemp = "";
    for (let i = 0; i < 10; i++) {
      let randomIndex = Math.floor(
        Math.random() * wordsData.common_words.length
      );
      stringtemp += wordsData.common_words[randomIndex] + " ";
    }
  }, []);
  
  useEffect(() => {
    const ws = new WebSocket("wss://fingerit.onrender.com");
    setSocket(ws);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: "joinRoom",
          payload: {
            roomId: window.location.pathname.split("/")[2],
            userId: session?.data?.user.id,
            word: "hello this is shivam here",
          },
        })
      );
      console.log("going out");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.action === "userJoined") {
        const payload = data.payload;
        handleuserJoined(payload);
      } else if (data.action === "speed") {
        setUsersSpeed(data.payload);
      }
    };
  }, [session]);

  const handleuserJoined = (payload: any) => {
    setUsers(payload.users);
    setRoomOwner(payload.roomOwner);
    let wordstring = payload.words.trim();
    setTextstring(wordstring);
    let temparray = Array.from(wordstring).map((char: any) => ({
      letter: char,
      color: "text-[#EBDAB4]/50",
    }));
    setLetterarray(temparray);
    setFetch(true);
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.action === "start") {
          setTimerStart(true);
          clearInterval(intervalRef.current); // Clear any existing interval
          setTimer(5); // Reset timer to 5 seconds
          startTimer();
          setTimeout(() => {
            setChallengeStart(true);
          }, 5000);
        } else if (data.action === "reload") {
          window.location.reload();
        }
      };
    }
  }, [socket, setChallengeStart]);

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
      <TypingComponent />
    </div>
  );
}
