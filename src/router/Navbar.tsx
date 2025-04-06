import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar: React.FC = () => {
    return (
        <ul className="nav nav-tabs justify-content-center">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
            Edit
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/chat">
            Exercise
            </NavLink>
          </li>
        </ul>
    )
}

export default Navbar;