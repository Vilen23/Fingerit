import { Request, Response } from "express";
import db from "../lib/db";
import bcrypt from "bcryptjs";
import { roomInputs } from "../validation/room-validation";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;
    //@ts-ignore
    const user = req.user;

    const { success } = roomInputs.safeParse(req.body);
    if (!success) return res.status(409).json({ error: "Invalid Inputs" });
    const checkRoom = await db.room.findFirst({
      where: {
        name: name,
      },
    });
    if (checkRoom)
      return res.status(409).json({ error: "Room already exists" });
    const hashPassword = await bcrypt.hash(password, 10);
    const room = await db.room.create({
      data: {
        name,
        password: hashPassword,
        RoomOwnerId: user.id,
      },
    });
    const roomuser = await db.roomUser.create({
      data: {
        userId: user.id,
        roomId: room.id,
      },
    });
    return res
      .status(201)
      .json({ message: "Successfully made the room", room: room });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;
    const { success } = roomInputs.safeParse(req.body);
    if (!success) return res.status(409).json({ error: "Invalid Inputs" });
    //@ts-ignore
    const user = req.user;
    const roomCheck = await db.room.findFirst({
      where: {
        name: name,
      },
    });
    if (!roomCheck) return res.status(409).json({ error: "Room not found" });

    const checkPassword = await bcrypt.compare(password, roomCheck.password);
    if (!checkPassword)
      return res.status(401).json({ error: "Invalid Password" });

    const roomuser = await db.roomUser.create({
      data: {
        userId: user.id,
        roomId: roomCheck.id,
      },
    });
    return res
      .status(201)
      .json({ message: "Room joined successfully", room: roomCheck });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
