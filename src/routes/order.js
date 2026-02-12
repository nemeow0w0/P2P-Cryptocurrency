import { Router } from "express";
import { cancelOrders, createOrder, getOrders, updateOrders } from "../controller/order.js";
import { auth } from "../middleware/authCheck.js";

const router = Router();

router.post("/orders", auth, createOrder); 
router.get("/orders", getOrders); 
router.put("/orders", auth, updateOrders); 
router.patch("/order/cancel", auth, cancelOrders);

export default router;
