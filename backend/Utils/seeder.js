const User = require("../Models/UserModel");

async function createAdmin() {
  try {
    const admins = await User.countDocuments({role: 'admin'});
    if(admins && admins > 0) {
      console.log('Admin exists');
      return;
    }
  
    // create an admin 
    let newAdmin = await User.create({
      email: 'kishan@niveshonline.com',
      role: 'admin',
    });
    await newAdmin.save();
    console.log('Admin created')
  } catch (error) {
    console.error('Error while checking or creating admin', error.message)
  }
}

module.exports = createAdmin;