import express from "express"
import { createRoom, joinRoom } from "../controllers/room-controller";
import { UserMiddleware } from "../middlewares/user-middleware";

const router = express.Router()

router.post('/createroom', UserMiddleware, createRoom);
router.post('/joinroom', UserMiddleware,joinRoom);

export default router
