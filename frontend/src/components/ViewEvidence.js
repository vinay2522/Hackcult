// components/ViewEvidence.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewEvidence = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/evidence`,
          {
            headers: {
              'x-auth-token': token
            }
          }
        );
        setEvidence(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching evidence:', error);
        setLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="evidence-list-container">
      <h2>Evidence List</h2>
      <div className="evidence-grid">
        {evidence.map(item => (
          <div key={item._id} className="evidence-card">
            <h3>{item.title}</h3>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Date/Time:</strong> {new Date(item.datetime).toLocaleString()}</p>
            <p><strong>Location:</strong> {item.location}</p>
            {item.ipfsHash && (
              <p><strong>IPFS Hash:</strong> {item.ipfsHash}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewEvidence;