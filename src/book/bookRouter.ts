import express from "express";
import { registerBook, updateBook, listBooks } from "./bookController";
import {upload} from "../config/multer";
import { authenticate } from "../middlewares/authenticate";

// router
const bookRouter = express.Router();

// routes
bookRouter.post("/register",
    authenticate,
    upload.fields([
    {name:"coverImage", maxCount:1},
    {name:"file", maxCount:1}
]), registerBook);

bookRouter.patch("/:bookId",
    authenticate,
    upload.fields([
    {name:"coverImage", maxCount:1},
    {name:"file", maxCount:1}
]), updateBook);

bookRouter.get("/", listBooks);

export default bookRouter;