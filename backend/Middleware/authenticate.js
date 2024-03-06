const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

module.exports = async function authenticate(req, res, next) {
  const token = req.cookies['user-token'];
  if(!token) {
    console.error('Token not available')
    return res.status(401).json({error: 'Unauthorized'});
  }

  // verify token and retrieve user data 
  jwt.verify(token, secret, (err, decoded) => {
    if(err) {
      console.log("Invalid token or secret");
      return res.status(403).json({error: 'Forbidden'})
    }

    // set user data to request 
    req.user = decoded;
    
    // call next middleware
    next();
  });
}