import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaCheckDouble,
  FaHeart,
  FaHome,
  FaNewspaper,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { AiOutlineDropbox, AiOutlineUsergroupAdd } from "react-icons/ai";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-details">
          <i>
            {" "}
            <FaBars
              onClick={toggleSidebar}
              id="btn"
              className="icons_sidebar"
            />
          </i>
        </div>
        <ul className="nav-list">
          {/* <li>
          <i>
            <FaSearch />
          </i>
          <input type="text" placeholder="Search..." />
          <span className="tooltip">Search</span>
        </li> */}
          <li>
            <Link  to="/dashboard/home">
              <i>
                {" "}
                <FaHome />
              </i>
              <span className="links_name">Home</span>
            </Link>
            <span className="tooltip">Home</span>
          </li>
          <li>
            <Link to="/dashboard/search-paper">
              <i>
                {" "}
                <FaNewspaper />
              </i>
              <span className="links_name">Search Papers</span>
            </Link>
            <span className="tooltip">Papers</span>
          </li>
          <li>
            <Link to="#">
              <i>
                {" "}
                <FaCheckDouble />
              </i>
              <span className="links_name">Plagiarism Checker</span>
            </Link>
            <span className="tooltip">Plagiarism Checker</span>
          </li>
          <li>
            <Link to="#">
              <i>
                {" "}
                <AiOutlineDropbox />
              </i>
              <span className="links_name">Publishing Guide</span>
            </Link>
            <span className="tooltip">Publishing Guide</span>
          </li>
          <li>
            <Link to="#">
              <i>
                <AiOutlineUsergroupAdd />
              </i>
              <span className="links_name">Conferences</span>
            </Link>
            <span className="tooltip">conferences</span>
          </li>
          <li>
            <Link to="#">
              <i>
                <FaHeart />
              </i>
              <span className="links_name">Saved</span>
            </Link>
            <span className="tooltip">Saved</span>
          </li>
          <li>
            <Link to="/dashboard/profile">
              <i>
                {" "}
                <FaUser />
              </i>
              <span className="links_name">Profile</span>
            </Link>
            <span className="tooltip">Profile</span>
          </li>
          <li className="profile">
            <div className="profile-details">
              <div className="name_job">
                <div className="name">Om Shete</div>
                <div className="job">Computer Engineering</div>
              </div>
            </div>
            <i id="log_out">
              {" "}
              <FaSignOutAlt />{" "}
            </i>
          </li>
        </ul>
      </div>

      <div id="header" className={`header ${isOpen ? "open" : ""}`}>
        <div className="header uboxed">
          <ul className="logo">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3209/3209937.png"
              className="icon"
              alt=""
            />
            <h2>IntelliPaper</h2>
          </ul>
          <ul className="menu">
            <li>
              <img
                src="https://byjaris.com/code/icons/home-alt.svg"
                alt="Fimanbol"
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="header-space"></div>
    </>
  );
};

export default Sidebar;
