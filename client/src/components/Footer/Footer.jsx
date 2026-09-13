import { Link } from "react-router-dom";
import { FaBookOpen, FaGithub, FaLinkedin } from "react-icons/fa";
import "./Footer.css";
const Footer = () => <footer className="footer"><div className="footer-brand"><span className="footer-mark"><FaBookOpen /></span><div><strong>IntelliPaper</strong><p>A calmer place to do meaningful research.</p></div></div><div className="footer-links"><Link to="/dashboard">Workspace</Link><a href="#top">Back to top</a><a href="#" aria-label="GitHub"><FaGithub /></a><a href="#" aria-label="LinkedIn"><FaLinkedin /></a></div></footer>;
export default Footer;
