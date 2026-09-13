import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

const MotionDiv = motion.div;

const Home = () => (
  <><Navbar /><main className="hero"><MotionDiv className="hero-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut" }}><h1>Make space for <span className="highlight">better research.</span></h1><p>A focused workspace to discover literature, build your reading list, and move your research forward with confidence.</p><MotionDiv whileHover={{ y: -2 }}><Link className="explore-btn" to="/dashboard">Open your workspace <span>→</span></Link></MotionDiv></MotionDiv></main><Footer /></>
);
export default Home;
