// utils/generateToken.js — Creates a signed JWT for a user
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }  // User stays logged in for 30 days
  );
};

module.exports = generateToken;
