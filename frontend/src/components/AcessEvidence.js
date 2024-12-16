import React, { useState } from 'react';
import axios from 'axios';

const AccessEvidence = () => {
  const [formData, setFormData] = useState({
    caseId: '',
    username: '',
    password: '',
    designation: '',
  });
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { caseId, username, password, designation } = formData;

    // Simple authentication logic
    if (username !== 'admin' || password !== 'password' || designation !== 'investigator') {
      setError('Unauthorized access. Please check your credentials.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/evidence/${caseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.evidence) {
        setEvidence(response.data.evidence);
      } else {
        setError('Evidence not found for the provided Case ID.');
      }
    } catch (err) {
      console.error('Error fetching evidence:', err.message);
      setError('Error fetching evidence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Access Evidence</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Case ID:</label>
          <input
            type="text"
            name="caseId"
            value={formData.caseId}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          {loading ? 'Loading...' : 'Access Evidence'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {evidence && (
        <div style={styles.evidenceContainer}>
          <h3>Evidence Details</h3>
          <p><strong>Title:</strong> {evidence.title}</p>
          <p><strong>Description:</strong> {evidence.description}</p>
          <p><strong>Date and Time:</strong> {new Date(evidence.datetime).toLocaleString()}</p>
          <p><strong>Location:</strong> {evidence.location}</p>
          <p>
            <strong>File:</strong>
            <a href={evidence.file} target="_blank" rel="noopener noreferrer"> View File</a>
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.8rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  evidenceContainer: {
    marginTop: '2rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  },
};

export default AccessEvidence;
