const express = require('express')
const Controller = require('./scopes.controller')
const format = require('../lib/utils/format')

module.exports = function (options) {
  const router = express.Router()
  const controller = new Controller(options)

  router.get('/', (req, res, next) => controller.index(req, res, next), format)

  return router
}
