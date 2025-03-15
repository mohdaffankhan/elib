import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { config } from "../config/config";
import userModel from "../user/userModel";

export interface authRequest extends Request {
    user?: string;
}

export const authenticate = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");
    console.log("Extracted token", token);
    if(!token) {
        return next(createHttpError(401, "Unauthorized"));
    }

    try {
        const decoded = jwt.verify(token, config.jwt_secret as string);
        console.log("Dcoded token",decoded);
        const user = await userModel.findById(decoded?.sub)
        if (!user) {
            return next(createHttpError(401, "Unauthorized"));
        }
        const authReq = req as authRequest;
        authReq.user = user._id;
        next();
    } catch (error) {
        console.log(error);
        return next(createHttpError(401, "Unauthorized"));
    }
}