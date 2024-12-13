import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EvidenceCard from './Evidencecard';

const ViewEvidence = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvidence = async () => {
      setLoading(true);  // Set loading true before fetching data
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/evidence`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  // Fetch token from localStorage
          }
        });

        if (Array.isArray(response.data.evidence)) {
          setEvidence(response.data.evidence);  // If data is an array, update evidence state
        } else {
          setError('Unexpected response format');  // Handle case where the response is not as expected
        }
      } catch (error) {
        console.error('Error fetching evidence:', error);
        setError('Error fetching evidence');  // Set error state if request fails
      } finally {
        setLoading(false);  // Set loading to false after request is complete
      }
    };

    fetchEvidence();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="evidence-list-container">
      <h2>Evidence Records</h2>
      <div className="evidence-grid">
        {evidence.map((item) => (
          <EvidenceCard key={item._id} evidence={item} />
        ))}
      </div>
    </div>
  );
};

export default ViewEvidence;