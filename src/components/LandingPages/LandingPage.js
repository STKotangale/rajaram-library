// LandingPage.js
import React from 'react';
import './LandingPage.css';
import logoImage from '../../assets/rajalib.png';
import illustrationImage from '../../assets/rajaram.jpg';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <img src={logoImage} alt="Library Logo" className="library-logo" />
        <nav className="landing-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#search" className="search-icon">
            {/* Icon for search goes here */}
          </a>
        </nav>
      </header>

      <div className="content">
        <div className="login-container">
          <h2>Login</h2>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required />
            </div>
            <button type="submit" className="login-btn">Login</button>
            <a href="#forgot" className="forgot-password">Forgot password?</a>
          </form>
        </div>
        <div className="illustration-container">
          <img src={illustrationImage} alt="Boy Reading a Book" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
