import express, {Request, Response} from 'express';
import Hotel from './../models/hotel';
import { BookingType, HotelSearchResponseType, PaymentIntentResponse } from '../shared/types';
import { param, validationResult } from 'express-validator';
import Stripe from 'stripe';
import { verifyToken } from '../middleware/auth';
import { constructSearchQuery } from '../utils/constructSearchQuery';

import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);



const router = express.Router();


router.get('/search', async (req : Request, res : Response) => {

    try {

        const query = constructSearchQuery(req.query)
        let sortOptions = {}

        switch(req.query.sortOption) {
            case "starsRating" :
                sortOptions = {starsRating: -1}
                break;
            case "pricePerNightAsc" :
                sortOptions = {pricePerNight: 1}
                break;
            case "pricePerNightDesc" : 
                sortOptions = {pricePerNight: -1}
                break;
        }

        // Pagination
        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        )
        const skip = (pageNumber - 1) * pageSize
        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);

        // Count all the hotel in DB
        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponseType = {
            data : hotels,
            pagination : {
                total ,
                page : pageNumber,
                pages : Math.ceil(total / pageSize)
            }
        }

        res.json(response)
        
    } catch (error) {
        console.log("error when searching", error);
        res.status(500).json({message : "Something went wrong"})
    }

})


router.get("/", async(req: Request , res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated")
    res.json(hotels)
  } catch (error) {
    console.log(error)
    res.status(500).json({message : "Error when fetching hotel"})
  }
})

router.get('/:id', 
  [
    param("id").notEmpty().withMessage("Hotel Id is required")
  ] , 
  async (req : Request, res : Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const id = req.params.id.toString();

    try {
      const hotel  = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log("Error when fectching hotel with id : " + id, error)
      res.status(500).json({message : error})
    }

})


router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: "gbp",
      metadata: {
        hotelId,
        userId: req.userId,
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    res.send(response);
  }
);


router.post(
    '/:hotelId/bookings' , 
    verifyToken , 
    async(req: Request, res: Response) => {

      try {
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string)


        if(!paymentIntent){
          return res.status(400).json({message : "Payment intent not found"})
        }

        if(
          paymentIntent.metadata.userId !== req.userId || 
          paymentIntent.metadata.hotelId !== req.params.hotelId
          ) {
            return res.status(400).json({message : "Payment intent mismatch"})
         }

         if(paymentIntent.status !== "succeeded") {
          return res.status(400).json({message : `Payment intent not succeeded. Status: ${paymentIntent.status}`})
         }

         // create a booking
         const newBooking : BookingType = {
            ...req.body,
            userId: req.userId,
         }

         // Update our hotel
         const hotel = await Hotel.findByIdAndUpdate(
          { _id : req.params.hotelId },
          {
            $push : {
              bookings: newBooking
            }
          })

          if(!hotel){
            return res.status(400).json({message : "Hotel not found"})
          }

          // save our hotel
          await hotel.save();
          res.status(200).send()

      } catch (error) {
        console.log(error)
      return res.status(500).json({message : "Something went wrong creating bookings"})
      }

})





export default router