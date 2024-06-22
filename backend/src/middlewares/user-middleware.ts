import { Request, Response, NextFunction } from "express";
import db from "../lib/db";

export const UserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(409).json({ error: "Invalid request" });
    const finduser = await db.user.findFirst({
      where: {
        id: userId
      }
    })
    if (!finduser) return res.status(404).json({ error: "Unauthorized request" });
    req.user = finduser;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
