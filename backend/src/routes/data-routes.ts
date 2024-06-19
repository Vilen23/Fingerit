import express from "express";
import { getData } from "../controllers/data-controller";
const router = express.Router();

router.get("/", getData);

export default router;
