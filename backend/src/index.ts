import express from "express";
import cors from "cors";
import db from "./lib/db";
import { WebSocketServer, WebSocket } from "ws";
import authRouter from "./routes/auth-routes";
import roomRouter from "./routes/room-routes";
import dataRouter from "./routes/data-routes";
import challengeRouter from "./routes/challenge-routes"

const app = express();
const httpServer = app.listen(8080);
app.use(express.json());
app.use(cors());


app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/getData", dataRouter);
app.use("/challenge", challengeRouter);
export interface CustomWebSocket extends WebSocket {
  userId?: string;
  roomId?: string;
  words?: string;
}

const wss = new WebSocketServer({ server: httpServer });
export const rooms: { [key: string]: Set<CustomWebSocket> } = {};
app.set('wss', wss);
wss.on("connection", (ws: CustomWebSocket) => {
  ws.on("error", console.error);

  ws.on("message", async (message) => {
    const { action, payload } = JSON.parse(message.toString());
    switch (action) {
      case "joinRoom":
        console.log("someone hopped up");
        const { roomId, userId, word } = payload;
        if (!rooms[roomId]) {
          rooms[roomId] = new Set();
        }
        rooms[roomId].add(ws);
        ws.roomId = roomId;
        ws.userId = userId;
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
        }
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
        rooms[roomId].forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                action: "userJoined",
                payload: {
                  users: users,
                  roomOwner: room?.RoomOwnerId,
                  room: room,
                  words: ws.words
                },
              })
            );
          }
        });
        break;
      case "setWords":
        console.log("someone sent words");
        const { roomid, words } = payload;
        if (words) rooms[words] = words;
        console.log(words);
        if (rooms[roomid]) {
          rooms[roomid].forEach((client) => {
            console.log(client.userId);
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({ action: "getWords", payload: words })
              );
            }
          });
        }
        break;
      case "checking":
        console.log("wroking");
        break;
      case "typingSpeed":
        const { roomId: typingRomId, speed } = payload;
        if (rooms[typingRomId]) {
          rooms[typingRomId].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ userId: ws.userId, speed }));
            }
          });
        }
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

