import express from "express";
import { registerUser, loginUser } from "./userController";

// router
const userRouter = express.Router();

// routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;