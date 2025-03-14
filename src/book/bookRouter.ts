import express from "express";
import { registerBook } from "./bookController";

// router
const bookRouter = express.Router();

// routes
bookRouter.post("/register", registerBook);

export default bookRouter;