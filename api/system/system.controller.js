const DbTokenService = require('../auth/db-tokens.service')

class SystemController {
  constructor (options) {
    this.dbTokenService = new DbTokenService(options)
  }

  ping (req, res, next) {
    res.data = 'pong'
    return next()
  }
}

module.exports = SystemController
