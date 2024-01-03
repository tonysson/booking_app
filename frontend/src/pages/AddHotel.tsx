
import { useMutation } from 'react-query'
import ManageHotelForm from '../components/ManageHotelForm'
import * as apiClient from "../api-client"
import { useAppContext } from '../contexts/AppContext'

export default function AddHotel() {

  const {showToast} = useAppContext()

  const { mutate , isLoading } = useMutation(apiClient.addHotel , {

    onSuccess : () => {
      showToast({message : "Hotel saved successfully!!" , type : "SUCCESS"})
    },

    onError : () => {
      showToast({message : "Error saving Hotel" , type : "ERROR"})
    }
  })

  const handleSave = (hotelFormData : FormData) => {
    mutate(hotelFormData)
  }


  return (
   <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
  )
}
