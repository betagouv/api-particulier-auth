const ScopeService = require('./scope.service')

module.exports = ScopesController

function ScopesController (options) {
  const scopeService = new ScopeService(options)

  scopeService.initialize().then((Scope) => {
    this.index = function (req, res, next) {
      return Scope.all().then((scopes) => {
        res.data = scopes
        return next()
      })
    }
  })
}
