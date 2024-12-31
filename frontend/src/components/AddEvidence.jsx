import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link
} from '@mui/material';
import { CloudUpload, CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AddEvidence = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseNumber: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      setFormData(prev => ({ ...prev, file }));
      setError('');
    } else {
      setError('File size should be less than 10MB');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('caseNumber', formData.caseNumber);
      formDataToSend.append('file', formData.file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/evidence/add`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess(response.data);
        setFormData({
          title: '',
          description: '',
          caseNumber: '',
          file: null
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Add New Evidence
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Case Number"
              name="caseNumber"
              value={formData.caseNumber}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2, height: 56 }}
              disabled={loading}
            >
              <CloudUpload sx={{ mr: 1 }} />
              Upload Evidence File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
              />
            </Button>

            {formData.file && (
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Selected file: {formData.file.name}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formData.file || loading}
              sx={{ mt: 3, height: 48 }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                'Add Evidence'
              )}
            </Button>
          </form>

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}
        </Paper>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Processing Evidence...
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please wait while we secure your evidence on the blockchain
            </Typography>
          </Box>
        </Backdrop>

        <Dialog
          open={!!success}
          onClose={handleCloseSuccess}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleOutline color="success" sx={{ mr: 1 }} />
            Evidence Added Successfully
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              Your evidence has been successfully added to the blockchain and IPFS.
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Transaction Hash:</strong>
            </Typography>
            <Link
              href={`https://sepolia.etherscan.io/tx/${success?.evidence?.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ wordBreak: 'break-all' }}
            >
              {success?.evidence?.transactionHash}
            </Link>
            <Typography variant="body2" sx={{ mt: 2 }}>
              You can use this transaction hash to verify your evidence later.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccess}>Close</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleCloseSuccess();
                // You can add navigation to verify page here if needed
              }}
            >
              Verify Now
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AddEvidence;
