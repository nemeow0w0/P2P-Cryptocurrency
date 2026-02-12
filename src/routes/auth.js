import { Router } from "express";
import { getprofile, login, register } from "../controller/auth.js";
import { auth } from "../middleware/authCheck.js";


const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile",auth, getprofile);

export default router;
