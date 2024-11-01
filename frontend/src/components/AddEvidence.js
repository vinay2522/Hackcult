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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/evidence/add`,
        formDataToSend,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Evidence added successfully!');
      // Redirect to evidence list
      window.location.href = '/view';
    } catch (error) {
      console.error('Error adding evidence:', error);
      alert('Error adding evidence');
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