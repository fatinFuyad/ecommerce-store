/*eslint-disable*/
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";

import { fileURLToPath } from "url";
import { connectDB } from "./backend/lib/connectDB.js";
import { analyticsRouter } from "./backend/routes/analyticsRouter.js";
import { authRouter } from "./backend/routes/authRouter.js";
import { cartRouter } from "./backend/routes/cartRouter.js";
import { couponRouter } from "./backend/routes/couponRouter.js";
import { paymentRouter } from "./backend/routes/paymentRouter.js";
import { productRouter } from "./backend/routes/productRouter.js";
import { userRouter } from "./backend/routes/userRouter.js";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser()); // allows to parse cookie from the the incoming request ℹ️
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:5000"
    ],
    credentials: true // so we can send cookies or auth headers in the request and handle authentication
  })
);

// Handling Routes
app.get("/api/hello", (req, res) => {
  res.send("Hello from Ecommerce API 🛒");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/analytics", analyticsRouter);

// console.log({ __dirname: path.dirname(fileURLToPath(import.meta.url)) });
/////

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // any other routes will be handled by the fronted <BrowserRouter>
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use((error, req, res, next) => {
  console.log(`⚠️ Error ${error.message}`);
  res.status(500).json({
    status: "Server Error",
    message: "⚠️ Something went wrong in Server!"
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  connectDB();
  console.log(
    `APP IS RUNNING ON ${process.env.NODE_ENV.toUpperCase()} PORT: ${port} 🖥️`
  );
});
