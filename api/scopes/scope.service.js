const Scope = require('./scope.model')
const mongoose = require('mongoose')

class ScopeService {
  constructor (options) {
    mongoose.Promise = Promise
    this.options = options
    this.collection = Scope
  }

  initialize () {
    return Promise.resolve(this)
  }

  all () {
    return this.collection.find({}).lean().then((response) => {
      return response.map((response) => {
        return { name: response.name, description: response.description }
      })
    })
  }
}

module.exports = ScopeService
