import { Router } from "express";
import { bookSlot } from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/book").post(verifyJWT,bookSlot);

export default router;
