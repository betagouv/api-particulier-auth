const {expect} = require('chai')
const Controller = require('../scopes.controller')

const url = 'mongodb://localhost:27017/test-api-particulier'
const controller = new Controller({mongoDbUrl: url})

describe('Scopes controller', () => {
  it('should set scopes as data', () => {
    const res = {}

    return controller.index({}, res, function () {
      expect(res.data).to.deep.equal([])
    })
  })
})
