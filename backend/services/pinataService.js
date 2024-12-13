const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Ensure this is configured

const pinataApiKey = String(process.env.PINATA_API_KEY || '');
const pinataSecretApiKey = String(process.env.PINATA_SECRET_API_KEY || '');

// Debugging environment variables
console.log('Pinata API Key:', typeof pinataApiKey, pinataApiKey);
console.log('Pinata Secret API Key:', typeof pinataSecretApiKey, pinataSecretApiKey);

const pinataService = {
  uploadFile: async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const metadata = JSON.stringify({
      name: file.originalname,
    });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    data.append('pinataOptions', options);

    try {
      const response = await axios.post(url, data, {
        maxContentLength: 'Infinity', // Prevent issues with large files
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file to Pinata:', error.response ? error.response.data : error.message);
      throw new Error('Error uploading file to Pinata');
    }
  },
};

module.exports = pinataService;
