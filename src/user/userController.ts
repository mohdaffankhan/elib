import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const registerUser = async (req:Request, res:Response, next:NextFunction) => {
    //validation
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    try {
        const user = await userModel.findOne({email});
        if(user) {
            const error = createHttpError(400, "User already exists");
            return next(error);
        }
    } catch (error) {
        return next(createHttpError(500, "Something went wrong"));
        console.error("Error while finding user: ", error);
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let newUser : User;
    
    try {
        newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        });
    } catch (error) {
        console.error(error);
        return next(createHttpError(500, "Error while creating user"));
    }

    // create jwt token
    try {
        const token = sign({sub: newUser._id}, config.jwt_secret as string, {
            expiresIn: "1d"
        });
        res.json({accessToken: token});
    } catch (error) {
        return next(createHttpError(500, "Error while signing jwt token"));
        console.error(error);
    }

}

export {registerUser}