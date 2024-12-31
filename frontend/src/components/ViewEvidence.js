import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewEvidence = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvidence = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/evidence`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && response.data.success) {
          setEvidence(response.data.evidence);
        } else {
          setError('No evidence found');
        }
      } catch (err) {
        console.error('Error fetching evidence:', err.message);
        setError('Error fetching evidence. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  if (loading) return <div>Loading evidence...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="evidence-list-container">
      <h2>Evidence Records</h2>
      {evidence.length === 0 ? (
        <p>No evidence records found.</p>
      ) : (
        <div className="evidence-grid">
          {evidence.map((item) => (
            <div key={item._id} className="evidence-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewEvidence;