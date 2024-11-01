import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy data for evidence (In a real application, this would come from a database)
const evidenceData = {
  'case123': {
    title: 'Sample Evidence',
    description: 'This is a description of the evidence.',
    datetime: '2023-10-01T12:00',
    location: 'Sample Location',
    file: 'sample-file.pdf',
  },
  // Add more cases as needed
};

// AccessEvidence Component
const AccessEvidence = () => {
  const [formData, setFormData] = useState({
    caseId: '',
    username: '',
    password: '',
    designation: '',
  });
  const [evidence, setEvidence] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy authentication check
    const { caseId, username, password, designation } = formData;

    // Replace this with actual authentication logic
    if (username === 'admin' && password === 'password' && designation === 'investigator') {
      const evidenceItem = evidenceData[caseId];
      if (evidenceItem) {
        setEvidence(evidenceItem);
      } else {
        alert('Evidence not found for the provided Case ID.');
      }
    } else {
      alert('Unauthorized access. Please check your credentials.');
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
          Access Evidence
        </button>
      </form>

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
  
  // Styles
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
        