import path from "node:path";
import express from "express";
import { registerBook } from "./bookController";
import multer from "multer";

// router
const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../src/public/uploads"),
    limits:{ fileSize:  1.05e7 } // 10MB
})

// routes
bookRouter.post("/register",upload.fields([
    {name:"coverImage", maxCount:1},
    {name:"file", maxCount:1}
]), registerBook);

export default bookRouter;