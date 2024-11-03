// frontend/src/components/AddEvidence.js
import React, { useState } from 'react';
import axios from 'axios';
import useWeb3 from '../hooks/useWeb3';
const AddEvidence = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        caseNumber: '',
        file: null
    });
    const { account, contract } = useWeb3();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataObj = new FormData();
            Object.keys(formData).forEach(key => {
                formDataObj.append(key, formData[key]);
            });

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/evidence/add`,
                formDataObj,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            alert('Evidence submitted successfully!');
            // Reset form or redirect
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting evidence');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-evidence-container">
            <h2>Submit New Evidence</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="title"
                        placeholder="Evidence Title"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="caseNumber"
                        placeholder="Case Number"
                        onChange={(e) => setFormData({...formData, caseNumber: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        placeholder="Description"
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="file"
                        onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Evidence'}
                </button>
            </form>
        </div>
    );
};

export default AddEvidence;