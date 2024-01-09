import { useQuery } from "react-query"
import * as apiClient from "../api-client"
import BookingForm from "../form/BookingForm"
import { useSearchContext } from "../contexts/SearchContext"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import BookingDetailSummary from "../components/BookingDetailSummary"
import { Elements } from "@stripe/react-stripe-js"
import { useAppContext } from "../contexts/AppContext"


export default function Booking() {

    const search = useSearchContext()
    const {hotelId} = useParams()
    const {stripePromise} = useAppContext()

    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    useEffect(() => {
        if(search.checkIn && search.checkOut) {
            // get the number of days
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60* 60 * 24)
            setNumberOfNights(Math.ceil(nights))
        }
    },[search.checkIn, search.checkOut])


    // createPaymentIntent QUERY call
    const {data : paymentIntentData} = useQuery(
        "createPaymentIntent", 
        () => apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()),
        {
            enabled: !!hotelId && numberOfNights > 0
        }
        
    )

    // fetchHotelById query call , enabled: !!hotelId means we'll call this query in case we have hotelId. Good for performance
    const {data : hotel} = useQuery(
        'fetchHotelById', 
        () =>  apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId
        }
    )
    const {data : currentUser} = useQuery('fetchCurrentUser', apiClient.fetchCurrentUser)

    if(!hotel) return null
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
        <BookingDetailSummary 
        hotel={ hotel}
        childCount={search.childCount}
        adultCount={search.adultCount}
        checkOut={search.checkOut}
        checkIn={search.checkIn} 
        numberOfNights={numberOfNights} />
        {
            currentUser && paymentIntentData && (
                <Elements stripe={stripePromise} options={{
                    clientSecret: paymentIntentData.clientSecret
                }}>
                    <BookingForm paymentIntent={paymentIntentData}   currentUser={currentUser}/>
                </Elements>
                
            )
        }
    </div>
  )
}
