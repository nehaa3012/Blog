import React, { useEffect, useState } from 'react'
import Posts from '../components/Posts'
import API from '../config/api'

function HomePage() {
    const [posts, setPosts] = useState([])
    const getPosts = async () => {
        const response = await API.get("/api/posts/all")
        if (response) {
            setPosts(response.data)
            console.log(response.data)
        }
    }
    useEffect(() => {
        getPosts()
    }, [])
  return (
    <div>
        
        <Posts />
        
    </div>
  )
}

export default HomePage
