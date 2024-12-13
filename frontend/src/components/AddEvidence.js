// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileUpload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
// import web3Service from '../services/web3Service';

// const AddEvidence = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     caseNumber: '',
//     file: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [web3Initialized, setWeb3Initialized] = useState(false);

//   useEffect(() => {
//     const initWeb3 = async () => {
//       try {
//         const initialized = await web3Service.init();
//         setWeb3Initialized(initialized);
//       } catch (err) {
//         console.error('Web3 Initialization Error:', err.message);
//         setError('Failed to initialize Web3. Please connect MetaMask.');
//       }
//     };
//     initWeb3();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError('');
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError('');
//   setSuccess('');

//   if (!web3Initialized) {
//     setError('Web3 is not initialized. Please ensure MetaMask is installed and connected.');
//     setLoading(false);
//     return;
//   }

//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('User is not authenticated. Please log in.');
//       setLoading(false);
//       return;
//     }

//     const formDataObj = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key]) {
//         formDataObj.append(key, formData[key]);
//       }
//     });

//     const backendResponse = await axios.post(
//       `${process.env.REACT_APP_API_URL}/evidence/add`,
//       formDataObj,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const { ipfsHash, caseNumber } = backendResponse.data.evidence;

//     await web3Service.addEvidence(ipfsHash, caseNumber);

//     setSuccess('Evidence submitted successfully to backend and blockchain!');
//     setFormData({ title: '', description: '', caseNumber: '', file: null });
//   } catch (err) {
//     console.error('Submission error:', err);
//     setError(err.response?.data?.error || 'An error occurred while submitting evidence.');
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="add-evidence-container">
//       <h2>Submit New Evidence</h2>
//       {error && <div className="error-message">{error}</div>}
//       {success && <div className="success-message">{success}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <input
//             type="text"
//             name="title"
//             placeholder="Evidence Title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="text"
//             name="caseNumber"
//             placeholder="Case Number"
//             value={formData.caseNumber}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="file-upload" className="custom-file-upload">
//             <FontAwesomeIcon icon={faFileUpload} /> Choose File
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             onChange={handleFileChange}
//             required
//           />
//           {formData.file && <span className="file-name">{formData.file.name}</span>}
//         </div>
//         <button type="submit" disabled={loading || !web3Initialized}>
//           {loading ? (
//             <span className="loading-spinner"></span>
//           ) : (
//             <>
//               <FontAwesomeIcon icon={faPaperPlane} /> Submit Evidence
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddEvidence;
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
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { getToken } = useAuth();  // Correctly accessing getToken here

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = getToken();
      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
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
      } else {
        throw new Error(response.data.error || 'Failed to submit evidence');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'An error occurred while submitting evidence.');
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
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="loading-spinner"></span>
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
