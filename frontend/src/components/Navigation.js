// components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faList, faCheck, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
const Navigation = () => {
  return (
    <nav>
  <h1>Evidence Chain</h1>
  <ul>
    <li><Link to="/"><FontAwesomeIcon icon={faHome} /> Home</Link></li>
    <li><Link to="/add-evidence"><FontAwesomeIcon icon={faPlus} /> Add Evidence</Link></li>
    <li><Link to="/view-evidence"><FontAwesomeIcon icon={faList} /> View Evidence</Link></li>
    <li><Link to="/verify-evidence"><FontAwesomeIcon icon={faCheck} /> Verify Evidence</Link></li>
    <li><Link to="/login"><FontAwesomeIcon icon={faSignInAlt} /> Login</Link></li>
    <li><Link to="/register"><FontAwesomeIcon icon={faUserPlus} /> Register</Link></li>
  </ul>
</nav>
  );
};

export default Navigation;