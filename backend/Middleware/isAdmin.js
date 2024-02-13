const User = require("../Models/UserModel");

module.exports = async function isAdmin(req, res, next){
  const userid = req.user.id;

  // get user data from DB 
  const user = await User.findById(userid);
  if(!user) {
    console.error('Unable to find user in database');
    return res.status(404).json({error: 'User not found'})
  }

  // return error if user is not admin 
  if(user.role !== 'admin') {
    return res.status(403).json("Unauthorized access");
  }

  // call next middleware function 
  next();
}