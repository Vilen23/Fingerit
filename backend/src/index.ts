import express from "express";
import cors from "cors";
import db from "./lib/db";
import { WebSocketServer, WebSocket } from "ws";
import authRouter from "./routes/auth-routes";
import roomRouter from "./routes/room-routes";
import dataRouter from "./routes/data-routes";

const app = express();
const httpServer = app.listen(8080);
app.use(express.json());
app.use(cors());

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
export const rooms: { [key: string]: Set<CustomWebSocket> } = {};
app.set("wss", wss);
wss.on("connection", (ws: CustomWebSocket) => {
  ws.on("error", console.error);

  ws.on("message", async (message) => {
    const { action, payload } = JSON.parse(message.toString());
    switch (action) {
      case "joinRoom":
        console.log("hopped up")
        const { roomId, userId, word } = payload;
        if (!rooms[roomId]) {
          rooms[roomId] = new Set();
        }
        // Array.from(rooms[roomId]).forEach((client) => {
        //   if (client.userId === userId && client.readyState === WebSocket.OPEN) {
        //     client.close();
        //     rooms[roomId].delete(client)
        //   }
        // })

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
              gametext: true
            }
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
        const usersId = roomusers.map((user) => user.userId);
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
        if (!rooms[roomId]) return;
        console.log(rooms[roomId].size);

        rooms[roomId].forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                action: "userJoined",
                payload: {
                  users: users,
                  roomOwner: room?.RoomOwnerId,
                  room: room,
                  words: ws.words || gametext?.gametext,
                },
              })
            );
          }
        });
        break;
      case "start":
        const roomid = ws.roomId;
        if (roomid && rooms[roomid]) {
          rooms[roomid].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
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
        const usersInChallengeMap = new Map();
        usersInChallenge.map((user) => {
          usersInChallengeMap.set(user.userId, user);
        });
        console.log(usersInChallengeMap)
        const roomDetails = Array.from(rooms[ws.roomId]).map((client) => ({
          speed: client.speed,
          user: usersInChallengeMap.get(client.userId),
        }));
        console.log(roomDetails)
        rooms[ws.roomId].forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ action: "speed", payload: roomDetails })
            );
          }
        });
        break;
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


