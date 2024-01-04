import express, {Request, Response} from 'express';
import Hotel from './../models/hotel';


const router = express.Router();


router.get('/search', async (req : Request, res : Response) => {

    try {

        // Pagination
        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        )
        const skip = (pageNumber - 1) * pageSize
        const hotels = Hotel.find().skip(skip).limit(pageSize);

        // Count all the hotel in DB
        const total = await Hotel.countDocuments();

        const response = {
            data : hotels ,
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



export default router