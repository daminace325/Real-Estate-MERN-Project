import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase.js'
import { deleteUserFaliure, deleteUserStart, deleteUserSuccess, signOutUserFaliure, signOutUserStart, signOutUserSuccess, updateUserFaliure, updateUserStart, updateUserSucess } from '../redux/user/userSlice.js'
import { Link } from 'react-router-dom'


export default function Profile() {

	const fileRef = useRef(null)
	const { currentUser, loading, error } = useSelector(state => state.user)
	const [file, setFile] = useState(undefined)
	const [filePerc, setFilePerc] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [updateSuccess, setUpdateSuccess] = useState(false)
	const [formData, setFormData] = useState({})

	const dispatch = useDispatch()

	useEffect(() => {
		if (file) {
			handleFileUpload(file)
		}
	}, [file])

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
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
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
			dispatch(updateUserSucess(data))
			setUpdateSuccess(true)
		} catch (error) {
			dispatch(updateUserFaliure(error.messgae))
		}
	}


	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart())
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: 'DELETE'
			})
			const data = await res.json()

			if (data.success === false) {
				dispatch(deleteUserFaliure(data.message))
				return
			}
			dispatch(deleteUserSuccess(data))
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
				<input type='text' placeholder='Username' id='username' defaultValue={currentUser.username} onChange={handleChange} className='border p-3 rounded-lg' />
				<input type='text' placeholder='E-mail' id='email' defaultValue={currentUser.email} onChange={handleChange} className='border p-3 rounded-lg' />
				<input type='password' placeholder='Password' id='password' onChange={handleChange} className='border p-3 rounded-lg' />
				<button disabled={loading} className='bg-sky-600 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-75'>
					{
						loading ? 'Loading...' : 'Update'
					}
				</button>
				<Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90'>
					Create Listing
				</Link>
			</form>
			<div className='flex justify-between mt-5'>
				<span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
				<span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
			</div>
			<p className='text-red-700 mt-5'>{error ? error : ''}</p>
			<p className='text-green-700 mt-5'>{updateSuccess ? 'User Updated Succesfully' : ''}</p>
		</div>
	)
}
