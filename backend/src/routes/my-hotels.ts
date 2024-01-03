import express from 'express';
import multer from 'multer'
import cloudinary from 'cloudinary'
import Hotel, { HotelType } from '../models/hotel';
import { verifyToken } from '../middleware/auth';
import {body} from 'express-validator';

const router = express.Router();

// Tell to save any image in memory
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize : 5 * 1024 * 1024 // 5MB
    }
})



router.post('/', 
    verifyToken, 
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Type is required"),
        body("pricePerNight").notEmpty().isNumeric().withMessage("PricePerNight is required and must be a number"),
        body("adultCount").notEmpty().isNumeric().withMessage("AdultCount is required and must be a number"),
        body("childCount").notEmpty().isNumeric().withMessage("ChildCount is required and must be a number"),
        body("starsRating").notEmpty().isNumeric().isLength({min : 1 , max : 5}).withMessage("StarsRating is required and must be a number between 1 and 5"),
        body("facilities").notEmpty().isArray().withMessage("Facilities are required and must be an array")
    ] , 
    upload.array("imageFiles", 6) , async (req : express.Request , res : express.Response) => {
  
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body
        // 1 uploaded image to cloudinary
        const uploadPromises = imageFiles.map(async(image) => {
            const b64 = Buffer.from(image.buffer).toString('base64')
            let dataURI = "data:" + image.mimetype + ";base64," + b64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url
        })
        const imageUrls =  await Promise.all(uploadPromises)
        // 2 if uploaded to cloudinary successfully , add URLS to new hotel Object
        newHotel.imageUrls = imageUrls
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;
        // 3 Save the new hotel in our database
        const hotel = new Hotel(newHotel)
        await hotel.save();
        // 4 return a 201 status code
        res.status(201).send(hotel)
    } catch (error) {
        console.log("Error creating new hotel: ", error)
        res.status(500).json({message : "Something went wrong"})
    }

})

export default router;

