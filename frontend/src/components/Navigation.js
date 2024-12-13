import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faList, faCheck, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
  return (
    <nav className="navigation">
      <h1 className="navigation-title">Evidence Chain</h1>
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/" aria-label="Home">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/add-evidence" aria-label="Add Evidence">
            <FontAwesomeIcon icon={faPlus} /> Add Evidence
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/view-evidence" aria-label="View Evidence">
            <FontAwesomeIcon icon={faList} /> View Evidence
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/verify-evidence" aria-label="Verify Evidence">
            <FontAwesomeIcon icon={faCheck} /> Verify Evidence
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/login" aria-label="Login">
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/register" aria-label="Register">
            <FontAwesomeIcon icon={faUserPlus} /> Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;