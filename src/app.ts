import express from "express";
import { config } from "./config/config";
import cors from "cors";

const app = express();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: config.cors_origin,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// home
app.get("/", (req, res) => {
  res.json({ message: "welcome to elib apis" });
});

// routes
import userRouter from "./user/userRouter";
app.use("/api/v1/users", userRouter); // users routes

import bookRouter from "./book/bookRouter";
app.use("/api/v1/books", bookRouter); // book routes

// global error handler
import globalErrorHandler from "./middlewares/globalErrorHandler";
app.use(globalErrorHandler);

export default app;
