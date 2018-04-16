const {expect} = require('chai')
const Controller = require('../scopes.controller')
const mongo = require('../../lib/utils/mongo')

const url = 'mongodb://localhost:27017/test-api-particulier'

describe('Scopes controller', () => {
  let controller
  beforeEach(() => {
    return mongo.connect().then(() => {
      controller = new Controller({mongoDbUrl: url})
    })
  })

  it('should set scopes as data', () => {
    const res = {}

    return controller.index({}, res, function () {
      expect(res.data).to.deep.equal([])
    })
  })
})
