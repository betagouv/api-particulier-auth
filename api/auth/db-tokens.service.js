const crypto = require('crypto')
const mongo = require('../lib/utils/mongo')

class DbTokenService {
  constructor (options) {
    this.options = options
    this.collection = mongo.db.collection('tokens')
  }

  initialize () {
    return Promise.resolve(this)
  }

  getToken (token) {
    const encryptedToken = crypto.createHash('sha512').update(token).digest('hex')
    return this.collection.findOne({hashed_token: encryptedToken})
  }
}

module.exports = DbTokenService
