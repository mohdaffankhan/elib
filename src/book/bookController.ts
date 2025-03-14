import { Request, Response, NextFunction } from "express";


const registerBook = async (req:Request, res:Response, next:NextFunction) => {
    res.json({message:"book registered"})
}

export {registerBook}