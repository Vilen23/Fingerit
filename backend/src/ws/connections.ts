import { wss } from "../index";
import db from "../lib/db";
import { handleJoin } from "./connection-controllers";
wss.on('connection', (ws) => {
  ws.on('erorr', console.error);

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());

    switch (data.type) {
      case 'join_room':
        handleJoin(data, ws);
        break;
    }
  })
})

