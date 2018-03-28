const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  name: {type: String},
  description: {type: String}
})

module.exports = mongoose.model('Scope', Schema)
