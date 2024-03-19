const express = require('express')
const connectToMongo = require('./db')
const app = express();
const cors = require('cors');
const path = require('path')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
require('dotenv').config();

// import routes
const userRoutes = require('./Routes/UserRoutes')
const linkRoutes = require('./Routes/LinkRoutes');
const generateJWT = require('./Utils/GenerateJWT');
const User = require('./Models/UserModel');

// middleware to parse incoming request body 
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// response to Homepage 
app.get('/', (req, res)=> {
  res.end('Happy Hacking!');
})

// API routes 
app.use('/api/user', userRoutes)
app.use('/api/link', linkRoutes)

//@description     login with zoho
//@route           GET /auth/zoho
//@access          Public
app.get("/auth/zoho", (req, res) => {
  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${process.env.ZOHO_CLIENT_ID}&scope=profile,email&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&access_type=offline`;
  res.redirect(authUrl);
});

//@description     callback where zoho will redirect
//@route           GET /auth/zoho/callback
//@access          zoho
app.get("/auth/zoho/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResponse = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          redirect_uri: process.env.ZOHO_REDIRECT_URI,
          code: code,
        },
      }
    );

    let id_token = tokenResponse.data.id_token;
    const decode = jwt.decode(id_token);

    // Check if the user is from your own company
    const allowedDomain = "niveshonline.com"; //company's domain

    // redirect to login page if user is not from same domain 
    if(!decode.email.endsWith(`@${allowedDomain}`)) {
      return res.redirect('/login?error=userNotFound');
    }

    // find if user exists in DB 
    let userExists = await User.findOne({email: decode.email}).select('-password');

    // create new user if it does not exist
    if(!userExists) {
      console.log('creating new user...')// test
     await User.create({
        email: decode.email,
        role: 'user'
      }).then(user => userExists = user);
    }
    
    // generate JWT of received user 
    const token = generateJWT({
      id: userExists._id,
      email: userExists.email
    })

    res.cookie('user-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: false,
      maxAge: 24 * 60 * 60 * 1000
    })

    // redirect to homepage 
    res.redirect('/')
  } catch (error) {
    console.error("Error during authentication", error);
    res.status(500).send("Authentication failed");
  }
});

//@description     to check is user is logged in or not
//@route           GET /auth/isAuthenticated
//@access          public
app.get('/auth/isAuthenticated', (req, res) => {
  const token = req.cookies['user-token'];
  if(!token) {
    console.error('Token not available')
    return res.status(200).json({'isAthenticated': false});
  }

  // verify token and retrieve user data 
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) {
      console.log("Invalid token or secret");
      return res.status(200).json({'isAthenticated': false})
    }

    // set user data to request 
    return res.status(200).json({'isAthenticated': true})
  })
})

//@description     logout
//@route           POST /auth/logout
//@access          protected
app.post('/auth/logout', (req, res) => {
  const token = req.cookies['user-token'];
  if(!token) {
    console.error('Token not available')
    return res.status(403).json({'error': 'forbidden'});
  }

  // clear cookie and redirect to login page 
  res.clearCookie('user-token');
  res.redirect('/login')
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// listening to app 
app.listen(port, ()=> {
  // connecting to mongoDB
  connectToMongo();
  console.log(`server is running on http://localhost:${port}`);
})