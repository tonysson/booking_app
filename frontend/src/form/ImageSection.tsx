import { useFormContext } from "react-hook-form"
import { HotelFormData } from "../components/ManageHotelForm"


export default function ImageSection() {
    const { register, formState:{errors} , watch, setValue } = useFormContext<HotelFormData>()
    // get the image data urls from the FormState
    const existingImageUrls = watch("imageUrls")


    const handleDelete = (
      event: React.MouseEvent<HTMLButtonElement,MouseEvent> , 
      imageUrl: string) => {
        event.preventDefault();
        setValue("imageUrls", existingImageUrls.filter(url => url !== imageUrl))
    }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {
          existingImageUrls && (
            <div className="grid grid-cols-6 gap-4">
              {
                existingImageUrls.map((imageUrl) =>(
                  <div key={imageUrl} className="relative group">
                    <img src={imageUrl} alt={imageUrl} className="min-h-full object-cover" />
                    <button 
                    onClick={(event) => handleDelete(event, imageUrl)} 
                    className=" absolute inset-0 items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white">
                      Delete
                    </button>
                  </div>
                ))
              }
            </div>
          )
        }
        <input 
        className="w-full text-gray-700 font normal" 
        type="file" 
        multiple 
        accept="image/*"
        {... register("imageFiles",{
            validate : (imageFiles) => {
              const totalLength = imageFiles.length + (existingImageUrls?.length || 0)
                if(totalLength === 0) {
                    return "At least one image should be uploaded"
                }
                if( totalLength > 6) {
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
