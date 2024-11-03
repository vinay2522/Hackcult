// components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Secure Your Digital Evidence</h1>
        <p>Blockchain-powered evidence management for unparalleled integrity and transparency.</p>
        <Link to="/register" className="cta-button">Get Started</Link>
      </section>
      
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Immutable Records</h3>
            <p>Store evidence securely on the blockchain, ensuring it can't be tampered with.</p>
          </div>
          <div className="feature-card">
            <h3>Easy Verification</h3>
            <p>Quickly verify the authenticity and integrity of any piece of evidence.</p>
          </div>
          <div className="feature-card">
            <h3>Audit Trail</h3>
            <p>Maintain a complete, transparent history of all evidence interactions.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;