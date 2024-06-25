"use client";
import React, { useState } from "react";
import { BsDoorClosed } from "react-icons/bs";
import { easeInOut, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

interface RoomProps {
  roomname: string;
  password: string;
}

interface FormTypeProps {
  makeroom: boolean;
  joinroom: boolean;
}

export const MakeRoom = () => {
  const [room, setRoom] = useState<RoomProps>({
    roomname: "",
    password: "",
  });
  const [formtype, setFormtype] = useState<FormTypeProps>({
    makeroom: true,
    joinroom: false,
  });
  const session = useSession();
  const [firstTime, setFirstTime] = useState(false);

  const handleRoomButtonClick = () => {
    if (room.roomname === "" || room.password === "") {
      alert("Please fill in all fields");
      return;
    }
    if (session.data === null) {
      alert("Please login first");
      return;
    }
    makeRoomMutation.mutate(room);
  };

  const makeRoomMutation = useMutation({
    mutationFn: async (room: RoomProps) => {
      if (formtype.makeroom) {
        return await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/room/createroom`,
          {
            name: room.roomname,
            password: room.password,
            userId: session.data?.user.id,
          }
        );
      } else {
        return await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/room/joinroom`,
          {
            name: room.roomname,
            password: room.password,
            userId: session.data?.user.id,
          }
        );
      }
    },
    onSuccess: (data): any => {
      window.location.href = `/room/${data.data.room.id}`;
    },
  });

  const handleChangeForm = () => {
    formtype.makeroom
      ? setFormtype({ makeroom: false, joinroom: true })
      : setFormtype({ makeroom: true, joinroom: false });
    setFirstTime(true);
  };

  return (
    <div className="flex w-full justify-center items-center h-[60vh] flex-col gap-2">
      <motion.button
        key={formtype.makeroom ? "make-room" : "join-room"}
        initial={{ y: "80px", opacity: "0" }}
        animate={{ y: "0", opacity: "1" }}
        transition={{
          duration: 0.5,
          delay: firstTime ? 0 : 0.5,
          type: easeInOut,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="z-10 bg-[#CD4E28] px-3 py-1 rounded-lg shadow-lg text-[#1D2021]"
        onClick={handleChangeForm}
      >
        {!formtype.joinroom ? "Join" : "Make"} Room?
      </motion.button>
      <motion.div
        initial={{ y: "-200px", opacity: "0" }}
        animate={{ y: "0px", opacity: "1" }}
        transition={{
          duration: 0.5,
          type: "spring",
          damping: 20,
          stiffness: 100,
        }}
        exit={{ y: "400px", opacity: "0" }}
        className="flex flex-col gap-4 bg-[#3C3933] rounded-lg p-10 shadow-lg z-20"
      >
        <input
          onChange={(e) => {
            setRoom({ ...room, roomname: e.target.value });
          }}
          value={room.roomname}
          key="roomname"
          type="text"
          placeholder="room name"
          className="bg-[#282828] px-2 rounded-lg  focus:outline-none py-1"
        />
        <input
          onChange={(e) => {
            setRoom({ ...room, password: e.target.value });
          }}
          value={room.password}
          key="password"
          type="password"
          placeholder={formtype.makeroom ? "set password" : "room password"}
          className="bg-[#282828] px-2 rounded-lg focus:outline-none py-1"
        />
        <motion.button
          key={formtype.makeroom ? "make-room" : "join-room"}
          onClick={handleRoomButtonClick}
          initial={{ y: "-50px", opacity: "0" }}
          animate={{ y: "0", opacity: "1" }}
          transition={{
            duration: 0.5,
            type: "easeInOut",
            delay: firstTime ? 0 : 0.3,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="flex gap-2 justify-center bg-[#282828] py-1 rounded-lg items-center"
        >
          <BsDoorClosed className="text-[#CD4E28] font-bold " />
          {formtype.makeroom ? "Make" : "Join"} Room
        </motion.button>
        {makeRoomMutation.isError && (
          <p className="text-sm text-red-500 text-center font-semibold lowercase">
            {
              //@ts-ignore
              makeRoomMutation.error.response.data.error
            }
          </p>
        )}
      </motion.div>
    </div>
  );
};
