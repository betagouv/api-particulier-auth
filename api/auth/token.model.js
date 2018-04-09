const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  hashed_token: { type: String },
  name: { type: String },
  mail: { type: String }
})

module.exports = mongoose.model('Token', Schema)
