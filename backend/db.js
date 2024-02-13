const mongoose = require('mongoose')
require('dotenv').config();
const URI = process.env.DATABASE_URI;

const connectToMongo = () => { 
  mongoose.connect(URI).then(()=> {
    console.log("connected to MongoDb successfully");
  }).catch((err)=> {
    console.log(err)
  });
}
module.exports = connectToMongo;