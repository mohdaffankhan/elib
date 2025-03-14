import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

const registerBook = async (req:Request, res:Response, next:NextFunction) => {
    try {
    const files = req.files as {[fieldname: string]: Express.Multer.File[]};

    // upload cover image
    const coverImageMimeType = files?.coverImage[0].mimetype.split("/").at(-1);
    const filename = files.coverImage[0].filename
    const filepath = path.resolve(__dirname, `../../src/public/uploads/${filename}`);

    const uploadCoverImage = await cloudinary.uploader.upload(filepath, {
        filename_override: filename,
        folder: "book-covers",
        format: coverImageMimeType,
    })

    // upload book
     const bookFileName = files?.file[0]?.filename;
     const bookFilePath = path.resolve(__dirname, `../../src/public/uploads/${bookFileName}`);
     const bookFileMimeType = files.file[0].mimetype.split("/").at(-1);
 
     const uploadBookFile = await cloudinary.uploader.upload(bookFilePath, {
         filename_override: bookFileName,
         resource_type: "raw",
         folder: "book-pdfs",
         format: bookFileMimeType,
     })
     
     console.log(uploadBookFile);     
     console.log(uploadCoverImage);
     
     res.json({message:"book registered"})
   } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while registering book"));
   }
}

export {registerBook}