import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Login from "../../pages/Login/Login";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <nav className="navbar_container">
        <div className="logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3209/3209937.png"
            alt=""
          />
          <h1>IntelliPaper</h1>
        </div>
        <input type="checkbox" id="checkbox" />
        <label htmlFor="checkbox" id="icon">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">About</Link>
          </li>
          <li>
            <span onClick={toggleDrawer}>Login</span>
          </li>
        </ul>
      </nav>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        size={400}
        className="drawer_container"
      >
        <Login onClose={toggleDrawer} />
      </Drawer>
    </>
  );
};

export default Navbar;
