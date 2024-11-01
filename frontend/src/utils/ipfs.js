const { create } = require('ipfs-http-client');

const auth = 'Basic ' + Buffer.from(
  process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_SECRET
).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const uploadToIPFS = async (buffer) => {
  try {
    const result = await ipfs.add(buffer);
    return result.path;
  } catch (error) {
    throw new Error(`IPFS upload error: ${error.message}`);
  }
};

const getFromIPFS = async (hash) => {
  try {
    const stream = ipfs.cat(hash);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    throw new Error(`IPFS retrieval error: ${error.message}`);
  }
};

module.exports = {
  uploadToIPFS,
  getFromIPFS
};