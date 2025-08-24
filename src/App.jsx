import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home.jsx'
import Adoption from './pages/Adoption.jsx'
import Contact from './pages/Contact.jsx'
import Releasing from './pages/Releasing.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/releasing" element={<Releasing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
