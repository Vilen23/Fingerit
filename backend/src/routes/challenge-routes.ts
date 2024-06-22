import express from "express"
import { putchallenge } from "../controllers/challenge-controller";
const router = express.Router();

router.post("/put",putchallenge)

export default router