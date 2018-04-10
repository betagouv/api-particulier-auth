const system = require('../system')
const auth = require('../auth')
const scopes = require('../scopes')

exports.configure = function (app, options) {
  app.use('/api', system(options))
  app.use('/api/auth', auth(options))
  app.use('/api/scopes', scopes(options))
}
