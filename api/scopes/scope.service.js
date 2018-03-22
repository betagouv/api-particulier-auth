const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

class ScopeService {
  constructor (options) {
    this.options = options
    this.mongoConnect = MongoClient.connect(this.options.mongoDbUrl, {})
  }

  initialize () {
    return this.mongoConnect.then((db) => {
      this.collection = db.collection('scopes')
      return this
    })
  }

  all () {
    return this.collection.find({}).toArray()
  }
}

module.exports = ScopeService
