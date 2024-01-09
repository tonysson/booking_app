import { hotelTypes } from "../config/hotel-option-config";


type Props = {
    selectedHotelTypes : string[];
    onChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function HotelTypesFilter({selectedHotelTypes , onChange} : Props) {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">
        Hotel Type
      </h4>
      {
        hotelTypes.map(hotelType => (
            <label key={Math.random()} className="flex items-center space-x-2">
                <input 
                type="checkbox" className="rounded" value={hotelType} checked={ selectedHotelTypes.includes(hotelType)} onChange={onChange} />
                <span>{hotelType}</span>
            </label>
        ))
      }
    </div>
  )
}
