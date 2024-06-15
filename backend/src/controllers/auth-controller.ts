import { Request, Response } from "express"
import db from "../lib/db";
import bcrypt from "bcryptjs"
import { signInInput, signUpInput } from "../validation/auth-validation";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const { success } = signUpInput.safeParse(req.body);
    if (!success) return res.status(409).json({ error: "Invalid format of inputs" });

    const ifUser = await db.user.findFirst({
      where: {
        username: username
      }
    })
    if (ifUser) return res.status(409).json({ error: "Username is already taken" })

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        username: username,
        email: email || "",
        password: hashPassword
      }
    })
    return res.status(201).json({ message: "User successfully created" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const signin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const { success } = signInInput.safeParse(req.body);
    if (!success) return res.status(409).json({ error: "Invalid format of inputs" })

    const isUser = await db.user.findFirst({
      where: {
        username
      }
    })
    if (!isUser) return res.status(409).json({ error: "Wrong username/password" });

    const checkPassword = await bcrypt.compare(password, isUser.password);
    if (!checkPassword) return res.status(409).json({ error: "Wrong username/password" });

    return res.status(201).json({ message: "User successfully signed in" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" })
  }
}