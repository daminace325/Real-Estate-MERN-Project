import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function AdminRoute() {
    const { currentUser } = useSelector(state => state.user)

    if(!currentUser || !currentUser.isAdmin){
        return <Navigate to='/' />
    }

    return <Outlet />
}

