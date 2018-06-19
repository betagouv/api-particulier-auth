'use strict'

const http = require('http')
const express = require('express')
const StandardError = require('standard-error')
const emptylogger = require('bunyan-blackhole')
const expressBunyanLogger = require('express-bunyan-logger')
const bodyParser = require('body-parser')
const cors = require('cors')
const raven = require('raven')
const routes = require('./routes')
const formatError = require('./lib/middlewares/formatError')
const formatFromUrl = require('./lib/middlewares/formatFromUrl')
const mongo = require('./lib/utils/mongo')

module.exports = class Server {
  constructor (options) {
    this.options = options
  }

  async start () {
    await mongo.connect()

    const options = this.options
    setDefaults(options)

    const logger = options.logger
    const app = express()
    app.set('port', options.port)
    app.set('json spaces', 2)
    app.set('logger', logger)
    app.disable('x-powered-by')
    app.use(express.static('public'))
    app.use(bodyParser.json())

    const corsOptions = {
      exposedHeaders: ['Range', 'Content-Range', 'X-Content-Range'],
      credentials: true,
      origin: function (origin, callback) {
        callback(null, true)
      }
    }
    app.use(cors(corsOptions))

    app.use(expressBunyanLogger({
      name: 'requests',
      logger,
      // excludes: loggerProperties.excludes,
      // includesFn: loggerProperties.includesFn,
      format: '":remote-address :incoming :method HTTP/:http-version :status-code :res-headers[content-length] :referer :user-agent[family] :user-agent[major].:user-agent[minor] :user-agent[os] :response-time ms";'
    }))

    app.use((req, res, next) => {
      req.logger = logger
      next()
    })

    if (options.raven.activate) {
      app.use(raven.middleware.express(options.raven.dsn))
    }

    if (options.staticPath) {
      app.use(express.static(options.staticPath))
    }

    app.use(formatFromUrl)

    routes.configure(app, options)

    app.use(function notFound (req, res, next) {
      next(new StandardError('no route for URL ' + req.url, {code: 404}))
    })

    app.use(formatError)

    this.server = http.createServer(app)
    this.app = app
    this.logger = logger

    return new Promise((resolve, reject) => {
      this.server.listen(app.get('port'), (error) => {
        if (error) {
          logger.error({error}, 'Got error while starting server')
          return reject(error)
        }
        this.port = this.server.address().port
        app.set('port', this.port)
        logger.info({
          event: 'server_started',
          port: this.port
        }, 'Server listening on port', this.port)
        resolve()
      })
    })
  }

  stop (onStopped) {
    const server = this.server
    const logger = this.logger

    logger.info({
      event: 'server_stopping'
    }, 'Stopping server')
    server.close(function (error) {
      if (error) {
        logger.error({error: error}, 'Got error while stopping server')
        return onStopped(error)
      }
      logger.info({
        event: 'server_stopped'
      }, 'server stopped')
      onStopped()
    })
  }
}

function setDefaults (options) {
  options = options || {}
  options.port = options.port || 0
  options.logger = options.logger || emptylogger()
}
