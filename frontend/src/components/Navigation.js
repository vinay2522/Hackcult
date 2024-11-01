// components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faList, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
const Navigation = () => {
  return (
    <nav>
      <h1>Evidence Management System</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add">Add Evidence</Link></li>
        <li><Link to="/view">View Evidence</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;