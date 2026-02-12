import { Router } from "express";
import { createTrade, getTrade } from "../controller/trade.js";
import { auth } from "../middleware/authCheck.js";

const router = Router();

router.post("/trade", auth, createTrade);
router.get("/trade",auth, getTrade);

export default router;
