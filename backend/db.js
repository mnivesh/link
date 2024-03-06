const mongoose = require('mongoose');
const createAdmin = require('./Utils/seeder');
require('dotenv').config();
const URI = process.env.DATABASE_URI;

const connectToMongo = () => { 
  mongoose.connect(URI).then(()=> {
    console.log("connected to MongoDb successfully");
    createAdmin();
  }).catch((err)=> {
    console.log(err)
  });
}
module.exports = connectToMongo;