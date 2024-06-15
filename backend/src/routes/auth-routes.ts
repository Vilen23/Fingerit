import express from "express"
import { signin, signup } from "../controllers/auth-controller";
const router = express.Router();

router.post('/signup', signup);
router.get('/signin', signin);

export default router
