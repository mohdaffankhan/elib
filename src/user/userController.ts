import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "./userModel";
import bcrypt from "bcrypt";

const registerUser = async (req:Request, res:Response, next:NextFunction) => {
    //validation
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    const user = await User.findOne({email});
    if(user) {
        const error = createHttpError(400, "User already exists");
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    

    
    res.json({message:"user registered"});
}

export {registerUser}