import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }} // Start off-screen
          animate={{ opacity: 1, y: 0 }} // Fade in and move up
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome to <span className="highlight">IntelliPaper</span> Your
            Ultimate Research Companion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Find relevant research papers, check plagiarism, and get guidance on
            publishing. Stay updated with upcoming academic conferences—all in
            one platform.
          </motion.p>

          <motion.button
            className="explore-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }} // Slight pop effect on hover
          >
            EXPLORE MORE →
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
