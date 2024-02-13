const express = require('express')
const connectToMongo = require('./db')
const app = express();
const cors = require('cors');
const path = require('path')
const port = process.env.PORT || 80;

// import routes
const userRoutes = require('./Routes/UserRoutes')
const linkRoutes = require('./Routes/LinkRoutes')

// middleware to parse incoming request body 
app.use(express.json());
app.use(cors())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// connecting to mongoDB 
connectToMongo();

// response to Homepage 
app.get('/', (req, res)=> {
  res.end('Happy Hacking!');
})

// API routes 
app.use('/api/user', userRoutes)
app.use('/api/link', linkRoutes)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// listening to app 
app.listen(port, ()=> {
  console.log(`server is running on http://localhost:${port}`);
})