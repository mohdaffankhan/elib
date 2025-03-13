import express from "express";
import { registerUser } from "./userController";

// router
const userRouter = express.Router();

// routes
userRouter.post("/register", registerUser);

export default userRouter;