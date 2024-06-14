import express from "express"

const router = express.Router()

router.post('/createroom', createRoom);
router.get('/joinroom', joinRoom);

export default router
