const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class PinataService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.apiSecret = process.env.PINATA_API_SECRET;
    this.baseUrl = 'https://api.pinata.cloud';
  }

  async pinFileToIPFS(buffer, originalname) {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('Pinata API credentials not configured');
      }

      const formData = new FormData();
      formData.append('file', buffer, {
        filename: originalname,
        contentType: 'application/octet-stream',
      });

      const response = await axios.post(`${this.baseUrl}/pinning/pinFileToIPFS`, formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.apiSecret,
        },
      });

      if (!response.data || !response.data.IpfsHash) {
        throw new Error('Invalid response from Pinata API');
      }

      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp
      };
    } catch (error) {
      console.error('Error pinning file to IPFS:', error);
      
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          throw new Error('Invalid Pinata API credentials');
        } else if (status === 413) {
          throw new Error('File too large for IPFS upload');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded for IPFS uploads');
        }
      }
      
      throw new Error('Failed to upload file to IPFS: ' + error.message);
    }
  }

  async getFileFromIPFS(ipfsHash) {
    try {
      if (!ipfsHash) {
        throw new Error('IPFS hash is required');
      }

      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
        responseType: 'arraybuffer'
      });

      return {
        data: response.data,
        contentType: response.headers['content-type']
      };
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error);
      throw new Error('Failed to retrieve file from IPFS: ' + error.message);
    }
  }

  async testConnection() {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('Pinata API credentials not configured');
      }

      const response = await axios.get(`${this.baseUrl}/data/testAuthentication`, {
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.apiSecret,
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error('Error testing Pinata connection:', error);
      return false;
    }
  }
}

module.exports = new PinataService();
