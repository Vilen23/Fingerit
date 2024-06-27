import express from "express";
import cors from "cors";
import db from "./lib/db";
import { WebSocketServer, WebSocket } from "ws";
import authRouter from "./routes/auth-routes";
import roomRouter from "./routes/room-routes";
import dataRouter from "./routes/data-routes";

const app = express();
const httpServer = app.listen(8080);
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/getData", dataRouter);
export interface CustomWebSocket extends WebSocket {
  userId?: string;
  roomId?: string;
  words?: string;
  speed?: number;
}

const wss = new WebSocketServer({ server: httpServer });
const rooms: { [key: string]: Set<CustomWebSocket> } = {};
wss.on("connection", (ws: CustomWebSocket) => {
  ws.on("error", console.error);

  ws.on("message", async (message) => {
    const { action, payload } = JSON.parse(message.toString());
    try {
      switch (action) {
        case "joinRoom":
          const { roomId, userId, word } = payload;
          if (!rooms[roomId]) {
            rooms[roomId] = new Set();
          }
          rooms[roomId].add(ws);
          ws.roomId = roomId;
          ws.userId = userId;
          ws.speed = 0;
          const roomusers = await db.roomUser.findMany({
            where: {
              roomId: roomId,
            },
          });

          const room = await db.room.findFirst({
            where: {
              id: roomId,
            },
          });

          if (room?.RoomOwnerId === ws.userId) {
            ws.words = word;
            const gametext = await db.room.update({
              where: {
                id: roomId,
              },
              data: {
                gametext: word,
              },
              select: {
                gametext: true,
              },
            });
          }
          const gametext = await db.room.findFirst({
            where: {
              id: roomId,
            },
            select: {
              gametext: true,
            },
          });
          const usersId = roomusers.map((user: any) => user.userId);
          const users = await db.user.findMany({
            where: {
              id: {
                in: usersId,
              },
            },
            select: {
              id: true,
              username: true,
              email: true,
              RoomOwner: true,
            },
          });
          const data: any = {
            users: users,
            roomOwner: room?.RoomOwnerId,
            room: room,
            words: ws.words || gametext?.gametext,
          };
          if (!rooms[roomId]) return;
          rooms[roomId].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  action: "userJoined",
                  payload: data,
                })
              );
            }
          });
          break;
        case "start":
          const roomid = ws.roomId;
          if (roomid && rooms[roomid]) {
            rooms[roomid].forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action: "start" }));
              }
            });
          }
          break;
        case "reload":
          const roomidReload = ws.roomId;
          if (roomidReload && rooms[roomidReload]) {
            rooms[roomidReload].forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action: "reload" }));
              }
            });
          }
          break;
        case "speed":
          const { speed } = payload;
          if (speed) {
            ws.speed = speed;
          }
          if (!ws.roomId) return;
          const usersInChallenge = await db.roomUser.findMany({
            where: {
              roomId: ws.roomId,
            },
          });

          const usersChallenge = await db.user.findMany({
            where: {
              id: {
                in: usersInChallenge.map((user: any) => user.userId),
              },
            },
          });

          const usersInChallengeMap = new Map();
          usersChallenge.map((user: any) => {
            usersInChallengeMap.set(user.id, user);
          });

          const roomDetails = Array.from(rooms[ws.roomId]).map((client) => ({
            speed: client.speed,
            user: usersInChallengeMap.get(client.userId),
          }));

          rooms[ws.roomId].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({ action: "speed", payload: roomDetails })
              );
            }
          });
          break;
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  ws.on("close", () => {
    if (ws.roomId && rooms[ws.roomId]) {
      rooms[ws.roomId].delete(ws);
      if (rooms[ws.roomId].size === 0) {
        delete rooms[ws.roomId];
      }
    }
  });
});
