import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Login from "../../pages/Login/Login";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { FaBookOpen, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <nav className="navbar_container">
        <Link className="logo" to="/" aria-label="IntelliPaper home">
          <span className="logo-mark"><FaBookOpen /></span>
          <span>IntelliPaper</span>
        </Link>
        <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul className={isMenuOpen ? "open" : ""}>
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Workspace</Link>
          </li>
          <li>
            <button className="nav-login" onClick={toggleDrawer}>Sign in</button>
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
