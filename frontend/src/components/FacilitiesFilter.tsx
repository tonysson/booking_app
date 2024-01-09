import { hotelFacilities} from "../config/hotel-option-config";


type Props = {
    selectedFacilities : string[];
    onChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FacilitiesFilter({selectedFacilities , onChange} : Props) {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">
        Facilities
      </h4>
      {
        hotelFacilities.map(hotelfacility => (
            <label key={Math.random()} className="flex items-center space-x-2">
                <input 
                type="checkbox" className="rounded" value={hotelfacility} checked={ selectedFacilities.includes(hotelfacility)} onChange={onChange} />
                <span>{hotelfacility}</span>
            </label>
        ))
      }
    </div>
  )
}
