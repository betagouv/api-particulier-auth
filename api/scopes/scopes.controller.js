const ScopeService = require('./scope.service')

module.exports = ScopesController

function ScopesController (options) {
  const scopeService = new ScopeService(options)

  this.index = function (req, res, next) {
    return scopeService.all().then((scopes) => {
      res.data = scopes
      return next()
    })
  }
}
