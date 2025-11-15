import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

function RequireAuth() {
    const {user, loading} = useContext(AuthContext);
    if (loading) {
        return <div>Loading...</div>
    }
    if (!user) {
        return <Navigate to="/login" />
    }
  return (
    <Outlet />
  )
}

export default RequireAuth 
