import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { nearbyStation } from "../controllers/station.controller.js";
const router = Router();

router.route("/get-stations").post(nearbyStation);

export default router;