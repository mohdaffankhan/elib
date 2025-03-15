import express from "express";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// home
app.get('/',(req, res)=>{
    res.json({message:"welcome to elib apis"})
})

// routes
import userRouter from "./user/userRouter";
app.use("/api/v1/users", userRouter); // users routes

import bookRouter from "./book/bookRouter";
app.use("/api/v1/books", bookRouter); // book routes

// global error handler
import globalErrorHandler from "./middlewares/globalErrorHandler";
app.use(globalErrorHandler);

export default app;