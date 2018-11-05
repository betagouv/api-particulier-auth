const supertest = require('supertest')
const nock = require('nock')
const options = require('../../defaults')

const {loadFixtures, cleanFixtures} = require('./fixtures');
const Server = require('../server')

module.exports = function () {
  let server
  const serverPort = process.env['SERVER_PORT_TEST']
  if (serverPort) {
    options.port = serverPort
  }

  nock.enableNetConnect('localhost')

  beforeEach(async () => {
    server = new Server(options)
    await loadFixtures()

    return await server.start()
  })
  afterEach(async () => {
    await cleanFixtures()
    return new Promise((resolve => server.stop(resolve)))
  })

  const api = function () {
    return supertest
      .agent('http://localhost:' + server.port)
  }
  return {
    api: api
  }
}
