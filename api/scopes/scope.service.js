const Scope = require('./scope.model')

class ScopeService {
  constructor (options) {
    this.options = options
    this.collection = Scope
  }

  initialize () {
    return Promise.resolve(this)
  }

  all () {
    return this.collection.find({}).toArray()
  }
}

module.exports = ScopeService
