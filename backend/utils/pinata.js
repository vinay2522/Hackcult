const axios = require('axios');
const FormData = require('form-data');

class PinataService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.secretApiKey = process.env.PINATA_SECRET_API_KEY;
  }

  async pinFileToIPFS(fileBuffer, fileName) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    let data = new FormData();
    data.append('file', fileBuffer, fileName);

    const config = {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretApiKey
      }
    };

    try {
      const response = await axios.post(url, data, config);
      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      throw new Error('Failed to upload to Pinata');
    }
  }

  async pinJSONToIPFS(jsonData) {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretApiKey
      }
    };

    try {
      const response = await axios.post(url, jsonData, config);
      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error);
      throw new Error('Failed to upload JSON to Pinata');
    }
  }
}

module.exports = new PinataService();