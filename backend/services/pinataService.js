const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const pinataService = {
  async pinFileToIPFS(buffer, fileName) {
    if (!buffer || !fileName) {
      throw new Error('Invalid file data provided to Pinata upload');
    }

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();

    try {
      // Append file data
      data.append('file', buffer, { filename: fileName });

      // Add metadata
      const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
          uploadedAt: new Date().toISOString(),
        },
      });
      data.append('pinataMetadata', metadata);

      // Add options
      const options = JSON.stringify({
        cidVersion: 1,
        wrapWithDirectory: false,
      });
      data.append('pinataOptions', options);

      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      });

      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Pinata upload error:', error.response?.data || error.message);
      throw new Error('Failed to upload file to Pinata');
    }
  },
};

module.exports = pinataService;
