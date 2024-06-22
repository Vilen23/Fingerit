import { Request, Response } from "express";
import db from "../lib/db";
import WebSocket from "ws";
import { rooms } from "..";
export const putchallenge = async (req: Request, res: Response) => {
  try {
    const { word, roomId } = req.body;
    const wss: WebSocket.Server = req.app.get("wss");
    const insert = await db.room.update({
      where: {
        id: roomId,
      },
      data: {
        gametext: word,
      },
    });
    rooms[roomId].forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              action: "getWords",
              payload:word
            })
          );
        }
      });
    return res.status(200).json({message:"Successfully started the challenege"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
