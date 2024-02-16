import React from "react";
import { Link } from "react-router-dom";
import './navbar.css'
const Navbar = () => {
    return(
        <nav className="navbar-container">
            <Link to='/signup'>Sign Up</Link>
            <Link to='/signin'>Sign In</Link>
        </nav>
    )
}
export default Navbar