import express from "express"
import authRouter from "./routes/auth-routes"
import roomRouter from "./routes/room-routes"
import { WebSocketServer } from "ws";
import cors from "cors"


const app = express();
const httpServer = app.listen(8080)
app.use(express.json());
app.use(cors());


export const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
})

app.use('/auth', authRouter);
app.use('/room', roomRouter);



