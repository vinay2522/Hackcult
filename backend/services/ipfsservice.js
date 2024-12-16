const { create } = require('ipfs-http-client');

class ipfsservice {
  constructor() {
    const auth = `Basic ${Buffer.from(
      `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
    ).toString('base64')}`;

    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: { authorization: auth },
    });
  }

  // Upload file to IPFS
  async uploadToIPFS(buffer) {
    try {
      const result = await this.ipfs.add(buffer);
      return {
        cid: result.cid.toString(),
        path: result.path,
        size: result.size,
      };
    } catch (error) {
      console.error('IPFS upload error:', error.message);
      throw new Error('Failed to upload to IPFS');
    }
  }

  // Retrieve file from IPFS
  async getFromIPFS(cid) {
    try {
      const stream = this.ipfs.cat(cid);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('IPFS retrieval error:', error.message);
      throw new Error('Failed to retrieve from IPFS');
    }
  }
}

module.exports = new ipfsservice();
