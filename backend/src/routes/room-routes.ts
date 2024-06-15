import express from "express"
import { createRoom, joinRoom } from "../controllers/room-controller";

const router = express.Router()

router.post('/createroom', createRoom);
router.get('/joinroom', joinRoom);

export default router
