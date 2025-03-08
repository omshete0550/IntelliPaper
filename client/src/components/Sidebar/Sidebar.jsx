import React, { useState, useEffect, useRef } from "react";
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
  FaBell,
  FaEnvelope,
  FaCog,
} from "react-icons/fa";
import { AiOutlineDropbox, AiOutlineUsergroupAdd } from "react-icons/ai";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const sidebarRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-details">
          <FaBars onClick={toggleSidebar} id="btn" className="icons_sidebar" />
        </div>
        <ul className="nav-list">
          {[
            { to: "/dashboard/home", icon: <FaHome />, label: "Home" },
            {
              to: "/dashboard/search-paper",
              icon: <FaNewspaper />,
              label: "Search Papers",
            },
            {
              to: "/dashboard/plagiarism-checker",
              icon: <FaCheckDouble />,
              label: "Plagiarism Checker",
            },
            {
              to: "/dashboard/publishing-guide",
              icon: <AiOutlineDropbox />,
              label: "Publishing Guide",
            },
            {
              to: "/dashboard/conferences",
              icon: <AiOutlineUsergroupAdd />,
              label: "Conferences",
            },
            {
              to: "/dashboard/user-preference-form",
              icon: <FaHeart />,
              label: "Saved",
            },
            { to: "/dashboard/profile", icon: <FaUser />, label: "Profile" },
          ].map((item, index) => (
            <li key={index} onClick={() => setIsOpen(false)}>
              <Link to={item.to}>
                <i>{item.icon}</i>
                <span className="links_name">{item.label}</span>
              </Link>
              <span className="tooltip">{item.label}</span>
            </li>
          ))}
          <li className="profile">
            <div className="profile-details">
              <div className="name_job">
                <div className="name">Om Shete</div>
                <div className="job">Computer Engineering</div>
              </div>
            </div>
            <FaSignOutAlt id="log_out" />
          </li>
        </ul>
      </div>

      {/* Header with Notification and Other Buttons */}
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
            <li className="menu-item">
              <FaBell
                className="header-icon"
                title="Notifications"
                onClick={toggleNotifications}
              />
              {showNotifications && (
                <div ref={notificationRef} className="notification-popup">
                  <h4>Notifications</h4>
                  <ul>
                    <li>New research paper added</li>
                    <li>Your plagiarism check is ready</li>
                    <li>Upcoming conference on AI</li>
                  </ul>
                </div>
              )}
            </li>
            <li className="menu-item">
              <FaEnvelope className="header-icon" title="Messages" />
            </li>
            <li className="menu-item">
              <FaCog className="header-icon" title="Settings" />
            </li>
          </ul>
        </div>
      </div>
      <div className="header-space"></div>
    </>
  );
};

export default Sidebar;
