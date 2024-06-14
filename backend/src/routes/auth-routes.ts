import express from "express"
const router = express.Router();

router.post('/signup', signup);
router.get('/signin', signin);

export default router
