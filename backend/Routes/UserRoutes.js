const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../Models/UserModel');
const generateJwt = require('../Utils/GenerateJWT');
const authenticate = require('../Middleware/authenticate');
const isAdmin = require('../Middleware/isAdmin');

const router = require('express').Router();

//@description     Register new user
//@route           POST /api/user/
//@access          Public
router.post('/', [
  body('email', 'Email is not valid').isEmail(),
  body('password')
      .isLength({ min: 8 }).withMessage('Minimum length of password must be 8')
      .not().isNumeric().withMessage('Password must contain an alphabet')
      .not().isAlpha().withMessage('Password must contain a number')
      .not().isUppercase().withMessage('Password must contain a lowercase letter')
      .not().isLowercase().withMessage('Password must contain a uppercase letter')
], async (req, res) => {
  const {email, password, role} = req.body;

  // remove the below line to make this route accessible
  return res.status(405).json({error: 'Not allowed'});
  
  // check for validation error 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({error: errors.array()})
  }

  try {
    // check if user with same email already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(409).json({ error: 'User already exists with this email' })
    }

    // generate salt for the password 
    const salt = await bcrypt.genSalt(10);

    // create hash for the password 
    const hash = await bcrypt.hash(password, salt)

    // create user object from request body and send success response
    User.create({
      email,
      password: hash,
      role
    }).then((user) => {
      // generate jwt token 
      const payload = {
        id: user._id,
        email,
      }
      const token = generateJwt(payload);

      res.status(200).json({ message: 'Sign up success', token });
    })
  } catch (error) {
    if (error) {
      console.error('Error creating account: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }

})

//@description     Register new user only by admin
//@route           POST /api/user/register
//@access          Private + Admin
router.post('/register', [
  body('email', 'Email is not valid').isEmail()
  .custom(value => { 
    if (!value.endsWith('@niveshonline.com')) {
    throw new Error('Email must be on the @niveshonline.com domain');
  }
  return true;})], 
  authenticate, isAdmin, async (req, res) => {
  const {email, role} = req.body;
  
  // check for validation error 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({error: errors.array()})
  }

  try {
    // check if user with same email already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(409).json({ error: 'User already exists with this email' })
    }

    // create user object from request body and send success response
    const userObject = {email};
    if(role !== '' && role.length >= 0) {userObject.role = role}

    User.create(userObject).then((user) => {
      res.status(201).json({ message: 'User registered', user });
    })
  } catch (error) {
    if (error) {
      console.error('Error registering account: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }

})


//@description     Login
//@route           POST /api/user/login
//@access          Public
router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    // find user in DB 
    const user = await User.findOne({email});
  
    // return error if user doesn't exist 
    if(!user) {
      return res.status(404).json({error: 'User does not exist'});
    }
  
    // compare passwords 
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched) {
      return res.status(401).json({error: 'Incorrect password'});
    }

    // generate JWT token 
    const token = generateJwt({
      id: user._id,
      email: user.email
    })
    
    res.status(200).json({message: 'Login success', token});
  } catch (error) {
    if (error) {
      console.error('Error login: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})


//@description     Get User
//@route           GET /api/user
//@access          Protected
router.get('/', authenticate, async (req, res) => {
  const {id} = req.user;

  try {
    // find user in DB 
    const user = await User.findById(id).select('-password');
  
    // return error if user doesn't exist 
    if(!user) {
      return res.status(404).json({error: 'User does not exist'});
    }
    
    res.status(200).json({user});
  } catch (error) {
    if (error) {
      console.error('Error getting user: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})


//@description     Get all users
//@route           GET /api/user/all + accept query[role]
//@access          Protected + Admin
router.get('/all', authenticate, isAdmin, async (req, res) => {
  const { role } = req.query;
 
  // query object 
  const query = {}

  // add role to query if not empty 
  if(role) {
    query.role = role;
  }

  try {
    // find users in DB 
    const users = await User.find(query).select('-password').sort({createdAt: -1});
    
    res.status(200).json({users});
  } catch (error) {
    if (error) {
      console.error('Error getting users: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})


//@description     Update Password
//@route           GET /api/user/change-password
//@access          Protected
router.put('/change-password', [
  body('oldPassword', 'Old password must not be empty').exists(),
  body('newPassword')
      .isLength({ min: 8 }).withMessage('Minimum length of password must be 8')
      .not().isNumeric().withMessage('Password must contain an alphabet')
      .not().isAlpha().withMessage("Password must contain a number")
      .not().isUppercase().withMessage('Password must contain a lowercase letter')
      .not().isLowercase().withMessage('Password must contain a uppercase letter')
], authenticate, async (req, res) => {
  const {id} = req.user;

  // destructure old and new passwords from request body 
  const {oldPassword, newPassword} = req.body;

  try {
    // check for validation errors 
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({error: errors.array()})
    }

    // find user in DB 
    const user = await User.findById(id);
  
    // return error if user doesn't exist 
    if(!user) {
      return res.status(404).json({error: 'User does not exist'});
    }

    // compare old password with stored password 
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    // return error if old password doesn't matched 
    if(!isPasswordMatched) {
      return res.status(401).json({error: "Wrong password"})
    }

    // generate salt for the new password 
    const salt = await bcrypt.genSalt(10);

    // generate hash of new password 
    const newHash = bcrypt.hashSync(newPassword, salt)
    
    // update password in DB 
    user.password = newHash;
    await user.save();

    res.status(200).json({message: 'Password updated', user});
  } catch (error) {
    if (error) {
      console.error('Error updating password: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})


//@description     Delete User
//@route           DELETE /api/user/userId
//@access          Protected + Admin
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const adminId = req.user.id;
  const userId = req.params.id;

  // destructure admin password from request body 
  // const { password } = req.body;

  try {
    // Get admin user to compare password
    // const admin = await User.findById(adminId);

    // // compare admin passwords 
    // const isPasswordMatched = await bcrypt.compare(password, admin.password);

    // // return error if admin password doesn't matched 
    // if(!isPasswordMatched) {
    //   return res.status(401).json({error: "Wrong password"})
    // }

    // find and delete the user 
    const user = await User.findByIdAndDelete(userId);
  
    // return error if unable to delete
    if(!user) {
      return res.status(400).json({error: 'Unable to delete the user'});
    }

    res.status(200).json({message: 'User deleted', user});
  } catch (error) {
    if (error) {
      console.error('Error deleting user: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})

module.exports = router;