import db from "../lib/db"

export const handleJoin = async (data: any, ws: any) => {
  let room = await db.room.findFirst({
    where: {
      id: data.roomid
    }
  })

  const client = await db.user.findFirst({
    where: {
      id: data.userId
    }
  })
  if (!room || !client) return;
  ws.room = room;
  ws.clientId = client.id;
}
