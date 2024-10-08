import React, { useEffect, useState } from 'react'
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Header() {
    const { currentUser } = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
                <Link to='/' className='text-slate-700 text-xl sm:text-2xl font-bold'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>Your</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input type='search' placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                <div className='flex items-center'>
                    <button className='sm:hidden text-slate-700' onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                    <ul className='hidden sm:flex gap-4'>
                        <Link to='/'>
                            <li className='text-slate-700 hover:underline cursor-pointer'>Home</li>
                        </Link>
                        {currentUser && currentUser.isAdmin && (
                            <Link to='/admin/dashboard'>
                                <li className='text-slate-700 hover:underline cursor-pointer'>Dashboard</li>
                            </Link>
                        )}
                        <Link to='/about'>
                            <li className='text-slate-700 hover:underline cursor-pointer'>About</li>
                        </Link>
                        <Link to='/profile'>
                            {currentUser ? (
                                <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
                            ) : (
                                <li className='text-slate-700 hover:underline cursor-pointer'>Sign-In</li>
                            )}
                        </Link>
                    </ul>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className='sm:hidden bg-slate-200 p-4'>
                    <ul className='flex flex-col gap-4'>
                        <Link to='/' onClick={toggleMobileMenu}>
                            <li className='text-slate-700 hover:underline cursor-pointer'>Home</li>
                        </Link>
                        {currentUser && currentUser.isAdmin && (
                            <Link to='/admin/dashboard' onClick={toggleMobileMenu}>
                                <li className='text-slate-700 hover:underline cursor-pointer'>Dashboard</li>
                            </Link>
                        )}
                        <Link to='/about' onClick={toggleMobileMenu}>
                            <li className='text-slate-700 hover:underline cursor-pointer'>About</li>
                        </Link>
                        <Link to='/profile' onClick={toggleMobileMenu}>
                            {currentUser ? (
                                <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
                            ) : (
                                <li className='text-slate-700 hover:underline cursor-pointer'>Sign-In</li>
                            )}
                        </Link>
                    </ul>
                </div>
            )}
        </header>
    )
}

