import express from "express"
import authRouter from "./routes/auth-routes"
import roomRouter from "./routes/room-routes"
import { WebSocketServer, WebSocket } from "ws";
import dataRouter from "./routes/data-routes"
import cors from "cors"

const app = express();
const httpServer = app.listen(8080)
app.use(express.json());
app.use(cors());

export interface CustomWebSocket extends WebSocket {
  userId?: string;
  roomId?: string;
}

export const wss = new WebSocketServer({ server: httpServer });


app.use('/auth', authRouter);
app.use('/room', roomRouter);
app.use('/getData', dataRouter);


