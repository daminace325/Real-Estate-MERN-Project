import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle'
import ListingItem from '../components/ListingItem'

export default function Home() {
	const [offerListings, setOfferListings] = useState([])
	const [rentListings, setRentListings] = useState([])
	const [saleListings, setSaleListings] = useState([])
	SwiperCore.use([Navigation])

	// console.log(saleListings)
	// console.log('offerlistings', offerListings)
	// console.log('rent', rentListings)


	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch('api/listing/get?offer=true&limit=4')
				const data = await res.json()
				setOfferListings(data)
				fetchRentListings()
			} catch (error) {
				console.log(error);
			}
		}
		const fetchRentListings = async () => {
			try {
				const res = await fetch('api/listing/get?type=rent&limit=4')
				const data = await res.json()
				setRentListings(data)
				fetchSaleListings()
			} catch (error) {
				console.log(error);
			}
		}
		const fetchSaleListings = async () => {
			try {
				const res = await fetch('api/listing/get?type=sale&limit=4')
				const data = await res.json()
				setSaleListings(data)
			} catch (error) {
				console.log(error);
			}
		}

		fetchOfferListings()
	}, [])



	return (
		<div>
			{/* Top Side */}
			<div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
				<h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
					Find your next <span className='text-slate-500'>perfect</span>
					<br /> place with ease
				</h1>
				<div className="text-gray-400 text-xs sm:text-sm">
					YourEstate is the best place to find your next perfect place to live
					<br />
					Choose among a wide range of properties.
				</div>
				<Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
					Let's get started...
				</Link>
			</div>


			{/* Swiper */}

			<Swiper navigation>
				{offerListings && offerListings.length > 0 && offerListings.map((listing) => (
					<SwiperSlide key={listing._id}>
						<div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }} className="h-[500px]"></div>
					</SwiperSlide>
				))}
			</Swiper>


			{/* Listing results for offer, sale and rent */}

			<div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
				{offerListings && offerListings.length > 0 && (
					<div className="">
						<div className='my-4'>
							<h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
							<Link to={'/search?offer=true'} className='text-sm text-blue-800 hover:underline'>
								Show More Offers...
							</Link>
						</div>
						<div className="flex flex-wrap gap-4 justify-evenly lg:justify-between">
							{offerListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
				{rentListings && rentListings.length > 0 && (
					<div className="">
						<div className='my-4'>
							<h2 className='text-2xl font-semibold text-slate-600'>Recent Places for rent</h2>
							<Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>
								Show More Places for Rent...
							</Link>
						</div>
						<div className="flex flex-wrap gap-4 justify-evenly lg:justify-between">
							{rentListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
				{saleListings && saleListings.length > 0 && (
					<div className="">
						<div className='my-4'>
							<h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Sale</h2>
							<Link to={'/search?type=sale'} className='text-sm text-blue-800 hover:underline'>
								Show More Places for Sale...
							</Link>
						</div>
						<div className="flex flex-wrap gap-4 justify-evenly lg:justify-between">
							{saleListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id}/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
