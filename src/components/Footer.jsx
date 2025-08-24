import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><a href="/#about">About</a></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: <a href="mailto:petheaven123@hotmail.com">petheaven123@hotmail.com</a></p>
          <p>Phone: +1 (123) 456-7890</p>
          <p>Address: Hougang Central, Block 851, Singapore 530851</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="X"><i className="fab fa-x-twitter"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 PetHeaven. All rights reserved.</p>
      </div>
    </footer>
  )
}
