import React from 'react';
import { Link } from 'react-router-dom';

// Function to generate a random case ID
const generateRandomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit case ID
};

// Function to generate a 15-character unique hash with all capital letters
const generateUniqueHash = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // All capital letters
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result; // Returns a random 15-character string
};

// ViewEvidence Component
const ViewEvidence = () => {
  const caseId = generateRandomId(); // Generate a random case ID
  const uniqueHash = generateUniqueHash(); // Generate a unique hash

  return (
    <div style={styles.container}>
      <h1>Evidence Submitted Successfully!</h1>
      <p>Case ID: {caseId}</p>
      <p>Unique Hash: {uniqueHash}</p>
      <Link to="/" style={styles.link}>Go Back</Link>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
  },
  link: {
    marginTop: '1rem',
    color: '#3498db',
    textDecoration: 'none',
  },
};

export default ViewEvidence;