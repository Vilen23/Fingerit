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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function ChallengeRoom() {
  const session = useSession();
  const [words, setWords] = useState("");
  const [timer, setTimer] = useState(5);
  const [timerStart, setTimerStart] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [users, setUsers] = useRecoilState(challengeUsers);
  const [roomOwner, setRoomOwner] = useRecoilState(roomownerAtom);
  const wordsData = useRecoilValue(wordDataAtom);
  const setFetch = useSetRecoilState(fetchAtom);
  const setTextstring = useSetRecoilState(wordsAtom);
  const setLetterarray = useSetRecoilState(letterArrayAtom);
  const setUsersSpeed = useSetRecoilState(userSpeedChallenge);
  const setChallengeStart = useSetRecoilState(challengeStartAtom);
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
    setWords(stringtemp);
  }, []);

  useEffect(() => {
    const roomId = window.location.pathname.split("/")[2];
    const userId = session?.data?.user.id;
    if (!userId) return;
    const createWebSocket = () => {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            action: "joinRoom",
            payload: {
              roomId: roomId,
              userId: userId,
              word: words,
            },
          })
        );
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.action === "userJoined") {
          const payload = data.payload;
          handleUserJoined(payload);
        } else if (data.action === "speed") {
          setUsersSpeed(data.payload);
        } else if (data.action === "start") {
          setTimerStart(true);
          clearInterval(intervalRef.current);
          setTimer(5);
          setTimeout(() => {
            setChallengeStart(true);
          }, 5000);
          startTimer();
        } else if (data.action === "reload") {
          window.location.reload();
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      setSocket(ws);
    };

    if (!socket) {
      createWebSocket();
    }
  }, [session]);

  const handleUserJoined = (payload: any) => {
    setUsers(payload.users);
    setRoomOwner(payload.roomOwner);
    let wordString = payload.words.trim();
    setTextstring(wordString);
    let tempArray = Array.from(wordString).map((char: any) => ({
      letter: char,
      color: "text-[#EBDAB4]/50",
    }));
    setLetterarray(tempArray);
    setFetch(true);
  };

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
              clearInterval(intervalRef.current);
              setTimer(5);
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
