import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Link,
  Alert,
  Fade
} from '@mui/material';
import { VerifiedUser, Error } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const VerifyEvidence = () => {
  const [hashKey, setHashKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const verifyEvidence = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEvidence(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/evidence/verify/${hashKey}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.data.success) {
        // Get the evidence details
        const detailsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/evidence/details/${hashKey}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        setEvidence({
          ...response.data.verification,
          ...detailsResponse.data.evidence
        });
      } else {
        setError('Evidence verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify evidence');
    } finally {
      setLoading(false);
    }
  };

  const viewFile = async () => {
    if (!evidence?.ipfsHash) return;
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/evidence/file/${evidence.ipfsHash}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evidence-${evidence.caseNumber}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to download file');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Verify Evidence
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <form onSubmit={verifyEvidence}>
            <TextField
              fullWidth
              label="Evidence Hash Key"
              value={hashKey}
              onChange={(e) => setHashKey(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="Enter transaction hash or evidence ID"
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={!hashKey || loading}
              sx={{ mt: 2, height: 48 }}
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
                'Verify Evidence'
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

          {evidence && (
            <Fade in={!!evidence}>
              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {evidence.verified ? (
                      <VerifiedUser color="success" sx={{ mr: 1 }} />
                    ) : (
                      <Error color="error" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="h6" component="div">
                      {evidence.verified ? 'Evidence Verified' : 'Verification Failed'}
                    </Typography>
                  </Box>

                  <Typography variant="body1" gutterBottom>
                    <strong>Case Number:</strong> {evidence.caseNumber}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Title:</strong> {evidence.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {evidence.description}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Timestamp:</strong>{' '}
                    {new Date(evidence.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Block Number:</strong> {evidence.blockNumber}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Transaction Hash:</strong>{' '}
                    <Link
                      href={`https://sepolia.etherscan.io/tx/${evidence.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {evidence.transactionHash}
                    </Link>
                  </Typography>

                  {evidence.verified && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={viewFile}
                      sx={{ mt: 2 }}
                    >
                      View Evidence File
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Fade>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEvidence;
