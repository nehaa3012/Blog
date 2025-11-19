import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import CreatePost from './pages/CreatePost'
import EditPage from './pages/EditPage'
import BlogPage from './pages/BlogPage'
import PostDetail from './components/PostDetail'
import Navbar from './components/Navbar'
// import Footer from './components/Footer'
import RequireAuth from './components/RequireAuth'
import AboutPage from './pages/AboutPage'


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/home?" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="edit/:id" element={<EditPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="posts/:id" element={<PostDetail />} />
        </Route>
        <Route path="*" element= {"404 Not Found"}/>
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
