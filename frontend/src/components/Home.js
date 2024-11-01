import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Evidence Chain</h1>
      <p>A decentralized platform for managing digital evidence</p>
      <div style={styles.buttons}>
        <Link to="/add" style={styles.button}>Add New Evidence</Link>
        <Link to="/view" style={styles.button}>View Evidence</Link>
        <Link to="/acess" style={styles.button}>Access Evidence</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  button: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  }
};

export default Home;