const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

module.exports = function generateJWT(payload) {
  const token = jwt.sign(payload, secret, {expiresIn: '15d'});
  return token;
}