const { create } = require('ipfs-http-client');

class IPFSService {
  constructor() {
    const auth = 'Basic ' + Buffer.from(
      process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_SECRET
    ).toString('base64');

    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });
  }

  // Upload buffer to IPFS
  async uploadToIPFS(buffer) {
    try {
      const result = await this.ipfs.add(buffer);  // Upload the file buffer to IPFS
      return {
        path: result.path,  // The file's path in IPFS
        cid: result.cid.toString(),  // The unique CID (hash) of the file
        size: result.size,           // Size of the file in bytes
      };
    } catch (error) {
      if (error.message.includes('unauthorized')) {
        console.error('IPFS authorization error: Please check your project ID and secret.');
      }
      console.error('IPFS upload error:', error.message);
      throw new Error('Failed to upload to IPFS');
    }
  }

  // Retrieve file from IPFS using hash
  async getFromIPFS(hash) {
    try {
      const stream = this.ipfs.cat(hash);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks); // Return the file content as a buffer
    } catch (error) {
      console.error(`IPFS retrieval error for hash ${hash}:`, error.message);
      throw new Error('Failed to retrieve from IPFS');
    }
  }
}

module.exports = new IPFSService();
