import React, { useState } from "react";
import "./Login.css";
import { BsLock, BsPerson } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion"; // Import animation library

const MotionDiv = motion.div;

const Login = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="login_container">

      <div className="close_btn" onClick={onClose}>
        <AiFillCloseCircle />
      </div>

      <AnimatePresence mode="wait">
        {isRegister ? (
          <MotionDiv
            key="register"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {/* Register Header */}
            <div className="login_header">
              <h1>Create an Account</h1>
              <p>Sign up to explore and publish research papers.</p>
            </div>

            {/* Register Inputs */}
            <div className="login_inputs">
              <label className="label">
                <span className="icon">
                  <BsPerson />
                </span>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter name"
                  autoComplete="off"
                />
              </label>

              <label className="label">
                <span className="icon">
                  <MdEmail />
                </span>
                <input
                  type="email"
                  className="input"
                  placeholder="Enter email"
                  autoComplete="off"
                />
              </label>

              <label className="label">
                <span className="icon">
                  <BsLock />
                </span>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter password"
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="login_submit">
              <span>
                Already have an account?{" "}
                <span
                  onClick={() => setIsRegister(false)}
                  className="toggle_link"
                >
                  Login
                </span>
              </span>
              <button>Sign Up</button>
            </div>
          </MotionDiv>
        ) : (
          <MotionDiv
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <div className="login_header">
              <h1>Welcome Back!</h1>
              <p>Login to continue exploring research papers.</p>
            </div>

            <div className="login_inputs">
              <label className="label">
                <span className="icon">
                  <BsPerson />
                </span>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter name"
                  autoComplete="off"
                />
              </label>

              <label className="label">
                <span className="icon">
                  <BsLock />
                </span>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter password"
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="login_submit">
              <span>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsRegister(true)}
                  className="toggle_link"
                >
                  Register
                </span>
              </span>
              <button>Sign In</button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
