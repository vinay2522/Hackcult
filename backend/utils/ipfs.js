const ipfsClient = require('ipfs-http-client');

// Connect to the IPFS node
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

async function uploadToIPFS(buffer) {
  try {
    const result = await ipfs.add(buffer);
    return result.path; // This is the IPFS hash
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
}

module.exports = { uploadToIPFS };