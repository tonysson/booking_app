
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query';
import * as apiClient from "../api-client"
import { AiFillStar } from 'react-icons/ai';
import GuestInfoForm from '../form/GuestInfoForm';

export default function Details() {

    const {hotelId} = useParams()

    const {data : hotel} = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId as string), {
        enabled : !!hotelId
    })

    if (!hotel) {
        return null;
    }
    
      return (
        <div className="space-y-6">
          <div>
            <span className="flex">
              {Array.from({ length: hotel.starsRating }).map(() => (
                <AiFillStar className="fill-yellow-400" />
              ))}
            </span>
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
          </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {hotel.imageUrls.map((url) => (
              <div className="h-[300px]">
                <img
                  src={url}
                  alt={hotel.name}
                  className="rounded-md w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {hotel.facilities.map((facility) => (
              <div className="border border-slate-300 rounded-sm p-3">
                {facility}
              </div>
            ))}
          </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="h-fit">
              <GuestInfoForm
                pricePerNight={hotel.pricePerNight}
                hotelId={hotel._id}
              />
            </div>
          </div>
        </div>
      );
}
