import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes defined
import bookingRouter from "./routes/booking.route.js";
import stationRouter from "./routes/station.route.js";
import paymentRouter from "./routes/payment.routes.js";

app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/station", stationRouter);
app.use("/api/v1/payment", paymentRouter);

export { app };
