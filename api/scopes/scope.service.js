const mongo = require('../lib/utils/mongo')

class ScopeService {
  constructor (options) {
    this.options = options
    this.collection = mongo.db.collection('scopes')
  }

  initialize () {
    return Promise.resolve(this)
  }

  all () {
    return this.collection.find({}).toArray().then((response) => {
      return response.map((element) => {
        return { name: element.name, description: element.description }
      })
    })
  }
}

module.exports = ScopeService
