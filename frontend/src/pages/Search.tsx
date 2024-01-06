import { useQuery } from 'react-query'
import { useSearchContext } from '../contexts/SearchContext'
import * as apiClient from '../api-client'
import { useState } from 'react'
import SearchResultCard from '../components/SearchResultCard'
import Pagination from '../components/Pagination'
import StarRatingFilter from '../components/StarRatingFilter'
import HotelTypesFilter from '../components/HotelTypesFilter'
import FacilitiesFilter from './../components/FacilitiesFilter';
import PriceFilter from '../components/PriceFilter'

export default function Search() {
    const search = useSearchContext()
    const [page , setPage] = useState<number>(1)
    const [selectedStars , setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes , setSelectedHotelTypes] = useState<string[]>([])
    const [selectedFacilities , setSelectedFacilities] = useState<string[]>([])
    const [selectedPrice , setSelectedPrice] = useState<number | undefined>()
    const [sortOption , setSortOption] = useState<string>('')


    const searchParams = {
        destination : search.destination,
        checkIn : search.checkIn.toISOString(),
        checkOut : search.checkOut.toISOString(),
        adultCount : search.adultCount.toString(),
        childCount : search.childCount.toString(),
        page:page.toString(),
        stars : selectedStars,
        types : selectedHotelTypes,
        facilities : selectedFacilities,
        maxPrice : selectedPrice?.toString(),
        sortOption
    }

    const {data :hotelData} = useQuery(['searchHotels', searchParams], () => apiClient.searchHotels(searchParams))

    const handleStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const starsRating = e.target.value;
      setSelectedStars((prevStars) => e.target.checked ? [...prevStars , starsRating] : prevStars.filter(star => star !== starsRating))
   }

   const handleHotelTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const hotelTypes = e.target.value;
    setSelectedHotelTypes((prevHotelType) => e.target.checked ? [...prevHotelType , hotelTypes] : prevHotelType.filter(type => type !== hotelTypes))
  }


  const handleFacilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const facilities = e.target.value;
    setSelectedFacilities((prevfacilities) => e.target.checked ? [...prevfacilities , facilities] : prevfacilities.filter(facility => facility !== facilities))
 }


  return (
    <div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
            <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
              Filter by:
            </h3>
            <StarRatingFilter selectedStars={selectedStars} onChange={handleStarsChange}/>
            <HotelTypesFilter onChange={handleHotelTypesChange} selectedHotelTypes={selectedHotelTypes}/>
            <FacilitiesFilter onChange={handleFacilitiesChange} selectedFacilities={selectedFacilities}/>
            <PriceFilter 
              onChange={(value?: number) => setSelectedPrice(value)}
              selectedPrice={selectedPrice}
            />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className=" flex justify-between items-center">
            <span className="text-xl font-bold">
                {hotelData?.pagination.total} Hotels found
                {search.destination ? ` in ${search.destination}` : ""}
            </span>
            {/* TODO sort options */}
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="p-2 border rounded-md">
              <option value="">Sort By</option>
              <option value="starsRating">Star Rating</option>
              <option value="pricePerNightAsc">Price per Night (low to high)</option>
              <option value="pricePerNightDesc">Price per Night ( high to low)</option>
            </select>
        </div>
        {hotelData?.data.map(hotel => (
            <SearchResultCard key={hotel._id} hotel={hotel}/>
        ))}

        <div className="">
            <Pagination pages={hotelData?.pagination.pages || 1} page={hotelData?.pagination.page || 1} onPageChange={(page) => setPage(page) }/>
        </div>
      </div>
    </div>
  )
}
