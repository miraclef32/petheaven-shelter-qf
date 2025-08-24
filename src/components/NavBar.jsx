import React, { useState, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  // simple accessible hover/focus dropdown behaviour
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef(null)

  const openMenu = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <nav className="navbar" aria-label="Primary">
      <Link to="/" className="brand" aria-label="PetHeaven Home" onClick={()=>window.scrollTo({top:0, behavior:'smooth'})}>
        <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true" className="logo-svg">
          <circle cx="18" cy="21" r="7" fill="#0ea5a4"/>
          <circle cx="32" cy="16" r="7" fill="#0ea5a4"/>
          <circle cx="46" cy="21" r="7" fill="#0ea5a4"/>
          <circle cx="40" cy="38" r="10" fill="#0ea5a4"/>
          <path d="M24 44c2.5-4.5 9-7.5 14-5.5 4 1.5 6 4.5 6.5 7.5" fill="none" stroke="#0ea5a4" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <span className="logo-text">PetHeaven</span>
      </Link>

      <ul className="nav-links">
        <li><a href="/#about" onClick={(e)=>{e.preventDefault(); window.history.pushState({}, '', '/#about'); const el=document.querySelector('#about'); el? el.scrollIntoView({behavior:'smooth'}): window.location.href='/'}}>About Us</a></li>

        <li className="has-sub"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
            onBlur={closeMenu}
            onFocus={openMenu}>
          <NavLink to="/adoption" aria-haspopup="true" aria-expanded={open ? 'true' : 'false'} className="nav-link">
            Services ▾
          </NavLink>
          <ul className="sub" style={{display: open ? 'block' : 'none'}}>
            <li><NavLink to="/adoption">Adoption</NavLink></li>
            <li><NavLink to="/releasing">Releasing</NavLink></li>
          </ul>
        </li>

        <li><NavLink to="/contact">Contact Us</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
      </ul>
    </nav>
  )
}
