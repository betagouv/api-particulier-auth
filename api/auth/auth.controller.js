const StandardError = require('standard-error')
const DbTokenService = require('./db-tokens.service')

module.exports = AuthController

function AuthController (options) {
  let dbTokenService, initializedService

  dbTokenService = new DbTokenService(options)
  initializedService = dbTokenService.initialize()

  this.authorize = function (req, res, next) {
    let token = req.get('X-API-Key')
    // set defaults
    if (token === null || typeof token === 'undefined') {
      token = ''
    }

    return initializedService.then((service) => {
      return service.getToken(token).then((result) => {
        handleResult(result)
      }).catch(() => handleResult(null))
    })

    function handleResult (result) {
      if (result) {
        req.logger.debug({ event: 'authorization' }, result.name + ' is authorized (' + result.role + ')')
        res.data = result
        next()
      } else {
        req.logger.debug({ event: 'authorization' }, 'not authorized')
        next(new StandardError('You are not authorized to use the api', {code: 401}))
      }
    }
  }
}
