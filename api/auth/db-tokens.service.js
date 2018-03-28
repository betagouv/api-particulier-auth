const crypto = require('crypto')
const Token = require('./token.model')

class DbTokenService {
  constructor (options) {
    this.options = options
    this.collection = Token
  }

  initialize () {
    return Promise.resolve(this)
  }

  getToken (token) {
    const encryptedToken = crypto.createHash('sha512').update(token).digest('hex')
    return Token.findOne({hashed_token: encryptedToken})
  }
}

module.exports = DbTokenService
