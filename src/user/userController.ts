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
        console.error("Error while finding user: ", error);
        return next(createHttpError(500, "Something went wrong"));
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
        res.status(201).json({accessToken: token});
    } catch (error) {
        console.error(error);
        return next(createHttpError(500, "Error while signing jwt token"));
    }

}

const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }

    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return next(createHttpError(404, "User not found"));
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return next(createHttpError(401, "Invalid credentials"));
        }

        // create jwt token
        try {
            const token = sign({sub: user._id}, config.jwt_secret as string, {
                expiresIn: "1d"
            });
            res.status(201).json({message:"Login successful", accessToken: token});
        } catch (error) {
            console.error(error);
            return next(createHttpError(500, "Error while signing jwt token"));
        }
    } catch (error) {
      console.error("Error while finding user: ", error);  
      return next(createHttpError(500, "Something went wrong"));
    }  
}

export {registerUser, loginUser}