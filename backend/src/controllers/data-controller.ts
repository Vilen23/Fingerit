import { Request, Response } from "express";
import { words } from "../data/data";

export const getData = async (req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .json({ message: "Data successfully fetched", words });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
