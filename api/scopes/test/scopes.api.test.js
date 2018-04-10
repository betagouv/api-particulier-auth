const serverTest = require('./../../test/utils/server')
const {expect} = require('chai')

describe('scopes API', function () {
  const server = serverTest()
  const api = server.api

  describe('/', () => {
    it('replies a 200 with no credentials', () => {
      return api()
        .get('/api/scopes')
        .expect(200)
    })

    it('replies an empty array', () => {
      return api()
        .get('/api/scopes')
        .then((res, err) => {
          return expect(res.body).to.deep.equal([])
        })
    })
  })
})
