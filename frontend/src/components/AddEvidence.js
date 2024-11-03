// components/AddEvidence.js
import React, { useState } from 'react';
import axios from 'axios';

const AddEvidence = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datetime: '',
    location: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // frontend/src/components/AddEvidence.js
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  Object.keys(evidenceData).forEach(key => {
    formData.append(key, evidenceData[key]);
  });
  
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/evidence/add`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    alert('Evidence added successfully!');
    navigate('/view');
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to add evidence');
  }
};

  return (
    <div className="add-evidence-container">
      <h2>Add New Evidence</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Evidence Title"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="datetime-local"
            name="datetime"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            name="file"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit Evidence</button>
      </form>
    </div>
  );
};

export default AddEvidence;