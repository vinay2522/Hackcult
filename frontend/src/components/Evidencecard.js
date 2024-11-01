import React from 'react';

const EvidenceCard = ({ evidence }) => {
  return (
    <div style={styles.card}>
      <h3>{evidence.title}</h3>
      <p><strong>Description:</strong> {evidence.description}</p>
      <p><strong>Date:</strong> {evidence.datetime}</p>
      <p><strong>Location:</strong> {evidence.location}</p>
      <p><strong>Hash:</strong> {evidence.evidenceHash}</p>
      <p><strong>Owner:</strong> {evidence.owner}</p>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '10px',
  }
};

export default EvidenceCard;