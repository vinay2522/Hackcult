// frontend/src/components/VerifyEvidence.js
import React, { useState } from 'react';
import useWeb3 from '../hooks/useWeb3';
import axios from 'axios';

const VerifyEvidence = () => {
    const [evidenceId, setEvidenceId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const { contract, loading } = useWeb3();

    const verifyEvidence = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/evidence/verify/${evidenceId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.verified) {
                setVerificationResult({
                    verified: true,
                    data: response.data.evidence
                });
            } else {
                setVerificationResult({
                    verified: false,
                    message: 'Evidence not found or invalid'
                });
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationResult({
                verified: false,
                message: 'Error verifying evidence'
            });
        }
    };


    return (
        <div className="verify-evidence-container">
            <h2>Verify Evidence</h2>
            <form onSubmit={verifyEvidence}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Enter Evidence ID"
                        value={evidenceId}
                        onChange={(e) => setEvidenceId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    Verify Evidence
                </button>
            </form>

            {verificationResult && (
                <div className={`verification-result ${verificationResult.verified ? 'success' : 'error'}`}>
                    {verificationResult.verified ? (
                        <div>
                            <h3>Evidence Verified ✓</h3>
                            <p>Case Number: {verificationResult.data.caseNumber}</p>
                            <p>Submitted By: {verificationResult.data.submitter}</p>
                            <p>Timestamp: {new Date(verificationResult.data.timestamp * 1000).toLocaleString()}</p>
                            <p>IPFS Hash: {verificationResult.data.evidenceHash}</p>
                        </div>
                    ) : (
                        <div>
                            <h3>Verification Failed ✗</h3>
                            <p>{verificationResult.message}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VerifyEvidence;