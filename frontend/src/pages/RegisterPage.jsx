import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import API from '../config/api'
import { AuthContext } from '../context/AuthContext'

function RegisterPage() {
    const {setUser} = useContext(AuthContext);
    const [formData, setFormData] = useState({name: "", email: "", password: ""});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await API.post("/api/auth/register", formData);
        console.log(response);
        if (response) {
            setUser(response.data.user);           
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='name' value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
            <input type="text" placeholder='email' value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
            <input type="password" placeholder='password' value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
            <button type="submit">Register</button>
        </form>
    </div>
  )
}

export default RegisterPage