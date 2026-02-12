import { Router } from "express";
import { createWallets, getWallets } from "../controller/wallet.js";
import { auth } from "../middleware/authCheck.js";

const router = Router();

router.post("/wallet",auth,createWallets);
router.get("/wallet",auth,getWallets);

export default router;
