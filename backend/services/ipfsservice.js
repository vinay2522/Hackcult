const { create } = require('ipfs-http-client');

// Configure IPFS client
const auth = 'Basic ' + Buffer.from(process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_SECRET).toString('base64');

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
    }
});

// Your upload function
async function uploadToIPFSWithRetry(file, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await ipfs.add(file);
            console.log(`Successfully uploaded to IPFS with hash: ${result.path}`);
            return result.path;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

// Export the function
module.exports = {
    uploadToIPFSWithRetry
};