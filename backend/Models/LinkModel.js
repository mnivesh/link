const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String
  }
})

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;