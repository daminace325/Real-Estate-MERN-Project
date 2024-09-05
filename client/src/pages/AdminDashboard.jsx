import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersFailure, fetchUsersStart, fetchUsersSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
	const [users, setUsers] = useState([]);
	const { error, loading } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchUsers = async () => {
			dispatch(fetchUsersStart());
			try {
				const res = await fetch('/api/admin/dashboard');
				const data = await res.json();
				if (data.success === false) {
					dispatch(fetchUsersFailure(data.message));
				} else {
					dispatch(fetchUsersSuccess(data));
					setUsers(data);
				}
			} catch (error) {
				dispatch(fetchUsersFailure(error.message));
			}
		};

		fetchUsers();
	}, [dispatch]);

	return (
		<div className='p-4'>
			<h1 className='text-3xl font-semibold mb-6'>Dashboard</h1>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p className='text-red-500'>Error: {error}</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 duration-300 lg:grid-cols-4 gap-4'>
					{users.map((user) => (
						<Link 
							to={`/admin/profile/${user._id}`} 
							key={user._id} 
							className='border p-4 rounded-lg shadow-md hover:shadow-2xl transition-transform transform hover:opacity-75 duration-300'
						>
							<img
								src={user.avatar}
								alt={user.username}
								className='w-24 h-24 rounded-full mx-auto mb-4'
							/>
							<h2 className='text-xl font-bold'>{user.username}</h2>
							<p className='text-gray-700'>{user.email}</p>
							<p className='mt-2'>
								<span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${user.isAdmin ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
									{user.isAdmin ? 'Admin' : 'User'}
								</span>
							</p>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
