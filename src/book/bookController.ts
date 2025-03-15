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

const updateBook = async (req:Request, res:Response, next:NextFunction) => {
    const { title, genre } = req.body;
    const files = req.files as {[fieldname: string]: Express.Multer.File[]};
    const bookId = req.params.bookId;

    try {
        const book = await bookModel.findOne({ _id: bookId });
        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }
    
        // Check access
        const _req = req as authRequest; // type assertion
        if (book.author.toString() !== _req.user?.toString()) {
            return next(createHttpError(403, "You can not update others book."));
        }
    
        // check if image field is exists.
        const coverImage = files?.coverImage?.[0];
        let completeCoverImage = null;
        if (coverImage) {
            try {
                const publicId = getPublicId(book.coverImage);
                if (publicId) {
                    await deleteOnCloudinary(publicId);
                }
                const uploadedCoverImage = await uploadonCloudinary(
                    path.resolve(__dirname, `../../src/public/uploads/${coverImage.filename}`)
                );
                completeCoverImage = uploadedCoverImage?.secure_url || book.coverImage;
            } catch (error) {
                console.log(error);
                return next(createHttpError(500, "Error while updating cover image"));
            }
        }
    
        // check if file field is exists.
        const bookFile = files?.file?.[0];
        const bookFilePath = path.resolve(__dirname, `../../src/public/uploads/${bookFile.filename}`);
        let completeFileName = null;
        if (bookFile) {
            try {
                const publicId = getPublicId(book.file);
                if (publicId) {
                    await deleteOnCloudinary(publicId);
                }
                const uploadedFileName = await uploadonCloudinary(bookFilePath, {
                    resource_type: "raw",  // Ensures Cloudinary treats it as a file, not an image
                    format: "pdf", // Explicitly set the format to PDF
                }
                );
                completeFileName = uploadedFileName?.secure_url || book.file;
            } catch (error) {
                console.log(error);
                return next(createHttpError(500, "Error while updating book file"));
            }
        }
    
        // update in db
        const updatedBook = await bookModel.findOneAndUpdate(
            {
                _id: bookId,
            },
            {
                title: title,
                genre: genre,
                coverImage: completeCoverImage,
                file: completeFileName,
            },
            { new: true }
        );
    
        res.json(updatedBook);
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error while updating book"));
    }
};

export {registerBook, updateBook};