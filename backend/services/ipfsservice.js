// backend/services/ipfsService.js
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

    async uploadToIPFS(buffer) {
        try {
            const result = await this.ipfs.add(buffer);
            return result.path;
        } catch (error) {
            console.error('IPFS upload error:', error);
            throw new Error('Failed to upload to IPFS');
        }
    }

    async getFromIPFS(hash) {
        try {
            const stream = this.ipfs.cat(hash);
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error('IPFS retrieval error:', error);
            throw new Error('Failed to retrieve from IPFS');
        }
    }
}

module.exports = new IPFSService();