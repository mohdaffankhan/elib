import { Request, Response, NextFunction } from "express";
import {HttpError} from "http-errors";
import { config } from "../config/config";

const globalErrorHandler =(error:HttpError, req:Request, res:Response, next:NextFunction)=>{
    const statusCode = error.statusCode || 500;
    res
    .status(statusCode)
    .json({
        message:error.message,
        stack:config.env === "development" ? error.stack : ""
    })
    next();
}

export default globalErrorHandler