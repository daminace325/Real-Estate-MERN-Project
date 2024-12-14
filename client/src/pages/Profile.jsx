import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase.js'
import { deleteUserFaliure, deleteUserStart, deleteUserSuccess, signOutUserFaliure, signOutUserStart, signOutUserSuccess, updateUserFaliure, updateUserStart, updateUserSucess } from '../redux/user/userSlice.js'
import { useParams, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


export default function Profile() {

	const fileRef = useRef(null)
	const { currentUser, loading, error } = useSelector(state => state.user)
	const [file, setFile] = useState(undefined)
	const [filePerc, setFilePerc] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [updateSuccess, setUpdateSuccess] = useState(false)
	const [formData, setFormData] = useState({})
	const [showListingsError, setShowListingsError] = useState(false)
	const [userListings, setUserListings] = useState([])
	const { userId } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [showListings, setShowListings] = useState(false)
	const [listingsLoading, setListingsLoading] = useState(false); // Add this line to track loading state

	const isAdminProfile = userId && currentUser && currentUser.isAdmin

	useEffect(() => {
		if (file) {
			handleFileUpload(file)
		}
	}, [file])

	useEffect(() => {
		const fetchUserProfile = async (userId) => {
			try {
				const res = await fetch(`/api/user/${userId}`);
				const data = await res.json();
				console.log(data);

				if (data.success === false) {
					console.log(data.message);
					return;
				}
				setFormData(data);
			} catch (error) {
				console.log(error.message);
			}
		};

		if (isAdminProfile) {
			fetchUserProfile(userId);
		} else {
			setFormData({
				username: currentUser.username,
				email: currentUser.email,
				avatar: currentUser.avatar
			});
		}
	}, [isAdminProfile, userId, currentUser]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app)
		const fileName = new Date().getTime() + file.name
		const storageRef = ref(storage, fileName)
		const uploadTask = uploadBytesResumable(storageRef, file)

		uploadTask.on('state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				setFilePerc(Math.round(progress))
			},
			(error) => {
				setFileUploadError(true)
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setFormData({ ...formData, avatar: downloadURL })
				})
			}
		)
	}

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			dispatch(updateUserStart())
			const res = await fetch(userId ? `/api/user/update/${userId}` : `/api/user/update/${currentUser._id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})
			const data = await res.json()
			if (data.success === false) {
				dispatch(updateUserFaliure(data.message))
				return
			}
			if (userId && userId !== currentUser._id) {
				dispatch(updateUserSucess({}))
				setUpdateSuccess(true)
				return
			}
			dispatch(updateUserSucess(data))
			setUpdateSuccess(true)
		} catch (error) {
			dispatch(updateUserFaliure(error.message))
		}
	}


	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart())
			const res = await fetch(userId ? `/api/user/delete/${userId}` : `/api/user/delete/${currentUser._id}`, {
				method: 'DELETE'
			})
			const data = await res.json()
			if (data.success === false) {
				dispatch(deleteUserFaliure(data.message))
				return
			}
			dispatch(deleteUserSuccess(userId ? {} : { _id: currentUser._id }));
			if (userId && userId !== currentUser._id) {
				navigate('/admin/dashboard');
			} else {
				navigate('/login')
			}
			setUpdateSuccess(true)
		} catch (error) {
			dispatch(deleteUserFaliure(error.message))
		}
	}


	const handleSignOut = async () => {
		try {
			dispatch(signOutUserStart())
			const res = await fetch('api/auth/signout')
			const data = await res.json()
			if (data.success === false) {
				dispatch(signOutUserFaliure(data.message))
				return
			}
			dispatch(signOutUserSuccess(data))
		} catch (error) {
			dispatch(signOutUserFaliure(error.message))
		}
	}

	const handleShowListings = async () => {
		try {
			setListingsLoading(true); // Set loading to true when fetching listings
			if (showListings) {
				setUserListings([])
			} else {
				setShowListingsError(false)
				const res = await fetch(userId ? `/api/user/listings/${userId}` : `/api/user/listings/${currentUser._id}`)
				const data = await res.json()
				if (data.success === false) {
					setShowListingsError(true)
					return
				}
				setUserListings(data)
			}
			setShowListings(!showListings)
		} catch (error) {
			setShowListingsError(true)
		} finally {
			setListingsLoading(false); // Set loading to false when fetching is complete
		}
	}

	const handleListingDelete = async (listingId) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: 'DELETE'
			})
			const data = await res.json()
			if (data.success === false) {
				console.log(data.message);
				return
			}
			setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
		} catch (error) {
			console.log(error.message);
		}
	}

	return (
		<div className='p-3 max-w-lg mx-auto'>
			<h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4' >
				<input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
				<img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
				<p className='text-sm self-center'>
					{fileUploadError ? (
						<span className='text-red-700'>
							Error Image Upload (Image size must be less than 2 MB)
						</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className='text-black-700'>
							{`Uploading ${filePerc}%`}
						</span>
					) : filePerc === 100 ? (
						<span className='text-green-700'>
							Image Successfully Uploaded
						</span>
					) : (
						''
					)}
				</p>
				<input type='text' placeholder='Username' id='username' defaultValue={formData.username} onChange={handleChange} className='border p-3 rounded-lg' />
				<input type='text' placeholder='E-mail' id='email' defaultValue={formData.email} onChange={handleChange} className='border p-3 rounded-lg' />
				<input type='password' placeholder='Password' id='password' onChange={handleChange} className='border p-3 rounded-lg' />
				<button disabled={loading} className='bg-sky-600 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-75'>
					{loading ? 'Loading...' : 'Update'}
				</button>
				{currentUser.isAdmin ? '' : (
					<Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90'>
						Create Listing
					</Link>
				)}
			</form>
			<div className='flex justify-between mt-5'>
				{!userId && currentUser.isAdmin ? '' : (
					<button onClick={handleShowListings} className='text-green-700'>
						{showListings ? 'Hide Listings' : 'Show Listings'}
					</button>
				)}
				{userId ? (
					<span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
				) : (
					<>
						<span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
						<span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
					</>
				)}
			</div>

			<p className='text-red-700 mt-5'>{error ? error : ''}</p>
			<p className='text-green-700 mt-5'>{updateSuccess ? 'User Updated Succesfully' : ''}</p>
			<p className='text-red-700 mt-5'>
				{showListingsError ? 'Error in showing listings' : ''}
			</p>
			{listingsLoading ? (
				<div className="flex justify-center items-center h-32">
					<img
						src="https://global.discourse-cdn.com/sitepoint/original/3X/e/3/e352b26bbfa8b233050087d6cb32667da3ff809c.gif"
						alt="Loading..."
						className="h-8 w-8 inline-block animate-spin"
					/>
				</div>
			) : (
				userListings && userListings.length > 0 &&
				<div className='flex flex-col gap-4'>
					<h1 className='text-center text-2xl font-semibold'>
						{currentUser.isAdmin ? 'User' : 'Your'} Listings
					</h1>
					{userListings.map((listing) => <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
						<Link to={`/listing/${listing._id}`}>
							<img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain' />
						</Link>
						<Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
							<p>{listing.name}</p>
						</Link>
						<div className='flex flex-col items-center'>
							<button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
							<Link to={`/update-listing/${listing._id}`} >
								<button className='text-green-700 uppercase'>Edit</button>
							</Link>
						</div>
					</div>)}
				</div>
			)}
		</div>
	)
}
