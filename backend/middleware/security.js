const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const securityMiddleware = (app) => {
  // Set security headers
  app.use(helmet());

  // Sanitize data
  app.use(mongoSanitize());

  // Prevent XSS attacks
  app.use(xss());

  // Add CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
};

module.exports = securityMiddleware;