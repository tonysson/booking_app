import { useFormContext } from "react-hook-form"
import { HotelFormData } from "../components/ManageHotelForm"


export default function ImageSection() {
    const { register, formState:{errors} } = useFormContext<HotelFormData>()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <input 
        className="w-full text-gray-700 font normal" 
        type="file" 
        multiple 
        accept="image/*"
        {... register("imageFiles",{
            validate : (imageFiles) => {
                if(imageFiles.length === 0) {
                    return "At least one image should be uploaded"
                }
                if(imageFiles.length > 6) {
                    return "Total images can not be more than 6"
                }
                return true
            }
        })} 
        />
      </div>
      {errors.imageFiles && (
            <span className="text-red-500 text-sm font-bold">
                {errors.imageFiles.message}
            </span>
        )}
    </div>
  )
}
