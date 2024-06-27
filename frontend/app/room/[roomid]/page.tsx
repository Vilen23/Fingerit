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
    const createWebSocket = () => {
      const ws = new WebSocket("wss://fingerit.onrender.com");
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
        console.log("WebSocket connection established.");
      };

      ws.onmessage = (event) => {
        console.log("Message received");
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.action === "userJoined") {
          const payload = data.payload;
          handleUserJoined(payload);
        } else if (data.action === "speed") {
          setUsersSpeed(data.payload);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed, attempting to reconnect...");
        setTimeout(() => {
          createWebSocket();
        }, 3000); // Attempt to reconnect after 3 seconds
      };

      setSocket(ws);
    };

    createWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
      setSocket(null);
    };
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
