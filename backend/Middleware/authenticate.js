const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

module.exports = async function authenticate(req, res, next) {
  const token = req.header('token');
  if(!token) {
    console.error('Token not available')
    return res.status(401).json({error: 'unauthorized'});
  }

  // verify token and retrieve user data 
  const decode = await jwt.verify(token, secret);

  // set user data to request 
  req.user = decode;

  // call next middleware
  next();
}