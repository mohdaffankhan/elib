import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "fs";

const registerBook = async (req:Request, res:Response, next:NextFunction) => {
    try {
    const { title, genre } = req.body;
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
     

     // add book in db
     const newBook = await bookModel.create({
        title,
        author:"67d375c974f625d566fd8120",
        genre,
        coverImage: uploadCoverImage.secure_url,
        file: uploadBookFile.secure_url
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

export {registerBook}