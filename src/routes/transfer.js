import { Router } from "express";
import { getTransferHistory, transferAsset } from "../controller/transfer.js";
import { auth } from "../middleware/authCheck.js";

const router = Router();

router.post("/transfer",auth, transferAsset);
router.get("/transferHistory",auth, getTransferHistory);

export default router;
