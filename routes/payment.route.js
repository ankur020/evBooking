import { Router } from "express";
import { createPayment , completePayment} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-payment").post(verifyJWT,createPayment);
router.route("/complete-payment").post(verifyJWT,completePayment);

export default router;
