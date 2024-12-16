import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const AddEvidence = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseNumber: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  const { getToken } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 50 * 1024 * 1024; // 50 MB limit

      if (file.size > maxSize) {
        setError('File size exceeds the 50MB limit.');
        return;
      }

      setFormData((prev) => ({ ...prev, file }));
      
      // Create file preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!process.env.REACT_APP_API_URL) {
      setError('API URL is not configured. Please set REACT_APP_API_URL.');
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error('User not authenticated. Please log in.');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('caseNumber', formData.caseNumber);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/evidence/add`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess('Evidence submitted successfully!');
        setFormData({ title: '', description: '', caseNumber: '', file: null });
        setFilePreview(null);
      } else {
        throw new Error(response.data.error || 'Failed to submit evidence');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'An error occurred while submitting evidence.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-evidence-container">
      <h2>Submit New Evidence</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Evidence Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="caseNumber"
            placeholder="Case Number"
            value={formData.caseNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="file-upload" className="custom-file-upload">
            <FontAwesomeIcon icon={faFileUpload} /> Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            required
          />
          {formData.file && <span className="file-name">{formData.file.name}</span>}
          {filePreview && (
            <div className="file-preview">
              {formData.file.type.startsWith('image/') ? (
                <img src={filePreview} alt="File Preview" />
              ) : (
                <p>File uploaded: {formData.file.name}</p>
              )}
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="loading-spinner">Submitting...</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} /> Submit Evidence
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddEvidence;