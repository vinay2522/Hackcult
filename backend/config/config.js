const config = {
    development: {
      mongodb_uri: 'mongodb://localhost:27017/evidence-chain',
      blockchain_url: 'http://localhost:7545',
      jwt_secret: 'your_jwt_secret_dev',
      ipfs_project_id: process.env.IPFS_PROJECT_ID,
      ipfs_project_secret: process.env.IPFS_PROJECT_SECRET
    },
    production: {
      mongodb_uri: process.env.MONGODB_URI,
      blockchain_url: process.env.BLOCKCHAIN_URL,
      jwt_secret: process.env.JWT_SECRET,
      ipfs_project_id: process.env.IPFS_PROJECT_ID,
      ipfs_project_secret: process.env.IPFS_PROJECT_SECRET
    }
  };
  
  module.exports = config[process.env.NODE_ENV || 'development'];