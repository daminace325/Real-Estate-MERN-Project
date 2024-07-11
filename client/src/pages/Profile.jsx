import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const { currentUser } = useSelector(state => state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form action="" className='flex flex-col gap-4' >
        <img src={currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <input type='text' placeholder='Username' id='username' className='border p-3 rounded-lg' />
        <input type='text' placeholder='E-mail' id='email' className='border p-3 rounded-lg' />
        <input type='text' placeholder='Password' id='password' className='border p-3 rounded-lg' />
        <button className='bg-sky-600 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
