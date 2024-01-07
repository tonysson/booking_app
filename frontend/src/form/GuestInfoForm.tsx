import  DatePicker  from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form';
import { useSearchContext } from '../contexts/SearchContext';
import { useAppContext } from '../contexts/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
    hotelId:string;
    pricePerNight:number;
}

type GuestInfoFormData = {
    checkIn : Date ;
    checkOut : Date;
    adultCount : number;
    childCount : number;
}

export default function GuestInfoForm({hotelId , pricePerNight} : Props) {

    const navigate = useNavigate()
    const location = useLocation()
    const search = useSearchContext()
    const {isLoggedIn} = useAppContext()

    const {watch , register , handleSubmit , setValue , formState : {errors}} = useForm<GuestInfoFormData>({
        defaultValues : {
            checkIn :search.checkIn,
            checkOut :search.checkOut,
            adultCount :search.adultCount,
            childCount:search.childCount
        }
    })

    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);


    // Function that will be called if the user is not logged In (ie the user see Sign in to Book button )
    const onSignInClick = (data: GuestInfoFormData) => {
        // populate the guest info into our search context
        search.saveSearchValues("", data.checkIn , data.checkOut , data.adultCount , data.childCount);
        // navigate to sign in page and we save some state on it (that we will take in some data that will be getting later and allow us to navigate to page we were when we logged in)
        navigate('/sign-in', { state : {from : location}});
    }

    // Function that will be called if the user is logged In (ie the user see book now button)
    const onSubmit = (data: GuestInfoFormData) => {
        // populate the guest info into our search context
        search.saveSearchValues("", data.checkIn , data.checkOut , data.adultCount , data.childCount);
        navigate(`/hotel/${hotelId}/booking`);
    }



  return (
    <div className='flex flex-col p-4 bg-blue-200 gap-4'>
      <h3 className="text-md font-bold">
        £{pricePerNight}
      </h3>
      <form onSubmit={
        isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
      }>
        <div className="grid grid-cols-1 gap-4 items-center">
            <div className="">
            <DatePicker
            required
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
            selected={checkIn} 
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-In Date"
            onChange={date => setValue("checkIn", date as Date)} />
            </div>
            <div className="">
            <DatePicker
            required
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
            selected={checkOut} 
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-out Date"
            onChange={date => setValue("checkOut", date as Date)} />
            </div>
            <div className="flex bg-white px-2 py-1 gap-2">
                <label className="items-center flex">
                Adults:
                <input 
                    className="w-full p-1 focus:outline-none font-bold"
                    type="number" 
                    min={1}
                    max={20}
                    {... register("adultCount" , {
                        required : "This field is required",
                        min : {
                            value : 1,
                            message : "There must be at least one adult"
                        },
                        valueAsNumber: true,
                    })}
                />
                </label>
                <label className="items-center flex">
                    Children:
                    <input 
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number" 
                        min={0}
                        max={20}
                        {... register("childCount" , {
                            valueAsNumber: true,
                        })}
                    />
                </label>
                {errors.adultCount && (
                    <span className="text-red-500 font-semibold text-mm">
                         {errors.adultCount.message}
                    </span>
                )}
            </div>
                {isLoggedIn ? (
                <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
                Book Now
                </button>
            ) : (
                <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
                Sign in to Book
                </button>
            )}
        </div>
      </form>
    </div>
  )
}
