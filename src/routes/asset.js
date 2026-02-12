import { Router } from "express";
import { createAssets, getAssets } from "../controller/asset.js";

const router = Router();

router.post('/asset',createAssets)
router.get("/asset",getAssets);

export default router;
