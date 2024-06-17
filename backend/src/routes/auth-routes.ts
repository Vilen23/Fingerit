import express from "express";
import { googleSignup, signin, signup } from "../controllers/auth-controller";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signup/google", googleSignup);

export default router;
