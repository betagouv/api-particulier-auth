const {expect} = require('chai')
const proxyrequire = require('proxyquire')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chai = require('chai')
const mongo = require('../../lib/utils/mongo')
chai.use(sinonChai)
chai.should()

describe('Auth controller', () => {
  describe('db tokens', () => {
    describe('I have a good token', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test'
      }
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../auth.controller', {
          './db-tokens.service': class FakeTokenService {
            initialize () {
              return Promise.resolve(this)
            }
            getToken () {
              return Promise.resolve(consumer)
            }
          }
        })
        return mongo.connect().then(() => {
          service = new Auth()
        })
      })

      it('should let pass 200 + consumer', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }
        const res = {}

        return service.authorize(req, res, function () {}).then(() => {
          expect(res.data).to.deep.equal(consumer)
        })
      })
    })

    describe('I have a bad token', () => {
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../auth.controller', {
          './db-tokens.service': class FakeTokenService {
            initialize () {
              return Promise.resolve(this)
            }
            getToken () {
              return Promise.resolve(null)
            }
          }
        })
        return mongo.connect().then(() => {
          service = new Auth()
        })
      })

      it('should not let pass 401 + Error', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }
        const res = {}
        const nextSpy = sinon.spy()

        return service.authorize(req, res, nextSpy).then(() => {
          nextSpy.getCall(0).args[0].code.should.equals(401)
        })
      })
    })
  })
})
