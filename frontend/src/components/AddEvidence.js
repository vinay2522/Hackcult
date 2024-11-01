import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// AddEvidence Component
const AddEvidence = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datetime: '',
    location: '',
    file: null
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a unique hash
    const uniqueHash = generateHash();

    // Show a pop-up message
    alert('Evidence submitted successfully!');

    // Redirect to ViewEvidence with the case ID and hash
    navigate('/view-evidence', { state: { caseId: formData.title, uniqueHash } });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Function to generate a unique hash
  const generateHash = () => {
    return '0x' + Math.random().toString(16).slice(2, 10); // Random hash
  };

  return (
    <div style={styles.container}>
      <h2>Add New Evidence</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Case Id:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Date and Time:</label>
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Evidence File:</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Add Evidence
        </button>
      </form>
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
  textarea: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minHeight: '100px',
  },
  button: {
    padding: '0.8rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AddEvidence;