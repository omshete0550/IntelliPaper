import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaBell, FaBookOpen, FaCheckDouble, FaCompass, FaFileAlt, FaHeart, FaHome, FaSearch, FaSlidersH, FaUser } from "react-icons/fa";
import "./Sidebar.css";

const navigation = [
  { to: "/dashboard/home", icon: <FaHome />, label: "Overview" },
  { to: "/dashboard/search-paper", icon: <FaSearch />, label: "Discover papers" },
  { to: "/dashboard/saved-paper", icon: <FaHeart />, label: "Library" },
  { to: "/dashboard/plagiarism-checker", icon: <FaCheckDouble />, label: "Similarity check" },
  { to: "/dashboard/publishing-guide", icon: <FaFileAlt />, label: "Publishing guide" },
  { to: "/dashboard/conferences", icon: <FaCompass />, label: "Conferences" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  return (
    <>
      {isOpen && <button className="sidebar-backdrop" onClick={() => setIsOpen(false)} aria-label="Close navigation" />}
      <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand"><span className="sidebar-brand-mark"><FaBookOpen /></span><span>IntelliPaper</span></div>
        <nav aria-label="Workspace navigation">
          <p className="sidebar-label">WORKSPACE</p>
          <ul>{navigation.map((item) => <li key={item.to}><NavLink to={item.to} onClick={() => setIsOpen(false)}><span className="sidebar-icon">{item.icon}</span><span>{item.label}</span></NavLink></li>)}</ul>
          <p className="sidebar-label sidebar-account-label">ACCOUNT</p>
          <ul><li><NavLink to="/dashboard/profile" onClick={() => setIsOpen(false)}><span className="sidebar-icon"><FaUser /></span><span>Profile</span></NavLink></li><li><NavLink to="/dashboard/user-preference-form" onClick={() => setIsOpen(false)}><span className="sidebar-icon"><FaSlidersH /></span><span>Preferences</span></NavLink></li></ul>
        </nav>
        <div className="sidebar-user"><span className="avatar">OS</span><span><strong>Om Shete</strong><small>Researcher</small></span></div>
      </aside>
      <header className="dashboard-topbar">
        <button type="button" className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-expanded={isOpen}><FaBars /></button>
        <div><p>YOUR WORKSPACE</p><h1>Research, made organized.</h1></div>
        <button type="button" className="notification-button" aria-label="Notifications are coming soon" title="Notifications coming soon" disabled><FaBell /></button>
      </header>
    </>
  );
};

export default Sidebar;
