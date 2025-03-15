import { Request, Response, NextFunction } from "express";
import { deleteOnCloudinary, uploadonCloudinary } from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { authRequest } from "../middlewares/authenticate";

const registerBook = async (req:Request, res:Response, next:NextFunction) => {
    try {
    const { title, genre } = req.body;
    const files = req.files as {[fieldname: string]: Express.Multer.File[]};
    const coverImageFile = files?.coverImage?.[0];
    const bookFile = files?.file?.[0];
    
    if (!coverImageFile || !bookFile) {
        return next(createHttpError(400, "Cover image and book file are required"));
    }
    
    // upload cover image
    const filepath = path.resolve(__dirname, `../../src/public/uploads/${coverImageFile.filename}`);
    const coverImage = await uploadonCloudinary(filepath);

    // upload book
     const bookFilePath = path.resolve(__dirname, `../../src/public/uploads/${bookFile.filename}`);
     const book = await uploadonCloudinary(bookFilePath, {
        resource_type: "raw",  // Ensures Cloudinary treats it as a file, not an image
        format: "pdf", // Explicitly set the format to PDF
      });
     
     console.log(book);     
     console.log(coverImage);
      
     const _req = req as authRequest; // type assertion
     

     // add book in db
     const newBook = await bookModel.create({
        title,
        author: _req.user,
        genre,
        coverImage: coverImage?.secure_url,
        file: book?.secure_url
     })
     
     // delete uploaded files
     try {
        await fs.promises.unlink(filepath);
        await fs.promises.unlink(bookFilePath);
     } catch (error) {
        console.log("Error while deleting file", error);
     }

     
     res.status(201).json(newBook._id );
   } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while registering book"));
   }
}

function getPublicId(url: string) {
    return url.split("/").pop()?.split(".")[0];
}

export {registerBook};