import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const registerUser = async (req:Request, res:Response, next:NextFunction) => {
    //validation
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    
    res.json({message:"user registered"});
}

export {registerUser}