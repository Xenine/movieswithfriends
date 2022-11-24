import React from 'react'
import {Route, Routes } from 'react-router-dom'
import About from './views/About'
import Home from './views/Home'
import Login from './views/LoginPage/LoginPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App