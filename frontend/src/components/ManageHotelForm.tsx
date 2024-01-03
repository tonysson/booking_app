import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "../form/DetailsSection";
import TypeSection from "../form/TypeSection";
import FacilitiesSection from "../form/FacilitiesSection";
import GuestSection from "../form/GuestSection";
import ImageSection from "../form/ImageSection";



export type HotelFormData = {
    name : string;
    city : string;
    country : string;
    description : string;
    type : string;
    adultCount : number;
    childCount : number;
    facilities: string[];
    pricePerNight : number;
    starsRating : number;
    imageUrls: string[];
    imageFiles: FileList;
}


type Props = {
    onSave : (hotelFormData : FormData) => void;
    isLoading : boolean;
}


export default function ManageHotelForm({onSave , isLoading} : Props) {

    const formMethods = useForm<HotelFormData>();

    const {handleSubmit} = formMethods;

    const onSubmit = handleSubmit((formDataJson :HotelFormData) => {
        const formData = new FormData()
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("pricePerNight", formDataJson.pricePerNight.toString());
        formData.append("starsRating", formDataJson.starsRating.toString());
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());

        formDataJson.facilities.forEach((facility, index) =>  {
            formData.append(`facilities[${index}]`, facility)
        });

        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile)
        });

        onSave(formData)

    });

  return (
    
    <FormProvider {...formMethods}>
        <form  className="flex flex-col gap-10" onSubmit={onSubmit}>
            <DetailsSection/>
            <TypeSection/>
            <FacilitiesSection/>
            <GuestSection/>
            <ImageSection/>
            <span className="flex justify-end">
                <button disabled={isLoading} type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500">
                    {isLoading ? "Saving..." : "Save"}
                </button>
            </span>
        </form>
    </FormProvider>
  )
}
