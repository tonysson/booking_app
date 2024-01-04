import {  useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom"
import * as apiClient from "../api-client"
import ManageHotelForm from "../components/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";


export default function EditHotel() {

    const {showToast} = useAppContext()
    const navigate = useNavigate()

    const  { hotelId } = useParams();
    const { data : hotel } = useQuery(
        "fetchMyHotelById" ,
         () => apiClient.fetchMyHotelById(hotelId || ""),
         {
            enabled : !!hotelId
         }
    );

    const {mutate , isLoading} = useMutation(apiClient.updateMyHotelById,{
        onSuccess : () => {
            showToast({message : "Hotel update successfully!!" , type : "SUCCESS"})
            navigate('/my-hotels')
            
          },
      
          onError : () => {
            showToast({message : "Error Updating Hotel" , type : "ERROR"})
          }
    })

    const handleSave = (hotelFormData : FormData) => {
        mutate(hotelFormData);
    }

  return (
    <ManageHotelForm onSave={handleSave} hotel={hotel} isLoading={isLoading} />
  )
}
