// frontend/src/components/ViewEvidence.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useWeb3 from '../hooks/useWeb3';
import EvidenceCard from './Evidencecard';

const ViewEvidence = () => {
    const [evidence, setEvidence] = useState([]);
    const [loading, setLoading] = useState(true);
    const { contract } = useWeb3();

    useEffect(() => {
        fetchEvidence();
    }, [contract]);

    const fetchEvidence = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/evidence`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Fetch blockchain data for each evidence
            const evidenceWithBlockchainData = await Promise.all(
                response.data.map(async (item) => {
                    try {
                        const blockchainData = await contract.methods
                            .getEvidence(item.blockchainId)
                            .call();
                        return { ...item, blockchainData };
                    } catch (error) {
                        console.error(`Error fetching blockchain data for evidence ${item._id}:`, error);
                        return item;
                    }
                })
            );

            setEvidence(evidenceWithBlockchainData);
        } catch (error) {
            console.error('Error fetching evidence:', error);
            alert('Error loading evidence');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

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